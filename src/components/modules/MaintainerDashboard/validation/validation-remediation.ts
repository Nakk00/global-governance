import type {
  ValidationOutcome,
  ValidationResult,
  ValidationRunDetail,
} from "@/lib/maintainer/api"

import { buildSourceDetailPath } from "../shared/routing"

type ValidationRemediationOutcome = Exclude<ValidationOutcome, "pass">

type ValidationRemediationFollowUp =
  | {
      kind: "sourceDetail"
      href: string
      label: string
    }
  | {
      kind: "resultOverlay"
      label: string
    }

export type ValidationRemediationItem = {
  resultId: string
  order: number
  result: ValidationResult
  outcome: ValidationRemediationOutcome
  likelyCauseLabel: string
  reviewStatusLabel: string
  destinationSurfaceLabel: string
  nextActionLabel: string
  sourceContextId: string | null
  sourceContextLabel: string
  followUp: ValidationRemediationFollowUp
}

const LIKELY_CAUSE_BY_OUTCOME: Record<ValidationRemediationOutcome, string> = {
  weakSupport: "Retrieved support is thin for the returned answer.",
  refused: "The answer refused the requested check.",
  failed: "The validator could not complete this question.",
  error: "The validation pipeline raised an unexpected error.",
}

function reviewStatusForOutcome(
  outcome: ValidationRemediationOutcome,
  hasSourceContext: boolean
) {
  if (outcome === "weakSupport") {
    return hasSourceContext
      ? "Needs source follow-up"
      : "Needs validation review"
  }
  if (outcome === "refused") {
    return "Needs validation review"
  }
  if (outcome === "failed") {
    return "Needs investigation"
  }
  return "Needs diagnostics"
}

function destinationSurfaceForOutcome(
  outcome: ValidationRemediationOutcome,
  hasSourceContext: boolean
) {
  if (outcome === "weakSupport" && hasSourceContext) {
    return "Source detail"
  }
  return "Validation result overlay"
}

function nextActionForOutcome(
  outcome: ValidationRemediationOutcome,
  hasSourceContext: boolean
) {
  if (outcome === "weakSupport" && hasSourceContext) {
    return "Open source detail"
  }
  return "Open result overlay"
}

function followUpForOutcome(
  outcome: ValidationRemediationOutcome,
  sourceContextId: string | null
) {
  if (outcome === "weakSupport" && sourceContextId) {
    return {
      kind: "sourceDetail" as const,
      href: buildSourceDetailPath(sourceContextId, "validation-follow-up"),
      label: "Open source detail",
    }
  }
  return {
    kind: "resultOverlay" as const,
    label: "Open result overlay",
  }
}

function formatSourceContextLabel(sourceIds: string[]) {
  if (!sourceIds.length) {
    return "No retrieved source context"
  }
  if (sourceIds.length === 1) {
    return sourceIds[0]
  }
  return `${sourceIds[0]} (+${sourceIds.length - 1} more)`
}

export function buildValidationRemediationItems(
  run: ValidationRunDetail
): ValidationRemediationItem[] {
  if (run.status !== "completed" || run.state !== "ready") {
    return []
  }

  return run.results.flatMap((result, index) => {
    if (result.outcome === "pass") {
      return []
    }

    const sourceContextId = result.retrievedSourceIds[0] ?? null
    const hasSourceContext = sourceContextId != null
    const outcome = result.outcome
    const followUp = followUpForOutcome(outcome, sourceContextId)

    return [
      {
        resultId: result.resultId,
        order: index + 1,
        result,
        outcome,
        likelyCauseLabel: LIKELY_CAUSE_BY_OUTCOME[outcome],
        reviewStatusLabel: reviewStatusForOutcome(outcome, hasSourceContext),
        destinationSurfaceLabel: destinationSurfaceForOutcome(
          outcome,
          hasSourceContext
        ),
        nextActionLabel: nextActionForOutcome(outcome, hasSourceContext),
        sourceContextId,
        sourceContextLabel: formatSourceContextLabel(result.retrievedSourceIds),
        followUp,
      },
    ]
  })
}
