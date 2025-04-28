"use client"

import { useState, useEffect } from "react"

type ScreenSizeBreakpoints = {
  sm: number
  md: number
  lg: number
  xl: number
  "2xl": number
}

type ScreenSizeValue = {
  width: number
  height: number
  breakpoint: keyof ScreenSizeBreakpoints | null
  lessThan: (breakpoint: keyof ScreenSizeBreakpoints) => boolean
  greaterThan: (breakpoint: keyof ScreenSizeBreakpoints) => boolean
  between: (minBreakpoint: keyof ScreenSizeBreakpoints, maxBreakpoint: keyof ScreenSizeBreakpoints) => boolean
}

// Tailwind default breakpoints
const defaultBreakpoints: ScreenSizeBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export default function useScreenSize(breakpoints: ScreenSizeBreakpoints = defaultBreakpoints): ScreenSizeValue {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  // Get current breakpoint based on window width
  const getCurrentBreakpoint = (width: number): keyof ScreenSizeBreakpoints | null => {
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort((a, b) => a[1] - b[1])
      .map(([key]) => key as keyof ScreenSizeBreakpoints)

    for (let i = sortedBreakpoints.length - 1; i >= 0; i--) {
      const breakpoint = sortedBreakpoints[i]
      if (width >= breakpoints[breakpoint]) {
        return breakpoint
      }
    }
    return null
  }

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const currentBreakpoint = getCurrentBreakpoint(windowSize.width)

  const lessThan = (breakpoint: keyof ScreenSizeBreakpoints): boolean => {
    return windowSize.width < breakpoints[breakpoint]
  }

  const greaterThan = (breakpoint: keyof ScreenSizeBreakpoints): boolean => {
    return windowSize.width >= breakpoints[breakpoint]
  }

  const between = (
    minBreakpoint: keyof ScreenSizeBreakpoints,
    maxBreakpoint: keyof ScreenSizeBreakpoints
  ): boolean => {
    return (
      windowSize.width >= breakpoints[minBreakpoint] && windowSize.width < breakpoints[maxBreakpoint]
    )
  }

  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint: currentBreakpoint,
    lessThan,
    greaterThan,
    between,
  }
}