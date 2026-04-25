import type { ChapterTransitionContent } from "@/data/sections/narrative-types"

type ChapterTransitionBlockProps = {
  content: ChapterTransitionContent
}

export function ChapterTransitionBlock({
  content,
}: ChapterTransitionBlockProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
      <div className="border-y border-border py-8">
        <p className="text-sm font-semibold text-muted-foreground">
          {content.label}
        </p>
        <p className="mt-2 max-w-2xl text-xl leading-8 font-semibold text-foreground">
          {content.title}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          {content.body}
        </p>
      </div>
    </div>
  )
}
