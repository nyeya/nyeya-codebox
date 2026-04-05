import type { FileNode } from "@/types/file-system"
import JSZip from "jszip"
import LZString from "lz-string"

export interface Library {
  name: string
  url: string
  type: "css" | "js"
  description: string
}

/**
 * Export project as a standard ZIP file with README and external dependencies
 */
export async function exportProject(files: FileNode[], projectName: string, libraries: Library[] = []) {
  const zip = new JSZip()

  const addFilesToZip = (nodes: FileNode[], folder: JSZip) => {
    nodes.forEach((node) => {
      if (node.type === "file" && node.content !== undefined) {
        // If it's a data URL asset, convert to binary
        if (node.content.startsWith("data:") && node.content.includes(";base64,")) {
          const base64Data = node.content.split(";base64,")[1]
          folder.file(node.name, base64Data, { base64: true })
        } else {
          folder.file(node.name, node.content)
        }
      } else if (node.type === "folder" && node.children) {
        const subFolder = folder.folder(node.name)
        if (subFolder) {
          addFilesToZip(node.children, subFolder)
        }
      }
    })
  }

  addFilesToZip(files, zip)

  // Generate README
  let readmeContent = `# ${projectName}\n\nCreated with **Nyeya CodeBox v2.0** — Ultramodern Cloud Web Studio.\n\n`
  if (libraries.length > 0) {
    readmeContent += `## External CDN Dependencies\n\n`
    libraries.forEach((lib) => {
      readmeContent += `- **${lib.name}** (${lib.type.toUpperCase()}): \`${lib.url}\`\n`
    })
    readmeContent += `\n`
  }
  readmeContent += `## Getting Started\n\n1. Open \`index.html\` directly in any modern browser, or\n2. Run a local static server: \`npx serve .\`\n`
  zip.file("README.md", readmeContent)

  const blob = await zip.generateAsync({ type: "blob" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-export.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export project as a Single Standalone Portable HTML file
 */
export function exportStandaloneHTML(files: FileNode[], projectName: string, libraries: Library[] = []) {
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

  let htmlContent = fileMap.get("/index.html") || fileMap.get("index.html") || ""
  if (!htmlContent) {
    for (const [path, content] of fileMap.entries()) {
      if (path.endsWith(".html")) {
        htmlContent = content
        break
      }
    }
  }

  if (!htmlContent) {
    htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${projectName}</title></head><body><h1>${projectName}</h1></body></html>`
  }

  // Inject External Libraries
  let libsHTML = ""
  libraries.forEach((lib) => {
    if (lib.type === "css") {
      libsHTML += `<link rel="stylesheet" href="${lib.url}">\n`
    } else {
      libsHTML += `<script src="${lib.url}"></script>\n`
    }
  })

  // Inline CSS
  const cssFiles = Array.from(fileMap.entries()).filter(([path]) => path.endsWith(".css"))
  let inlinedCSS = ""
  cssFiles.forEach(([path, content]) => {
    inlinedCSS += `/* Inlined: ${path} */\n${content}\n`
  })

  // Inline JS
  const jsFiles = Array.from(fileMap.entries()).filter(([path]) => path.endsWith(".js") || path.endsWith(".ts"))
  let inlinedJS = ""
  jsFiles.forEach(([path, content]) => {
    inlinedJS += `// Inlined: ${path}\n${content}\n`
  })

  // Replace assets in HTML & CSS
  assetMap.forEach((dataUrl, path) => {
    const regex = new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
    htmlContent = htmlContent.replace(regex, dataUrl)
    inlinedCSS = inlinedCSS.replace(regex, dataUrl)
  })

  // Inject into HTML
  if (libsHTML && htmlContent.includes("<head>")) {
    htmlContent = htmlContent.replace("<head>", `<head>\n${libsHTML}`)
  }
  if (inlinedCSS) {
    if (htmlContent.includes("</head>")) {
      htmlContent = htmlContent.replace("</head>", `<style>\n${inlinedCSS}\n</style>\n</head>`)
    } else {
      htmlContent = `<style>\n${inlinedCSS}\n</style>\n` + htmlContent
    }
  }
  if (inlinedJS) {
    if (htmlContent.includes("</body>")) {
      htmlContent = htmlContent.replace("</body>", `<script>\n${inlinedJS}\n</script>\n</body>`)
    } else {
      htmlContent = htmlContent + `\n<script>\n${inlinedJS}\n</script>`
    }
  }

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-standalone.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Import a ZIP file and convert to FileNode hierarchy
 */
export async function importProjectFromZip(file: File): Promise<{ name: string; files: FileNode[] }> {
  const zip = await JSZip.loadAsync(file)
  const projectName = file.name.replace(/\.zip$/i, "")
  const fileNodes: FileNode[] = []

  const pathMap = new Map<string, FileNode>()

  // Helper to ensure directory node exists
  const getOrCreateFolder = (folderPath: string): FileNode => {
    if (folderPath === "" || folderPath === "/") return { id: "root", name: "root", type: "folder", path: "/" }
    if (pathMap.has(folderPath)) return pathMap.get(folderPath)!

    const parts = folderPath.split("/").filter(Boolean)
    const folderName = parts[parts.length - 1]
    const parentPath = "/" + parts.slice(0, -1).join("/")

    const folderNode: FileNode = {
      id: "folder_" + Math.random().toString(36).substring(2, 9),
      name: folderName,
      type: "folder",
      path: folderPath.startsWith("/") ? folderPath : "/" + folderPath,
      children: [],
    }

    pathMap.set(folderPath, folderNode)

    if (parentPath === "/" || parentPath === "") {
      fileNodes.push(folderNode)
    } else {
      const parent = getOrCreateFolder(parentPath)
      if (parent.children && !parent.children.some((c) => c.path === folderNode.path)) {
        parent.children.push(folderNode)
      }
    }

    return folderNode
  }

  const entries = Object.keys(zip.files)
  for (const relativePath of entries) {
    const zipEntry = zip.files[relativePath]
    const cleanPath = relativePath.replace(/\\/g, "/")
    if (cleanPath.endsWith("/")) {
      // directory
      getOrCreateFolder("/" + cleanPath.slice(0, -1))
      continue
    }

    const parts = cleanPath.split("/")
    const fileName = parts[parts.length - 1]
    const parentDir = "/" + parts.slice(0, -1).join("/")

    let content: string
    const isImage = /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(fileName)

    if (isImage) {
      const base64 = await zipEntry.async("base64")
      const ext = fileName.split(".").pop()?.toLowerCase() || "png"
      const mime = ext === "svg" ? "image/svg+xml" : `image/${ext}`
      content = `data:${mime};base64,${base64}`
    } else {
      content = await zipEntry.async("string")
    }

    const fileNode: FileNode = {
      id: "file_" + Math.random().toString(36).substring(2, 9),
      name: fileName,
      type: "file",
      path: (parentDir === "/" ? "" : parentDir) + "/" + fileName,
      content,
    }

    if (parentDir === "/" || parentDir === "") {
      fileNodes.push(fileNode)
    } else {
      const parent = getOrCreateFolder(parentDir)
      if (parent.children) {
        parent.children.push(fileNode)
      }
    }
  }

  return { name: projectName, files: fileNodes }
}

/**
 * Generate compressed shareable URL using LZ-String
 */
export function generateShareableLink(files: FileNode[], projectName: string, libraries: Library[] = []): string {
  // Strip heavy data: URLs from share link to avoid browser URL length limits
  const cleanFiles = (nodes: FileNode[]): FileNode[] => {
    return nodes
      .map((node) => {
        if (node.type === "folder" && node.children) {
          if (node.path === "/assets") return null
          return { ...node, children: cleanFiles(node.children) }
        }
        if (node.path.startsWith("/assets/")) return null
        return node
      })
      .filter((n): n is FileNode => n !== null)
  }

  const payload = {
    n: projectName,
    f: cleanFiles(files),
    l: libraries,
    v: 2,
  }

  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload))
  if (typeof window !== "undefined") {
    return `${window.location.origin}${window.location.pathname}?code=${compressed}`
  }
  return `?code=${compressed}`
}

/**
 * Decode project from shareable URL
 */
export function decodeShareableLink(searchParams: string): { name: string; files: FileNode[]; libraries: Library[] } | null {
  try {
    const params = new URLSearchParams(searchParams)
    const code = params.get("code") || params.get("project")
    if (!code) return null

    let json = ""
    if (params.has("code")) {
      json = LZString.decompressFromEncodedURIComponent(code) || ""
    } else if (params.has("project")) {
      json = atob(code)
    }

    if (!json) return null
    const data = JSON.parse(json)

    if (data.v === 2) {
      return {
        name: data.n || "Shared Project",
        files: data.f || [],
        libraries: data.l || [],
      }
    }

    return {
      name: data.name || "Shared Project",
      files: data.files || [],
      libraries: data.libraries || [],
    }
  } catch (error) {
    console.error("Failed to decode project link", error)
    return null
  }
}

/**
 * Format code using safe in-browser formatting engine
 */
export function formatCode(code: string, language: string): string {
  if (!code || !code.trim()) return code

  switch (language) {
    case "html":
    case "htm":
      return formatHTML(code)
    case "css":
    case "scss":
    case "sass":
      return formatCSS(code)
    case "json":
      return formatJSON(code)
    case "javascript":
    case "typescript":
    case "jsx":
    case "tsx":
      return formatJS(code)
    default:
      return code
  }
}

function formatHTML(html: string): string {
  let formatted = ""
  let indent = 0
  const tab = "  "
  
  // Normalize self-closing tags and clean up spacing between tags
  const clean = html.trim().replace(/>\s*</g, "><")
  const tokens = clean.split(/(?=[<])|(?<=>)/g)

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim()
    if (!token) continue

    if (token.startsWith("</")) {
      indent = Math.max(0, indent - 1)
      formatted += tab.repeat(indent) + token + "\n"
    } else if (token.startsWith("<") && !token.endsWith("/>") && !token.startsWith("<!") && !isVoidTag(token)) {
      formatted += tab.repeat(indent) + token + "\n"
      if (!token.includes("</")) {
        indent++
      }
    } else {
      formatted += tab.repeat(indent) + token + "\n"
    }
  }

  return formatted.trim()
}

function isVoidTag(tag: string): boolean {
  const match = tag.match(/<([a-zA-Z0-9-]+)/)
  if (!match) return false
  const name = match[1].toLowerCase()
  return ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"].includes(name)
}

function formatCSS(css: string): string {
  let indent = 0
  const tab = "  "
  const lines = css
    .replace(/\{/g, " {\n")
    .replace(/\}/g, "\n}\n")
    .replace(/;/g, ";\n")
    .split("\n")

  const result: string[] = []
  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    if (line.startsWith("}")) {
      indent = Math.max(0, indent - 1)
    }

    result.push(tab.repeat(indent) + line)

    if (line.endsWith("{")) {
      indent++
    }
  }

  return result.join("\n").replace(/\n\s*\n\s*\n/g, "\n\n").trim()
}

function formatJSON(json: string): string {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return json
  }
}

function formatJS(js: string): string {
  // If valid JSON, pretty print
  if (js.trim().startsWith("{") || js.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(js)
      return JSON.stringify(parsed, null, 2)
    } catch {}
  }

  let indent = 0
  const tab = "  "
  const lines = js
    .replace(/\{/g, " {\n")
    .replace(/\}/g, "\n}\n")
    .replace(/;/g, ";\n")
    .split("\n")

  const result: string[] = []
  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    if (line.startsWith("}") || line.startsWith("]")) {
      indent = Math.max(0, indent - 1)
    }

    result.push(tab.repeat(indent) + line)

    if (line.endsWith("{") || line.endsWith("[")) {
      indent++
    }
  }

  return result.join("\n").replace(/\n\s*\n\s*\n/g, "\n\n").trim()
}


