import { chapterNavigation } from "@/data/navigation"
import { useNavigation } from "@/hooks/useNavigation"

export function SectionProgressRail() {
  const { activeChapterId, navigateToChapter } = useNavigation()

  return (
    <nav aria-label="Section progress" className="sr-only">
      {chapterNavigation.map((item) => {
        const isActive = item.id === activeChapterId

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={item.label}
            aria-current={isActive ? "location" : undefined}
            data-action-priority="secondary"
            onClick={(event) => {
              event.preventDefault()
              navigateToChapter(item.id)
            }}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
