import type { FileNode } from "@/types/file-system"
import JSZip from "jszip"

interface Library {
  name: string
  url: string
  type: "css" | "js"
  description: string
}

export async function exportProject(files: FileNode[], projectName: string, libraries: Library[] = []) {
  const zip = new JSZip()

  const addFilesToZip = (nodes: FileNode[], folder: JSZip) => {
    nodes.forEach((node) => {
      if (node.type === "file" && node.content !== undefined) {
        const fileName = node.name
        folder.file(fileName, node.content)
      } else if (node.type === "folder" && node.children) {
        const subFolder = folder.folder(node.name)
        if (subFolder) {
          addFilesToZip(node.children, subFolder)
        }
      }
    })
  }

  addFilesToZip(files, zip)

  if (libraries.length > 0) {
    let readmeContent = `# ${projectName}\n\n## External Libraries Used\n\n`
    libraries.forEach((lib) => {
      readmeContent += `- **${lib.name}** (${lib.type.toUpperCase()}): ${lib.url}\n`
    })
    readmeContent += `\n## Usage\n\nOpen index.html in your browser to view the project.\n`
    zip.file("README.md", readmeContent)
  }

  const blob = await zip.generateAsync({ type: "blob" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateShareableLink(files: FileNode[], projectName: string): string {
  // In a real implementation, this would save to a database and return a unique URL
  // For now, we'll encode the project data in the URL (limited by URL length)
  const projectData = {
    name: projectName,
    files: files,
  }

  const encoded = btoa(JSON.stringify(projectData))
  return `${window.location.origin}?project=${encoded}`
}

export function formatCode(code: string, language: string): string {
  // Basic formatting for HTML, CSS, and JS
  if (language === "html") {
    return formatHTML(code)
  } else if (language === "css") {
    return formatCSS(code)
  } else if (language === "javascript") {
    return formatJS(code)
  }
  return code
}

function formatHTML(html: string): string {
  let formatted = ""
  let indent = 0
  const tab = "  "

  html.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) indent--
    formatted += tab.repeat(indent) + "<" + node + ">\n"
    if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith("input")) indent++
  })

  return formatted.substring(1, formatted.length - 2)
}

function formatCSS(css: string): string {
  return css
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n\n")
    .trim()
}

function formatJS(js: string): string {
  // Basic JS formatting
  return js.replace(/;/g, ";\n").replace(/{/g, " {\n  ").replace(/}/g, "\n}\n").trim()
}

export function validateHTML(html: string): Array<{ line: number; message: string; type: "error" | "warning" }> {
  const issues: Array<{ line: number; message: string; type: "error" | "warning" }> = []
  const lines = html.split("\n")

  lines.forEach((line, index) => {
    // Check for unclosed tags
    const openTags = line.match(/<(\w+)[^>]*>/g) || []
    const closeTags = line.match(/<\/(\w+)>/g) || []

    if (openTags.length > closeTags.length) {
      const tagName = openTags[0].match(/<(\w+)/)?.[1]
      if (tagName && !["img", "br", "hr", "input", "meta", "link"].includes(tagName)) {
        issues.push({
          line: index + 1,
          message: `Possible unclosed tag: ${tagName}`,
          type: "warning",
        })
      }
    }

    // Check for missing alt attributes on images
    if (line.includes("<img") && !line.includes("alt=")) {
      issues.push({
        line: index + 1,
        message: "Image missing alt attribute",
        type: "warning",
      })
    }
  })

  return issues
}
