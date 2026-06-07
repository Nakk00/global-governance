import { writeFileSync } from "node:fs"

import {
  getSourceAwareChatStarterPromptAuditEntries,
  type SourceAwareChatStarterPromptAuditEntry,
} from "../../src/data/chat/source-aware-chat.ts"
import {
  classifyPromptAuditEnvelopeFailure,
  classifyPromptAuditOutcome,
  hasStrictPromptAuditMiss,
  type PromptAuditRow,
} from "../../src/lib/chat/prompt-audit.ts"

const defaultEndpoint = "http://127.0.0.1:8000/api/chat"

function readFlagValue(flag: string) {
  const flagIndex = process.argv.indexOf(flag)
  if (flagIndex === -1) {
    return undefined
  }

  return process.argv[flagIndex + 1]
}

function hasFlag(flag: string) {
  return process.argv.includes(flag)
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

async function auditPrompt(
  entry: SourceAwareChatStarterPromptAuditEntry,
  endpoint: string,
  endpointMode: string,
  anonymousSessionId: string
): Promise<PromptAuditRow> {
  if (endpointMode === "fixture") {
    return classifyPromptAuditOutcome(
      entry,
      buildFixtureResponseData(entry),
      endpointMode
    )
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Session-Id": anonymousSessionId,
      },
      body: JSON.stringify({
        question: entry.prompt,
        context: {
          currentSectionId: entry.section,
          depthMode: entry.depthMode,
        },
      }),
    })
    const payload = await response.json()
    const envelope = asRecord(payload)
    const success = envelope?.success
    const data = asRecord(envelope?.data)

    if (success !== true || data === null) {
      const error = asRecord(envelope?.error)

      return classifyPromptAuditEnvelopeFailure(
        entry,
        endpointMode,
        readString(error?.code) ||
          `Non-success envelope with HTTP ${response.status}.`
      )
    }

    return classifyPromptAuditOutcome(entry, data, endpointMode)
  } catch (error) {
    return classifyPromptAuditEnvelopeFailure(
      entry,
      endpointMode,
      error instanceof Error ? error.message : "Prompt audit request failed."
    )
  }
}

function buildFixtureResponseData(
  entry: SourceAwareChatStarterPromptAuditEntry
): Record<string, unknown> {
  return {
    state: "answered",
    answer:
      "Fixture mode confirms the audit schema and strict gate without calling the live backend.",
    grounding: {
      supportLevel: "strong",
      cue: "Grounded answer",
    },
    citations: [
      {
        sourceId: entry.readiness.sourceIds[0],
      },
    ],
  }
}

function escapeTableCell(value: string) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ")
}

function formatRowsAsMarkdown(rows: PromptAuditRow[]) {
  const lines = [
    "| Section | Depth mode | Prompt ID | Label | Prompt | Classification | Response state | Support level | Expected source IDs | Returned citation source IDs | Visible card | Follow-up action | Endpoint mode | Notes |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  ]

  for (const row of rows) {
    lines.push(
      `| ${escapeTableCell(row.section)} | ${escapeTableCell(row.depthMode)} | ${escapeTableCell(row.id)} | ${escapeTableCell(row.label)} | ${escapeTableCell(row.prompt)} | ${row.classification} | ${escapeTableCell(row.responseState)} | ${escapeTableCell(row.supportLevel ?? "")} | ${escapeTableCell(row.sourceIds.join(", "))} | ${escapeTableCell(row.returnedCitationSourceIds.join(", "))} | ${escapeTableCell(row.visibleCard)} | ${row.followUpAction} | ${escapeTableCell(row.endpointMode)} | ${escapeTableCell(row.notes)} |`
    )
  }

  return lines.join("\n")
}

async function main() {
  const endpoint = readFlagValue("--endpoint") ?? defaultEndpoint
  const endpointMode = readFlagValue("--endpoint-mode") ?? "live"
  const outputPath = readFlagValue("--output")
  const outputJson = hasFlag("--json")
  const failOnMiss = hasFlag("--fail-on-miss")
  const entries = getSourceAwareChatStarterPromptAuditEntries()
  const rows: PromptAuditRow[] = []

  for (const [index, entry] of entries.entries()) {
    const anonymousSessionId = `prompt-audit-${Date.now()}-${index + 1}`
    rows.push(
      await auditPrompt(entry, endpoint, endpointMode, anonymousSessionId)
    )
  }

  const output = outputJson
    ? `${JSON.stringify(rows, null, 2)}\n`
    : `${formatRowsAsMarkdown(rows)}\n`

  if (outputPath) {
    writeFileSync(outputPath, output, "utf8")
  }

  process.stdout.write(output)

  if (failOnMiss && hasStrictPromptAuditMiss(rows)) {
    process.exitCode = 1
  }
}

void main()
