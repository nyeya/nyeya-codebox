"use client"

import React, { useState } from "react"
import {
  Play,
  Save,
  Download,
  Share2,
  Columns2,
  Eye,
  FileCode,
  Sparkles,
  Command,
  Plus,
  FolderOpen,
  FileDown,
  Upload,
  Settings,
  Keyboard,
  Layers,
  ChevronDown,
  Edit2,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface TopNavigationProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  onSave: () => void
  onExportZip: () => void
  onExportHTML: () => void
  onImportZip: (file: File) => void
  onShare: () => void
  onRun: () => void
  onFormat: () => void
  onLayoutChange: (layout: "split" | "editor" | "preview") => void
  currentLayout: "split" | "editor" | "preview"
  onNewProject: () => void
  onOpenTemplates: () => void
  onOpenSettings: () => void
  onOpenCommandPalette: () => void
  onOpenShortcuts: () => void
  isDirty?: boolean
}

export function TopNavigation({
  projectName,
  onProjectNameChange,
  onSave,
  onExportZip,
  onExportHTML,
  onImportZip,
  onShare,
  onRun,
  onFormat,
  onLayoutChange,
  currentLayout,
  onNewProject,
  onOpenTemplates,
  onOpenSettings,
  onOpenCommandPalette,
  onOpenShortcuts,
  isDirty = false,
}: TopNavigationProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(projectName)

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onProjectNameChange(tempName.trim())
    } else {
      setTempName(projectName)
    }
    setIsEditingName(false)
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImportZip(file)
      e.target.value = ""
    }
  }

  return (
    <header className="h-12 flex-none bg-[#121215] border-b border-white/[0.08] flex items-center justify-between px-3 gap-3 z-30 select-none">
      {/* Left Section: Brand & Project Name */}
      <div className="flex items-center gap-3">
        {/* Project Name Capsule */}
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameSubmit()
                  if (e.key === "Escape") {
                    setTempName(projectName)
                    setIsEditingName(false)
                  }
                }}
                className="h-7 w-48 px-2 text-xs bg-[#18181b] border-indigo-500 text-white focus-visible:ring-1 focus-visible:ring-indigo-500"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNameSubmit}
                className="h-7 w-7 text-emerald-400 hover:bg-emerald-500/20"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempName(projectName)
                setIsEditingName(true)
              }}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.08]"
              title="Click to rename project"
            >
              <span>{projectName}</span>
              <Edit2 className="h-3 w-3 text-zinc-500" />
            </button>
          )}

          {isDirty && (
            <span className="h-2 w-2 rounded-full bg-amber-400" title="Unsaved changes" />
          )}
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="h-3.5 w-3.5 text-zinc-500" />
          <span>Quick Find / Actions</span>
          <kbd className="text-[10px] bg-[#27272a] text-zinc-400 px-1.5 py-0.5 rounded font-mono font-semibold">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center Section: Layout Modes */}
      <div className="flex items-center gap-1 bg-[#18181b] p-0.5 rounded-lg border border-white/[0.08]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLayoutChange("editor")}
          className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
            currentLayout === "editor"
              ? "bg-indigo-600/30 text-indigo-300 shadow-sm border border-indigo-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Code Editor Only"
        >
          <FileCode className="h-3.5 w-3.5 mr-1.5" />
          <span className="hidden sm:inline">Editor</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLayoutChange("split")}
          className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
            currentLayout === "split"
              ? "bg-indigo-600/30 text-indigo-300 shadow-sm border border-indigo-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Split Editor & Live Preview"
        >
          <Columns2 className="h-3.5 w-3.5 mr-1.5" />
          <span className="hidden sm:inline">Split</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLayoutChange("preview")}
          className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
            currentLayout === "preview"
              ? "bg-indigo-600/30 text-indigo-300 shadow-sm border border-indigo-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Live Preview Only"
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          <span className="hidden sm:inline">Preview</span>
        </Button>
      </div>

      {/* Right Section: Action Controls */}
      <div className="flex items-center gap-2">
        {/* Prettier Format */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onFormat}
          className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] hidden sm:flex items-center gap-1.5"
          title="Format with Prettier (Shift+Alt+F)"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Format</span>
        </Button>

        {/* Save */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] flex items-center gap-1.5"
          title="Save Project (Ctrl+S)"
        >
          <Save className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Save</span>
        </Button>

        {/* Share */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] flex items-center gap-1.5"
          title="Share Project URL"
        >
          <Share2 className="h-3.5 w-3.5 text-purple-400" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        {/* Run Button (Glowing) */}
        <Button
          size="sm"
          onClick={onRun}
          className="h-8 px-3.5 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          title="Run / Refresh Sandbox (Ctrl+Enter)"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Run</span>
        </Button>

        {/* Project Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] flex items-center gap-1"
            >
              <span>Project</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#18181b] border-white/[0.1] text-zinc-200 p-1.5 shadow-2xl rounded-xl">
            <DropdownMenuItem onClick={onNewProject} className="gap-2.5 cursor-pointer hover:bg-white/[0.08] rounded-lg">
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>New Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenTemplates} className="gap-2.5 cursor-pointer hover:bg-white/[0.08] rounded-lg">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Starter Templates</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/[0.08] my-1" />

            {/* Import ZIP */}
            <label className="flex items-center gap-2.5 px-2 py-1.5 text-xs text-zinc-200 hover:bg-white/[0.08] rounded-lg cursor-pointer transition-colors">
              <Upload className="h-4 w-4 text-cyan-400" />
              <span>Import ZIP Project</span>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            {/* Export ZIP */}
            <DropdownMenuItem onClick={onExportZip} className="gap-2.5 cursor-pointer hover:bg-white/[0.08] rounded-lg">
              <Download className="h-4 w-4 text-blue-400" />
              <span>Export as ZIP Package</span>
            </DropdownMenuItem>

            {/* Export Standalone HTML */}
            <DropdownMenuItem onClick={onExportHTML} className="gap-2.5 cursor-pointer hover:bg-white/[0.08] rounded-lg">
              <FileDown className="h-4 w-4 text-teal-400" />
              <span>Export as Single HTML</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/[0.08] my-1" />

            <DropdownMenuItem onClick={onOpenShortcuts} className="gap-2.5 cursor-pointer hover:bg-white/[0.08] rounded-lg">
              <Keyboard className="h-4 w-4 text-zinc-400" />
              <span>Shortcuts Cheatsheet</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenSettings} className="gap-2.5 cursor-pointer hover:bg-white/[0.08] rounded-lg">
              <Settings className="h-4 w-4 text-zinc-400" />
              <span>Preferences</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
