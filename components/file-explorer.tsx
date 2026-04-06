"use client"

import React, { useState } from "react"
import type { FileNode } from "@/types/file-system"
import {
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Trash2,
  Edit2,
  Copy,
  Download,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  ChevronsUpDown
} from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface FileExplorerProps {
  files: FileNode[]
  activeFile: string | null
  onFileSelect: (path: string) => void
  onFileCreate: (parentPath: string, name: string, type: "file" | "folder") => void
  onFileDelete: (path: string) => void
  onFileRename: (oldPath: string, newName: string) => void
  onFileDuplicate?: (path: string) => void
}

export function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileDuplicate,
}: FileExplorerProps) {
  const [isCreatingInRoot, setIsCreatingInRoot] = useState<"file" | "folder" | null>(null)
  const [newItemName, setNewItemName] = useState("")

  const handleRootCreate = () => {
    if (newItemName.trim() && isCreatingInRoot) {
      const name = newItemName.trim()
      onFileCreate("/", name, isCreatingInRoot)
      setNewItemName("")
      setIsCreatingInRoot(null)
      toast.success(`Created ${name}`)
    } else {
      setIsCreatingInRoot(null)
    }
  }

  return (
    <div className="h-full bg-[#121215] text-zinc-200 flex flex-col select-none overflow-hidden">
      {/* Explorer Header */}
      <div className="h-10 px-3.5 border-b border-white/[0.08] flex items-center justify-between flex-none bg-[#121215]">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Explorer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsCreatingInRoot("file")
              setNewItemName("newfile.js")
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="New File"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setIsCreatingInRoot("folder")
              setNewItemName("components")
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="New Folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* File Tree Area */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {/* Inline Create at Root */}
        {isCreatingInRoot && (
          <div className="px-2 py-1 flex items-center gap-2 bg-[#18181b] rounded-lg border border-indigo-500">
            {isCreatingInRoot === "folder" ? (
              <Folder className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <FileCode className="h-3.5 w-3.5 text-cyan-400" />
            )}
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleRootCreate}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRootCreate()
                if (e.key === "Escape") setIsCreatingInRoot(null)
              }}
              className="h-6 px-1.5 py-0 text-xs bg-transparent border-none text-white focus-visible:ring-0"
              autoFocus
            />
          </div>
        )}

        <FileTree
          files={files}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          onFileCreate={onFileCreate}
          onFileDelete={onFileDelete}
          onFileRename={onFileRename}
          onFileDuplicate={onFileDuplicate}
          level={0}
        />
      </div>
    </div>
  )
}

interface FileTreeProps {
  files: FileNode[]
  activeFile: string | null
  onFileSelect: (path: string) => void
  onFileCreate: (parentPath: string, name: string, type: "file" | "folder") => void
  onFileDelete: (path: string) => void
  onFileRename: (oldPath: string, newName: string) => void
  onFileDuplicate?: (path: string) => void
  level: number
}

function FileTree({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileDuplicate,
  level,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/", "/assets"]))
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [creatingInFolder, setCreatingInFolder] = useState<{ path: string; type: "file" | "folder" } | null>(null)
  const [newItemName, setNewItemName] = useState("")

  const toggleFolder = (path: string) => {
    const next = new Set(expandedFolders)
    if (next.has(path)) next.delete(path)
    else next.add(path)
    setExpandedFolders(next)
  }

  const handleRename = (oldPath: string, newName: string) => {
    if (newName && newName.trim() !== "") {
      onFileRename(oldPath, newName.trim())
      toast.success("File renamed")
    }
    setEditingFile(null)
  }

  const handleCreateInFolder = (folderPath: string) => {
    if (newItemName.trim() && creatingInFolder) {
      onFileCreate(folderPath, newItemName.trim(), creatingInFolder.type)
      setNewItemName("")
      setCreatingInFolder(null)
      toast.success(`Created ${newItemName.trim()}`)
    } else {
      setCreatingInFolder(null)
    }
  }

  const downloadIndividualFile = (file: FileNode) => {
    if (file.content === undefined) return
    const isData = file.content.startsWith("data:")
    let url = ""
    if (isData) {
      url = file.content
    } else {
      const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" })
      url = URL.createObjectURL(blob)
    }

    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    if (!isData) URL.revokeObjectURL(url)
    toast.success(`Downloaded ${file.name}`)
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || ""
    switch (ext) {
      case "html":
        return <span className="font-mono text-[10px] font-bold text-orange-400">H</span>
      case "css":
        return <span className="font-mono text-[10px] font-bold text-cyan-400">#</span>
      case "js":
        return <span className="font-mono text-[10px] font-bold text-amber-400">JS</span>
      case "ts":
      case "tsx":
        return <span className="font-mono text-[10px] font-bold text-blue-400">TS</span>
      case "json":
        return <span className="font-mono text-[10px] font-bold text-yellow-400">{}</span>
      case "svg":
      case "png":
      case "jpg":
        return <span className="font-mono text-[10px] font-bold text-rose-400">IMG</span>
      default:
        return <FileText className="h-3.5 w-3.5 text-zinc-400" />
    }
  }

  return (
    <div className="space-y-0.5">
      {files.map((file) => {
        const isFolder = file.type === "folder"
        const isExpanded = expandedFolders.has(file.path)
        const isActive = activeFile === file.path

        return (
          <div key={file.id}>
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer text-xs transition-colors group ${
                    isActive
                      ? "bg-indigo-600/20 text-white font-medium border-l-2 border-indigo-500"
                      : "hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                  }`}
                  style={{ paddingLeft: `${level * 12 + 8}px` }}
                  onClick={() => {
                    if (isFolder) toggleFolder(file.path)
                    else onFileSelect(file.path)
                  }}
                >
                  {isFolder ? (
                    <span className="text-zinc-500 group-hover:text-zinc-300">
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </span>
                  ) : null}

                  {isFolder ? (
                    isExpanded ? (
                      <FolderOpen className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    )
                  ) : (
                    <div className="w-4 flex items-center justify-center shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                  )}

                  {editingFile === file.path ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleRename(file.path, editingName)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(file.path, editingName)
                        if (e.key === "Escape") setEditingFile(null)
                      }}
                      className="h-5 px-1 py-0 text-xs bg-[#18181b] border-indigo-500 text-white"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate flex-1">{file.name}</span>
                  )}
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent className="bg-[#18181b] border-white/[0.1] text-zinc-200 text-xs rounded-xl p-1 shadow-2xl">
                {isFolder && (
                  <>
                    <ContextMenuItem
                      onClick={() => {
                        setExpandedFolders(new Set([...expandedFolders, file.path]))
                        setCreatingInFolder({ path: file.path, type: "file" })
                        setNewItemName("script.js")
                      }}
                      className="gap-2 cursor-pointer hover:bg-white/[0.08] rounded-lg"
                    >
                      <FilePlus className="h-3.5 w-3.5 text-emerald-400" />
                      <span>New File Here</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        setExpandedFolders(new Set([...expandedFolders, file.path]))
                        setCreatingInFolder({ path: file.path, type: "folder" })
                        setNewItemName("subfolder")
                      }}
                      className="gap-2 cursor-pointer hover:bg-white/[0.08] rounded-lg"
                    >
                      <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
                      <span>New Folder Here</span>
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-white/[0.08] my-1" />
                  </>
                )}

                {/* Duplicate file */}
                {!isFolder && onFileDuplicate && (
                  <ContextMenuItem
                    onClick={() => {
                      onFileDuplicate(file.path)
                      toast.success(`Duplicated ${file.name}`)
                    }}
                    className="gap-2 cursor-pointer hover:bg-white/[0.08] rounded-lg"
                  >
                    <Copy className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Duplicate</span>
                  </ContextMenuItem>
                )}

                {/* Download file */}
                {!isFolder && (
                  <ContextMenuItem
                    onClick={() => downloadIndividualFile(file)}
                    className="gap-2 cursor-pointer hover:bg-white/[0.08] rounded-lg"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-400" />
                    <span>Download File</span>
                  </ContextMenuItem>
                )}

                {/* Copy path */}
                <ContextMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(file.path)
                    toast.success(`Copied path: ${file.path}`)
                  }}
                  className="gap-2 cursor-pointer hover:bg-white/[0.08] rounded-lg"
                >
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Copy Path</span>
                </ContextMenuItem>

                <ContextMenuItem
                  onClick={() => {
                    setEditingFile(file.path)
                    setEditingName(file.name)
                  }}
                  className="gap-2 cursor-pointer hover:bg-white/[0.08] rounded-lg"
                >
                  <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Rename</span>
                </ContextMenuItem>

                <ContextMenuSeparator className="bg-white/[0.08] my-1" />

                <ContextMenuItem
                  onClick={() => {
                    onFileDelete(file.path)
                    toast.info(`Deleted ${file.name}`)
                  }}
                  className="gap-2 cursor-pointer hover:bg-rose-500/20 text-rose-400 rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            {/* Child items */}
            {isFolder && file.children && isExpanded && (
              <div className="space-y-0.5">
                {creatingInFolder?.path === file.path && (
                  <div
                    className="px-2 py-1 flex items-center gap-2 bg-[#18181b] rounded-lg border border-indigo-500"
                    style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
                  >
                    {creatingInFolder.type === "folder" ? (
                      <Folder className="h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                    )}
                    <Input
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onBlur={() => handleCreateInFolder(file.path)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateInFolder(file.path)
                        if (e.key === "Escape") setCreatingInFolder(null)
                      }}
                      className="h-5 px-1 py-0 text-xs bg-transparent border-none text-white focus-visible:ring-0"
                      autoFocus
                    />
                  </div>
                )}

                <FileTree
                  files={file.children}
                  activeFile={activeFile}
                  onFileSelect={onFileSelect}
                  onFileCreate={onFileCreate}
                  onFileDelete={onFileDelete}
                  onFileRename={onFileRename}
                  onFileDuplicate={onFileDuplicate}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
