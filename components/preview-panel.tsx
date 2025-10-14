"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileNode } from "@/types/file-system"

interface Library {
  name: string
  url: string
  type: "css" | "js"
  description: string
}

interface PreviewPanelProps {
  files: FileNode[]
  onConsoleLog?: (message: string, type: "log" | "error" | "warn") => void
  externalLibraries?: Library[]
}

type ViewportSize = "mobile" | "tablet" | "desktop"

export function PreviewPanel({ files, onConsoleLog, externalLibraries = [] }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [viewport, setViewport] = useState<ViewportSize>("desktop")
  const previousContentRef = useRef<string>(JSON.stringify(externalLibraries))
  const previousFilesRef = useRef<Map<string, string>>(new Map())
  const isInitialLoadRef = useRef(true)
  const hotReloadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup blob URLs and timeouts on unmount
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
      // Validate message origin and structure
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

          onConsoleLog(message, method as "log" | "error" | "warn")
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onConsoleLog])

  useEffect(() => {
    // Only update preview when file content changes, not when files are just selected
    const relevantFiles = files.filter(file => 
      file.type === 'file' && 
      (file.path.endsWith('.html') || file.path.endsWith('.htm') || 
       file.path.endsWith('.css') || file.path.endsWith('.js'))
    )
    
    // Detect which files changed
    const changedFiles: { path: string; content: string; type: 'html' | 'css' | 'js' }[] = []
    const currentFilesMap = new Map<string, string>()
    
    relevantFiles.forEach(file => {
      if (file.content !== undefined) {
        currentFilesMap.set(file.path, file.content)
        const previousContent = previousFilesRef.current.get(file.path)
        
        if (previousContent !== file.content) {
          let fileType: 'html' | 'css' | 'js' = 'html'
          if (file.path.endsWith('.css')) fileType = 'css'
          else if (file.path.endsWith('.js')) fileType = 'js'
          
          changedFiles.push({ path: file.path, content: file.content, type: fileType })
        }
      }
    })
    
    // Update the reference
    previousFilesRef.current = currentFilesMap
    
    // Check if external libraries changed
    const currentLibsContent = JSON.stringify(externalLibraries)
    const libsChanged = currentLibsContent !== previousContentRef.current
    
    // If it's the initial load or libraries changed, do full reload
    if (isInitialLoadRef.current || libsChanged) {
      previousContentRef.current = currentLibsContent
      isInitialLoadRef.current = false
      
      // Clear any pending hot reload
      if (hotReloadTimeoutRef.current) {
        clearTimeout(hotReloadTimeoutRef.current)
        hotReloadTimeoutRef.current = null
      }
      
      updatePreview(true) // Full reload
    } else if (changedFiles.length > 0) {
      // CSS, JS, or HTML changed - do hot reload with debounce
      if (hotReloadTimeoutRef.current) {
        clearTimeout(hotReloadTimeoutRef.current)
      }
      
      hotReloadTimeoutRef.current = setTimeout(() => {
        hotReloadChanges(changedFiles)
        hotReloadTimeoutRef.current = null
      }, 150) // 150ms debounce for smooth typing with faster feedback
    }
  }, [files, externalLibraries])

  const hotReloadChanges = (changedFiles: { path: string; content: string; type: 'html' | 'css' | 'js' }[]) => {
    if (!iframeRef.current?.contentWindow) return

    try {
      // Collect assets for replacement
      const assetMap = new Map<string, string>()
      const collectAssets = (nodes: FileNode[]) => {
        nodes.forEach((node) => {
          if (node.type === "file" && node.content !== undefined) {
            const isAsset = node.path.startsWith("/assets/") || 
                           (node.content && (
                             node.content.startsWith("data:image/") ||
                             node.content.startsWith("data:application/") ||
                             node.content.startsWith("data:text/")
                           ))
            if (isAsset) {
              assetMap.set(node.path, node.content)
            }
          }
          if (node.type === "folder" && node.children) {
            collectAssets(node.children)
          }
        })
      }
      collectAssets(files)
      
      changedFiles.forEach(file => {
        const fileName = file.path.split("/").pop() || file.path
        let content = file.content
        
        // Replace asset references in HTML and CSS
        if (file.type === 'html' || file.type === 'css') {
          assetMap.forEach((dataUrl, path) => {
            // Replace in img src attributes
            const imgRegex = new RegExp(`<img([^>]*?)src=["']${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'gi')
            content = content.replace(imgRegex, `<img$1src="${dataUrl}"`)
            
            // Replace in CSS url() references
            const cssUrlRegex = new RegExp(`url\\(['"]?${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?\\)`, 'gi')
            content = content.replace(cssUrlRegex, `url('${dataUrl}')`)
          })
        }
        
        if (file.type === 'css') {
          // Update CSS without reload
          iframeRef.current!.contentWindow!.postMessage({
            type: 'hot-reload-css',
            fileName,
            content
          }, '*')
        } else if (file.type === 'js') {
          // Update JS without reload
          iframeRef.current!.contentWindow!.postMessage({
            type: 'hot-reload-js',
            fileName,
            content
          }, '*')
        } else if (file.type === 'html') {
          // Update HTML body content without full reload
          iframeRef.current!.contentWindow!.postMessage({
            type: 'hot-reload-html',
            fileName,
            content
          }, '*')
        }
      })
    } catch (error) {
      // Fallback to full reload on error
      updatePreview(true)
    }
  }

  const updatePreview = (fullReload: boolean = false) => {
    if (!iframeRef.current) return

    try {
      const htmlContent = generateHTMLPreview(files, externalLibraries)
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      // Revoke previous URL to prevent memory leak
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setPreviewUrl(url)
      iframeRef.current.src = url
    } catch (error) {
      onConsoleLog?.(`Preview Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
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

  const getViewportClass = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[375px] mx-auto"
      case "tablet":
        return "max-w-[768px] mx-auto"
      default:
        return "w-full"
    }
  }

  const getViewportLabel = () => {
    switch (viewport) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "100%"
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#2d2d2d]">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#cccccc] font-semibold">Preview</span>
          {viewport !== "desktop" && (
            <span className="text-xs text-[#858585] bg-[#1e1e1e] px-2 py-1 rounded">
              {getViewportLabel()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-[#1e1e1e] rounded p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 hover:bg-[#2d2d2d] cursor-pointer transition-all ${
                viewport === "mobile" 
                  ? "bg-[#0e639c] text-white hover:bg-[#1177bb]" 
                  : "text-[#cccccc] hover:text-white"
              }`}
              onClick={() => setViewport("mobile")}
              title="Mobile view (375px)"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 hover:bg-[#2d2d2d] cursor-pointer transition-all ${
                viewport === "tablet" 
                  ? "bg-[#0e639c] text-white hover:bg-[#1177bb]" 
                  : "text-[#cccccc] hover:text-white"
              }`}
              onClick={() => setViewport("tablet")}
              title="Tablet view (768px)"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 hover:bg-[#2d2d2d] cursor-pointer transition-all ${
                viewport === "desktop" 
                  ? "bg-[#0e639c] text-white hover:bg-[#1177bb]" 
                  : "text-[#cccccc] hover:text-white"
              }`}
              onClick={() => setViewport("desktop")}
              title="Desktop view (100%)"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-5 w-px bg-[#2d2d2d]" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#2d2d2d] text-[#cccccc] cursor-pointer hover:text-white transition-colors"
            onClick={handleRefresh}
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#2d2d2d] text-[#cccccc] cursor-pointer hover:text-white transition-colors"
            onClick={handleOpenInNewTab}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white relative overflow-auto">
        <div className={`h-full ${getViewportClass()} transition-all duration-300 ${viewport !== "desktop" ? "shadow-xl" : ""}`}>
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
            title="Preview"
          />
        </div>
      </div>
    </div>
  )
}

function generateHTMLPreview(files: FileNode[], externalLibraries: Library[]): string {
  const fileMap = new Map<string, string>()
  const assetMap = new Map<string, string>()

  const collectFiles = (nodes: FileNode[]) => {
    nodes.forEach((node) => {
      if (node.type === "file" && node.content !== undefined) {
        fileMap.set(node.path, node.content)
        
        // Collect assets (images and other binary files stored as data URLs)
        const isAsset = node.path.startsWith("/assets/") || 
                       (node.content && (
                         node.content.startsWith("data:image/") ||
                         node.content.startsWith("data:application/") ||
                         node.content.startsWith("data:text/")
                       ))
        
        if (isAsset) {
          assetMap.set(node.path, node.content)
        }
      }
      if (node.type === "folder" && node.children) {
        collectFiles(node.children)
      }
    })
  }

  collectFiles(files)

  // Find HTML file - prioritize index.html but accept any .html file
  let htmlContent = ""
  const htmlPaths = ["/index.html", "/public/index.html", "/src/index.html"]
  
  // First try common paths
  for (const path of htmlPaths) {
    if (fileMap.has(path)) {
      htmlContent = fileMap.get(path) || ""
      break
    }
  }
  
  // If not found, look for any .html or .htm file
  if (!htmlContent) {
    for (const [path, content] of fileMap.entries()) {
      if (path.endsWith(".html") || path.endsWith(".htm")) {
        htmlContent = content
        break
      }
    }
  }

  // If still no HTML found, create a basic template
  if (!htmlContent) {
    htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
</head>
<body>
  <h1>No HTML file found</h1>
  <p>Create an index.html file to see your preview.</p>
</body>
</html>`
  }
  
  // Validate that we have actual HTML content, not CSS or JS
  const trimmedContent = htmlContent.trim()
  const looksLikeHTML = trimmedContent.includes("<html") || trimmedContent.includes("<!DOCTYPE") || trimmedContent.includes("<body") || trimmedContent.includes("<head")
  
  if (!looksLikeHTML) {
    // Content doesn't look like HTML, wrap it
    htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
</head>
<body>
  ${htmlContent}
</body>
</html>`
  }

  let externalLibsHTML = ""
  externalLibraries.forEach((lib) => {
    if (lib.type === "css") {
      externalLibsHTML += `<link rel="stylesheet" href="${lib.url}">\n`
    } else {
      externalLibsHTML += `<script src="${lib.url}"></script>\n`
    }
  })

  // Ensure HTML has proper structure
  if (!htmlContent.includes("</head>")) {
    // Add head tag if missing
    if (htmlContent.includes("<head>")) {
      htmlContent = htmlContent.replace("<head>", "<head>\n</head>")
    } else if (htmlContent.includes("<html>")) {
      htmlContent = htmlContent.replace("<html>", "<html>\n<head>\n</head>")
    } else {
      htmlContent = `<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n${htmlContent}\n</body>\n</html>`
    }
  }

  if (!htmlContent.includes("</body>")) {
    // Add body tag if missing
    if (htmlContent.includes("<body>")) {
      htmlContent = htmlContent.replace("<body>", "<body>\n</body>")
    } else if (htmlContent.includes("</head>")) {
      htmlContent = htmlContent.replace("</head>", "</head>\n<body>\n</body>")
    } else {
      htmlContent = `${htmlContent}\n<body>\n</body>`
    }
  }

  if (externalLibsHTML) {
    htmlContent = htmlContent.replace("</head>", `${externalLibsHTML}</head>`)
  }

  // Process and inject CSS files
  const cssFiles = Array.from(fileMap.entries()).filter(
    ([path]) => path.endsWith(".css") && !path.includes("node_modules"),
  )

  cssFiles.forEach(([path, content]) => {
    const fileName = path.split("/").pop()
    if (!fileName) return
    
    // Skip if content is empty
    if (!content || !content.trim()) return
    
    // Escape special regex characters in filename
    const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const linkRegex = new RegExp(`<link[^>]*href=["'](?:\\.?\\/)?${escapedFileName}["'][^>]*>`, "gi")
    
    // Check if this CSS file is referenced in the HTML
    const isReferenced = htmlContent.match(linkRegex)
    
    if (isReferenced) {
      // Replace the link tag with inline style
      htmlContent = htmlContent.replace(linkRegex, `<style data-file="${fileName}">\n${content}\n</style>`)
    } else if (!htmlContent.includes(content)) {
      // Inject CSS even if not referenced (auto-include all CSS files)
      htmlContent = htmlContent.replace("</head>", `<style data-file="${fileName}">\n${content}\n</style>\n</head>`)
    }
  })

  // Process and inject JS files
  const jsFiles = Array.from(fileMap.entries()).filter(
    ([path]) => path.endsWith(".js") && !path.includes("node_modules"),
  )

  jsFiles.forEach(([path, content]) => {
    const fileName = path.split("/").pop()
    if (!fileName) return
    
    // Skip if content is empty
    if (!content || !content.trim()) return
    
    // Escape special regex characters in filename
    const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const scriptRegex = new RegExp(`<script[^>]*src=["'](?:\\.?\\/)?${escapedFileName}["'][^>]*></script>`, "gi")
    
    // Check if this JS file is referenced in the HTML
    const isReferenced = htmlContent.match(scriptRegex)
    
    if (isReferenced) {
      // Replace the script tag with inline script
      htmlContent = htmlContent.replace(scriptRegex, `<script data-file="${fileName}">\n${content}\n</script>`)
    } else if (!htmlContent.includes(content)) {
      // Inject JS even if not referenced (auto-include all JS files)
      htmlContent = htmlContent.replace("</body>", `<script data-file="${fileName}">\n${content}\n</script>\n</body>`)
    }
  })

  // Create asset mapping script to inject into preview
  const assetMappingScript = `
  <script>
    // Asset mapping for resolving asset paths
    window.__ASSET_MAP__ = ${JSON.stringify(Object.fromEntries(assetMap))};
    
    // Override image loading to use asset map
    (function() {
      const originalImage = window.Image;
      window.Image = function() {
        const img = new originalImage();
        const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        
        Object.defineProperty(img, 'src', {
          get: function() {
            return originalSrcDescriptor.get.call(this);
          },
          set: function(value) {
            // Check if this is an asset path
            if (window.__ASSET_MAP__ && window.__ASSET_MAP__[value]) {
              originalSrcDescriptor.set.call(this, window.__ASSET_MAP__[value]);
            } else {
              originalSrcDescriptor.set.call(this, value);
            }
          }
        });
        
        return img;
      };
      
      // Intercept setAttribute for img tags
      const originalSetAttribute = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, value) {
        if (this.tagName === 'IMG' && name === 'src' && window.__ASSET_MAP__ && window.__ASSET_MAP__[value]) {
          originalSetAttribute.call(this, name, window.__ASSET_MAP__[value]);
        } else {
          originalSetAttribute.call(this, name, value);
        }
      };
      
      // Handle CSS background images
      const originalStyleSetProperty = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
        if ((property === 'background' || property === 'background-image') && typeof value === 'string') {
          // Extract URL from CSS url() function
          const urlMatch = value.match(/url\\(['"]?([^'"\\)]+)['"]?\\)/);
          if (urlMatch && window.__ASSET_MAP__ && window.__ASSET_MAP__[urlMatch[1]]) {
            value = value.replace(urlMatch[1], window.__ASSET_MAP__[urlMatch[1]]);
          }
        }
        return originalStyleSetProperty.call(this, property, value, priority);
      };
    })();
  </script>
  `

  const consoleScript = `
  <script>
    (function() {
      // Ensure window and required objects exist
      if (typeof window === 'undefined' || !window) return;
      
      // Hot reload listener
      window.addEventListener('message', function(event) {
        if (event.data.type === 'hot-reload-css') {
          const fileName = event.data.fileName;
          const content = event.data.content;
          
          // Find existing style tag with this file
          let styleTag = document.querySelector('style[data-file="' + fileName + '"]');
          
          if (styleTag) {
            // Update existing style
            styleTag.textContent = content;
            // console.log('[Hot Reload] Updated CSS:', fileName);
          } else {
            // Create new style tag
            styleTag = document.createElement('style');
            styleTag.setAttribute('data-file', fileName);
            styleTag.textContent = content;
            document.head.appendChild(styleTag);
            // console.log('[Hot Reload] Added CSS:', fileName);
          }
        } else if (event.data.type === 'hot-reload-js') {
          const fileName = event.data.fileName;
          const content = event.data.content;
          
          // For JS, we need to re-execute
          // Remove old script if exists
          const oldScript = document.querySelector('script[data-file="' + fileName + '"]');
          if (oldScript) {
            oldScript.remove();
          }
          
          // Execute new script
          try {
            const script = document.createElement('script');
            script.setAttribute('data-file', fileName);
            script.textContent = content;
            document.body.appendChild(script);
            // console.log('[Hot Reload] Updated JS:', fileName);
          } catch (e) {
            console.error('[Hot Reload] JS execution error:', e);
          }
        } else if (event.data.type === 'hot-reload-html') {
          const content = event.data.content;
          
          try {
            // Save scroll position
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            
            // Parse the new HTML to extract body content
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(content, 'text/html');
            const newBody = newDoc.body;
            
            if (newBody) {
              // Preserve existing scripts and styles (they're managed separately)
              const existingScripts = Array.from(document.querySelectorAll('script[data-file]'));
              const existingStyles = Array.from(document.querySelectorAll('style[data-file]'));
              
              // Update body content
              document.body.innerHTML = newBody.innerHTML;
              
              // Re-append managed scripts and styles
              existingStyles.forEach(function(style) {
                document.head.appendChild(style);
              });
              
              existingScripts.forEach(function(script) {
                // Re-execute scripts
                const newScript = document.createElement('script');
                newScript.setAttribute('data-file', script.getAttribute('data-file'));
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
              });
              
              // Restore scroll position
              window.scrollTo(scrollX, scrollY);
              
              // console.log('[Hot Reload] Updated HTML body');
            }
          } catch (e) {
            console.error('[Hot Reload] HTML update error:', e);
          }
        }
      });
      
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        try {
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({ 
              type: 'console', 
              method: 'log', 
              args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
            }, '*');
          }
        } catch (e) {}
      };
      
      console.error = function(...args) {
        originalError.apply(console, args);
        try {
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({ 
              type: 'console', 
              method: 'error', 
              args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
            }, '*');
          }
        } catch (e) {}
      };
      
      console.warn = function(...args) {
        originalWarn.apply(console, args);
        try {
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({ 
              type: 'console', 
              method: 'warn', 
              args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
            }, '*');
          }
        } catch (e) {}
      };
      
      // Add event listeners only if window exists and has addEventListener
      if (window && window.addEventListener) {
        window.addEventListener('error', (event) => {
          try {
            if (window.parent && window.parent.postMessage) {
              window.parent.postMessage({ 
                type: 'console', 
                method: 'error', 
                args: [event.message + ' at ' + event.filename + ':' + event.lineno]
              }, '*');
            }
          } catch (e) {}
        });
        
        window.addEventListener('unhandledrejection', (event) => {
          try {
            if (window.parent && window.parent.postMessage) {
              window.parent.postMessage({ 
                type: 'console', 
                method: 'error', 
                args: ['Unhandled Promise Rejection: ' + event.reason]
              }, '*');
            }
          } catch (e) {}
        });
      }
    })();
  </script>
  `

  // Replace asset references in HTML with data URLs
  assetMap.forEach((dataUrl, path) => {
    // Replace in img src attributes
    const imgRegex = new RegExp(`<img([^>]*?)src=["']${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'gi')
    htmlContent = htmlContent.replace(imgRegex, `<img$1src="${dataUrl}"`)
    
    // Replace in CSS url() references
    const cssUrlRegex = new RegExp(`url\\(['"]?${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?\\)`, 'gi')
    htmlContent = htmlContent.replace(cssUrlRegex, `url('${dataUrl}')`)
  })

  // Inject asset mapping script and console script before closing body tag
  htmlContent = htmlContent.replace("</body>", `${assetMappingScript}\n${consoleScript}\n</body>`)

  return htmlContent
}
