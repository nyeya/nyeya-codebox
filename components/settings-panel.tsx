"use client"

import React from "react"
import { Settings, Sliders, Palette, ShieldCheck, Terminal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  settings: {
    autoSave: boolean
    autoFormat: boolean
    fontSize: number
    tabSize: number
    wordWrap: boolean
    editorTheme: string
  }
  onSettingsChange: (settings: any) => void
}

export function SettingsPanel({ open, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#18181b] border-white/[0.1] text-zinc-200 p-0 rounded-2xl overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-white/[0.08] bg-[#121215]">
          <div className="flex items-center gap-2 text-indigo-400">
            <Settings className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold text-white">Editor Preferences</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400 mt-1">
            Customize typography, theme, and runtime behavior
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Theme Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Palette className="h-3.5 w-3.5" />
              <span>Editor Theme</span>
            </div>

            <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.06] flex items-center justify-between">
              <div>
                <Label htmlFor="editor-theme" className="text-xs font-semibold text-white">
                  Monaco Color Theme
                </Label>
                <p className="text-[11px] text-zinc-400 mt-0.5">Choose your preferred syntax highlighting</p>
              </div>

              <Select
                value={settings.editorTheme}
                onValueChange={(val) => updateSetting("editorTheme", val)}
              >
                <SelectTrigger id="editor-theme" className="w-44 bg-[#18181b] border-white/[0.1] text-xs text-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#18181b] border-white/[0.1] text-zinc-200">
                  <SelectItem value="obsidian-dark">Obsidian Dark (Studio)</SelectItem>
                  <SelectItem value="vs-dark">VS Code Dark</SelectItem>
                  <SelectItem value="dracula">Dracula</SelectItem>
                  <SelectItem value="monokai">Monokai</SelectItem>
                  <SelectItem value="github-dark">GitHub Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Behavior Toggles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sliders className="h-3.5 w-3.5" />
              <span>Editor Behavior</span>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save" className="text-xs font-semibold text-white cursor-pointer">
                    Auto-Save to LocalStorage
                  </Label>
                  <p className="text-[11px] text-zinc-400">Automatically sync project snapshot every 30 seconds</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(c) => updateSetting("autoSave", c)}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <Label htmlFor="word-wrap" className="text-xs font-semibold text-white cursor-pointer">
                    Word Wrap
                  </Label>
                  <p className="text-[11px] text-zinc-400">Wrap long lines to prevent horizontal scrolling</p>
                </div>
                <Switch
                  id="word-wrap"
                  checked={settings.wordWrap}
                  onCheckedChange={(c) => updateSetting("wordWrap", c)}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-format" className="text-xs font-semibold text-white cursor-pointer">
                    Auto-Format with Prettier
                  </Label>
                  <p className="text-[11px] text-zinc-400">Automatically format code on manual save (Ctrl+S)</p>
                </div>
                <Switch
                  id="auto-format"
                  checked={settings.autoFormat}
                  onCheckedChange={(c) => updateSetting("autoFormat", c)}
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Terminal className="h-3.5 w-3.5" />
              <span>Typography & Indentation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.06] space-y-2">
                <Label htmlFor="font-size" className="text-xs font-semibold text-white">Font Size</Label>
                <Select
                  value={settings.fontSize.toString()}
                  onValueChange={(val) => updateSetting("fontSize", parseInt(val))}
                >
                  <SelectTrigger id="font-size" className="bg-[#18181b] border-white/[0.1] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-white/[0.1] text-zinc-200">
                    <SelectItem value="12">12 px</SelectItem>
                    <SelectItem value="13">13 px</SelectItem>
                    <SelectItem value="14">14 px (Default)</SelectItem>
                    <SelectItem value="16">16 px</SelectItem>
                    <SelectItem value="18">18 px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.06] space-y-2">
                <Label htmlFor="tab-size" className="text-xs font-semibold text-white">Tab Spacing</Label>
                <Select
                  value={settings.tabSize.toString()}
                  onValueChange={(val) => updateSetting("tabSize", parseInt(val))}
                >
                  <SelectTrigger id="tab-size" className="bg-[#18181b] border-white/[0.1] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-white/[0.1] text-zinc-200">
                    <SelectItem value="2">2 Spaces (Standard)</SelectItem>
                    <SelectItem value="4">4 Spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* About Nyeya CodeBox */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Nyeya CodeBox v2.0</p>
              <p className="text-[11px] text-zinc-400">Next-Gen Browser Cloud IDE & Web Sandbox</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
              Release 2026
            </span>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#121215] flex justify-end">
          <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
