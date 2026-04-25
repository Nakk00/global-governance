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
    <aside className="rounded-lg border border-border bg-secondary/55 p-5 text-secondary-foreground">
      <p className="text-xs font-semibold tracking-normal text-muted-foreground uppercase">
        Key takeaway
      </p>
      <p className="mt-3 text-base leading-7">{children}</p>
      {nextStep ? (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold tracking-normal text-muted-foreground uppercase">
            Next step
          </p>
          <a
            href={`#${nextStep.targetId}`}
            className="mt-2 inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
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
