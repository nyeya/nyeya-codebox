"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const { setTheme } = useTheme()
  
  if (!open) return null

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] border border-[#454545] rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-[#454545] bg-[#2d2d2d]">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Settings</h2>
            <p className="text-xs text-[#858585] mt-0.5">Customize your editor experience</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-[#3e3e42] text-[#cccccc] cursor-pointer transition-colors">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Editor Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-1 rounded-full bg-[#0e639c]"></div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Editor Theme</h3>
            </div>

            <div className="space-y-4 p-6 bg-[#252526] rounded-lg">
              <Label htmlFor="editor-theme" className="text-[#cccccc] font-medium">
                Editor Color Theme
              </Label>
              <Select
                value={settings.editorTheme}
                onValueChange={(value) => updateSetting("editorTheme", value)}
              >
                <SelectTrigger id="editor-theme" className="bg-[#3c3c3c] border-[#454545] text-[#cccccc] hover:border-[#656565] transition-colors cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#252526] border-[#454545] text-[#cccccc]">
                  <SelectItem value="vs-dark" className="cursor-pointer">Visual Studio Dark</SelectItem>
                  <SelectItem value="vs-light" className="cursor-pointer">Visual Studio Light</SelectItem>
                  <SelectItem value="hc-black" className="cursor-pointer">High Contrast Dark</SelectItem>
                  <SelectItem value="monokai" className="cursor-pointer">Monokai</SelectItem>
                  <SelectItem value="dracula" className="cursor-pointer">Dracula</SelectItem>
                  <SelectItem value="github-dark" className="cursor-pointer">GitHub Dark</SelectItem>
                  <SelectItem value="github-light" className="cursor-pointer">GitHub Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Editor Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-1 rounded-full bg-[#0e639c]"></div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Editor</h3>
            </div>

            <div className="flex items-center justify-between p-6 bg-[#1e1e1e] rounded-lg hover:bg-[#2a2a2d] transition-colors">
              <div className="space-y-1">
                <Label htmlFor="auto-save" className="text-[#cccccc] font-medium cursor-pointer">
                  Auto Save
                </Label>
                <p className="text-xs text-[#858585]">Automatically save changes every 30 seconds</p>
              </div>
              <Switch
                id="auto-save"
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSetting("autoSave", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-[#1e1e1e] rounded-lg hover:bg-[#2a2a2d] transition-colors">
              <div className="space-y-1">
                <Label htmlFor="auto-format" className="text-[#cccccc] font-medium cursor-pointer">
                  Auto Format
                </Label>
                <p className="text-xs text-[#858585]">Format code automatically on save</p>
              </div>
              <Switch
                id="auto-format"
                checked={settings.autoFormat}
                onCheckedChange={(checked) => updateSetting("autoFormat", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-[#1e1e1e] rounded-lg hover:bg-[#2a2a2d] transition-colors">
              <div className="space-y-1">
                <Label htmlFor="word-wrap" className="text-[#cccccc] font-medium cursor-pointer">
                  Word Wrap
                </Label>
                <p className="text-xs text-[#858585]">Wrap long lines in the editor</p>
              </div>
              <Switch
                id="word-wrap"
                checked={settings.wordWrap}
                onCheckedChange={(checked) => updateSetting("wordWrap", checked)}
              />
            </div>

            <div className="space-y-4 p-6 bg-[#252526] rounded-lg">
              <Label htmlFor="font-size" className="text-[#cccccc] font-medium">
                Font Size
              </Label>
              <Select
                value={settings.fontSize.toString()}
                onValueChange={(value) => updateSetting("fontSize", Number.parseInt(value))}
              >
                <SelectTrigger id="font-size" className="bg-[#3c3c3c] border-[#454545] text-[#cccccc] hover:border-[#656565] transition-colors cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#252526] border-[#454545] text-[#cccccc]">
                  <SelectItem value="12" className="cursor-pointer">12px</SelectItem>
                  <SelectItem value="14" className="cursor-pointer">14px</SelectItem>
                  <SelectItem value="16" className="cursor-pointer">16px</SelectItem>
                  <SelectItem value="18" className="cursor-pointer">18px</SelectItem>
                  <SelectItem value="20" className="cursor-pointer">20px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 p-6 bg-[#252526] rounded-lg">
              <Label htmlFor="tab-size" className="text-[#cccccc] font-medium">
                Tab Size
              </Label>
              <Select
                value={settings.tabSize.toString()}
                onValueChange={(value) => updateSetting("tabSize", Number.parseInt(value))}
              >
                <SelectTrigger id="tab-size" className="bg-[#3c3c3c] border-[#454545] text-[#cccccc] hover:border-[#656565] transition-colors cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#252526] border-[#454545] text-[#cccccc]">
                  <SelectItem value="2" className="cursor-pointer">2 spaces</SelectItem>
                  <SelectItem value="4" className="cursor-pointer">4 spaces</SelectItem>
                  <SelectItem value="8" className="cursor-pointer">8 spaces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4 pt-4 border-t border-[#454545]">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-1 rounded-full bg-[#0e639c]"></div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">About</h3>
            </div>
            <div className="p-6 bg-[#252526] rounded-lg space-y-2">
              <p className="text-sm text-[#cccccc] font-medium">Nyeya CodeBox v1.0.0</p>
              <p className="text-xs text-[#858585]">A web-based code editor for HTML, CSS, and JavaScript</p>
            </div>
          </div>
        </div>

        <div className="flex-none flex items-center justify-end gap-3 px-6 py-4 border-t border-[#454545] bg-[#2d2d2d]">
          <Button onClick={onClose} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-6 cursor-pointer transition-all">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
