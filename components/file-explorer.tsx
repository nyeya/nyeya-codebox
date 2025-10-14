"use client"

import { useState } from "react"
import type { FileNode } from "@/types/file-system"
import { ChevronRight, ChevronDown, File, Folder, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"

interface FileExplorerProps {
  files: FileNode[]
  activeFile: string | null
  onFileSelect: (path: string) => void
  onFileCreate: (parentPath: string, name: string, type: "file" | "folder") => void
  onFileDelete: (path: string) => void
  onFileRename: (oldPath: string, newName: string) => void
}

export function FileExplorer({ files, activeFile, onFileSelect, onFileCreate, onFileDelete, onFileRename }: FileExplorerProps) {
  return (
    <div className="h-full bg-[#1e1e1e] text-[#cccccc] flex flex-col">
      <div className="px-4 py-3 border-b border-[#2d2d2d] flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide">Explorer</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-[#2d2d2d] cursor-pointer"
          onClick={() => onFileCreate("/", "newfile.js", "file")}
          title="New file"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <FileTree
          files={files}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          onFileCreate={onFileCreate}
          onFileDelete={onFileDelete}
          onFileRename={onFileRename}
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
  level: number
}

function FileTree({ files, activeFile, onFileSelect, onFileCreate, onFileDelete, onFileRename, level }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleRename = (oldPath: string, newName: string) => {
    if (newName && newName.trim() !== "") {
      onFileRename(oldPath, newName.trim())
    }
    setEditingFile(null)
  }

  return (
    <div>
      {files.map((file) => (
        <div key={file.id}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-[#2d2d2d] ${
                  activeFile === file.path ? "bg-[#37373d]" : ""
                }`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => {
                  if (file.type === "folder") {
                    toggleFolder(file.path)
                  } else {
                    onFileSelect(file.path)
                  }
                }}
              >
                {file.type === "folder" && (
                  <span className="flex-shrink-0">
                    {expandedFolders.has(file.path) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                )}
                {file.type === "folder" ? (
                  <Folder className="h-4 w-4 flex-shrink-0 text-[#dcb67a]" />
                ) : (
                  <File className="h-4 w-4 flex-shrink-0 text-[#519aba]" />
                )}
                {editingFile === file.path ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleRename(file.path, editingName)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRename(file.path, editingName)
                      } else if (e.key === "Escape") {
                        setEditingFile(null)
                      }
                    }}
                    className="h-5 px-1 py-0 text-xs bg-[#3c3c3c] border-[#007acc]"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm truncate">{file.name}</span>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-[#252526] border-[#454545] text-[#cccccc]">
              {file.type === "folder" && (
                <>
                  <ContextMenuItem
                    onClick={() => onFileCreate(file.path, "newfile.js", "file")}
                    className="hover:bg-[#2d2d2d]"
                  >
                    New File
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => onFileCreate(file.path, "newfolder", "folder")}
                    className="hover:bg-[#2d2d2d]"
                  >
                    New Folder
                  </ContextMenuItem>
                </>
              )}
              <ContextMenuItem
                onClick={() => {
                  setEditingFile(file.path)
                  setEditingName(file.name)
                }}
                className="hover:bg-[#2d2d2d]"
              >
                Rename
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onFileDelete(file.path)} className="hover:bg-[#2d2d2d] text-red-400">
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          {file.type === "folder" && file.children && expandedFolders.has(file.path) && (
            <FileTree
              files={file.children}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              onFileCreate={onFileCreate}
              onFileDelete={onFileDelete}
              onFileRename={onFileRename}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}
