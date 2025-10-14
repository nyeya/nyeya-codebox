"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface AssetManagerProps {
  onAssetAdd: (name: string, content: string, type: string) => void
}

export function AssetManager({ onAssetAdd }: AssetManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [assets, setAssets] = useState<Array<{ name: string; url: string; type: string }>>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result as string
        const asset = {
          name: file.name,
          url: content,
          type: file.type,
        }

        setAssets((prev) => [...prev, asset])

        // Add to file system in assets folder
        onAssetAdd(`/assets/${file.name}`, content, file.type)
      }

      if (file.type.startsWith("image/")) {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeAsset = (index: number) => {
    setAssets((prev) => prev.filter((_, i) => i !== index))
  }

  const copyPath = (name: string) => {
    const path = `/assets/${name}`
    navigator.clipboard.writeText(path)
    alert(`Path copied: ${path}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#cccccc] hover:bg-[#2d2d2d] cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          Assets
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#252526] border-[#454545] text-[#cccccc] max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-[#454545] bg-[#2d2d2d]">
          <DialogTitle className="text-xl text-white font-semibold">Asset Manager</DialogTitle>
          <p className="text-xs text-[#858585] mt-1">Upload and manage your project assets</p>
        </DialogHeader>

        <div className="space-y-5 p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-500/10" : "border-[#454545] hover:border-[#656565]"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-[#858585]" />
            <p className="text-sm mb-2">Drag and drop files here</p>
            <p className="text-xs text-[#858585] mb-4">or</p>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,.svg,.css,.js"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <span className="inline-block px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] rounded text-sm cursor-pointer transition-colors">
                Browse Files
              </span>
            </label>
            <p className="text-xs text-[#858585] mt-4">Supported: Images (PNG, JPG, GIF, SVG), CSS, JS</p>
          </div>

          {/* Assets List */}
          {assets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Uploaded Assets</h3>
              <div className="max-h-64 overflow-auto space-y-2">
                {assets.map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-[#1e1e1e] rounded hover:bg-[#2d2d2d] group"
                  >
                    {asset.type.startsWith("image/") ? (
                      <img
                        src={asset.url || "/placeholder.svg"}
                        alt={asset.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-[#2d2d2d] rounded flex items-center justify-center">
                        <File className="h-5 w-5 text-[#858585]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{asset.name}</p>
                      <p className="text-xs text-[#858585]">{asset.type}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPath(asset.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Copy Path
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAsset(index)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 cursor-pointer"
                    >
                      <X className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#454545] text-xs space-y-2">
            <p className="font-semibold text-white">How to use assets:</p>
            <p className="text-[#858585]">
              In HTML: <code className="bg-[#2d2d2d] px-1 py-0.5 rounded">&lt;img src="/assets/image.png"&gt;</code>
            </p>
            <p className="text-[#858585]">
              In CSS: <code className="bg-[#2d2d2d] px-1 py-0.5 rounded">background: url('/assets/image.png')</code>
            </p>
            <p className="text-yellow-500 mt-2">
              ⚠️ Note: Assets are session-only and won't be saved to localStorage due to size limits.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
