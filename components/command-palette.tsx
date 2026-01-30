"use client"

import React, { useState, useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Play,
  Save,
  Download,
  Share2,
  FilePlus,
  Sparkles,
  FileCode,
  Columns2,
  Eye,
  Sun,
  Moon,
  Layers,
  Settings,
  Terminal,
  Package,
  FolderOpen
} from "lucide-react"
import type { FileNode } from "@/types/file-system"
import { templates, type ProjectTemplate } from "@/lib/templates"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  files: FileNode[]
  activeFile: string | null
  onFileSelect: (path: string) => void
  onRun: () => void
  onSave: () => void
  onExportZip: () => void
  onExportHTML: () => void
  onShare: () => void
  onFormat: () => void
  onNewProject: () => void
  onSelectTemplate: (template: ProjectTemplate) => void
  onLayoutChange: (layout: "split" | "editor" | "preview") => void
  onToggleTheme: () => void
  onOpenSettings: () => void
  onToggleConsole: () => void
}

export function CommandPalette({
  open,
  onOpenChange,
  files,
  activeFile,
  onFileSelect,
  onRun,
  onSave,
  onExportZip,
  onExportHTML,
  onShare,
  onFormat,
  onNewProject,
  onSelectTemplate,
  onLayoutChange,
  onToggleTheme,
  onOpenSettings,
  onToggleConsole,
}: CommandPaletteProps) {
  // Flatten all files for quick navigation
  const flatFiles: { path: string; name: string }[] = []
  const collect = (nodes: FileNode[]) => {
    nodes.forEach((n) => {
      if (n.type === "file") {
        flatFiles.push({ path: n.path, name: n.name })
      }
      if (n.children) collect(n.children)
    })
  }
  collect(files)

  const runAndClose = (fn: () => void) => {
    fn()
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="bg-[#18181b] text-zinc-200 border border-white/[0.1] shadow-2xl rounded-2xl overflow-hidden">
        <CommandInput placeholder="Type a command or search files..." className="text-sm text-zinc-100 placeholder:text-zinc-500" />
        <CommandList className="max-h-96 py-2">
          <CommandEmpty className="py-6 text-center text-xs text-zinc-500">No matching commands found.</CommandEmpty>

          {/* Quick Actions */}
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runAndClose(onRun)} className="gap-2 cursor-pointer hover:bg-indigo-600/20">
              <Play className="h-4 w-4 text-emerald-400" />
              <span>Run / Refresh Project</span>
              <kbd className="ml-auto text-[10px] text-zinc-500 bg-white/[0.06] px-1.5 py-0.5 rounded">Ctrl+Enter</kbd>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onSave)} className="gap-2 cursor-pointer hover:bg-indigo-600/20">
              <Save className="h-4 w-4 text-indigo-400" />
              <span>Save Project to LocalStorage</span>
              <kbd className="ml-auto text-[10px] text-zinc-500 bg-white/[0.06] px-1.5 py-0.5 rounded">Ctrl+S</kbd>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onFormat)} className="gap-2 cursor-pointer hover:bg-indigo-600/20">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Format Active File (Prettier)</span>
              <kbd className="ml-auto text-[10px] text-zinc-500 bg-white/[0.06] px-1.5 py-0.5 rounded">Shift+Alt+F</kbd>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onShare)} className="gap-2 cursor-pointer hover:bg-indigo-600/20">
              <Share2 className="h-4 w-4 text-purple-400" />
              <span>Generate Compressed Share Link</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onExportZip)} className="gap-2 cursor-pointer hover:bg-indigo-600/20">
              <Download className="h-4 w-4 text-blue-400" />
              <span>Export Project as ZIP Package</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onExportHTML)} className="gap-2 cursor-pointer hover:bg-indigo-600/20">
              <Download className="h-4 w-4 text-teal-400" />
              <span>Export as Single-File Standalone HTML</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onNewProject)} className="gap-2 cursor-pointer hover:bg-indigo-600/20">
              <FilePlus className="h-4 w-4 text-zinc-400" />
              <span>Start New Clean Project</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/[0.08] my-1" />

          {/* Project Files */}
          <CommandGroup heading="Jump to File">
            {flatFiles.map((f) => (
              <CommandItem
                key={f.path}
                onSelect={() => {
                  onFileSelect(f.path)
                  onOpenChange(false)
                }}
                className={`gap-2 cursor-pointer ${activeFile === f.path ? "bg-indigo-600/20 text-indigo-300" : ""}`}
              >
                <FileCode className="h-4 w-4 text-zinc-400" />
                <span>{f.name}</span>
                <span className="ml-auto text-[10px] text-zinc-500">{f.path}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="bg-white/[0.08] my-1" />

          {/* Starter Templates */}
          <CommandGroup heading="Starter Templates">
            {templates.map((t) => (
              <CommandItem
                key={t.id}
                onSelect={() => runAndClose(() => onSelectTemplate(t))}
                className="gap-2 cursor-pointer"
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.name}</span>
                <span className="ml-auto text-[10px] text-zinc-500">{t.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="bg-white/[0.08] my-1" />

          {/* Layout & Views */}
          <CommandGroup heading="View & Layout">
            <CommandItem onSelect={() => runAndClose(() => onLayoutChange("split"))} className="gap-2 cursor-pointer">
              <Columns2 className="h-4 w-4 text-zinc-400" />
              <span>Switch to Split View (Editor & Preview)</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(() => onLayoutChange("editor"))} className="gap-2 cursor-pointer">
              <FileCode className="h-4 w-4 text-zinc-400" />
              <span>Switch to Editor Only</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(() => onLayoutChange("preview"))} className="gap-2 cursor-pointer">
              <Eye className="h-4 w-4 text-zinc-400" />
              <span>Switch to Preview Only</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onToggleConsole)} className="gap-2 cursor-pointer">
              <Terminal className="h-4 w-4 text-zinc-400" />
              <span>Toggle DevTools Console</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onToggleTheme)} className="gap-2 cursor-pointer">
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Toggle Light / Dark Theme</span>
            </CommandItem>
            <CommandItem onSelect={() => runAndClose(onOpenSettings)} className="gap-2 cursor-pointer">
              <Settings className="h-4 w-4 text-zinc-400" />
              <span>Open IDE Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  )
}
