"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { ActivityBar, type ActiveDrawer } from "@/components/activity-bar"
import { TopNavigation } from "@/components/top-navigation"
import { StatusBar } from "@/components/status-bar"
import { FileExplorer } from "@/components/file-explorer"
import { CodeEditor } from "@/components/code-editor"
import { PreviewPanel } from "@/components/preview-panel"
import { ConsolePanel } from "@/components/console-panel"
import { TemplateSelector } from "@/components/template-selector"
import { LibraryManager } from "@/components/library-manager"
import { AssetManager } from "@/components/asset-manager"
import { SnippetsManager } from "@/components/snippets-manager"
import { SettingsPanel } from "@/components/settings-panel"
import { ShortcutsModal } from "@/components/shortcuts-modal"
import { CommandPalette } from "@/components/command-palette"
import { useFileSystem } from "@/hooks/use-file-system"
import { useConsole } from "@/hooks/use-console"
import { detectLanguage } from "@/lib/language-detector"
import {
  exportProject,
  exportStandaloneHTML,
  importProjectFromZip,
  generateShareableLink,
  decodeShareableLink,
  formatCode,
  type Library,
} from "@/lib/export-project"
import type { ProjectTemplate } from "@/lib/templates"
import type { FileNode } from "@/types/file-system"
import { toast } from "sonner"

export default function Home() {
  const {
    files,
    activeFile,
    openFiles,
    setActiveFile,
    closeFile,
    updateFile,
    createFile,
    removeFile,
    renameFile,
    getActiveFileContent,
    loadFiles,
    resetFiles,
  } = useFileSystem()

  const { messages, addMessage, clearMessages } = useConsole()

  const [projectName, setProjectName] = useState("My Project")
  const [layout, setLayout] = useState<"split" | "editor" | "preview">("split")
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>("explorer")
  const [showConsole, setShowConsole] = useState(true)
  const [externalLibraries, setExternalLibraries] = useState<Library[]>([])
  const { theme, setTheme } = useTheme()

  // Modals
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Cursor tracking
  const [lineCol, setLineCol] = useState({ line: 1, col: 1 })

  // Settings
  const [settings, setSettings] = useState({
    autoSave: true,
    autoFormat: false,
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    editorTheme: "obsidian-dark",
  })

  // Load Settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("nyeya-codebox-settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch {}
  }, [])

  // Persist Settings
  useEffect(() => {
    try {
      localStorage.setItem("nyeya-codebox-settings", JSON.stringify(settings))
    } catch {}
  }, [settings])

  // Hydrate from URL query or LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const decoded = decodeShareableLink(window.location.search)
      if (decoded && decoded.files && decoded.files.length > 0) {
        loadFiles(decoded.files)
        setProjectName(decoded.name || "Shared Project")
        setExternalLibraries(decoded.libraries || [])
        toast.success(`Loaded project "${decoded.name}" from share link!`)
        addMessage(`Loaded project from share link`, "info")
        return
      }

      // Otherwise load from LocalStorage
      try {
        const saved = localStorage.getItem("nyeya-codebox-project")
        if (saved) {
          const data = JSON.parse(saved)
          if (data.files && data.files.length > 0) {
            loadFiles(data.files)
            setProjectName(data.name || "My Project")
            setExternalLibraries(data.libraries || [])
            addMessage("Project restored from previous session", "info")
          }
        }
      } catch {}
    }
  }, [loadFiles, addMessage])

  // Auto-save every 30s
  useEffect(() => {
    if (!settings.autoSave) return

    const interval = setInterval(() => {
      try {
        const filterAssets = (nodes: FileNode[]): FileNode[] => {
          return nodes
            .map((node) => {
              if (node.type === "folder" && node.children) {
                if (node.path === "/assets") return { ...node, children: [] }
                return { ...node, children: filterAssets(node.children) }
              }
              if (node.path.startsWith("/assets/")) return null
              return node
            })
            .filter((n): n is FileNode => n !== null)
        }

        const filesToSave = filterAssets(files)
        localStorage.setItem(
          "nyeya-codebox-project",
          JSON.stringify({
            name: projectName,
            files: filesToSave,
            activeFile,
            openFiles,
            libraries: externalLibraries,
          })
        )
        setIsDirty(false)
      } catch {}
    }, 30000)

    return () => clearInterval(interval)
  }, [projectName, files, activeFile, openFiles, externalLibraries, settings.autoSave])

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setShowCommandPalette((prev) => !prev)
      }

      // Ctrl+/ or Cmd+/ -> Shortcuts Modal
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        setShowShortcuts((prev) => !prev)
      }

      // Ctrl+S or Cmd+S -> Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        handleSave()
      }

      // Ctrl+Enter or Cmd+Enter -> Run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        handleRun()
      }

      // Shift+Alt+F -> Format
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault()
        handleFormatCode()
      }

      // Ctrl+B or Cmd+B -> Toggle Drawer
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault()
        setActiveDrawer((prev) => (prev ? null : "explorer"))
      }

      // Ctrl+` or Cmd+` -> Toggle Console
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault()
        setShowConsole((prev) => !prev)
      }

      // Ctrl+Shift+E -> File Explorer
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault()
        setActiveDrawer("explorer")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [files, projectName, externalLibraries, activeFile, settings])

  const handleFileContentChange = useCallback(
    (content: string, filePath: string) => {
      updateFile(filePath, content)
      setIsDirty(true)
    },
    [updateFile]
  )

  const handleSave = () => {
    try {
      if (settings.autoFormat && activeFile) {
        handleFormatCode()
      }

      const filterAssets = (nodes: FileNode[]): FileNode[] => {
        return nodes
          .map((node) => {
            if (node.type === "folder" && node.children) {
              if (node.path === "/assets") return { ...node, children: [] }
              return { ...node, children: filterAssets(node.children) }
            }
            if (node.path.startsWith("/assets/")) return null
            return node
          })
          .filter((n): n is FileNode => n !== null)
      }

      const filesToSave = filterAssets(files)
      localStorage.setItem(
        "nyeya-codebox-project",
        JSON.stringify({
          name: projectName,
          files: filesToSave,
          activeFile,
          openFiles,
          libraries: externalLibraries,
        })
      )
      setIsDirty(false)
      toast.success("Project snapshot saved successfully!")
      addMessage("Project snapshot saved", "info")
    } catch (error) {
      toast.error("Failed to save project")
    }
  }

  const handleRun = () => {
    clearMessages()
    addMessage("Sandbox re-rendered", "info")
    toast.success("Live preview refreshed!")
  }

  const handleFormatCode = () => {
    if (!activeFile) return
    const content = getActiveFileContent()
    const lang = detectLanguage(activeFile)
    const formatted = formatCode(content, lang)
    updateFile(activeFile, formatted)
    toast.success(`Formatted ${activeFile.split("/").pop()}`)
    addMessage(`Formatted ${activeFile}`, "info")
  }

  const handleExportZip = async () => {
    toast.info("Bundling ZIP archive...")
    await exportProject(files, projectName, externalLibraries)
    toast.success("ZIP archive exported!")
    addMessage("Exported ZIP package", "info")
  }

  const handleExportHTML = () => {
    toast.info("Generating standalone HTML bundle...")
    exportStandaloneHTML(files, projectName, externalLibraries)
    toast.success("Standalone HTML exported!")
    addMessage("Exported standalone HTML bundle", "info")
  }

  const handleImportZip = async (file: File) => {
    try {
      toast.info(`Importing ${file.name}...`)
      const result = await importProjectFromZip(file)
      if (result.files.length > 0) {
        loadFiles(result.files)
        setProjectName(result.name)
        const html = result.files.find((f) => f.name.endsWith(".html"))
        if (html) {
          setActiveFile(html.path)
        }
        toast.success(`Imported ${result.files.length} files from ${file.name}`)
        addMessage(`Project imported from ${file.name}`, "info")
      }
    } catch (err) {
      toast.error("Failed to read ZIP archive")
    }
  }

  const handleShare = () => {
    const link = generateShareableLink(files, projectName, externalLibraries)
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Compressed share link copied to clipboard!")
      addMessage("Generated share link", "info")
    })
  }

  const handleNewProject = () => {
    if (confirm("Start a new clean project? Unsaved changes in the current session will be replaced.")) {
      resetFiles()
      setProjectName("My Project")
      setExternalLibraries([])
      clearMessages()
      localStorage.removeItem("nyeya-codebox-project")
      toast.success("New project started!")
      addMessage("Initialized new project", "info")
    }
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    loadFiles(template.files)
    const htmlFile = template.files.find((f) => f.name === "index.html")
    if (htmlFile) {
      setActiveFile(htmlFile.path)
    }
    setProjectName(template.name)
    toast.success(`Loaded "${template.name}" starter template!`)
    addMessage(`Template "${template.name}" loaded`, "info")
    setShowTemplateSelector(false)
  }

  const handleAssetAdd = (path: string, content: string, type: string) => {
    const assetsFolder = files.find((f) => f.path === "/assets" && f.type === "folder")
    if (!assetsFolder) {
      createFile("/", "assets", "folder")
    }
    const fileName = path.split("/").pop() || "asset"
    createFile("/assets", fileName, "file", content)
    addMessage(`Asset loaded: ${path}`, "info")
  }

  const handleLibraryAdd = (library: Library) => {
    setExternalLibraries((prev) => [...prev, library])
    addMessage(`Injected CDN package: ${library.name}`, "info")
  }

  const handleLibraryRemove = (url: string) => {
    setExternalLibraries((prev) => prev.filter((lib) => lib.url !== url))
    addMessage("Removed CDN package", "info")
  }

  const handleInsertSnippet = (code: string) => {
    if (activeFile) {
      const current = getActiveFileContent()
      updateFile(activeFile, current + "\n\n" + code)
      setIsDirty(true)
    }
  }

  const handleEvalREPL = (expression: string) => {
    const iframes = document.querySelectorAll("iframe")
    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage({ type: "eval-repl", expression }, "*")
    })
  }

  const handleFileDuplicate = (path: string) => {
    const findNode = (nodes: FileNode[]): FileNode | null => {
      for (const n of nodes) {
        if (n.path === path) return n
        if (n.children) {
          const res = findNode(n.children)
          if (res) return res
        }
      }
      return null
    }

    const target = findNode(files)
    if (!target) return

    const parts = path.split("/").filter(Boolean)
    const origName = parts[parts.length - 1]
    const parentPath = "/" + parts.slice(0, -1).join("/")

    const nameParts = origName.split(".")
    let base = nameParts[0]
    let ext = nameParts.length > 1 ? "." + nameParts.slice(1).join(".") : ""
    let newName = `${base}-copy${ext}`

    let counter = 2
    const allPaths = new Set<string>()
    const collectPaths = (nodes: FileNode[]) => {
      nodes.forEach((n) => {
        allPaths.add(n.path)
        if (n.children) collectPaths(n.children)
      })
    }
    collectPaths(files)

    let testPath = parentPath === "/" ? `/${newName}` : `${parentPath}/${newName}`
    while (allPaths.has(testPath)) {
      newName = `${base}-copy-${counter}${ext}`
      testPath = parentPath === "/" ? `/${newName}` : `${parentPath}/${newName}`
      counter++
    }

    createFile(parentPath, newName, target.type, target.content)
    setActiveFile(testPath)
    addMessage(`Duplicated ${origName} -> ${newName}`, "info")
  }

  const activeFileContent = getActiveFileContent()
  const activeFileLanguage = activeFile ? detectLanguage(activeFile) : "javascript"
  const errorCount = messages.filter((m) => m.type === "error").length
  const warnCount = messages.filter((m) => m.type === "warn").length

  return (
    <div className="h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] overflow-hidden select-none">
      {/* Top Header Navigation */}
      <TopNavigation
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSave={handleSave}
        onExportZip={handleExportZip}
        onExportHTML={handleExportHTML}
        onImportZip={handleImportZip}
        onShare={handleShare}
        onRun={handleRun}
        onFormat={handleFormatCode}
        onLayoutChange={setLayout}
        currentLayout={layout}
        onNewProject={handleNewProject}
        onOpenTemplates={() => setShowTemplateSelector(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onOpenShortcuts={() => setShowShortcuts(true)}
        isDirty={isDirty}
      />

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Activity Bar */}
        <ActivityBar
          activeDrawer={activeDrawer}
          onSelectDrawer={setActiveDrawer}
          onOpenSettings={() => setShowSettings(true)}
          onOpenShortcuts={() => setShowShortcuts(true)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          addedLibrariesCount={externalLibraries.length}
        />

        {/* Studio Workspace Resizable Panels */}
        <div className="flex-1 overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Left Dynamic Drawer */}
            {activeDrawer !== null && (
              <>
                <Panel defaultSize={20} minSize={14} maxSize={35} className="h-full bg-[#121215]">
                  {activeDrawer === "explorer" && (
                    <FileExplorer
                      files={files}
                      activeFile={activeFile}
                      onFileSelect={setActiveFile}
                      onFileCreate={createFile}
                      onFileDelete={removeFile}
                      onFileRename={renameFile}
                      onFileDuplicate={handleFileDuplicate}
                    />
                  )}
                  {activeDrawer === "templates" && (
                    <div className="h-full flex flex-col p-3 overflow-y-auto space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 p-2">
                        Templates Showcase
                      </span>
                      <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="w-full p-4 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-left hover:bg-indigo-600/30 transition-all text-xs font-semibold text-indigo-300 cursor-pointer"
                      >
                        ⚡ Open Full Templates Gallery →
                      </button>
                    </div>
                  )}
                  {activeDrawer === "libraries" && (
                    <LibraryManager
                      onLibraryAdd={handleLibraryAdd}
                      addedLibraries={externalLibraries}
                      onLibraryRemove={handleLibraryRemove}
                    />
                  )}
                  {activeDrawer === "assets" && (
                    <AssetManager
                      files={files}
                      onAssetAdd={handleAssetAdd}
                      onAssetDelete={removeFile}
                    />
                  )}
                  {activeDrawer === "snippets" && (
                    <SnippetsManager onInsertCode={handleInsertSnippet} />
                  )}
                </Panel>

                <PanelResizeHandle className="w-1 bg-white/[0.06] hover:bg-indigo-500 transition-colors" />
              </>
            )}

            {/* Central Editor, Preview & Console Area */}
            <Panel defaultSize={activeDrawer !== null ? 80 : 100}>
              <PanelGroup direction="vertical">
                {/* Editor & Preview Row */}
                <Panel defaultSize={showConsole ? 70 : 100} minSize={25}>
                  <PanelGroup direction="horizontal">
                    {/* Code Editor */}
                    {(layout === "split" || layout === "editor") && (
                      <>
                        <Panel defaultSize={layout === "editor" ? 100 : 50} minSize={25}>
                          <CodeEditor
                            value={activeFileContent}
                            onChange={handleFileContentChange}
                            language={activeFileLanguage}
                            path={activeFile || ""}
                            openFiles={openFiles}
                            activeFile={activeFile}
                            onFileSelect={setActiveFile}
                            onFileClose={closeFile}
                            onNewFile={() => createFile("/", "index.js", "file")}
                            onFormat={handleFormatCode}
                            onSave={handleSave}
                            onCursorChange={(line, col) => setLineCol({ line, col })}
                            settings={settings}
                          />
                        </Panel>
                        {layout === "split" && (
                          <PanelResizeHandle className="w-1 bg-white/[0.06] hover:bg-indigo-500 transition-colors" />
                        )}
                      </>
                    )}

                    {/* Live Preview Panel */}
                    {(layout === "split" || layout === "preview") && (
                      <Panel defaultSize={layout === "preview" ? 100 : 50} minSize={25}>
                        <PreviewPanel
                          files={files}
                          onConsoleLog={addMessage}
                          externalLibraries={externalLibraries}
                        />
                      </Panel>
                    )}
                  </PanelGroup>
                </Panel>

                {/* DevTools Console Panel */}
                {showConsole && (
                  <>
                    <PanelResizeHandle className="h-1 bg-white/[0.06] hover:bg-indigo-500 transition-colors" />
                    <Panel defaultSize={30} minSize={12} maxSize={50}>
                      <ConsolePanel
                        messages={messages}
                        onClear={clearMessages}
                        onEvalREPL={handleEvalREPL}
                      />
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        activeFile={activeFile}
        activeLanguage={activeFileLanguage}
        errorCount={errorCount}
        warnCount={warnCount}
        showConsole={showConsole}
        onToggleConsole={() => setShowConsole(!showConsole)}
        currentLayout={layout}
        onLayoutChange={setLayout}
        lineCol={lineCol}
        tabSize={settings.tabSize}
        autoSave={settings.autoSave}
      />

      {/* Modals & Dialogs */}
      <TemplateSelector
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <ShortcutsModal
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        files={files}
        activeFile={activeFile}
        onFileSelect={setActiveFile}
        onRun={handleRun}
        onSave={handleSave}
        onExportZip={handleExportZip}
        onExportHTML={handleExportHTML}
        onShare={handleShare}
        onFormat={handleFormatCode}
        onNewProject={handleNewProject}
        onSelectTemplate={handleTemplateSelect}
        onLayoutChange={setLayout}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onOpenSettings={() => setShowSettings(true)}
        onToggleConsole={() => setShowConsole(!showConsole)}
      />
    </div>
  )
}
