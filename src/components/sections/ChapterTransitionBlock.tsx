import type { ChapterTransitionContent } from "@/data/sections/narrative-types"

type ChapterTransitionBlockProps = {
  content: ChapterTransitionContent
}

export function ChapterTransitionBlock({
  content,
}: ChapterTransitionBlockProps) {
  return (
    <div className="editorial-container" data-editorial-surface="transition">
      <div className="editorial-transition orbital-grid-line px-6 sm:px-8">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.65fr)] md:items-end">
          <div>
            <p className="editorial-kicker">{content.label}</p>
            <p className="mt-2 max-w-2xl text-xl leading-8 font-semibold text-foreground sm:text-2xl">
              {content.title}
            </p>
          </div>
          <p className="editorial-prose max-w-md md:justify-self-end">
            {content.body}
          </p>
        </div>
      </div>
    </div>
  )
}
