"use client"

import { useState, useCallback } from "react"
import type { FileNode, FileSystemState } from "@/types/file-system"
import { addFile, deleteFile, updateFileContent, findFileByPath, renameFile } from "@/lib/file-system"

const defaultFiles: FileNode[] = [
  {
    id: "1",
    name: "index.html",
    type: "file",
    path: "/index.html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <p>Start building your project here.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
  },
  {
    id: "2",
    name: "style.css",
    type: "file",
    path: "/style.css",
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

p {
  font-size: 1.2rem;
  color: #666;
}`,
  },
  {
    id: "3",
    name: "script.js",
    type: "file",
    path: "/script.js",
    content: `// Your JavaScript code here
console.log('Project initialized!');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
});`,
  },
]

export function useFileSystem() {
  const [state, setState] = useState<FileSystemState>({
    files: defaultFiles,
    activeFile: "/index.html",
    openFiles: ["/index.html"],
  })

  const loadFiles = useCallback((newFiles: FileNode[]) => {
    setState({
      files: newFiles,
      activeFile: newFiles[0]?.path || null,
      openFiles: newFiles[0]?.path ? [newFiles[0].path] : [],
    })
  }, [])

  const resetFiles = useCallback(() => {
    setState({
      files: defaultFiles,
      activeFile: "/index.html",
      openFiles: ["/index.html"],
    })
  }, [])

  const setActiveFile = useCallback((path: string) => {
    setState((prev) => {
      // Ensure the file exists before setting it as active
      const fileExists = findFileByPath(prev.files, path)
      if (!fileExists) {
        return prev
      }
      
      return {
        ...prev,
        activeFile: path,
        openFiles: prev.openFiles.includes(path) ? prev.openFiles : [...prev.openFiles, path],
      }
    })
  }, [])

  const closeFile = useCallback((path: string) => {
    setState((prev) => {
      const newOpenFiles = prev.openFiles.filter((f) => f !== path)
      const newActiveFile = prev.activeFile === path ? newOpenFiles[newOpenFiles.length - 1] || null : prev.activeFile

      return {
        ...prev,
        openFiles: newOpenFiles,
        activeFile: newActiveFile,
      }
    })
  }, [])

  const updateFile = useCallback((path: string, content: string) => {
    setState((prev) => {
      // Ensure the file exists before updating
      const fileExists = findFileByPath(prev.files, path)
      if (!fileExists) {
        return prev
      }
      
      const updatedFiles = updateFileContent(prev.files, path, content)
      
      return {
        ...prev,
        files: updatedFiles,
      }
    })
  }, [])

  const createFile = useCallback((parentPath: string, name: string, type: "file" | "folder", initialContent?: string) => {
    const id = Date.now().toString()
    const path = parentPath === "/" ? `/${name}` : `${parentPath}/${name}`
    const newFile: FileNode = {
      id,
      name,
      type,
      path,
      content: type === "file" ? (initialContent ?? "") : undefined,
      children: type === "folder" ? [] : undefined,
    }

    setState((prev) => ({
      ...prev,
      files: addFile(prev.files, parentPath, newFile),
    }))
  }, [])

  const removeFile = useCallback((path: string) => {
    setState((prev) => ({
      ...prev,
      files: deleteFile(prev.files, path),
      openFiles: prev.openFiles.filter((f) => f !== path),
      activeFile: prev.activeFile === path ? null : prev.activeFile,
    }))
  }, [])

  const renameFileOrFolder = useCallback((oldPath: string, newName: string) => {
    setState((prev) => {
      const renamedFiles = renameFile(prev.files, oldPath, newName)
      
      // Calculate new path
      const pathParts = oldPath.split("/")
      pathParts[pathParts.length - 1] = newName
      const newPath = pathParts.join("/")
      
      // Update open files and active file if they reference the renamed file or its children
      const updatePathInList = (paths: string[]) => {
        return paths.map(p => {
          if (p === oldPath) return newPath
          if (p.startsWith(oldPath + "/")) {
            return p.replace(oldPath, newPath)
          }
          return p
        })
      }
      
      return {
        ...prev,
        files: renamedFiles,
        openFiles: updatePathInList(prev.openFiles),
        activeFile: prev.activeFile ? updatePathInList([prev.activeFile])[0] : null,
      }
    })
  }, [])

  const getActiveFileContent = useCallback(() => {
    if (!state.activeFile) return ""
    const file = findFileByPath(state.files, state.activeFile)
    return file?.content || ""
  }, [state.activeFile, state.files])

  const getFileByPath = useCallback(
    (path: string) => {
      return findFileByPath(state.files, path)
    },
    [state.files],
  )

  return {
    files: state.files,
    activeFile: state.activeFile,
    openFiles: state.openFiles,
    setActiveFile,
    closeFile,
    updateFile,
    createFile,
    removeFile,
    renameFile: renameFileOrFolder,
    getActiveFileContent,
    getFileByPath,
    loadFiles,
    resetFiles,
  }
}
