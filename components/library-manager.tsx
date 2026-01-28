"use client"

import React, { useState } from "react"
import { Package, Plus, X, Search, Check, ExternalLink, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Library } from "@/lib/export-project"
import { toast } from "sonner"

const popularLibraries: (Library & { category: string })[] = [
  // Frameworks
  {
    name: "React 19 (UMD)",
    url: "https://unpkg.com/react@19/umd/react.production.min.js",
    type: "js",
    category: "Frameworks",
    description: "Component-based user interface library",
  },
  {
    name: "React DOM 19 (UMD)",
    url: "https://unpkg.com/react-dom@19/umd/react-dom.production.min.js",
    type: "js",
    category: "Frameworks",
    description: "React DOM renderer for web apps",
  },
  {
    name: "Alpine.js 3",
    url: "https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js",
    type: "js",
    category: "Frameworks",
    description: "Lightweight reactive frontend framework",
  },
  {
    name: "HTMX 2.0",
    url: "https://unpkg.com/htmx.org@2.0.0",
    type: "js",
    category: "Frameworks",
    description: "High-power HTML extensions for modern web",
  },

  // Styling & UI
  {
    name: "Tailwind CSS CDN",
    url: "https://cdn.tailwindcss.com",
    type: "js",
    category: "Styling",
    description: "Utility-first CSS framework with JIT in-browser compiler",
  },
  {
    name: "Font Awesome 6",
    url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    type: "css",
    category: "Styling",
    description: "Comprehensive modern icon library",
  },
  {
    name: "Animate.css",
    url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
    type: "css",
    category: "Styling",
    description: "Cross-browser CSS animations library",
  },

  // 3D & Graphics
  {
    name: "Three.js",
    url: "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js",
    type: "js",
    category: "3D & Canvas",
    description: "Complete WebGL 3D graphics library",
  },
  {
    name: "Canvas Confetti",
    url: "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js",
    type: "js",
    category: "3D & Canvas",
    description: "Celebration confetti particle explosions",
  },

  // Animation
  {
    name: "GSAP 3.12",
    url: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js",
    type: "js",
    category: "Animation",
    description: "High-performance JavaScript animation platform",
  },
  {
    name: "Anime.js",
    url: "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
    type: "js",
    category: "Animation",
    description: "Flexible JavaScript animation library",
  },

  // Utilities
  {
    name: "Chart.js 4",
    url: "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
    type: "js",
    category: "Utilities",
    description: "Dynamic responsive HTML5 canvas charts",
  },
  {
    name: "Axios",
    url: "https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js",
    type: "js",
    category: "Utilities",
    description: "Promise-based HTTP client for browser",
  },
  {
    name: "Lodash",
    url: "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js",
    type: "js",
    category: "Utilities",
    description: "Modern JavaScript utility library",
  },
]

interface LibraryManagerProps {
  onLibraryAdd: (library: Library) => void
  addedLibraries: Library[]
  onLibraryRemove: (url: string) => void
}

export function LibraryManager({ onLibraryAdd, addedLibraries, onLibraryRemove }: LibraryManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [customUrl, setCustomUrl] = useState("")
  const [customName, setCustomName] = useState("")
  const [customType, setCustomType] = useState<"css" | "js">("js")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const categories = ["All", "Frameworks", "Styling", "3D & Canvas", "Animation", "Utilities"]

  const filteredLibraries = popularLibraries.filter((lib) => {
    const matchesSearch =
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === "All" || lib.category === categoryFilter
    return matchesSearch && matchesCat
  })

  const isLibraryAdded = (url: string) => {
    return addedLibraries.some((lib) => lib.url === url)
  }

  const handleAddCustom = () => {
    if (customUrl.trim()) {
      const name = customName.trim() || customUrl.split("/").pop()?.split("?")[0] || "Custom CDN"
      const customLib: Library = {
        name,
        url: customUrl.trim(),
        type: customType,
        description: "User added external package",
      }
      onLibraryAdd(customLib)
      setCustomUrl("")
      setCustomName("")
      toast.success(`Injected ${name}`)
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#121215] text-zinc-200 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between flex-none bg-[#121215]">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-indigo-400" />
          <span className="text-sm font-bold text-white tracking-tight">CDN Packages & Hub</span>
        </div>
        {addedLibraries.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            {addedLibraries.length} Active
          </span>
        )}
      </div>

      {/* Added Packages Section */}
      {addedLibraries.length > 0 && (
        <div className="p-3 border-b border-white/[0.08] bg-[#0e0e11] space-y-2">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Active Dependencies</span>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {addedLibraries.map((lib, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-[#18181b] border border-white/[0.06] group hover:border-white/10"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white truncate">{lib.name}</span>
                    <span className="text-[9px] px-1 py-0.2 bg-white/[0.08] text-zinc-400 font-mono rounded">
                      {lib.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">{lib.url}</p>
                </div>
                <button
                  onClick={() => {
                    onLibraryRemove(lib.url)
                    toast.info(`Removed ${lib.name}`)
                  }}
                  className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/20 rounded transition-colors"
                  title="Remove Library"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Pills */}
      <div className="p-3 border-b border-white/[0.08] space-y-2 flex-none">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CDN catalog..."
            className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                  : "text-zinc-400 hover:text-white bg-white/[0.03]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredLibraries.map((lib, idx) => {
          const added = isLibraryAdded(lib.url)

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#18181b] border border-white/[0.08] hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {lib.name}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-white/[0.06] text-zinc-400 font-mono">
                    {lib.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{lib.description}</p>
              </div>

              <button
                onClick={() => {
                  if (added) {
                    onLibraryRemove(lib.url)
                    toast.info(`Removed ${lib.name}`)
                  } else {
                    onLibraryAdd(lib)
                    toast.success(`Injected ${lib.name}`)
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  added
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30"
                }`}
              >
                {added ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" /> Added
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Custom CDN Ingestion Bar */}
      <div className="p-3 border-t border-white/[0.08] bg-[#0e0e11] space-y-2 flex-none">
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Custom CDN Script / CSS</span>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="https://cdn.example.com/lib.min.js"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-[#18181b] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value as "css" | "js")}
            className="bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="js">JS</option>
            <option value="css">CSS</option>
          </select>
          <button
            onClick={handleAddCustom}
            disabled={!customUrl.trim()}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-lg text-xs font-semibold transition-all"
          >
            Inject
          </button>
        </div>
      </div>
    </div>
  )
}
