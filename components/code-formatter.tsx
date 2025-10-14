"use client"

import { Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCode } from "@/lib/export-project"

interface CodeFormatterProps {
  code: string
  language: string
  onFormat: (formattedCode: string) => void
}

export function CodeFormatter({ code, language, onFormat }: CodeFormatterProps) {
  const handleFormat = () => {
    const formatted = formatCode(code, language)
    onFormat(formatted)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleFormat}
      className="text-[#cccccc] hover:bg-[#2d2d2d] cursor-pointer"
      title="Format code"
    >
      <Wand2 className="h-4 w-4 mr-2" />
      Format
    </Button>
  )
}
