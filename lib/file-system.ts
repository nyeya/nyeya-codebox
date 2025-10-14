import type { FileNode } from "@/types/file-system"

export function findFileByPath(files: FileNode[], path: string): FileNode | null {
  for (const file of files) {
    if (file.path === path) {
      return file
    }
    if (file.type === "folder" && file.children) {
      const found = findFileByPath(file.children, path)
      if (found) return found
    }
  }
  return null
}

export function updateFileContent(files: FileNode[], path: string, content: string): FileNode[] {
  return files.map((file) => {
    if (file.path === path) {
      return { ...file, content }
    }
    if (file.type === "folder" && file.children) {
      return {
        ...file,
        children: updateFileContent(file.children, path, content),
      }
    }
    return file
  })
}

export function addFile(files: FileNode[], parentPath: string, newFile: FileNode): FileNode[] {
  if (parentPath === "/") {
    return [...files, newFile]
  }

  return files.map((file) => {
    if (file.path === parentPath && file.type === "folder") {
      return {
        ...file,
        children: [...(file.children || []), newFile],
      }
    }
    if (file.type === "folder" && file.children) {
      return {
        ...file,
        children: addFile(file.children, parentPath, newFile),
      }
    }
    return file
  })
}

export function deleteFile(files: FileNode[], path: string): FileNode[] {
  return files
    .filter((file) => file.path !== path)
    .map((file) => {
      if (file.type === "folder" && file.children) {
        return {
          ...file,
          children: deleteFile(file.children, path),
        }
      }
      return file
    })
}

export function getFileExtension(filename: string): string {
  const parts = filename.split(".")
  return parts.length > 1 ? parts[parts.length - 1] : ""
}

export function renameFile(files: FileNode[], oldPath: string, newName: string): FileNode[] {
  // Helper function to update paths recursively
  const updatePaths = (node: FileNode, oldBasePath: string, newBasePath: string): FileNode => {
    const updatedPath = node.path.replace(oldBasePath, newBasePath)
    
    if (node.type === "folder" && node.children) {
      return {
        ...node,
        path: updatedPath,
        name: node.path === oldBasePath ? newName : node.name,
        children: node.children.map(child => updatePaths(child, oldBasePath, newBasePath))
      }
    }
    
    return {
      ...node,
      path: updatedPath,
      name: node.path === oldBasePath ? newName : node.name
    }
  }

  return files.map((file) => {
    if (file.path === oldPath) {
      // Calculate new path
      const pathParts = oldPath.split("/")
      pathParts[pathParts.length - 1] = newName
      const newPath = pathParts.join("/")
      
      return updatePaths(file, oldPath, newPath)
    }
    
    if (file.type === "folder" && file.children) {
      return {
        ...file,
        children: renameFile(file.children, oldPath, newName),
      }
    }
    
    return file
  })
}

export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename)
  const iconMap: Record<string, string> = {
    js: "📄",
    jsx: "⚛️",
    ts: "📘",
    tsx: "⚛️",
    html: "🌐",
    css: "🎨",
    json: "📋",
    md: "📝",
  }
  return iconMap[ext] || "📄"
}
