"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  X,
  Plus,
  Copy,
  Check,
  Sparkles,
  WrapText,
  ZoomIn,
  ZoomOut,
  Eye,
  FileCode,
  FileText,
  FileSpreadsheet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Editor, { loader, OnMount } from "@monaco-editor/react"
import { toast } from "sonner"

// Monaco Custom Theme Palettes
const customThemes = {
  "obsidian-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "f4f4f5" },
      { token: "keyword", foreground: "818cf8", fontStyle: "bold" },
      { token: "string", foreground: "34d399" },
      { token: "number", foreground: "38bdf8" },
      { token: "comment", foreground: "71717a", fontStyle: "italic" },
      { token: "tag", foreground: "f472b6" },
      { token: "attribute.name", foreground: "a78bfa" },
      { token: "attribute.value", foreground: "34d399" },
      { token: "delimiter", foreground: "a1a1aa" },
    ],
    colors: {
      "editor.background": "#0e0e11",
      "editor.foreground": "#f4f4f5",
      "editorLineNumber.foreground": "#52525b",
      "editorLineNumber.activeForeground": "#818cf8",
      "editor.selectionBackground": "#6366f133",
      "editor.lineHighlightBackground": "#ffffff08",
      "editorCursor.foreground": "#818cf8",
      "editorWhitespace.foreground": "#27272a",
    },
  },
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "F8F8F2" },
      { token: "keyword", foreground: "F92672" },
      { token: "string", foreground: "E6DB74" },
      { token: "number", foreground: "AE81FF" },
      { token: "comment", foreground: "88846F" },
    ],
    colors: {
      "editor.background": "#1e1f1c",
      "editor.foreground": "#F8F8F2",
      "editorLineNumber.foreground": "#8F908A",
      "editor.selectionBackground": "#49483E",
      "editor.lineHighlightBackground": "#3E3D32",
    },
  },
  dracula: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "F8F8F2" },
      { token: "keyword", foreground: "FF79C6" },
      { token: "string", foreground: "F1FA8C" },
      { token: "number", foreground: "BD93F9" },
      { token: "comment", foreground: "6272A4" },
    ],
    colors: {
      "editor.background": "#1e1f29",
      "editor.foreground": "#F8F8F2",
      "editorLineNumber.foreground": "#6272A4",
      "editor.selectionBackground": "#44475A",
      "editor.lineHighlightBackground": "#44475A50",
    },
  },
  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "c9d1d9" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
      { token: "comment", foreground: "8b949e" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editorLineNumber.foreground": "#6e7681",
      "editor.selectionBackground": "#284566",
      "editor.lineHighlightBackground": "#161b22",
    },
  },
}

interface CodeEditorProps {
  value: string
  onChange: (value: string, filePath: string) => void
  language: string
  path: string
  openFiles: string[]
  activeFile: string | null
  onFileSelect: (path: string) => void
  onFileClose: (path: string) => void
  onNewFile?: () => void
  onFormat?: () => void
  onSave?: () => void
  onCursorChange?: (line: number, col: number) => void
  settings: {
    editorTheme: string
    fontSize: number
    tabSize: number
    wordWrap: boolean
  }
}

export function CodeEditor({
  value,
  onChange,
  language,
  path,
  openFiles,
  activeFile,
  onFileSelect,
  onFileClose,
  onNewFile,
  onFormat,
  onSave,
  onCursorChange,
  settings,
}: CodeEditorProps) {
  const currentFilePathRef = useRef<string>(path)
  const editorRef = useRef<any>(null)
  const [copied, setCopied] = useState(false)
  const [localFontSize, setLocalFontSize] = useState(settings.fontSize)
  const [localWordWrap, setLocalWordWrap] = useState(settings.wordWrap)

  // Initialize custom Monaco themes
  useEffect(() => {
    loader.init().then((monaco) => {
      Object.entries(customThemes).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, themeData as any)
      })
    })
  }, [])

  useEffect(() => {
    currentFilePathRef.current = path
  }, [path])

  // Update editor value if changed externally (e.g. Prettier formatting or template switch)
  useEffect(() => {
    if (editorRef.current) {
      const currentEditorValue = editorRef.current.getValue()
      if (currentEditorValue !== value) {
        editorRef.current.setValue(value || "")
      }
    }
  }, [value, path])

  // Dynamically update editor options without remounting
  useEffect(() => {
    setLocalFontSize(settings.fontSize)
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
      })
    }
  }, [settings.fontSize, settings.tabSize])

  useEffect(() => {
    setLocalWordWrap(settings.wordWrap)
    if (editorRef.current) {
      editorRef.current.updateOptions({
        wordWrap: settings.wordWrap ? "on" : "off",
      })
    }
  }, [settings.wordWrap])

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Register cursor position change listener
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange?.(e.position.lineNumber, e.position.column)
    })

    // Register keyboard shortcuts inside editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.()
    })

    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      onFormat?.()
    })
  }

  const handleEditorChange = (val: string | undefined) => {
    if (val !== undefined) {
      onChange(val, currentFilePathRef.current)
    }
  }

  const getFileName = (filePath: string) => {
    return filePath.split("/").pop() || filePath
  }

  const getFileBadgeColor = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || ""
    switch (ext) {
      case "html":
        return "text-orange-400"
      case "css":
        return "text-cyan-400"
      case "js":
        return "text-amber-400"
      case "ts":
      case "tsx":
        return "text-blue-400"
      case "json":
        return "text-yellow-400"
      case "svg":
        return "text-rose-400"
      default:
        return "text-zinc-400"
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success("Code copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const isImageFile = () => {
    return path.startsWith("/assets/") && (value.startsWith("data:image/") || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(path))
  }

  const isBinaryAsset = () => {
    return path.startsWith("/assets/") || (value.startsWith("data:") && !isImageFile())
  }

  const activeMonacoTheme = settings.editorTheme === "vs-dark" ? "obsidian-dark" : settings.editorTheme

  return (
    <div className="h-full flex flex-col bg-[#0e0e11] overflow-hidden">
      {/* Tab bar & Editor Toolbar */}
      <div className="flex-none flex items-center justify-between bg-[#121215] border-b border-white/[0.08] pr-2 select-none overflow-x-auto">
        {/* Tabs */}
        <div className="flex items-center overflow-x-auto scrollbar-none flex-1 min-w-0">
          {openFiles.map((file) => {
            const fileName = getFileName(file)
            const isActive = activeFile === file
            const colorClass = getFileBadgeColor(fileName)

            return (
              <div
                key={file}
                onClick={() => onFileSelect(file)}
                onMouseDown={(e) => {
                  if (e.button === 1) {
                    // Middle click close
                    e.preventDefault()
                    onFileClose(file)
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 border-r border-white/[0.08] cursor-pointer text-xs transition-all group shrink-0 ${
                  isActive
                    ? "bg-[#0e0e11] text-white border-t-2 border-t-indigo-500 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border-t-2 border-t-transparent"
                }`}
                title={file}
              >
                <span className={`font-mono text-[11px] font-bold ${colorClass}`}>
                  {fileName.split(".").pop()?.toUpperCase() || "FILE"}
                </span>
                <span className="truncate max-w-[120px]">{fileName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileClose(file)
                  }}
                  className="h-4 w-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all"
                  title="Close Tab"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          })}

          {onNewFile && (
            <button
              onClick={onNewFile}
              className="px-2.5 py-2 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] transition-colors"
              title="New File"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* In-Editor Quick Tools */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {onFormat && (
            <button
              onClick={onFormat}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Format with Prettier"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          )}

          <button
            onClick={() => {
              const nextWrap = !localWordWrap
              setLocalWordWrap(nextWrap)
              if (editorRef.current) {
                editorRef.current.updateOptions({ wordWrap: nextWrap ? "on" : "off" })
              }
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              localWordWrap ? "text-indigo-400 bg-indigo-500/20" : "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
            }`}
            title="Toggle Word Wrap"
          >
            <WrapText className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              const nextSize = Math.min(24, localFontSize + 1)
              setLocalFontSize(nextSize)
              if (editorRef.current) {
                editorRef.current.updateOptions({ fontSize: nextSize })
              }
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Increase Font Size"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              const nextSize = Math.max(10, localFontSize - 1)
              setLocalFontSize(nextSize)
              if (editorRef.current) {
                editorRef.current.updateOptions({ fontSize: nextSize })
              }
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Decrease Font Size"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Copy Code to Clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 relative overflow-hidden bg-[#0e0e11]">
        {/* Image Preview Viewer */}
        {isImageFile() && (
          <div className="w-full h-full flex items-center justify-center p-8 bg-[#09090b]/80">
            <div className="text-center p-6 rounded-2xl bg-[#121215] border border-white/[0.08] shadow-2xl max-w-lg">
              <img
                src={value}
                alt={getFileName(path)}
                className="max-w-full max-h-[380px] object-contain rounded-xl shadow-lg mx-auto mb-4 border border-white/[0.05]"
              />
              <p className="font-semibold text-sm text-white mb-1">{getFileName(path)}</p>
              <p className="text-xs text-zinc-400">Path: <code className="text-indigo-400">{path}</code></p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`<img src="${path}" alt="${getFileName(path)}" />`)
                  toast.success("Copied <img> tag to clipboard!")
                }}
                className="mt-4 px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all cursor-pointer"
              >
                Copy HTML &lt;img&gt; Tag
              </button>
            </div>
          </div>
        )}

        {/* Binary Asset Viewer */}
        {!isImageFile() && isBinaryAsset() && (
          <div className="w-full h-full flex items-center justify-center p-8 bg-[#09090b]/80">
            <div className="text-center p-8 rounded-2xl bg-[#121215] border border-white/[0.08] shadow-2xl max-w-sm">
              <FileSpreadsheet className="h-12 w-12 text-zinc-500 mx-auto mb-3" />
              <p className="font-semibold text-sm text-white">{getFileName(path)}</p>
              <p className="text-xs text-zinc-400 mt-1">Binary media asset</p>
              <p className="text-xs text-zinc-500 mt-2">Size: {Math.round(value.length / 1024)} KB</p>
            </div>
          </div>
        )}

        {/* Monaco Code Editor */}
        {!isBinaryAsset() && !isImageFile() && (
          <Editor
            key={path}
            height="100%"
            language={language}
            defaultValue={value}
            theme={activeMonacoTheme}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              fontSize: localFontSize,
              tabSize: settings.tabSize,
              wordWrap: localWordWrap ? "on" : "off",
              minimap: { enabled: true, scale: 0.75 },
              scrollBeyondLastLine: false,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              padding: { top: 12, bottom: 12 },
              lineNumbersMinChars: 3,
              renderLineHighlight: "all",
              fontFamily: "var(--font-geist-mono), 'Fira Code', Menlo, Monaco, monospace",
              fontLigatures: true,
            }}
            loading={
              <div className="absolute inset-0 flex items-center justify-center bg-[#0e0e11] text-zinc-400">
                <div className="flex items-center gap-2 text-xs">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
                  <span>Loading Monaco Engine...</span>
                </div>
              </div>
            }
          />
        )}
      </div>
    </div>
  )
}
