"use client"

import { templates, type ProjectTemplate } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface TemplateSelectorProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: ProjectTemplate) => void
}

export function TemplateSelector({ open, onClose, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#252526] border-[#454545] text-[#cccccc] p-0 gap-0">
        <DialogHeader className="px-6 py-5 border-b border-[#454545] bg-[#2d2d2d]">
          <DialogTitle className="text-2xl text-white font-bold">Choose a Template</DialogTitle>
          <DialogDescription className="text-[#cccccc] mt-2">Start with a pre-configured project template to get coding faster</DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template)
                  onClose()
                }}
                className="p-6 bg-[#1e1e1e] hover:bg-[#2d2d2d] border-2 border-[#454545] hover:border-[#0e639c] rounded-xl text-left transition-all group cursor-pointer transform hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="text-5xl mb-4 transition-transform group-hover:scale-110">{template.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#0e639c] transition-colors">{template.name}</h3>
                <p className="text-sm text-[#858585] leading-relaxed">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#454545] bg-[#2d2d2d]">
          <Button variant="ghost" onClick={onClose} className="hover:bg-[#3e3e42] text-[#cccccc] cursor-pointer transition-colors">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
