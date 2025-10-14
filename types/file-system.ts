export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  path: string
}

export interface FileSystemState {
  files: FileNode[]
  activeFile: string | null
  openFiles: string[]
}
