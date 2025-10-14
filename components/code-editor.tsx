"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Editor, { loader } from "@monaco-editor/react"

// Define custom Monaco editor themes
const customThemes = {
  monokai: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'F8F8F2' },
      { token: 'keyword', foreground: 'F92672' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'number', foreground: 'AE81FF' },
      { token: 'comment', foreground: '88846F' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#F8F8F2',
      'editorLineNumber.foreground': '#8F908A',
      'editor.selectionBackground': '#49483E',
      'editor.lineHighlightBackground': '#3E3D32',
    }
  },
  dracula: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'F8F8F2' },
      { token: 'keyword', foreground: 'FF79C6' },
      { token: 'string', foreground: 'F1FA8C' },
      { token: 'number', foreground: 'BD93F9' },
      { token: 'comment', foreground: '6272A4' },
    ],
    colors: {
      'editor.background': '#282A36',
      'editor.foreground': '#F8F8F2',
      'editorLineNumber.foreground': '#6272A4',
      'editor.selectionBackground': '#44475A',
      'editor.lineHighlightBackground': '#44475A50',
    }
  },
  'github-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'c9d1d9' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'comment', foreground: '8b949e' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editorLineNumber.foreground': '#6e7681',
      'editor.selectionBackground': '#284566',
      'editor.lineHighlightBackground': '#161b22',
    }
  },
  'github-light': {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '24292f' },
      { token: 'keyword', foreground: 'd73a49' },
      { token: 'string', foreground: '032f62' },
      { token: 'number', foreground: '005cc5' },
      { token: 'comment', foreground: '6a737d' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292f',
      'editorLineNumber.foreground': '#1b1f24',
      'editor.selectionBackground': '#0366d625',
      'editor.lineHighlightBackground': '#f6f8fa',
    }
  }
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
  settings,
}: CodeEditorProps) {
  const currentFilePathRef = useRef<string>(path)

  // Initialize custom themes
  useEffect(() => {
    loader.init().then(monaco => {
      Object.entries(customThemes).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, themeData)
      })
    })
  }, [])

  // Update the current file path reference
  useEffect(() => {
    currentFilePathRef.current = path
  }, [path])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value, currentFilePathRef.current)
    }
  }

  const getFileName = (filePath: string) => {
    return filePath.split("/").pop() || filePath
  }

  // Check if current file is an image
  const isImageFile = () => {
    return path.startsWith("/assets/") && value.startsWith("data:image/")
  }

  // Check if current file is a binary asset
  const isBinaryAsset = () => {
    return path.startsWith("/assets/") || value.startsWith("data:")
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* File Tabs */}
      <div className="flex items-center bg-[#252526] border-b border-[#2d2d2d] overflow-x-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
        {openFiles.map((file) => (
          <div
            key={file}
            className={`flex items-center gap-2 px-4 py-2 border-r border-[#2d2d2d] cursor-pointer group transition-colors ${
              activeFile === file ? "bg-[#1e1e1e] text-white" : "bg-[#2d2d2d] text-[#969696] hover:bg-[#323233]"
            }`}
            onClick={() => onFileSelect(file)}
          >
            <span className="text-sm whitespace-nowrap">{getFileName(file)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-[#3e3e42] cursor-pointer transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onFileClose(file)
              }}
              title="Close file"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {/* Image Preview */}
        {isImageFile() && (
          <div className="w-full h-full overflow-auto bg-[#1e1e1e] flex items-center justify-center p-8">
            <div className="text-center">
              <img 
                src={value} 
                alt={getFileName(path)} 
                className="max-w-full max-h-full object-contain rounded shadow-lg"
                style={{ maxHeight: 'calc(100vh - 200px)' }}
              />
              <div className="mt-4 text-[#cccccc]">
                <p className="text-sm font-semibold">{getFileName(path)}</p>
                <p className="text-xs text-[#858585] mt-1">Image Preview</p>
                <p className="text-xs text-[#858585]">Size: {Math.round(value.length / 1024)} KB</p>
              </div>
            </div>
          </div>
        )}

        {/* Binary Asset Info */}
        {!isImageFile() && isBinaryAsset() && (
          <div className="w-full h-full overflow-auto bg-[#1e1e1e] flex items-center justify-center p-8">
            <div className="text-center text-[#cccccc]">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-semibold">{getFileName(path)}</p>
              <p className="text-sm text-[#858585] mt-2">Binary Asset</p>
              <p className="text-xs text-[#858585] mt-1">Size: {Math.round(value.length / 1024)} KB</p>
              <p className="text-xs text-[#858585] mt-4">This file cannot be edited in the code editor.</p>
            </div>
          </div>
        )}

        {/* Monaco Editor */}
        {!isBinaryAsset() && (
          <Editor
            key={path}
            height="100%"
            language={language}
            defaultValue={value}
            theme={settings.editorTheme}
            onChange={handleEditorChange}
            options={{
              automaticLayout: true,
              minimap: { enabled: true },
              fontSize: settings.fontSize,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              cursorStyle: "line",
              wordWrap: settings.wordWrap ? "on" : "off",
              tabSize: settings.tabSize,
            }}
            loading={
              <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] text-[#cccccc]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007acc] mx-auto mb-2"></div>
                  <p className="text-sm">Loading editor...</p>
                </div>
              </div>
            }
          />
        )}
      </div>
    </div>
  )
}
