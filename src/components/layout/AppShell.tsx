import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/Navbar"
import { SectionProgressRail } from "@/components/layout/SectionProgressRail"
import { NavigationProvider } from "@/contexts/NavigationContext"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <NavigationProvider>
      <div className="min-h-svh bg-background text-foreground">
        <Navbar />
        <SectionProgressRail />
        {children}
      </div>
    </NavigationProvider>
  )
}
