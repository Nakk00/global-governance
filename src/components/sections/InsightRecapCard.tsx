type InsightRecapCardProps = {
  children: string
}

export function InsightRecapCard({ children }: InsightRecapCardProps) {
  return (
    <aside className="rounded-lg border border-border bg-secondary/70 p-5 text-secondary-foreground">
      <p className="text-xs font-semibold tracking-normal text-muted-foreground uppercase">
        Key takeaway
      </p>
      <p className="mt-3 text-base leading-7">{children}</p>
    </aside>
  )
}
