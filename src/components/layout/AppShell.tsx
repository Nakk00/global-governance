import type { ReactNode } from "react"

import { SourceAwareChat } from "@/components/chat/SourceAwareChat"
import { Navbar } from "@/components/layout/Navbar"
import { SectionProgressRail } from "@/components/layout/SectionProgressRail"
import { NavigationProvider } from "@/contexts/NavigationContext"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <NavigationProvider>
      <div className="editorial-shell min-h-svh overflow-x-clip [overflow-wrap:anywhere]">
        <Navbar />
        <SectionProgressRail />
        {children}
        <SourceAwareChat />
      </div>
    </NavigationProvider>
  )
}
