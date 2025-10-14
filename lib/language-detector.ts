export function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || ""

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    json: "json",
    md: "markdown",
    txt: "plaintext",
    xml: "xml",
    svg: "xml",
    yml: "yaml",
    yaml: "yaml",
  }

  return languageMap[ext] || "plaintext"
}
