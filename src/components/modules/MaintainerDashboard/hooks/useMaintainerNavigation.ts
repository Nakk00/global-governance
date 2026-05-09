import { useCallback, useEffect, useState } from "react"

import {
  parseMaintainerRoute,
  type MaintainerRoute,
} from "../shared/maintainerDashboardShared"

export function useMaintainerNavigation({
  initialPath,
}: {
  initialPath?: string
}) {
  const [route, setRoute] = useState<MaintainerRoute>(() =>
    parseMaintainerRoute(
      initialPath ?? `${window.location.pathname}${window.location.search}`
    )
  )

  const navigateTo = useCallback((path: string) => {
    const nextRoute = parseMaintainerRoute(path)
    window.history.pushState(null, "", nextRoute.path)
    setRoute(nextRoute)
  }, [])

  useEffect(() => {
    function syncRouteFromHistory() {
      setRoute(
        parseMaintainerRoute(
          `${window.location.pathname}${window.location.search}`
        )
      )
    }

    window.addEventListener("popstate", syncRouteFromHistory)
    return () => window.removeEventListener("popstate", syncRouteFromHistory)
  }, [])

  return { route, navigateTo, setRoute }
}
