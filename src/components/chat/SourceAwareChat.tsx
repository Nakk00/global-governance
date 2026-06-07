import {
  ArrowRight,
  BookOpenCheck,
  ChevronDown,
  FileText,
  LoaderCircle,
  MessageCircle,
  Minus,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { motion, useReducedMotion, type Transition } from "motion/react"

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
  ChatError,
  ChatDepthMode,
  ChatTranscriptTurn,
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

const assistantGreeting =
  "I can help explain institutions, norms, and collective action using the approved course materials."
const composerMinHeightPx = 48
const composerMaxHeightPx = 144

export function SourceAwareChat({
  starterPrompts = sourceAwareChatStarterPrompts,
  chatClient = requestGroundedAnswer,
}: SourceAwareChatProps) {
  const { activeSectionId } = useNavigation()
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [depthMode, setDepthMode] = useState<ChatDepthMode>("student")
  const [transcript, setTranscript] = useState<ChatTranscriptTurn[]>([])
  const [expandedCitationKey, setExpandedCitationKey] = useState<string | null>(
    null
  )
  const [isDockHovered, setIsDockHovered] = useState(false)
  const [isDockFocused, setIsDockFocused] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const isOpenRef = useRef(isOpen)
  const turnIdRef = useRef(0)
  const panelId = useId()
  const inputId = useId()
  const promptGroupId = useId()
  const shouldReduceMotion = useReducedMotion()
  const isSubmitting = transcript.some(
    (turn) => turn.response.status === "loading"
  )
  const isDockExpanded = isOpen || isDockHovered || isDockFocused
  const dockMotionState = isDockExpanded ? "expanded" : "collapsed"
  const dockEase = [0.16, 1, 0.3, 1] as const
  const dockTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 430, damping: 34, mass: 0.72 }
  const dockRevealTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: dockEase }
  const dockVariants = {
    collapsed: {
      width: "3.55rem",
      scale: 0.985,
      borderRadius: "999px",
    },
    expanded: {
      width: "23rem",
      scale: 1,
      borderRadius: "1.35rem",
    },
  }
  const dockIconVariants = {
    collapsed: {
      scale: 1,
      rotate: 0,
    },
    expanded: {
      scale: shouldReduceMotion ? 1 : 1.04,
      rotate: shouldReduceMotion ? 0 : -4,
    },
  }
  const dockCopyVariants = {
    collapsed: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 10,
      filter: shouldReduceMotion ? "blur(0px)" : "blur(5px)",
    },
    expanded: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
    },
  }
  const dockArrowVariants = {
    collapsed: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 12,
      scale: shouldReduceMotion ? 1 : 0.82,
    },
    expanded: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
  }
  const promptCatalog =
    starterPrompts === sourceAwareChatStarterPrompts
      ? getSourceAwareChatStarterPrompts(activeSectionId)
      : starterPrompts
  const promptState = resolveStarterPromptState(promptCatalog)
  const rephrasePrompt =
    promptState.status === "available"
      ? (promptState.prompts.find(
          (prompt) => prompt.readiness.classification === "answered"
        ) ?? promptState.prompts[0]).prompt
      : "Where does the UN help coordinate states, and where do its enforcement limits show up?"

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      focusComposer(inputRef, isOpenRef)
      syncComposerHeight(inputRef.current)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    syncComposerHeight(inputRef.current)
  }, [question, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const transcriptElement = transcriptRef.current
      if (!transcriptElement) {
        return
      }

      transcriptElement.scrollTop = transcriptElement.scrollHeight
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isOpen, transcript])

  function closeChat() {
    setIsOpen(false)
    setIsDockHovered(false)
    setIsDockFocused(false)
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

  async function submitQuestion(questionToSubmit: string) {
    const trimmedQuestion = questionToSubmit.trim()

    if (trimmedQuestion.length === 0 || isSubmitting) {
      return
    }

    const turnId = createTranscriptTurnId(turnIdRef)
    const transcriptTurn: ChatTranscriptTurn = {
      id: turnId,
      question: trimmedQuestion,
      response: {
        status: "loading",
      },
    }

    setExpandedCitationKey(null)
    setTranscript((current) => [...current, transcriptTurn])
    setQuestion("")
    window.requestAnimationFrame(() => {
      syncComposerHeight(inputRef.current)
      focusComposer(inputRef, isOpenRef)
    })

    try {
      const response = await chatClient(trimmedQuestion, {
        currentSectionId: activeSectionId,
        depthMode,
      })

      setTranscript((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                response: {
                  status: "success",
                  response,
                },
              }
            : turn
        )
      )
    } catch (error) {
      const chatError = toChatError(error)

      setTranscript((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                response: {
                  status: "error",
                  error: chatError,
                },
              }
            : turn
        )
      )
    } finally {
      window.requestAnimationFrame(() => focusComposer(inputRef, isOpenRef))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitQuestion(question)
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
    void submitQuestion(prompt)
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
              "fixed inset-x-3 top-3 bottom-3 flex min-w-0 flex-col overflow-hidden rounded-[1.45rem] border border-sky-300/25 bg-slate-950/95 text-slate-100 shadow-[0_30px_90px_rgba(2,8,23,0.58)] backdrop-blur-2xl",
              "sm:inset-x-auto sm:top-6 sm:right-6 sm:bottom-6 sm:w-[26rem] sm:max-w-[calc(100vw-3rem)]",
              "md:w-[31rem]"
            )}
          >
            <div className="relative shrink-0 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_16%_12%,rgba(125,211,252,0.18),transparent_38%),radial-gradient(circle_at_86%_0%,rgba(245,158,11,0.14),transparent_34%)]"
              />
              <div className="relative p-4 pb-3 sm:p-5 sm:pb-4">
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-amber-300/35 bg-amber-300/10 text-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                      <Sparkles aria-hidden="true" className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.68rem] leading-4 font-black tracking-[0.16em] text-sky-300 uppercase">
                        Source-aware assistant
                      </p>
                      <h2 className="mt-1 text-xl leading-7 font-semibold text-white">
                        Governance Guide
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm leading-5 text-slate-300">
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                        />
                        Source-aware • Online
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Minimize source-aware chat"
                      className="rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                      onClick={closeChat}
                    >
                      <Minus aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Close source-aware chat"
                      className="rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                      onClick={closeChat}
                    >
                      <X aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <p className="mt-4 max-w-[28rem] text-sm leading-6 text-slate-300">
                  Ask course questions, compare concepts, or verify sources from
                  the chapter.
                </p>
              </div>
            </div>

            <div
              ref={transcriptRef}
              className="min-h-0 flex-1 overflow-y-auto border-y border-white/10 px-4 py-4 sm:px-5"
              aria-live="polite"
              aria-label="Conversation with Governance Guide"
              data-source-aware-chat-transcript=""
            >
              <div className="space-y-4">
                <AssistantMessage>{assistantGreeting}</AssistantMessage>

                {transcript.map((turn) => (
                  <div key={turn.id} className="space-y-4">
                    <div
                      role="article"
                      aria-label="Submitted question"
                      className="flex justify-end"
                    >
                      <div className="max-w-[82%] rounded-2xl rounded-tr-md border border-sky-300/30 bg-sky-500/20 px-4 py-3 text-sm leading-6 text-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        {turn.question}
                      </div>
                    </div>

                    {turn.response.status === "loading" ? (
                      <AssistantMessage>
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle
                            aria-hidden="true"
                            className="size-4 animate-spin text-sky-300 motion-reduce:animate-none"
                          />
                          Checking approved materials for a grounded answer.
                        </span>
                      </AssistantMessage>
                    ) : null}

                    {turn.response.status === "error" ? (
                      <AssistantMessage tone="alert">
                        <span role="alert">{turn.response.error.message}</span>
                      </AssistantMessage>
                    ) : null}

                    {turn.response.status === "success" ? (
                      <div className="flex min-w-0 items-start gap-3">
                        <AssistantAvatar />
                        <div className="min-w-0 flex-1">
                          <GroundedAnswerSurface
                            turnId={turn.id}
                            response={turn.response.response}
                            expandedCitationKey={expandedCitationKey}
                            onRefocusQuestion={() =>
                              focusComposer(inputRef, isOpenRef)
                            }
                            onRephraseCourseQuestion={() =>
                              chooseStarterPrompt(rephrasePrompt)
                            }
                            onChooseSuggestedPrompt={chooseStarterPrompt}
                            onToggleSource={(citationKey) =>
                              setExpandedCitationKey((current) =>
                                current === citationKey ? null : citationKey
                              )
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 space-y-4 p-4 sm:p-5">
              <div
                role="group"
                aria-label="Answer depth"
                className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-900/70 p-1"
              >
                {(["student", "expert"] as const).map((mode) => {
                  const isSelected = depthMode === mode
                  const label = mode === "student" ? "Student" : "Expert"

                  return (
                    <Button
                      key={mode}
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`${label} depth`}
                      aria-pressed={isSelected}
                      className={cn(
                        "min-h-10 rounded-md text-xs font-semibold",
                        isSelected
                          ? "bg-sky-300 text-slate-950 hover:bg-sky-200 hover:text-slate-950"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      )}
                      onClick={() => setDepthMode(mode)}
                    >
                      {label}
                    </Button>
                  )
                })}
              </div>

              <div
                role="group"
                aria-labelledby={promptGroupId}
                className="space-y-3"
              >
                <p
                  id={promptGroupId}
                  className="text-[0.68rem] leading-4 font-black tracking-[0.14em] text-slate-400 uppercase"
                >
                  Suggested prompts
                </p>
                {promptState.status === "available" ? (
                  <div className="flex flex-wrap gap-2">
                    {promptState.prompts.map((prompt) => (
                      <Button
                        key={prompt.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto min-h-11 rounded-full border-white/15 bg-white/5 px-3 py-2 text-left text-xs font-semibold whitespace-normal text-slate-100 hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-white"
                        onClick={() => chooseStarterPrompt(prompt.prompt)}
                        disabled={isSubmitting}
                      >
                        <BookOpenCheck
                          aria-hidden="true"
                          className="size-3.5 text-sky-300"
                        />
                        {prompt.label}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p
                    role="status"
                    className="rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300"
                  >
                    {promptState.message}
                  </p>
                )}
              </div>

              <form ref={formRef} className="space-y-3" onSubmit={handleSubmit}>
                <label htmlFor={inputId} className="sr-only">
                  Course question
                </label>
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-sky-300/25 bg-slate-900/80 p-2 pl-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors focus-within:border-sky-300/60 focus-within:ring-3 focus-within:ring-sky-300/20 motion-reduce:transition-none">
                  <textarea
                    ref={inputRef}
                    id={inputId}
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={handleQuestionKeyDown}
                    rows={1}
                    placeholder="Ask about this chapter..."
                    className="min-h-12 flex-1 resize-none bg-transparent px-0 py-3 text-base leading-6 text-white outline-none placeholder:text-slate-500 sm:text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    aria-label={isSubmitting ? "Asking" : "Ask"}
                    className="size-12 shrink-0 rounded-2xl bg-amber-300 text-slate-950 shadow-[0_12px_28px_rgba(245,158,11,0.22)] hover:bg-amber-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoaderCircle
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                    ) : (
                      <Send aria-hidden="true" />
                    )}
                  </Button>
                </div>

                <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 text-xs leading-5 text-slate-400">
                  <span className="inline-flex items-center gap-2 text-emerald-300">
                    <ShieldCheck aria-hidden="true" className="size-4" />
                    Grounded in course sources
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    Cite-verified
                    <span
                      aria-hidden="true"
                      className="grid size-4 place-items-center rounded-full border border-white/20 text-[0.62rem] text-slate-300"
                    >
                      i
                    </span>
                  </span>
                </div>
              </form>
            </div>
          </section>
        ) : null}

        {!isOpen ? (
          <motion.button
            ref={triggerRef}
            type="button"
            aria-controls={panelId}
            aria-expanded={isOpen}
            aria-label="Open source-aware chat"
            data-source-aware-chat-trigger=""
            data-expanded={isDockExpanded ? "true" : "false"}
            className="source-chat-dock"
            initial={false}
            animate={dockMotionState}
            variants={dockVariants}
            transition={dockTransition}
            onPointerEnter={() => setIsDockHovered(true)}
            onPointerLeave={() => setIsDockHovered(false)}
            onFocus={() => setIsDockFocused(true)}
            onBlur={() => setIsDockFocused(false)}
            onClick={() => setIsOpen(true)}
          >
            <motion.span
              className="source-chat-dock-icon"
              aria-hidden="true"
              variants={dockIconVariants}
              transition={dockRevealTransition}
            >
              <MessageCircle />
            </motion.span>
            <motion.span
              className="source-chat-dock-copy"
              variants={dockCopyVariants}
              transition={dockRevealTransition}
            >
              <strong>Ask a question about this chapter</strong>
              <small>Source-aware • Cite-verified</small>
            </motion.span>
            <motion.span
              className="source-chat-dock-arrow"
              aria-hidden="true"
              variants={dockArrowVariants}
              transition={dockRevealTransition}
            >
              <ArrowRight />
            </motion.span>
          </motion.button>
        ) : null}
      </div>
    </div>
  )
}

function createTranscriptTurnId(turnIdRef: { current: number }) {
  turnIdRef.current += 1
  return `chat-turn-${turnIdRef.current}`
}

function focusComposer(
  inputRef: { current: HTMLTextAreaElement | null },
  isOpenRef: { current: boolean }
) {
  if (!isOpenRef.current) {
    return
  }

  inputRef.current?.focus({ preventScroll: true })
}

function syncComposerHeight(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return
  }

  textarea.style.height = "0px"
  const nextHeight = Math.min(
    Math.max(textarea.scrollHeight, composerMinHeightPx),
    composerMaxHeightPx
  )
  textarea.style.height = `${nextHeight}px`
  textarea.style.overflowY =
    textarea.scrollHeight > composerMaxHeightPx ? "auto" : "hidden"
}

function toChatError(error: unknown): ChatError {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof error.code === "string" &&
    typeof error.message === "string"
  ) {
    return {
      code: error.code,
      message: error.message,
    }
  }

  return {
    code: "grounded_chat_unavailable",
    message:
      "The assistant could not return a grounded answer right now. Please try again with a course question.",
  }
}

type AssistantMessageProps = {
  children: ReactNode
  tone?: "default" | "alert"
}

function AssistantMessage({
  children,
  tone = "default",
}: AssistantMessageProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <AssistantAvatar tone={tone} />
      <div
        className={cn(
          "max-w-[82%] rounded-2xl rounded-tl-md border px-4 py-3 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          tone === "alert"
            ? "border-rose-300/30 bg-rose-500/10 text-rose-50"
            : "border-white/10 bg-white/[0.06] text-slate-100"
        )}
      >
        {children}
      </div>
    </div>
  )
}

type AssistantAvatarProps = {
  tone?: "default" | "alert"
}

function AssistantAvatar({ tone = "default" }: AssistantAvatarProps) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
        tone === "alert"
          ? "border-rose-300/35 bg-rose-400/10 text-rose-200"
          : "border-amber-300/35 bg-amber-300/10 text-amber-200"
      )}
      aria-hidden="true"
    >
      <Sparkles className="size-4" />
    </span>
  )
}

type GroundedAnswerSurfaceProps = {
  turnId: string
  response: GroundedChatSuccess
  expandedCitationKey: string | null
  onRefocusQuestion: () => void
  onRephraseCourseQuestion: () => void
  onChooseSuggestedPrompt: (prompt: string) => void
  onToggleSource: (citationKey: string) => void
}

function GroundedAnswerSurface({
  turnId,
  response,
  expandedCitationKey,
  onRefocusQuestion,
  onRephraseCourseQuestion,
  onChooseSuggestedPrompt,
  onToggleSource,
}: GroundedAnswerSurfaceProps) {
  const detailsId = useId()

  if (response.state === "fallback") {
    return (
      <article className="space-y-3 rounded-lg border border-amber-300/35 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="font-semibold text-amber-100">
          Grounded answer unavailable
        </p>
        <p>{response.message}</p>
        <p className="text-amber-100/75">{response.nextStep}</p>
        {response.fallbackSource ? (
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200">
            <BookOpenCheck aria-hidden="true" className="size-4 text-sky-300" />
            {response.fallbackSource.label}
          </p>
        ) : null}
        <div className="grid gap-2">
          {response.suggestedPrompts.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              className="h-auto min-h-11 justify-start rounded-lg border-amber-300/35 bg-slate-950/30 px-3 py-2 text-left text-amber-50 whitespace-normal hover:bg-amber-300/15 hover:text-white"
              onClick={() => onChooseSuggestedPrompt(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </article>
    )
  }

  if (response.state === "weakSupport") {
    return (
      <article className="space-y-3 rounded-2xl rounded-tl-md border border-amber-300/35 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="font-semibold text-amber-100">{response.grounding.cue}</p>
        <p>{response.message}</p>
        <p className="text-amber-100/75">{response.nextStep}</p>
      </article>
    )
  }

  if (response.state === "refused") {
    return (
      <article className="space-y-3 rounded-2xl rounded-tl-md border border-sky-300/30 bg-sky-400/10 p-4 text-sm leading-6 text-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="font-semibold text-sky-100">Course boundary reached</p>
        <p>{response.message}</p>
        <p className="text-sky-100/75">{response.nextStep}</p>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 rounded-full border-sky-300/30 bg-sky-300/10 text-sky-50 hover:bg-sky-300/20 hover:text-white"
          onClick={onRephraseCourseQuestion}
        >
          Rephrase a course question
        </Button>
      </article>
    )
  }

  if (response.state === "cooldown") {
    return (
      <article className="space-y-3 rounded-2xl rounded-tl-md border border-amber-300/35 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="font-semibold text-amber-100">
          Assistant temporarily limited
        </p>
        <p>{response.message}</p>
        <p className="text-amber-100/75">
          {response.nextStep} Retry in about {response.retryAfterSeconds}{" "}
          seconds.
        </p>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 rounded-full border-amber-300/35 bg-amber-300/10 text-amber-50 hover:bg-amber-300/20 hover:text-white"
          onClick={onRefocusQuestion}
        >
          Try again shortly
        </Button>
      </article>
    )
  }

  return (
    <article className="space-y-4 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-emerald-300 uppercase">
          <ShieldCheck aria-hidden="true" className="size-4" />
          {response.grounding.cue}
        </p>
        <p>{response.answer}</p>
      </div>

      <div className="space-y-2" aria-label="Approved source support">
        <p className="text-sm font-semibold text-slate-100">Source support</p>
        <div className="grid gap-2">
          {response.citations.map((citation) => {
            const citationKey = `${turnId}:${citation.sourceId}`
            const isExpanded = expandedCitationKey === citationKey
            const sourceDetailsId = `${detailsId}-${turnId}-${citation.sourceId}`

            return (
              <div key={citation.sourceId} className="min-w-0">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={sourceDetailsId}
                  className="inline-flex min-h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-left text-xs font-semibold text-slate-100 transition-colors hover:border-sky-300/45 hover:bg-sky-300/10 focus-visible:border-sky-300 focus-visible:ring-3 focus-visible:ring-sky-300/25 focus-visible:outline-none motion-reduce:transition-none"
                  onClick={() => onToggleSource(citationKey)}
                >
                  <FileText
                    aria-hidden="true"
                    className="size-4 shrink-0 text-amber-200"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {citation.shortTitle}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-4 shrink-0 text-slate-400 transition-transform motion-reduce:transition-none",
                      isExpanded ? "rotate-180" : null
                    )}
                  />
                </button>

                {isExpanded ? (
                  <div
                    id={sourceDetailsId}
                    className="mt-2 min-w-0 rounded-xl border border-white/10 bg-slate-950/65 p-3 text-sm leading-6 text-slate-100"
                  >
                    <p className="font-semibold">{citation.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {citation.sourceId} - {citation.sourceType}
                    </p>
                    <p className="mt-2 text-slate-300">{citation.detail}</p>
                    {citation.url ? (
                      <a
                        href={citation.url}
                        className="mt-2 inline-flex text-sm font-semibold text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline focus-visible:ring-3 focus-visible:ring-sky-300/25 focus-visible:outline-none"
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
