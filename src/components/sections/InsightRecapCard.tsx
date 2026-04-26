import { useNavigation } from "@/hooks/useNavigation"

type InsightRecapCardProps = {
  children: string
  nextStep?: {
    label: string
    targetId: string
  }
}

export function InsightRecapCard({
  children,
  nextStep,
}: InsightRecapCardProps) {
  const { navigateToSection } = useNavigation()

  return (
    <aside
      className="editorial-surface editorial-recap shadow-none"
      data-editorial-surface="recap"
    >
      <p className="editorial-kicker">Key takeaway</p>
      <p className="mt-3 text-base leading-7">{children}</p>
      {nextStep ? (
        <div className="mt-5 border-t border-border pt-4">
          <p className="editorial-kicker">Next step</p>
          <a
            href={`#${nextStep.targetId}`}
            data-action-priority="primary"
            className="editorial-primary-action mt-3 inline-flex w-full items-center justify-center text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:w-auto"
            onClick={(event) => {
              event.preventDefault()
              navigateToSection(nextStep.targetId)
            }}
          >
            {nextStep.label}
          </a>
        </div>
      ) : null}
    </aside>
  )
}
