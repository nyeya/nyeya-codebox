"use client"

import React from "react"
import {
  Files,
  Layers,
  Package,
  Image as ImageIcon,
  Sparkles,
  Settings,
  Keyboard,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Code2
} from "lucide-react"

export type ActiveDrawer = "explorer" | "templates" | "libraries" | "assets" | "snippets" | null

interface ActivityBarProps {
  activeDrawer: ActiveDrawer
  onSelectDrawer: (drawer: ActiveDrawer) => void
  onOpenSettings: () => void
  onOpenShortcuts: () => void
  theme?: string
  onToggleTheme?: () => void
  addedLibrariesCount?: number
}

export function ActivityBar({
  activeDrawer,
  onSelectDrawer,
  onOpenSettings,
  onOpenShortcuts,
  theme = "dark",
  onToggleTheme,
  addedLibrariesCount = 0,
}: ActivityBarProps) {
  const toggleDrawer = (drawer: ActiveDrawer) => {
    if (activeDrawer === drawer) {
      onSelectDrawer(null)
    } else {
      onSelectDrawer(drawer)
    }
  }

  const items = [
    {
      id: "explorer" as const,
      label: "Explorer (Ctrl+Shift+E)",
      icon: Files,
    },
    {
      id: "templates" as const,
      label: "Starter Templates",
      icon: Layers,
    },
    {
      id: "libraries" as const,
      label: "CDN Packages & Frameworks",
      icon: Package,
      badge: addedLibrariesCount > 0 ? addedLibrariesCount : undefined,
    },
    {
      id: "assets" as const,
      label: "Assets & Media Locker",
      icon: ImageIcon,
    },
    {
      id: "snippets" as const,
      label: "Snippet Vault",
      icon: Sparkles,
    },
  ]

  return (
    <aside className="w-13 flex-none bg-[#121215] border-r border-white/[0.08] flex flex-col items-center justify-between py-3 select-none z-20">
      {/* Top section: Logo & Nav items */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Brand Icon */}
        <div
          className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform"
          title="Nyeya CodeBox v2.0"
        >
          <Code2 className="h-5 w-5 text-white" />
        </div>

        <div className="w-7 h-px bg-white/[0.08] my-1" />

        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-1.5 w-full px-1.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeDrawer === item.id

            return (
              <button
                key={item.id}
                onClick={() => toggleDrawer(item.id)}
                title={item.label}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />

                {item.badge !== undefined && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-indigo-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute -left-1.5 top-2.5 bottom-2.5 w-1 rounded-r-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom section: Utilities, Theme, Settings */}
      <div className="flex flex-col items-center gap-2 w-full px-1.5">
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (Ctrl+/)"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-all"
        >
          <Keyboard className="h-4 w-4" />
        </button>

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-all"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
          </button>
        )}

        <button
          onClick={onOpenSettings}
          title="IDE Preferences & Settings"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-all"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
