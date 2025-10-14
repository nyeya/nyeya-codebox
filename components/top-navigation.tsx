"use client"

import { useState } from "react"
import { Menu, Save, Download, Settings, Play, Moon, Sun, Code2, FileText, Plus, Columns2, Eye, FileCode, PanelLeft, PanelBottom } from "lucide-react"
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
  onExport: () => void
  onShare: () => void
  onFork: () => void
  onRun: () => void
  onLayoutChange: (layout: "split" | "editor" | "preview") => void
  currentLayout: "split" | "editor" | "preview"
  onNewProject?: () => void
  onOpenTemplates?: () => void
  onToggleTheme?: () => void
  theme?: "dark" | "light"
  onOpenSettings?: () => void
  showFilePane?: boolean
  onToggleFilePane?: () => void
  showConsole?: boolean
  onToggleConsole?: () => void
}

export function TopNavigation({
  projectName,
  onProjectNameChange,
  onSave,
  onExport,
  onShare,
  onFork,
  onRun,
  onLayoutChange,
  currentLayout,
  onNewProject,
  onOpenTemplates,
  onToggleTheme,
  theme = "dark",
  onOpenSettings,
  showFilePane = true,
  onToggleFilePane,
  showConsole = true,
  onToggleConsole,
}: TopNavigationProps) {
  const [isEditingName, setIsEditingName] = useState(false)

  return (
    <div className="h-12 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-[#007acc]" />
          <span className="text-[#cccccc] font-semibold text-sm">Nyeya CodeBox</span>
        </div>

        <div className="h-6 w-px bg-[#2d2d2d]" />

        {/* Project Name */}
        {isEditingName ? (
          <Input
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingName(false)
              if (e.key === "Escape") setIsEditingName(false)
            }}
            className="h-7 w-48 px-2 text-sm bg-[#3c3c3c] border-[#007acc] text-[#cccccc] focus:ring-1 focus:ring-[#007acc]"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-sm text-[#cccccc] hover:text-white px-2 py-1 rounded hover:bg-[#2d2d2d] cursor-pointer transition-colors"
            title="Click to edit project name"
          >
            {projectName}
          </button>
        )}
      </div>

      {/* Center Section - Layout Controls */}
      <div className="flex items-center gap-1 bg-[#1e1e1e] rounded p-1">
        {onToggleFilePane && (
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 cursor-pointer ${
              showFilePane
                ? "bg-[#37373d] text-white"
                : "text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white"
            }`}
            onClick={onToggleFilePane}
            title={showFilePane ? "Hide file pane" : "Show file pane"}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        {onToggleConsole && (
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 cursor-pointer ${
              showConsole
                ? "bg-[#37373d] text-white"
                : "text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white"
            }`}
            onClick={onToggleConsole}
            title={showConsole ? "Hide console" : "Show console"}
          >
            <PanelBottom className="h-4 w-4" />
          </Button>
        )}
        <div className="h-5 w-px bg-[#2d2d2d]" />
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 cursor-pointer ${
            currentLayout === "editor"
              ? "bg-[#37373d] text-white"
              : "text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white"
          }`}
          onClick={() => onLayoutChange("editor")}
          title="Editor only"
        >
          <FileCode className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 cursor-pointer ${
            currentLayout === "split" ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white"
          }`}
          onClick={() => onLayoutChange("split")}
          title="Split view"
        >
          <Columns2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 cursor-pointer ${
            currentLayout === "preview"
              ? "bg-[#37373d] text-white"
              : "text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white"
          }`}
          onClick={() => onLayoutChange("preview")}
          title="Preview only"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-[#0e639c] hover:bg-[#1177bb] text-white cursor-pointer transition-all"
          onClick={onRun}
          title="Run project"
        >
          <Play className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#2d2d2d] text-[#cccccc] cursor-pointer" onClick={onSave}>
          <Save className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#2d2d2d] text-[#cccccc] cursor-pointer">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#252526] border-[#454545] text-[#cccccc] p-2">
            {onNewProject && (
              <DropdownMenuItem onClick={onNewProject} className="hover:bg-[#2d2d2d] cursor-pointer rounded px-3 py-2.5 transition-colors">
                <Plus className="h-4 w-4 mr-3" />
                <span className="text-sm">New Project</span>
              </DropdownMenuItem>
            )}
            {onOpenTemplates && (
              <DropdownMenuItem onClick={onOpenTemplates} className="hover:bg-[#2d2d2d] cursor-pointer rounded px-3 py-2.5 transition-colors">
                <FileText className="h-4 w-4 mr-3" />
                <span className="text-sm">Templates</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#454545] my-2" />
            <DropdownMenuItem onClick={onExport} className="hover:bg-[#2d2d2d] cursor-pointer rounded px-3 py-2.5 transition-colors">
              <Download className="h-4 w-4 mr-3" />
              <span className="text-sm">Export Project</span>
            </DropdownMenuItem>
            {onToggleTheme && (
              <DropdownMenuItem onClick={onToggleTheme} className="hover:bg-[#2d2d2d] cursor-pointer rounded px-3 py-2.5 transition-colors">
                {theme === "dark" ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
                <span className="text-sm">Toggle Theme</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#454545] my-2" />
            {onOpenSettings && (
              <DropdownMenuItem onClick={onOpenSettings} className="hover:bg-[#2d2d2d] cursor-pointer rounded px-3 py-2.5 transition-colors">
                <Settings className="h-4 w-4 mr-3" />
                <span className="text-sm">Settings</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
