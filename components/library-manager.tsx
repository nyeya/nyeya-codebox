"use client"

import { useState } from "react"
import { Package, Plus, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Library {
  name: string
  url: string
  type: "css" | "js"
  description: string
}

const popularLibraries: Library[] = [
  {
    name: "jQuery",
    url: "https://code.jquery.com/jquery-3.7.1.min.js",
    type: "js",
    description: "Fast, small, and feature-rich JavaScript library",
  },
  {
    name: "Bootstrap CSS",
    url: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    type: "css",
    description: "Popular CSS framework",
  },
  {
    name: "Bootstrap JS",
    url: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
    type: "js",
    description: "Bootstrap JavaScript components",
  },
  { name: "Tailwind CSS", url: "https://cdn.tailwindcss.com", type: "js", description: "Utility-first CSS framework" },
  {
    name: "Font Awesome",
    url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    type: "css",
    description: "Icon library",
  },
  {
    name: "Animate.css",
    url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
    type: "css",
    description: "CSS animations library",
  },
  {
    name: "Lodash",
    url: "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js",
    type: "js",
    description: "JavaScript utility library",
  },
  {
    name: "Axios",
    url: "https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js",
    type: "js",
    description: "Promise-based HTTP client",
  },
  {
    name: "Chart.js",
    url: "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
    type: "js",
    description: "Simple yet flexible JavaScript charting",
  },
  {
    name: "Alpine.js",
    url: "https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js",
    type: "js",
    description: "Lightweight JavaScript framework",
  },
  {
    name: "GSAP",
    url: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js",
    type: "js",
    description: "Professional-grade animation library",
  },
  {
    name: "Three.js",
    url: "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js",
    type: "js",
    description: "3D graphics library",
  },
]

interface LibraryManagerProps {
  onLibraryAdd: (library: Library) => void
  addedLibraries: Library[]
  onLibraryRemove: (url: string) => void
}

export function LibraryManager({ onLibraryAdd, addedLibraries, onLibraryRemove }: LibraryManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [customUrl, setCustomUrl] = useState("")
  const [customType, setCustomType] = useState<"css" | "js">("js")

  const filteredLibraries = popularLibraries.filter(
    (lib) =>
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isLibraryAdded = (url: string) => {
    return addedLibraries.some((lib) => lib.url === url)
  }

  const handleAddLibrary = (library: Library) => {
    if (!isLibraryAdded(library.url)) {
      onLibraryAdd(library)
    }
  }

  const handleAddCustom = () => {
    if (customUrl.trim()) {
      const customLib: Library = {
        name: "Custom Library",
        url: customUrl.trim(),
        type: customType,
        description: "Custom CDN library",
      }
      onLibraryAdd(customLib)
      setCustomUrl("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#cccccc] hover:bg-[#2d2d2d] cursor-pointer">
          <Package className="h-4 w-4 mr-2" />
          Libraries
          {addedLibraries.length > 0 && (
            <Badge variant="secondary" className="ml-2 px-2 py-0.5 bg-[#0e639c] text-white rounded-full">
              {addedLibraries.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#252526] border-[#454545] text-[#cccccc] max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-[#454545] bg-[#2d2d2d]">
          <DialogTitle className="text-xl text-white font-semibold">External Libraries</DialogTitle>
          <p className="text-xs text-[#858585] mt-1">Add CDN libraries to your project</p>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col p-6">
          {/* Added Libraries */}
          {addedLibraries.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Added Libraries ({addedLibraries.length})</h3>
              <div className="space-y-2 max-h-32 overflow-auto">
                {addedLibraries.map((lib, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-[#1e1e1e] rounded hover:bg-[#2d2d2d] group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{lib.name}</span>
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {lib.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#858585] truncate">{lib.url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onLibraryRemove(lib.url)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#858585]" />
            <Input
              placeholder="Search libraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1e1e1e] border-[#454545] text-[#cccccc]"
            />
          </div>

          {/* Popular Libraries */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-3">Popular Libraries</h3>
            <div className="flex-1 overflow-auto space-y-2">
              {filteredLibraries.map((lib, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded hover:bg-[#2d2d2d]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{lib.name}</span>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {lib.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#858585]">{lib.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddLibrary(lib)}
                    disabled={isLibraryAdded(lib.url)}
                    className={isLibraryAdded(lib.url) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0e639c] cursor-pointer transition-colors"}
                  >
                    {isLibraryAdded(lib.url) ? "Added" : "Add"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom CDN */}
          <div className="space-y-3 border-t border-[#454545] pt-4">
            <h3 className="text-sm font-semibold text-white">Add Custom CDN</h3>
            <div className="flex gap-2">
              <Input
                placeholder="https://cdn.example.com/library.js"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 bg-[#1e1e1e] border-[#454545] text-[#cccccc]"
              />
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as "css" | "js")}
                className="px-3 py-2 bg-[#1e1e1e] border border-[#454545] rounded text-[#cccccc] text-sm cursor-pointer hover:border-[#656565] transition-colors"
              >
                <option value="js">JS</option>
                <option value="css">CSS</option>
              </select>
              <Button onClick={handleAddCustom} className="bg-[#0e639c] hover:bg-[#1177bb] cursor-pointer transition-colors" title="Add custom library">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
