"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { FileExplorer } from "@/components/file-explorer"
import { CodeEditor } from "@/components/code-editor"
import { PreviewPanel } from "@/components/preview-panel"
import { ConsolePanel } from "@/components/console-panel"
import { TopNavigation } from "@/components/top-navigation"
import { TemplateSelector } from "@/components/template-selector"
import { AssetManager } from "@/components/asset-manager"
import { LibraryManager } from "@/components/library-manager"
import { CodeFormatter } from "@/components/code-formatter"
import { SettingsPanel } from "@/components/settings-panel"
import { useFileSystem } from "@/hooks/use-file-system"
import { useConsole } from "@/hooks/use-console"
import { detectLanguage } from "@/lib/language-detector"
import { exportProject, generateShareableLink } from "@/lib/export-project"
import type { ProjectTemplate } from "@/lib/templates"
import type { FileNode } from "@/types/file-system"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"

interface Library {
  name: string
  url: string
  type: "css" | "js"
  description: string
}

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
  const [showTemplateSelector, setShowTemplateSelector] = useState(true)
  const [externalLibraries, setExternalLibraries] = useState<Library[]>([])
  const { theme, setTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [showFilePane, setShowFilePane] = useState(true)
  const [showConsole, setShowConsole] = useState(true)
  const [settings, setSettings] = useState({
    autoSave: true,
    autoFormat: false,
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    editorTheme: "vs-dark",
  })


  useEffect(() => {
    const savedSettings = localStorage.getItem("nyeya-codebox-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        // Failed to load settings, using defaults
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("nyeya-codebox-settings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nyeya-codebox-project")
      if (saved) {
        const data = JSON.parse(saved)
        if (data.files) {
          loadFiles(data.files)
          setProjectName(data.name || "My Project")
          setExternalLibraries(data.libraries || [])
          setShowTemplateSelector(false)
          addMessage("Project loaded from previous session", "info")
        }
      }
    } catch (error) {
      // Failed to load saved project
    }
  }, [])

  useEffect(() => {
    if (!settings.autoSave) return

    const interval = setInterval(() => {
      try {
        // Filter out asset files to prevent quota exceeded errors
        const filterAssets = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.type === "folder" && node.children) {
              // Skip the entire assets folder
              if (node.path === "/assets") {
                return { ...node, children: [] }
              }
              return { ...node, children: filterAssets(node.children) }
            }
            // Skip individual asset files
            if (node.path.startsWith("/assets/")) {
              return null
            }
            return node
          }).filter((node): node is FileNode => node !== null)
        }

        const filesToSave = filterAssets(files)
        
        localStorage.setItem(
          "nyeya-codebox-project",
          JSON.stringify({ name: projectName, files: filesToSave, activeFile, openFiles, libraries: externalLibraries }),
        )
      } catch (error) {
        // Auto-save failed
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [projectName, files, activeFile, openFiles, externalLibraries, settings.autoSave])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
      // Ctrl+Shift+E or Cmd+Shift+E to export
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "e") {
        e.preventDefault()
        handleExport()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [projectName, files, externalLibraries])


  const handleFileContentChange = useCallback((content: string, filePath: string) => {
    // Update the specific file that changed (not activeFile which can be stale)
    updateFile(filePath, content)
  }, [updateFile])

  const handleSave = () => {
    try {
      // Filter out asset files to prevent quota exceeded errors
      const filterAssets = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.type === "folder" && node.children) {
            if (node.path === "/assets") {
              return { ...node, children: [] }
            }
            return { ...node, children: filterAssets(node.children) }
          }
          if (node.path.startsWith("/assets/")) {
            return null
          }
          return node
        }).filter((node): node is FileNode => node !== null)
      }

      const filesToSave = filterAssets(files)
      
      localStorage.setItem(
        "nyeya-codebox-project",
        JSON.stringify({ name: projectName, files: filesToSave, activeFile, openFiles, libraries: externalLibraries }),
      )
      addMessage("Project saved successfully! (Note: Assets are not persisted)", "info")
    } catch (error) {
      addMessage("Failed to save project: " + (error instanceof Error ? error.message : "Unknown error"), "error")
    }
  }

  const handleExport = async () => {
    addMessage("Exporting project...", "info")
    await exportProject(files, projectName, externalLibraries)
    addMessage("Project exported successfully!", "info")
  }

  const handleShare = () => {
    const link = generateShareableLink(files, projectName)
    navigator.clipboard.writeText(link).then(() => {
      addMessage("Share link copied to clipboard!", "info")
    })
  }

  const handleFork = () => {
    const newName = `${projectName} (Fork)`
    setProjectName(newName)
    addMessage(`Project forked as "${newName}"!`, "info")
  }

  const handleRun = () => {
    addMessage("Running project...", "info")
    clearMessages()
  }

  const handleNewProject = () => {
    if (confirm("Are you sure you want to start a new project? Unsaved changes will be lost.")) {
      resetFiles()
      setProjectName("My Project")
      setExternalLibraries([])
      clearMessages()
      localStorage.removeItem("nyeya-codebox")
      addMessage("New project created", "info")
    }
  }

  const handleOpenTemplates = () => {
    setShowTemplateSelector(true)
  }

  const handleAssetAdd = (path: string, content: string, type: string) => {
    // Ensure /assets folder exists
    const assetsFolder = files.find(f => f.path === "/assets" && f.type === "folder")
    if (!assetsFolder) {
      createFile("/", "assets", "folder")
    }
    
    // Create the asset file with content
    const fileName = path.split("/").pop() || "asset"
    createFile("/assets", fileName, "file", content)
    
    addMessage(`Asset added: ${path}`, "info")
  }

  const handleLibraryAdd = (library: Library) => {
    setExternalLibraries((prev) => [...prev, library])
    addMessage(`Library added: ${library.name}`, "info")
  }

  const handleLibraryRemove = (url: string) => {
    setExternalLibraries((prev) => prev.filter((lib) => lib.url !== url))
    addMessage("Library removed", "info")
  }

  const handleCodeFormat = (formattedCode: string) => {
    if (activeFile) {
      updateFile(activeFile, formattedCode)
      addMessage("Code formatted successfully!", "info")
    }
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    loadFiles(template.files)

    // Set the first HTML file as active
    const htmlFile = template.files.find((f) => f.name === "index.html")
    if (htmlFile) {
      setActiveFile(htmlFile.path)
    }

    setProjectName(template.name)
    addMessage(`Loaded ${template.name} template`, "info")
    setShowTemplateSelector(false)
  }

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
    addMessage(`Switched to ${theme === "dark" ? "light" : "dark"} theme`, "info")
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings)
    addMessage("Settings updated", "info")
  }

  const handleToggleFilePane = () => {
    setShowFilePane((prev) => !prev)
  }

  const handleToggleConsole = () => {
    setShowConsole((prev) => !prev)
  }

  const activeFileContent = getActiveFileContent()
  const activeFileLanguage = activeFile ? detectLanguage(activeFile) : "javascript"

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      <TopNavigation
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSave={handleSave}
        onExport={handleExport}
        onShare={handleShare}
        onFork={handleFork}
        onRun={handleRun}
        onLayoutChange={setLayout}
        currentLayout={layout}
        onNewProject={handleNewProject}
        onOpenTemplates={handleOpenTemplates}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        onOpenSettings={handleOpenSettings}
        showFilePane={showFilePane}
        onToggleFilePane={handleToggleFilePane}
        showConsole={showConsole}
        onToggleConsole={handleToggleConsole}
      />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* File Explorer */}
          {showFilePane && (
            <>
              <Panel defaultSize={15} minSize={10} maxSize={30}>
                <div className="h-full flex flex-col">
                  <div className="px-2 py-2 border-b border-[#2d2d2d] space-y-2">
                    <AssetManager onAssetAdd={handleAssetAdd} />
                    <LibraryManager
                      onLibraryAdd={handleLibraryAdd}
                      addedLibraries={externalLibraries}
                      onLibraryRemove={handleLibraryRemove}
                    />
                    {activeFile && (
                      <CodeFormatter code={activeFileContent} language={activeFileLanguage} onFormat={handleCodeFormat} />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <FileExplorer
                      files={files}
                      activeFile={activeFile}
                      onFileSelect={setActiveFile}
                      onFileCreate={createFile}
                      onFileDelete={removeFile}
                      onFileRename={renameFile}
                    />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="w-1 bg-[#2d2d2d] hover:bg-[#007acc] transition-colors" />
            </>
          )}

          {/* Main Content Area */}
          <Panel defaultSize={85}>
            <PanelGroup direction="vertical">
              {/* Editor and Preview */}
              <Panel defaultSize={70} minSize={30}>
                <PanelGroup direction="horizontal">
                  {/* Code Editor */}
                  {(layout === "split" || layout === "editor") && (
                    <>
                      <Panel defaultSize={layout === "editor" ? 100 : 50} minSize={30}>
                        <CodeEditor
                          value={activeFileContent}
                          onChange={handleFileContentChange}
                          language={activeFileLanguage}
                          path={activeFile || ""}
                          openFiles={openFiles}
                          activeFile={activeFile}
                          onFileSelect={setActiveFile}
                          onFileClose={closeFile}
                          settings={settings}
                        />
                      </Panel>
                      {layout === "split" && (
                        <PanelResizeHandle className="w-1 bg-[#2d2d2d] hover:bg-[#007acc] transition-colors" />
                      )}
                    </>
                  )}

                  {/* Preview */}
                  {(layout === "split" || layout === "preview") && (
                    <Panel defaultSize={layout === "preview" ? 100 : 50} minSize={30}>
                      <PreviewPanel files={files} onConsoleLog={addMessage} externalLibraries={externalLibraries} />
                    </Panel>
                  )}
                </PanelGroup>
              </Panel>

              {showConsole && (
                <>
                  <PanelResizeHandle className="h-1 bg-[#2d2d2d] hover:bg-[#007acc] transition-colors" />

                  {/* Console */}
                  <Panel defaultSize={30} minSize={15} maxSize={50}>
                    <ConsolePanel messages={messages} onClear={clearMessages} />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      <TemplateSelector
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  )
}
