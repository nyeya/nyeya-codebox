"use client"

import React, { useState } from "react"
import { templates, type ProjectTemplate } from "@/lib/templates"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Layers, Sparkles, ArrowRight } from "lucide-react"

interface TemplateSelectorProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: ProjectTemplate) => void
}

export function TemplateSelector({ open, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedCat, setSelectedCat] = useState("All")
  const categories = ["All", "Frontend", "3D & Canvas", "Animation", "Starter"]

  const filtered = templates.filter(
    (t) => selectedCat === "All" || t.category.toLowerCase() === selectedCat.toLowerCase()
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#18181b] border-white/[0.1] text-zinc-200 p-0 rounded-2xl overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-white/[0.08] bg-[#121215]">
          <div className="flex items-center gap-2 text-indigo-400">
            <Layers className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold text-white">Starter Kits & Templates</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400 mt-1">
            Jumpstart your web project with production-grade templates and modern libraries
          </DialogDescription>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCat === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="p-6 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template)
                  onClose()
                }}
                className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] hover:border-indigo-500/50 text-left transition-all group cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-3xl p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:scale-110 transition-transform">
                      {template.icon}
                    </div>
                    {template.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {template.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs text-zinc-500 group-hover:text-indigo-400 transition-colors">
                  <span className="font-mono text-[10px]">{template.files.length} Files</span>
                  <div className="flex items-center gap-1 font-semibold text-xs">
                    <span>Use Template</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
