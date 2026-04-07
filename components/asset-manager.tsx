"use client"

import React, { useState } from "react"
import { Upload, X, Image as ImageIcon, Copy, Check, FileSpreadsheet, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { FileNode } from "@/types/file-system"

interface AssetManagerProps {
  files: FileNode[]
  onAssetAdd: (name: string, content: string, type: string) => void
  onAssetDelete: (path: string) => void
}

export function AssetManager({ files, onAssetAdd, onAssetDelete }: AssetManagerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  // Collect all media assets from the file system
  const assetItems: Array<{ path: string; name: string; url: string; type: string; size: string }> = []

  const collect = (nodes: FileNode[]) => {
    nodes.forEach((node) => {
      if (node.type === "file" && node.content !== undefined) {
        const isMedia =
          node.path.startsWith("/assets/") ||
          node.content.startsWith("data:image/") ||
          /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(node.name)

        if (isMedia) {
          const isSvg = node.name.endsWith(".svg")
          const isData = node.content.startsWith("data:")
          let displayUrl = node.content
          if (!isData && isSvg) {
            displayUrl = `data:image/svg+xml;utf8,${encodeURIComponent(node.content)}`
          }

          const sizeBytes = node.content.length
          const sizeFormatted = `${(sizeBytes / 1024).toFixed(1)} KB`

          assetItems.push({
            path: node.path,
            name: node.name,
            url: displayUrl,
            type: isSvg ? "image/svg+xml" : isData ? node.content.split(";")[0].replace("data:", "") : "image",
            size: sizeFormatted,
          })
        }
      }
      if (node.children) {
        collect(node.children)
      }
    })
  }

  collect(files)

  const handleFileUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    Array.from(fileList).forEach((file) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result as string
        const cleanName = file.name.replace(/\s+/g, "_")
        onAssetAdd(`/assets/${cleanName}`, content, file.type)
        toast.success(`Uploaded ${cleanName}`)
      }

      if (file.type.startsWith("image/") || file.type.includes("svg")) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const copySnippet = (path: string, name: string) => {
    const isSvg = name.endsWith(".svg")
    const snippet = `<img src="${path}" alt="${name}" />`
    navigator.clipboard.writeText(snippet)
    setCopiedPath(path)
    toast.success(`Copied: ${snippet}`)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  return (
    <div className="h-full flex flex-col bg-[#121215] text-zinc-200 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between flex-none bg-[#121215]">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-bold text-white tracking-tight">Assets & Media Locker</span>
        </div>
        {assetItems.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            {assetItems.length} {assetItems.length === 1 ? "File" : "Files"}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Drag and Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]"
              : "border-white/[0.1] bg-[#18181b]/50 hover:border-white/20"
          }`}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-zinc-500" />
          <p className="text-xs font-semibold text-zinc-200 mb-1">Drag and drop images or media</p>
          <p className="text-[11px] text-zinc-500 mb-4">PNG, JPG, SVG, WebP, GIF</p>

          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*,.svg,.json"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <span className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all">
              Browse Media
            </span>
          </label>
        </div>

        {/* Assets Grid */}
        {assetItems.length > 0 ? (
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Project Assets</span>
            <div className="grid grid-cols-1 gap-2.5">
              {assetItems.map((asset) => {
                const isImage = asset.type.startsWith("image") || asset.name.endsWith(".svg")

                return (
                  <div
                    key={asset.path}
                    className="p-2.5 rounded-xl bg-[#18181b] border border-white/[0.08] hover:border-indigo-500/40 transition-all flex items-center gap-3 group"
                  >
                    {isImage ? (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="h-10 w-10 object-cover rounded-lg bg-black/40 border border-white/[0.08]"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-white/[0.05] flex items-center justify-center text-zinc-400">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{asset.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{asset.path} • {asset.size}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copySnippet(asset.path, asset.name)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                        title="Copy <img> snippet"
                      >
                        {copiedPath === asset.path ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onAssetDelete(asset.path)
                          toast.info(`Deleted ${asset.name}`)
                        }}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {/* Instructions */}
        <div className="p-3.5 rounded-xl bg-[#18181b] border border-white/[0.06] text-xs space-y-1.5 text-zinc-400">
          <p className="font-semibold text-zinc-200">How to reference assets:</p>
          <div className="font-mono text-[11px] bg-black/40 p-2 rounded-lg text-indigo-300">
            &lt;img src="/assets/logo.png" /&gt;
          </div>
          <div className="font-mono text-[11px] bg-black/40 p-2 rounded-lg text-indigo-300">
            background: url('/assets/background.jpg');
          </div>
        </div>
      </div>
    </div>
  )
}
