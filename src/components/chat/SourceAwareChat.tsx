import {
  ChevronDown,
  FileText,
  LoaderCircle,
  MessageCircle,
  Send,
  X,
} from "lucide-react"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"

import { Button } from "@/components/ui/button"
import {
  getSourceAwareChatStarterPrompts,
  resolveStarterPromptState,
  sourceAwareChatStarterPrompts,
} from "@/data/chat/source-aware-chat"
import { useNavigation } from "@/hooks/useNavigation"
import { requestGroundedAnswer } from "@/lib/chat/api-client"
import { cn } from "@/lib/utils"
import type {
  ChatAsyncState,
  GroundedChatRequest,
  GroundedChatSuccess,
} from "@/types/chat"

type SourceAwareChatProps = {
  starterPrompts?: unknown
  chatClient?: (
    question: string,
    context?: GroundedChatRequest["context"]
  ) => Promise<GroundedChatSuccess>
}

export function SourceAwareChat({
  starterPrompts = sourceAwareChatStarterPrompts,
  chatClient = requestGroundedAnswer,
}: SourceAwareChatProps) {
  const { activeSectionId } = useNavigation()
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [answerState, setAnswerState] = useState<ChatAsyncState>({
    status: "idle",
  })
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const panelId = useId()
  const inputId = useId()
  const promptGroupId = useId()
  const promptCatalog =
    starterPrompts === sourceAwareChatStarterPrompts
      ? getSourceAwareChatStarterPrompts(activeSectionId)
      : starterPrompts
  const promptState = resolveStarterPromptState(promptCatalog)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame = window.requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true })
    )

    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  function closeChat() {
    setIsOpen(false)
    window.requestAnimationFrame(() =>
      triggerRef.current?.focus({ preventScroll: true })
    )
  }

  function handleShellKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      closeChat()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuestion = question.trim()

    if (trimmedQuestion.length === 0 || answerState.status === "loading") {
      return
    }

    setExpandedSourceId(null)
    setAnswerState({
      status: "loading",
      question: trimmedQuestion,
    })

    try {
      const response = await chatClient(trimmedQuestion, {
        currentSectionId: activeSectionId,
      })

      setAnswerState({
        status: "success",
        response,
      })
    } catch (error) {
      const chatError =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error &&
        typeof error.code === "string" &&
        typeof error.message === "string"
          ? {
              code: error.code,
              message: error.message,
            }
          : {
              code: "grounded_chat_unavailable",
              message:
                "The assistant could not return a grounded answer right now. Please try again with a course question.",
            }

      setAnswerState({
        status: "error",
        error: chatError,
      })
    }
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.nativeEvent.isComposing
    ) {
      return
    }

    event.preventDefault()
    formRef.current?.requestSubmit()
  }

  function chooseStarterPrompt(prompt: string) {
    setQuestion(prompt)
    window.requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true })
    )
  }

  return (
    <div
      className="fixed right-4 bottom-4 z-50 flex max-w-[calc(100vw-2rem)] items-end justify-end sm:right-6 sm:bottom-6"
      onKeyDown={handleShellKeyDown}
    >
      <div className="flex min-w-0 flex-col items-end gap-3">
        {isOpen ? (
          <section
            id={panelId}
            role="region"
            aria-label="Source-aware academic chat"
            data-source-aware-chat-panel=""
            className={cn(
              "fixed inset-x-3 bottom-3 max-h-[calc(100svh-1.5rem)] min-w-0 overflow-y-auto rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-2xl",
              "motion-reduce:transition-none sm:inset-x-auto sm:right-6 sm:bottom-20 sm:w-[24rem] sm:max-w-[calc(100vw-3rem)] sm:p-5",
              "md:w-[26rem]"
            )}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <p className="editorial-kicker">Source-aware assistant</p>
                <h2 className="text-lg leading-7 font-semibold text-card-foreground">
                  Ask about this course
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  This academic assistant is bounded to the Global Governance
                  learning experience. Use it for course questions, source
                  orientation, and chapter review.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close source-aware chat"
                onClick={closeChat}
              >
                <X aria-hidden="true" />
              </Button>
            </div>

            <form
              ref={formRef}
              className="mt-5 space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <label
                  htmlFor={inputId}
                  className="text-sm font-semibold text-card-foreground"
                >
                  Course question
                </label>
                <textarea
                  ref={inputRef}
                  id={inputId}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleQuestionKeyDown}
                  rows={4}
                  placeholder="Ask a question about global governance, the UN, or the West Philippine Sea case."
                  className="min-h-28 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-base leading-6 text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
                />
              </div>

              <div
                role="group"
                aria-labelledby={promptGroupId}
                className="space-y-3"
              >
                <p
                  id={promptGroupId}
                  className="text-sm font-semibold text-card-foreground"
                >
                  Suggested prompts
                </p>
                {promptState.status === "available" ? (
                  <div className="grid gap-2">
                    {promptState.prompts.map((prompt) => (
                      <Button
                        key={prompt.id}
                        type="button"
                        variant="outline"
                        className="h-auto min-h-11 w-full justify-start rounded-xl px-3 py-3 text-left whitespace-normal"
                        onClick={() => chooseStarterPrompt(prompt.prompt)}
                      >
                        {prompt.label}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p
                    role="status"
                    className="rounded-xl border border-dashed border-border bg-background/70 p-3 text-sm leading-6 text-muted-foreground"
                  >
                    {promptState.message}
                  </p>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-muted-foreground">
                  Answers stay inside the approved course materials.
                </p>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={answerState.status === "loading"}
                >
                  {answerState.status === "loading" ? (
                    <LoaderCircle
                      aria-hidden="true"
                      data-icon="inline-start"
                      className="animate-spin motion-reduce:animate-none"
                    />
                  ) : (
                    <Send aria-hidden="true" data-icon="inline-start" />
                  )}
                  {answerState.status === "loading" ? "Asking" : "Ask"}
                </Button>
              </div>
            </form>

            <div
              className="mt-4"
              aria-live="polite"
              aria-label="Grounded answer status"
            >
              {answerState.status === "loading" ? (
                <div
                  role="status"
                  className="rounded-xl border border-border bg-background/80 p-3 text-sm leading-6 text-muted-foreground"
                >
                  Checking approved materials for a grounded answer.
                </div>
              ) : null}

              {answerState.status === "error" ? (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm leading-6 text-foreground"
                >
                  {answerState.error.message}
                </div>
              ) : null}

              {answerState.status === "success" ? (
                <GroundedAnswerSurface
                  response={answerState.response}
                  expandedSourceId={expandedSourceId}
                  onToggleSource={(sourceId) =>
                    setExpandedSourceId((current) =>
                      current === sourceId ? null : sourceId
                    )
                  }
                />
              ) : null}
            </div>
          </section>
        ) : null}

        <Button
          ref={triggerRef}
          type="button"
          aria-controls={panelId}
          aria-expanded={isOpen}
          tabIndex={isOpen ? -1 : undefined}
          data-source-aware-chat-trigger=""
          className="rounded-full px-4 shadow-lg"
          onClick={() => setIsOpen((current) => !current)}
        >
          <MessageCircle aria-hidden="true" data-icon="inline-start" />
          Open source-aware chat
        </Button>
      </div>
    </div>
  )
}

type GroundedAnswerSurfaceProps = {
  response: GroundedChatSuccess
  expandedSourceId: string | null
  onToggleSource: (sourceId: string) => void
}

function GroundedAnswerSurface({
  response,
  expandedSourceId,
  onToggleSource,
}: GroundedAnswerSurfaceProps) {
  const detailsId = useId()

  if (response.state === "weakSupport") {
    return (
      <article className="space-y-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm leading-6">
        <p className="font-semibold text-card-foreground">
          {response.grounding.cue}
        </p>
        <p className="text-foreground">{response.message}</p>
        <p className="text-muted-foreground">{response.nextStep}</p>
      </article>
    )
  }

  if (response.state === "deferredProtection") {
    return (
      <article className="rounded-xl border border-border bg-background/80 p-3 text-sm leading-6 text-muted-foreground">
        {response.message}
      </article>
    )
  }

  return (
    <article className="space-y-4 rounded-xl border border-border bg-background/80 p-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {response.grounding.cue}
        </p>
        <p className="text-sm leading-6 text-foreground">{response.answer}</p>
      </div>

      <div className="space-y-2" aria-label="Approved source support">
        <p className="text-sm font-semibold text-card-foreground">
          Source support
        </p>
        <div className="flex flex-wrap gap-2">
          {response.citations.map((citation) => {
            const isExpanded = expandedSourceId === citation.sourceId
            const sourceDetailsId = `${detailsId}-${citation.sourceId}`

            return (
              <div key={citation.sourceId} className="min-w-0">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={sourceDetailsId}
                  className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-left text-xs font-semibold text-card-foreground transition-colors hover:border-ring focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
                  onClick={() => onToggleSource(citation.sourceId)}
                >
                  <FileText aria-hidden="true" className="size-4 shrink-0" />
                  <span className="min-w-0 truncate">
                    {citation.shortTitle}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-4 shrink-0 transition-transform motion-reduce:transition-none",
                      isExpanded ? "rotate-180" : null
                    )}
                  />
                </button>

                {isExpanded ? (
                  <div
                    id={sourceDetailsId}
                    className="mt-2 w-full min-w-0 rounded-xl border border-border bg-card p-3 text-sm leading-6 text-card-foreground"
                  >
                    <p className="font-semibold">{citation.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {citation.sourceId} · {citation.sourceType}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      {citation.detail}
                    </p>
                    {citation.url ? (
                      <a
                        href={citation.url}
                        className="mt-2 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open source
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </article>
  )
}
