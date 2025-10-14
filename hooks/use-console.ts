"use client"

import { useState, useCallback, useEffect } from "react"
import type { ConsoleMessage } from "@/components/console-panel"

export function useConsole() {
  const [messages, setMessages] = useState<ConsoleMessage[]>([])

  const addMessage = useCallback((message: string, type: "log" | "error" | "warn" | "info" = "log") => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString() + Math.random(),
      type,
      message,
      timestamp: new Date(),
    }

    setMessages((prev) => {
      // Check if last message is the same (for grouping)
      const lastMessage = prev[prev.length - 1]
      if (lastMessage && lastMessage.message === message && lastMessage.type === type) {
        return [...prev.slice(0, -1), { ...lastMessage, count: (lastMessage.count || 1) + 1 }]
      }
      return [...prev, newMessage]
    })
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "console") {
        const { method, args } = event.data
        const message = args
          .map((arg: any) => {
            if (typeof arg === "object") {
              try {
                return JSON.stringify(arg, null, 2)
              } catch {
                return String(arg)
              }
            }
            return String(arg)
          })
          .join(" ")

        addMessage(message, method)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [addMessage])

  return {
    messages,
    addMessage,
    clearMessages,
  }
}
