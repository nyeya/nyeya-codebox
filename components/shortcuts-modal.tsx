"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Keyboard, X } from "lucide-react"

interface ShortcutsModalProps {
  open: boolean
  onClose: () => void
}

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  const shortcutGroups = [
    {
      category: "General & Navigation",
      shortcuts: [
        { keys: ["Ctrl", "K"], mac: ["⌘", "K"], description: "Open Command Palette" },
        { keys: ["Ctrl", "/"], mac: ["⌘", "/"], description: "Toggle Shortcuts Cheatsheet" },
        { keys: ["Ctrl", "P"], mac: ["⌘", "P"], description: "Quick File Search" },
      ],
    },
    {
      category: "Editor & Formatting",
      shortcuts: [
        { keys: ["Ctrl", "S"], mac: ["⌘", "S"], description: "Save Project to LocalStorage" },
        { keys: ["Shift", "Alt", "F"], mac: ["⇧", "⌥", "F"], description: "Format Code with Prettier" },
        { keys: ["Ctrl", "Enter"], mac: ["⌘", "↵"], description: "Re-run / Refresh Live Preview" },
      ],
    },
    {
      category: "Panels & Views",
      shortcuts: [
        { keys: ["Ctrl", "B"], mac: ["⌘", "B"], description: "Toggle Left Navigation Drawer" },
        { keys: ["Ctrl", "`"], mac: ["⌘", "`"], description: "Toggle DevTools Console" },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#18181b] border-white/[0.1] text-zinc-200 p-0 rounded-2xl overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-white/[0.08] bg-[#121215]">
          <div className="flex items-center gap-2 text-indigo-400">
            <Keyboard className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold text-white">Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400 mt-1">
            Supercharge your developer workflow with pro keybindings
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((group) => (
            <div key={group.category} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {group.category}
              </h4>
              <div className="space-y-2">
                {group.shortcuts.map((sc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
                  >
                    <span className="text-xs text-zinc-300 font-medium">{sc.description}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map((k, kidx) => (
                        <kbd
                          key={kidx}
                          className="px-2 py-1 text-[10px] font-mono font-bold bg-[#27272a] text-zinc-200 rounded border border-white/[0.1] shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
