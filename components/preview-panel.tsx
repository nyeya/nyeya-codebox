"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  RefreshCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileNode } from "@/types/file-system"
import type { Library } from "@/lib/export-project"

interface PreviewPanelProps {
  files: FileNode[]
  onConsoleLog?: (message: string, type: "log" | "error" | "warn" | "info") => void
  externalLibraries?: Library[]
}

type ViewportPreset = "desktop" | "laptop" | "tablet" | "mobile"

export function PreviewPanel({ files, onConsoleLog, externalLibraries = [] }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [viewport, setViewport] = useState<ViewportPreset>("desktop")
  const [isLandscape, setIsLandscape] = useState<boolean>(false)
  const [zoomScale, setZoomScale] = useState<number>(100)
  const [isReloading, setIsReloading] = useState<boolean>(false)

  const previousContentRef = useRef<string>(JSON.stringify(externalLibraries))
  const previousFilesRef = useRef<Map<string, string>>(new Map())
  const isInitialLoadRef = useRef<boolean>(true)
  const hotReloadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      if (hotReloadTimeoutRef.current) {
        clearTimeout(hotReloadTimeoutRef.current)
      }
    }
  }, [previewUrl])

  // Listen for console messages from iframe
  useEffect(() => {
    if (!onConsoleLog) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "console") {
        const { method, args } = event.data
        if (method && args && Array.isArray(args)) {
          const message = args
            .map((arg: any) => {
              if (typeof arg === "object") {
                try {
                  return JSON.stringify(arg, null, 2)
                } catch {
                  return String(arg)
                }
              }
              return String(arg)
            })
            .join(" ")

          onConsoleLog(message, method as "log" | "error" | "warn" | "info")
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onConsoleLog])

  // React to file changes
  useEffect(() => {
    const relevantFiles = files.filter(
      (file) =>
        file.type === "file" &&
        (file.path.endsWith(".html") ||
          file.path.endsWith(".htm") ||
          file.path.endsWith(".css") ||
          file.path.endsWith(".js") ||
          file.path.endsWith(".ts") ||
          file.path.endsWith(".jsx") ||
          file.path.endsWith(".tsx"))
    )

    const changedFiles: { path: string; content: string; type: "html" | "css" | "js" }[] = []
    const currentFilesMap = new Map<string, string>()

    relevantFiles.forEach((file) => {
      if (file.content !== undefined) {
        currentFilesMap.set(file.path, file.content)
        const previousContent = previousFilesRef.current.get(file.path)

        if (previousContent !== file.content) {
          let fileType: "html" | "css" | "js" = "html"
          if (file.path.endsWith(".css")) fileType = "css"
          else if (file.path.endsWith(".js") || file.path.endsWith(".ts") || file.path.endsWith(".jsx") || file.path.endsWith(".tsx")) {
            fileType = "js"
          }

          changedFiles.push({ path: file.path, content: file.content, type: fileType })
        }
      }
    })

    previousFilesRef.current = currentFilesMap

    const currentLibsContent = JSON.stringify(externalLibraries)
    const libsChanged = currentLibsContent !== previousContentRef.current

    if (isInitialLoadRef.current || libsChanged) {
      previousContentRef.current = currentLibsContent
      isInitialLoadRef.current = false
      if (hotReloadTimeoutRef.current) {
        clearTimeout(hotReloadTimeoutRef.current)
        hotReloadTimeoutRef.current = null
      }
      updatePreview(true)
    } else if (changedFiles.length > 0) {
      if (hotReloadTimeoutRef.current) {
        clearTimeout(hotReloadTimeoutRef.current)
      }
      hotReloadTimeoutRef.current = setTimeout(() => {
        hotReloadChanges(changedFiles)
        hotReloadTimeoutRef.current = null
      }, 150)
    }
  }, [files, externalLibraries])

  const hotReloadChanges = (changedFiles: { path: string; content: string; type: "html" | "css" | "js" }[]) => {
    if (!iframeRef.current?.contentWindow) return

    try {
      changedFiles.forEach((file) => {
        const fileName = file.path.split("/").pop() || file.path
        let content = file.content

        if (file.type === "css") {
          iframeRef.current!.contentWindow!.postMessage(
            {
              type: "hot-reload-css",
              fileName,
              content,
            },
            "*"
          )
        } else if (file.type === "js") {
          iframeRef.current!.contentWindow!.postMessage(
            {
              type: "hot-reload-js",
              fileName,
              content,
            },
            "*"
          )
        } else if (file.type === "html") {
          iframeRef.current!.contentWindow!.postMessage(
            {
              type: "hot-reload-html",
              fileName,
              content,
            },
            "*"
          )
        }
      })
    } catch {
      updatePreview(true)
    }
  }

  const updatePreview = (fullReload: boolean = false) => {
    if (!iframeRef.current) return
    setIsReloading(true)

    try {
      const htmlContent = generateHTMLPreview(files, externalLibraries)
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setPreviewUrl(url)
      iframeRef.current.src = url
    } catch (error) {
      onConsoleLog?.(`Preview Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    } finally {
      setTimeout(() => setIsReloading(false), 300)
    }
  }

  const handleRefresh = () => {
    isInitialLoadRef.current = true
    updatePreview(true)
  }

  const handleOpenInNewTab = () => {
    if (!previewUrl) {
      onConsoleLog?.("No preview available to open", "warn")
      return
    }
    window.open(previewUrl, "_blank")
  }

  const getViewportStyles = () => {
    if (viewport === "desktop") return { width: "100%", height: "100%" }

    let w = 375
    let h = 667

    if (viewport === "mobile") {
      w = isLandscape ? 667 : 375
      h = isLandscape ? 375 : 667
    } else if (viewport === "tablet") {
      w = isLandscape ? 1024 : 768
      h = isLandscape ? 768 : 1024
    } else if (viewport === "laptop") {
      w = isLandscape ? 1280 : 1024
      h = isLandscape ? 800 : 768
    }

    return {
      width: `${w}px`,
      height: `${h}px`,
      maxHeight: "96%",
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#09090b] overflow-hidden">
      {/* Preview Header Bar */}
      <div className="flex-none h-10 px-3 bg-[#121215] border-b border-white/[0.08] flex items-center justify-between gap-2 select-none z-10">
        {/* Left: Viewport Switchers */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 bg-[#18181b] p-0.5 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "desktop"
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport("laptop")}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "laptop"
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Laptop View (1024px)"
            >
              <Laptop className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "tablet"
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "mobile"
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {viewport !== "desktop" && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className={`p-1.5 rounded-lg border border-white/[0.08] text-xs transition-colors ${
                isLandscape ? "bg-indigo-600/20 text-indigo-300" : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Toggle Portrait / Landscape"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Center: Fake Browser URL Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#18181b] border border-white/[0.08] text-[11px] text-zinc-400 flex-1 max-w-xs truncate">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="truncate font-mono">localhost:3000/sandbox</span>
        </div>

        {/* Right: Zoom & Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-[#18181b] p-0.5 rounded-lg border border-white/[0.08] hidden md:flex">
            <button
              onClick={() => setZoomScale(Math.max(50, zoomScale - 10))}
              className="p-1 text-zinc-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="text-[10px] font-mono text-zinc-400 px-1">{zoomScale}%</span>
            <button
              onClick={() => setZoomScale(Math.min(150, zoomScale + 10))}
              className="p-1 text-zinc-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className={`h-7 w-7 text-zinc-400 hover:text-white hover:bg-white/[0.08] ${isReloading ? "animate-spin text-indigo-400" : ""}`}
            title="Reload Sandbox"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenInNewTab}
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-white/[0.08]"
            title="Open Live Preview in New Window"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-[#09090b] relative flex items-center justify-center p-2 overflow-auto">
        <div
          style={{
            ...getViewportStyles(),
            transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : undefined,
            transformOrigin: "center center",
          }}
          className={`transition-all duration-200 bg-white relative ${
            viewport !== "desktop"
              ? "rounded-2xl shadow-2xl border-4 border-zinc-800 ring-1 ring-white/10 overflow-hidden"
              : "w-full h-full"
          }`}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin allow-downloads"
            title="Live Preview Sandbox"
          />
        </div>
      </div>
    </div>
  )
}

function generateHTMLPreview(files: FileNode[], externalLibraries: Library[]): string {
  const fileMap = new Map<string, string>()
  const assetMap = new Map<string, string>()

  const collect = (nodes: FileNode[]) => {
    nodes.forEach((node) => {
      if (node.type === "file" && node.content !== undefined) {
        fileMap.set(node.path, node.content)
        if (node.path.startsWith("/assets/") || node.content.startsWith("data:")) {
          assetMap.set(node.path, node.content)
        }
      }
      if (node.type === "folder" && node.children) {
        collect(node.children)
      }
    })
  }
  collect(files)

  // Find HTML
  let htmlContent = fileMap.get("/index.html") || fileMap.get("index.html") || ""
  if (!htmlContent) {
    for (const [path, content] of fileMap.entries()) {
      if (path.endsWith(".html") || path.endsWith(".htm")) {
        htmlContent = content
        break
      }
    }
  }

  if (!htmlContent) {
    htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body style="background:#09090b;color:#f4f4f5;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h2>No HTML file found</h2></body></html>`
  }

  // Format external libraries
  let externalLibsHTML = ""
  externalLibraries.forEach((lib) => {
    if (lib.type === "css") {
      externalLibsHTML += `<link rel="stylesheet" href="${lib.url}">\n`
    } else {
      externalLibsHTML += `<script src="${lib.url}"></script>\n`
    }
  })

  // Head and body structuring
  if (!htmlContent.includes("<head>")) {
    htmlContent = `<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>\n` + htmlContent
  }
  if (externalLibsHTML) {
    htmlContent = htmlContent.replace("</head>", `${externalLibsHTML}\n</head>`)
  }

  // Inject CSS
  const cssFiles = Array.from(fileMap.entries()).filter(([path]) => path.endsWith(".css"))
  cssFiles.forEach(([path, content]) => {
    const fileName = path.split("/").pop() || ""
    if (!content.trim()) return
    const linkRegex = new RegExp(`<link[^>]*href=["'](?:\\.?\\/)?${fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`, "gi")
    if (htmlContent.match(linkRegex)) {
      htmlContent = htmlContent.replace(linkRegex, `<style data-file="${fileName}">\n${content}\n</style>`)
    } else {
      htmlContent = htmlContent.replace("</head>", `<style data-file="${fileName}">\n${content}\n</style>\n</head>`)
    }
  })

  // Inject JS
  const jsFiles = Array.from(fileMap.entries()).filter(([path]) => path.endsWith(".js") || path.endsWith(".ts"))
  jsFiles.forEach(([path, content]) => {
    const fileName = path.split("/").pop() || ""
    if (!content.trim()) return
    const scriptRegex = new RegExp(`<script[^>]*src=["'](?:\\.?\\/)?${fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*></script>`, "gi")
    if (htmlContent.match(scriptRegex)) {
      htmlContent = htmlContent.replace(scriptRegex, `<script data-file="${fileName}">\n${content}\n</script>`)
    } else {
      htmlContent = htmlContent.replace("</body>", `<script data-file="${fileName}">\n${content}\n</script>\n</body>`)
    }
  })

  // Asset mapping script & Live console interceptor
  const bridgeScript = `
  <script>
    window.__ASSET_MAP__ = ${JSON.stringify(Object.fromEntries(assetMap))};

    // Asset interceptor
    (function() {
      const originalImage = window.Image;
      window.Image = function() {
        const img = new originalImage();
        const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(img, 'src', {
          get: function() { return originalSrcDescriptor.get.call(this); },
          set: function(val) {
            if (window.__ASSET_MAP__ && window.__ASSET_MAP__[val]) {
              originalSrcDescriptor.set.call(this, window.__ASSET_MAP__[val]);
            } else {
              originalSrcDescriptor.set.call(this, val);
            }
          }
        });
        return img;
      };

      const originalSetAttr = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, val) {
        if (this.tagName === 'IMG' && name === 'src' && window.__ASSET_MAP__ && window.__ASSET_MAP__[val]) {
          originalSetAttr.call(this, name, window.__ASSET_MAP__[val]);
        } else {
          originalSetAttr.call(this, name, val);
        }
      };
    })();

    // Live Hot Reload Listener & REPL Eval
    window.addEventListener('message', function(event) {
      if (!event.data) return;

      if (event.data.type === 'hot-reload-css') {
        let styleTag = document.querySelector('style[data-file="' + event.data.fileName + '"]');
        if (styleTag) {
          styleTag.textContent = event.data.content;
        } else {
          styleTag = document.createElement('style');
          styleTag.setAttribute('data-file', event.data.fileName);
          styleTag.textContent = event.data.content;
          document.head.appendChild(styleTag);
        }
      } else if (event.data.type === 'hot-reload-js') {
        const oldScript = document.querySelector('script[data-file="' + event.data.fileName + '"]');
        if (oldScript) oldScript.remove();
        try {
          const script = document.createElement('script');
          script.setAttribute('data-file', event.data.fileName);
          script.textContent = event.data.content;
          document.body.appendChild(script);
        } catch (e) {
          console.error('[Live JS Error]:', e);
        }
      } else if (event.data.type === 'eval-repl') {
        try {
          const result = window.eval(event.data.expression);
          console.log('[REPL Result]:', result);
        } catch (err) {
          console.error('[REPL Error]:', err.message);
        }
      }
    });

    // Console Logging Bridge
    (function() {
      const sendConsole = (method, args) => {
        try {
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({
              type: 'console',
              method: method,
              args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
            }, '*');
          }
        } catch (e) {}
      };

      const origLog = console.log;
      const origError = console.error;
      const origWarn = console.warn;
      const origInfo = console.info;

      console.log = function(...args) { origLog.apply(console, args); sendConsole('log', args); };
      console.error = function(...args) { origError.apply(console, args); sendConsole('error', args); };
      console.warn = function(...args) { origWarn.apply(console, args); sendConsole('warn', args); };
      console.info = function(...args) { origInfo.apply(console, args); sendConsole('info', args); };

      window.addEventListener('error', (e) => sendConsole('error', [e.message + ' (' + e.filename + ':' + e.lineno + ')']));
      window.addEventListener('unhandledrejection', (e) => sendConsole('error', ['Unhandled Promise: ' + e.reason]));
    })();
  </script>
  `

  // Replace assets in HTML
  assetMap.forEach((dataUrl, path) => {
    const regex = new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
    htmlContent = htmlContent.replace(regex, dataUrl)
  })

  if (htmlContent.includes("</body>")) {
    htmlContent = htmlContent.replace("</body>", `${bridgeScript}\n</body>`)
  } else {
    htmlContent = htmlContent + `\n${bridgeScript}`
  }

  return htmlContent
}
