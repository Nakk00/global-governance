import { MessageCircle, Send, X } from "lucide-react"
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
  resolveStarterPromptState,
  sourceAwareChatStarterPrompts,
} from "@/data/chat/source-aware-chat"
import { cn } from "@/lib/utils"

type SourceAwareChatProps = {
  starterPrompts?: unknown
}

export function SourceAwareChat({
  starterPrompts = sourceAwareChatStarterPrompts,
}: SourceAwareChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelId = useId()
  const inputId = useId()
  const promptGroupId = useId()
  const promptState = resolveStarterPromptState(starterPrompts)

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
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
                        onClick={() => setQuestion(prompt.prompt)}
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
                  Grounded answers and citations arrive in the next chat story.
                </p>
                <Button type="submit" className="w-full sm:w-auto">
                  <Send aria-hidden="true" data-icon="inline-start" />
                  Ask
                </Button>
              </div>
            </form>
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
