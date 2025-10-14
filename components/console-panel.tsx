"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ConsoleMessage {
  id: string
  type: "log" | "error" | "warn" | "info"
  message: string
  timestamp: Date
  count?: number
}

interface ConsolePanelProps {
  messages: ConsoleMessage[]
  onClear: () => void
}

export function ConsolePanel({ messages, onClear }: ConsolePanelProps) {
  const [filter, setFilter] = useState<"all" | "log" | "error" | "warn">("all")
  const consoleEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredMessages = filter === "all" ? messages : messages.filter((msg) => msg.type === filter)

  const errorCount = messages.filter((m) => m.type === "error").length
  const warnCount = messages.filter((m) => m.type === "warn").length

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-t border-[#2d2d2d]">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#2d2d2d]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#cccccc]" />
            <span className="text-sm text-[#cccccc] font-semibold">Console</span>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs cursor-pointer ${
                filter === "all" ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2d2d2d]"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs cursor-pointer ${
                filter === "error" ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2d2d2d]"
              }`}
              onClick={() => setFilter("error")}
            >
              Errors {errorCount > 0 && `(${errorCount})`}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs cursor-pointer ${
                filter === "warn" ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2d2d2d]"
              }`}
              onClick={() => setFilter("warn")}
            >
              Warnings {warnCount > 0 && `(${warnCount})`}
            </Button>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#2d2d2d] text-[#cccccc] cursor-pointer" onClick={onClear} title="Clear console">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Console Messages */}
      <div className="flex-1 overflow-auto font-mono text-sm">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#858585] text-xs">No console output</div>
        ) : (
          <div className="p-2">
            {filteredMessages.map((msg) => (
              <ConsoleMessage key={msg.id} message={msg} />
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}

function ConsoleMessage({ message }: { message: ConsoleMessage }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getMessageColor = () => {
    switch (message.type) {
      case "error":
        return "text-[#f48771]"
      case "warn":
        return "text-[#cca700]"
      case "info":
        return "text-[#75beff]"
      default:
        return "text-[#cccccc]"
    }
  }

  const getIcon = () => {
    switch (message.type) {
      case "error":
        return "✕"
      case "warn":
        return "⚠"
      case "info":
        return "ℹ"
      default:
        return "›"
    }
  }

  const isMultiline = message.message.includes("\n") || message.message.length > 100

  return (
    <div className={`flex gap-2 px-2 py-1 hover:bg-[#2d2d2d] border-b border-[#2d2d2d]/50 ${getMessageColor()}`}>
      {isMultiline && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex-shrink-0 mt-0.5 cursor-pointer hover:opacity-70">
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
      )}
      <span className="flex-shrink-0 mt-0.5">{getIcon()}</span>
      <div className="flex-1 min-w-0">
        <div className={isExpanded ? "" : "truncate"}>{message.message}</div>
        {message.count && message.count > 1 && (
          <span className="ml-2 px-1.5 py-0.5 bg-[#37373d] rounded text-xs">{message.count}</span>
        )}
        <div className="text-[#858585] text-xs mt-0.5">{message.timestamp.toLocaleTimeString()}</div>
      </div>
    </div>
  )
}
