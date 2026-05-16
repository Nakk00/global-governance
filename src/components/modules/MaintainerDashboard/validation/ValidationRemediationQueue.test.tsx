import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type { ValidationRunDetail } from "@/lib/maintainer/api"

import { ValidationRemediationQueue } from "./ValidationRemediationQueue"
import { buildValidationRemediationItems } from "./validation-remediation"

const mixedRun = {
  runId: "val-run-1",
  validationSetId: "demo-readiness-v1",
  validationSetName: "Demo Readiness v1",
  validationSetVersion: 1,
  status: "completed",
  totalCount: 5,
  passCount: 1,
  weakSupportCount: 1,
  refusedCount: 1,
  failedCount: 1,
  errorCount: 1,
  averageLatencyMs: 685,
  createdBy: "admin@example.test",
  createdAt: "2026-05-05T00:00:00Z",
  startedAt: "2026-05-05T00:00:01Z",
  completedAt: "2026-05-05T00:00:05Z",
  sourceSnapshotIds: ["gg-src-un-charter-institutions@active"],
  state: "ready",
  notes: "Immutable validation run completed.",
  results: [
    {
      resultId: "result-pass",
      validationQuestionId: "demo-q-grounded-un-charter",
      questionText: "What is the UN Security Council's role?",
      expectedState: "grounded",
      actualState: "grounded",
      outcome: "pass",
      answerPreview: "The Security Council has primary responsibility...",
      retrievedSourceIds: ["gg-src-un-charter-institutions"],
      citationIds: ["ref-un-charter"],
      supportScore: 0.93,
      latencyMs: 840,
      notes: "Expected grounded answer matched.",
      createdAt: "2026-05-05T00:00:05Z",
    },
    {
      resultId: "result-weak-support",
      validationQuestionId: "demo-q-weak-support",
      questionText: "Which body coordinates implementation under the Charter?",
      expectedState: "weakSupport",
      actualState: "weakSupport",
      outcome: "weakSupport",
      answerPreview:
        "The response pointed to the UN system but only lightly tied it to the Charter.",
      retrievedSourceIds: ["gg-src-un-charter-institutions"],
      citationIds: ["ref-un-charter"],
      supportScore: 0.41,
      latencyMs: 910,
      notes: "Support exists, but the source detail should be revisited.",
      createdAt: "2026-05-05T00:00:06Z",
    },
    {
      resultId: "result-refused",
      validationQuestionId: "demo-q-refused",
      questionText: "Can the answer invent a new member state commitment?",
      expectedState: "refused",
      actualState: "refused",
      outcome: "refused",
      answerPreview:
        "I cannot confirm that request from the available evidence.",
      retrievedSourceIds: [],
      citationIds: [],
      supportScore: null,
      latencyMs: 460,
      notes:
        "Correct refusal, but the follow-up should stay in validation detail.",
      createdAt: "2026-05-05T00:00:07Z",
    },
    {
      resultId: "result-failed",
      validationQuestionId: "demo-q-failed",
      questionText: "Does the evaluator still resolve a grounded answer?",
      expectedState: "grounded",
      actualState: "timeout",
      outcome: "failed",
      answerPreview: "The evaluator did not complete this question.",
      retrievedSourceIds: [],
      citationIds: [],
      supportScore: null,
      latencyMs: null,
      notes: "Validation failed before a stable answer could be recorded.",
      createdAt: "2026-05-05T00:00:08Z",
    },
    {
      resultId: "result-error",
      validationQuestionId: "demo-q-error",
      questionText: "Can the backend return a parsed result envelope?",
      expectedState: "grounded",
      actualState: "error",
      outcome: "error",
      answerPreview: "The validation pipeline encountered an unexpected error.",
      retrievedSourceIds: [],
      citationIds: [],
      supportScore: null,
      latencyMs: null,
      notes: "Unexpected error while loading validation detail.",
      createdAt: "2026-05-05T00:00:09Z",
    },
  ],
  auditEvents: [],
} satisfies ValidationRunDetail

const allPassRun = {
  ...mixedRun,
  results: [
    {
      ...mixedRun.results[0],
      resultId: "result-pass-only",
      outcome: "pass" as const,
    },
  ],
  passCount: 1,
  weakSupportCount: 0,
  refusedCount: 0,
  failedCount: 0,
  errorCount: 0,
} satisfies ValidationRunDetail

const inFlightRun = {
  ...mixedRun,
  status: "processing" as const,
  state: "partial" as const,
} satisfies ValidationRunDetail

describe("buildValidationRemediationItems", () => {
  it("filters pass results and keeps immutable result order", () => {
    const items = buildValidationRemediationItems(mixedRun)

    expect(items.map((item) => item.resultId)).toEqual([
      "result-weak-support",
      "result-refused",
      "result-failed",
      "result-error",
    ])
    expect(items.map((item) => item.reviewStatusLabel)).toEqual([
      "Needs source follow-up",
      "Needs validation review",
      "Needs investigation",
      "Needs diagnostics",
    ])
    expect(items[0]?.followUp).toEqual({
      kind: "sourceDetail",
      href: "/maintainer/sources/gg-src-un-charter-institutions?preset=validation-follow-up",
      label: "Open source detail",
    })
    expect(items[1]?.followUp).toEqual({
      kind: "resultOverlay",
      label: "Open result overlay",
    })
  })
})

describe("ValidationRemediationQueue", () => {
  it("renders one item per non-pass result and routes weak support to source detail", async () => {
    const user = userEvent.setup()
    const onInspectResult = vi.fn()

    render(
      <ValidationRemediationQueue
        run={mixedRun}
        onInspectResult={onInspectResult}
      />
    )

    expect(
      screen.getByRole("heading", { name: "Remediation queue" })
    ).toBeVisible()
    expect(screen.getByText("4 remediation items")).toBeVisible()
    expect(
      screen.getByRole("link", { name: "Open source detail" })
    ).toHaveAttribute(
      "href",
      "/maintainer/sources/gg-src-un-charter-institutions?preset=validation-follow-up"
    )

    const queueCards = screen.getAllByRole("article")
    expect(queueCards).toHaveLength(4)
    expect(
      within(queueCards[0] as HTMLElement).getByText("result-weak-support")
    ).toBeVisible()

    await user.click(
      within(queueCards[1] as HTMLElement).getByRole("button", {
        name: "Open result overlay",
      })
    )

    expect(onInspectResult).toHaveBeenCalledWith(
      expect.objectContaining({ resultId: "result-refused" })
    )
  })

  it("shows an explicit empty state for completed all-pass runs", () => {
    render(
      <ValidationRemediationQueue run={allPassRun} onInspectResult={vi.fn()} />
    )

    expect(screen.getByText("No remediation items")).toBeVisible()
    expect(
      screen.getByText(
        "This completed validation run only contains pass results, so the evidence table is the only place that needs review."
      )
    ).toBeVisible()
  })

  it("hides the queue for in-flight or partial runs", () => {
    const { container } = render(
      <ValidationRemediationQueue run={inFlightRun} onInspectResult={vi.fn()} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
