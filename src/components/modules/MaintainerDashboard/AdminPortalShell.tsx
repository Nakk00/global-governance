import { RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AdminUtilityBar({
  userInitials,
  lastSync,
  onNavigate,
}: {
  route?: unknown
  userInitials?: string
  lastSync?: string
  onNavigate: (path: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-card/70 p-3 shadow-sm shadow-black/10">
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-background/70 text-sm font-semibold">
        {(userInitials ?? "AD").slice(0, 2).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">Maintainer workspace</p>
        <p className="text-xs text-muted-foreground">
          {lastSync ? `Last sync ${lastSync}` : "Local preview state"}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ml-auto"
        onClick={() => onNavigate("/maintainer/sources/new")}
      >
        <RefreshCcw className="size-4" aria-hidden="true" />
        Upload source
      </Button>
    </div>
  )
}
