#!/bin/sh
# Refresh all Graphify graph slices used by this repository.
#
# The installed Graphify git hooks call this helper after commits and branch
# switches. Keep this POSIX-sh compatible because Git for Windows runs hooks
# through `sh`, not PowerShell.

set -eu

log() {
  printf '%s\n' "$*"
}

fail() {
  log "[graphify hook] ERROR: $*"
  exit 1
}

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
[ -d "$REPO_ROOT" ] || fail "could not resolve repository root"
cd "$REPO_ROOT"

command -v graphify >/dev/null 2>&1 || fail "graphify is not available on PATH"

# Avoid Windows cp1252 crashes from Graphify status messages that contain arrows
# or other non-ASCII characters.
export PYTHONIOENCODING=UTF-8
export PYTHONUTF8=1

PYTHON_BIN=${PYTHON_BIN:-}
if [ -z "$PYTHON_BIN" ]; then
  for candidate in python python3; do
    if command -v "$candidate" >/dev/null 2>&1 &&
      "$candidate" -c "import graphify" >/dev/null 2>&1; then
      PYTHON_BIN=$candidate
      break
    fi
  done
fi
[ -n "$PYTHON_BIN" ] || fail "could not find a Python interpreter with graphify installed"

refresh_graph() {
  graph_root=$1
  log "[graphify hook] updating $graph_root"
  GRAPHIFY_FORCE=1 graphify update "$graph_root" --force
}

sync_graph_out() {
  source_dir=$1
  target_dir=$2

  [ -f "$source_dir/graph.json" ] || fail "missing graph output: $source_dir/graph.json"

  # Copy into the existing repo-level folder instead of replacing the whole
  # directory. On Windows, Git's sh can hit transient permission errors when a
  # freshly removed directory is immediately recreated via `mv`.
  mkdir -p "$target_dir"
  cp -a "$source_dir/." "$target_dir/"
}

cleanup_nested_graph_out() {
  nested_dir=$1

  case "$nested_dir" in
    backend/graphify-out|supabase/graphify-out)
      rm -rf "$nested_dir"
      ;;
    *)
      fail "refusing to remove unexpected graph output path: $nested_dir"
      ;;
  esac
}

refresh_graph "."

refresh_graph "backend"
sync_graph_out "backend/graphify-out" "graphify-out-backend"
cleanup_nested_graph_out "backend/graphify-out"

refresh_graph "supabase"
sync_graph_out "supabase/graphify-out" "graphify-out-supabase"
cleanup_nested_graph_out "supabase/graphify-out"

log "[graphify hook] rebuilding graphify-out-merged"
"$PYTHON_BIN" - "$REPO_ROOT" <<'PY'
import json
import subprocess
import sys
from pathlib import Path

import networkx as nx
from networkx.readwrite import json_graph

from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.cluster import cluster, score_all
from graphify.export import to_html, to_json
from graphify.report import generate

repo_root = Path(sys.argv[1]).resolve()
out_dir = repo_root / "graphify-out-merged"
graph_paths = [
    repo_root / "graphify-out" / "graph.json",
    repo_root / "graphify-out-backend" / "graph.json",
    repo_root / "graphify-out-supabase" / "graph.json",
]

graphs = []
hyperedges = []
seen_hyperedges = set()

for graph_path in graph_paths:
    if not graph_path.exists():
        raise SystemExit(f"missing graph input: {graph_path}")

    data = json.loads(graph_path.read_text(encoding="utf-8"))
    try:
        graph = json_graph.node_link_graph(data, edges="links")
    except TypeError:
        graph = json_graph.node_link_graph(data)

    repo_tag = graph_path.parent.name
    for node_id in graph.nodes:
        graph.nodes[node_id].setdefault("repo", repo_tag)

    for hyperedge in data.get("hyperedges", []):
        hyperedge_id = hyperedge.get("id") or json.dumps(hyperedge, sort_keys=True)
        if hyperedge_id not in seen_hyperedges:
            seen_hyperedges.add(hyperedge_id)
            hyperedges.append(hyperedge)

    graphs.append(graph)

merged = nx.compose_all(graphs)
merged.graph["hyperedges"] = hyperedges

communities = cluster(merged)
cohesion = score_all(merged, communities)
labels = {community_id: f"Community {community_id}" for community_id in communities}
gods = god_nodes(merged)
surprises = surprising_connections(merged, communities)
questions = suggest_questions(merged, communities, labels)

commit_result = subprocess.run(
    ["git", "rev-parse", "HEAD"],
    cwd=repo_root,
    capture_output=True,
    text=True,
    timeout=3,
    check=False,
)
commit = commit_result.stdout.strip() if commit_result.returncode == 0 else None

out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / ".graphify_root").write_text(str(repo_root), encoding="utf-8")

if not to_json(
    merged,
    communities,
    str(out_dir / "graph.json"),
    force=True,
    built_at_commit=commit,
):
    raise SystemExit("failed to write merged graph.json")

report = generate(
    merged,
    communities,
    cohesion,
    labels,
    gods,
    surprises,
    {"warning": "merged graph from graphify-out, graphify-out-backend, and graphify-out-supabase"},
    {"input": 0, "output": 0},
    "Global-Governance merged",
    suggested_questions=questions,
    built_at_commit=commit,
)
(out_dir / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")

html_target = out_dir / "graph.html"
try:
    to_html(merged, communities, str(html_target), community_labels=labels or None)
except ValueError as exc:
    if html_target.exists():
        html_target.unlink()
    print(f"[graphify hook] skipped merged graph.html: {exc}")

print(
    f"[graphify hook] merged graph refreshed: "
    f"{merged.number_of_nodes()} nodes, {merged.number_of_edges()} edges"
)
PY

log "[graphify hook] refreshed root, backend, supabase, and merged graphs."
