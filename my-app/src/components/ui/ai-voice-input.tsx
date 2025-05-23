"use client"

import { Mic } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

interface AIVoiceInputProps {
  onStart?: () => void
  onStop?: (duration: number) => void
  visualizerBars?: number
  demoMode?: boolean
  demoInterval?: number
  className?: string
  compact?: boolean
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className,
  compact = false,
}: AIVoiceInputProps) {
  const [submitted, setSubmitted] = useState(false)
  const [time, setTime] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isDemo, setIsDemo] = useState(demoMode)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Use useRef to track time without adding it to dependency array
  const timeRef = useCallback(() => time, [time])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (submitted) {
      onStart?.()
      intervalId = setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    } else {
      // We can still access current time via timeRef
      const currentTime = timeRef()
      if (currentTime > 0) {
        onStop?.(currentTime)
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [submitted, onStart, onStop, timeRef]) // timeRef is stable between renders

  useEffect(() => {
    if (!isDemo) return

    let timeoutId: NodeJS.Timeout
    const runAnimation = () => {
      setSubmitted(true)
      timeoutId = setTimeout(() => {
        setSubmitted(false)
        timeoutId = setTimeout(runAnimation, 1000)
      }, demoInterval)
    }

    const initialTimeout = setTimeout(runAnimation, 100)
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(initialTimeout)
    }
  }, [isDemo, demoInterval])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false)
      setSubmitted(false)
      setTime(0) // Reset time when demo stops
    } else {
      if (submitted) {
        // If we're stopping the recording
        setSubmitted(false)
        // Wait for the next tick to reset time after onStop is called
        setTimeout(() => setTime(0), 0)
      } else {
        // If we're starting recording
        setSubmitted(true)
      }
    }
  }

  if (compact) {
    return (
      <button
        className={cn(
          "group w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          submitted ? "bg-blue-100" : "bg-none hover:bg-black/10",
          className,
        )}
        type="button"
        onClick={handleClick}
      >
        {submitted ? (
          <div
            className="w-4 h-4 rounded-sm animate-spin bg-blue-600 cursor-pointer pointer-events-auto"
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <Mic className="w-5 h-5 text-blue-600" />
        )}
      </button>
    )
  }

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            submitted ? "bg-none" : "bg-none hover:bg-black/10",
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            submitted ? "text-black/70" : "text-black/30",
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                submitted ? "bg-black/50 animate-pulse" : "bg-black/10 h-1",
              )}
              style={
                submitted && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70">{submitted ? "Listening..." : "Click to speak"}</p>
      </div>
    </div>
  )
}
