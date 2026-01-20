"use client"

import React from "react"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Radio,
  FileCode2,
  Sparkles,
  Terminal,
  Columns2,
  FileCode,
  Eye
} from "lucide-react"

interface StatusBarProps {
  activeFile: string | null
  activeLanguage: string
  errorCount: number
  warnCount: number
  showConsole: boolean
  onToggleConsole: () => void
  currentLayout: "split" | "editor" | "preview"
  onLayoutChange: (layout: "split" | "editor" | "preview") => void
  lineCol?: { line: number; col: number }
  tabSize?: number
  autoSave?: boolean
}

export function StatusBar({
  activeFile,
  activeLanguage,
  errorCount,
  warnCount,
  showConsole,
  onToggleConsole,
  currentLayout,
  onLayoutChange,
  lineCol = { line: 1, col: 1 },
  tabSize = 2,
  autoSave = true,
}: StatusBarProps) {
  const getLanguageLabel = () => {
    switch (activeLanguage.toLowerCase()) {
      case "html":
        return "HTML5"
      case "css":
        return "CSS3"
      case "javascript":
        return "JavaScript (ES6+)"
      case "typescript":
        return "TypeScript"
      case "json":
        return "JSON"
      default:
        return activeLanguage.toUpperCase()
    }
  }

  return (
    <footer className="h-6 flex-none bg-[#0e0e11] border-t border-white/[0.08] flex items-center justify-between px-3 text-[11px] text-zinc-400 select-none z-20">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Console & Issue counters */}
        <button
          onClick={onToggleConsole}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/[0.08] transition-colors cursor-pointer ${
            showConsole ? "text-indigo-400 bg-indigo-500/10" : ""
          }`}
          title="Toggle Terminal Console"
        >
          <Terminal className="h-3 w-3" />
          <span className="font-semibold">Console</span>
          {errorCount > 0 && (
            <span className="flex items-center gap-0.5 text-rose-400 font-bold ml-1">
              <XCircle className="h-3 w-3" /> {errorCount}
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-0.5 text-amber-400 font-bold ml-1">
              <AlertTriangle className="h-3 w-3" /> {warnCount}
            </span>
          )}
          {errorCount === 0 && warnCount === 0 && (
            <span className="flex items-center gap-0.5 text-emerald-400 text-[10px] ml-1">
              <CheckCircle2 className="h-2.5 w-2.5" /> 0
            </span>
          )}
        </button>

        <div className="h-3 w-px bg-white/[0.08]" />

        {/* Live Server Pulse */}
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium" title="Live Preview Synchronization Active">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Reload</span>
        </div>

        {autoSave && (
          <>
            <div className="h-3 w-px bg-white/[0.08]" />
            <span className="text-zinc-500 hidden sm:inline">Auto-Save On</span>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Ln / Col */}
        <span className="font-mono text-zinc-400 hidden sm:inline">
          Ln {lineCol.line}, Col {lineCol.col}
        </span>

        {/* Spaces */}
        <span className="text-zinc-400 hidden md:inline">Spaces: {tabSize}</span>

        {/* Encoding */}
        <span className="text-zinc-400 hidden md:inline">UTF-8</span>

        {/* Formatter ready */}
        <div className="flex items-center gap-1 text-zinc-400 hidden sm:flex" title="Prettier Formatting Ready">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span>Prettier</span>
        </div>

        {/* Language */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.05] text-zinc-300 font-medium border border-white/[0.06]">
          <FileCode2 className="h-3 w-3 text-indigo-400" />
          <span>{getLanguageLabel()}</span>
        </div>

        {/* Quick layout triggers */}
        <div className="flex items-center gap-0.5 border border-white/[0.08] rounded p-0.5 bg-white/[0.02]">
          <button
            onClick={() => onLayoutChange("editor")}
            title="Editor View"
            className={`p-0.5 rounded hover:text-white ${currentLayout === "editor" ? "bg-indigo-600/30 text-indigo-300" : "text-zinc-500"}`}
          >
            <FileCode className="h-3 w-3" />
          </button>
          <button
            onClick={() => onLayoutChange("split")}
            title="Split View"
            className={`p-0.5 rounded hover:text-white ${currentLayout === "split" ? "bg-indigo-600/30 text-indigo-300" : "text-zinc-500"}`}
          >
            <Columns2 className="h-3 w-3" />
          </button>
          <button
            onClick={() => onLayoutChange("preview")}
            title="Preview View"
            className={`p-0.5 rounded hover:text-white ${currentLayout === "preview" ? "bg-indigo-600/30 text-indigo-300" : "text-zinc-500"}`}
          >
            <Eye className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  )
}
