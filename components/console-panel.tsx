"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Terminal,
  Trash2,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
  onEvalREPL?: (expression: string) => void
}

export function ConsolePanel({ messages, onClear, onEvalREPL }: ConsolePanelProps) {
  const [filter, setFilter] = useState<"all" | "log" | "error" | "warn" | "info">("all")
  const [search, setSearch] = useState("")
  const [replInput, setReplInput] = useState("")
  const [copied, setCopied] = useState(false)
  const consoleEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredMessages = messages.filter((msg) => {
    const matchesType = filter === "all" || msg.type === filter
    const matchesSearch = !search || msg.message.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const errorCount = messages.filter((m) => m.type === "error").length
  const warnCount = messages.filter((m) => m.type === "warn").length

  const handleCopyLogs = () => {
    const text = messages.map((m) => `[${m.timestamp.toLocaleTimeString()}] [${m.type.toUpperCase()}]: ${m.message}`).join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Console logs copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReplSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replInput.trim()) return

    const expr = replInput.trim()
    setReplInput("")

    // Send expression to iframe
    if (onEvalREPL) {
      onEvalREPL(expr)
    } else {
      const iframes = document.querySelectorAll("iframe")
      iframes.forEach((iframe) => {
        iframe.contentWindow?.postMessage({ type: "eval-repl", expression: expr }, "*")
      })
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#0e0e11] border-t border-white/[0.08] text-zinc-200">
      {/* Console Header Bar */}
      <div className="h-9 px-3 bg-[#121215] border-b border-white/[0.08] flex items-center justify-between gap-2 select-none flex-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-xs">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>DevTools Console</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-0.5 bg-[#18181b] p-0.5 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                filter === "all" ? "bg-indigo-600/30 text-indigo-300" : "text-zinc-400 hover:text-white"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter("error")}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                filter === "error" ? "bg-rose-500/20 text-rose-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              Errors {errorCount > 0 && `(${errorCount})`}
            </button>
            <button
              onClick={() => setFilter("warn")}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                filter === "warn" ? "bg-amber-500/20 text-amber-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              Warnings {warnCount > 0 && `(${warnCount})`}
            </button>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2 top-2 h-3 w-3 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter output..."
              className="w-32 bg-[#18181b] border border-white/[0.08] rounded-md pl-6 pr-2 py-0.5 text-[11px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleCopyLogs}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Copy Console Logs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={onClear}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Clear Console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Output Area */}
      <div className="flex-1 overflow-y-auto font-mono text-xs p-2 space-y-1 select-text">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
            <span>No console output. Logs from your preview will appear here.</span>
          </div>
        ) : (
          filteredMessages.map((msg) => <ConsoleMessageItem key={msg.id} message={msg} />)
        )}
        <div ref={consoleEndRef} />
      </div>

      {/* Live JavaScript REPL Input */}
      <form onSubmit={handleReplSubmit} className="flex-none flex items-center border-t border-white/[0.08] bg-[#121215] px-2 py-1.5">
        <span className="font-mono text-indigo-400 font-bold px-2 text-xs select-none">&gt;</span>
        <input
          type="text"
          value={replInput}
          onChange={(e) => setReplInput(e.target.value)}
          placeholder="Evaluate JavaScript expression in live sandbox..."
          className="flex-1 bg-transparent border-none text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!replInput.trim()}
          className="p-1 text-zinc-400 hover:text-indigo-400 disabled:opacity-30 transition-colors cursor-pointer"
          title="Run in sandbox"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  )
}

function ConsoleMessageItem({ message }: { message: ConsoleMessage }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeStyle = () => {
    switch (message.type) {
      case "error":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-300",
          icon: <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />,
        }
      case "warn":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-300",
          icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />,
        }
      case "info":
        return {
          bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
          icon: <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />,
        }
      default:
        return {
          bg: "hover:bg-white/[0.03] border-transparent text-zinc-300",
          icon: <span className="text-zinc-500 font-bold select-none shrink-0">›</span>,
        }
    }
  }

  const { bg, icon } = getTypeStyle()
  const isMultiline = message.message.includes("\n") || message.message.length > 90

  return (
    <div className={`flex items-start gap-2 px-2.5 py-1.5 rounded-md border transition-colors ${bg}`}>
      {icon}

      <div className="flex-1 min-w-0">
        <div className={`break-words ${isExpanded ? "" : "line-clamp-2"}`}>
          {message.message}
        </div>

        {isMultiline && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] text-indigo-400 hover:underline mt-0.5 cursor-pointer select-none"
          >
            {isExpanded ? "Show less" : "Show full trace"}
          </button>
        )}
      </div>

      <span className="text-[10px] text-zinc-500 shrink-0 font-mono select-none">
        {message.timestamp.toLocaleTimeString()}
      </span>
    </div>
  )
}
