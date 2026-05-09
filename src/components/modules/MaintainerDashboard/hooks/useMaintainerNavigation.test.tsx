import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useMaintainerNavigation } from "./useMaintainerNavigation"

describe("useMaintainerNavigation", () => {
  it("normalizes malformed source detail paths back to overview", () => {
    const { result } = renderHook(() =>
      useMaintainerNavigation({ initialPath: "/maintainer/sources/%E0%A4%A" })
    )

    expect(result.current.route.section).toBe("overview")
    expect(result.current.route.path).toBe("/maintainer")
  })

  it("keeps preset state when navigating into source detail", () => {
    const { result } = renderHook(() =>
      useMaintainerNavigation({ initialPath: "/maintainer" })
    )

    act(() => {
      result.current.navigateTo(
        "/maintainer/sources/gg-src-un-charter-institutions?preset=validation-follow-up"
      )
    })

    expect(result.current.route.section).toBe("sourceDetail")
    expect(result.current.route.path).toContain("preset=validation-follow-up")
  })
})
