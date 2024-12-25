import React from 'react'
import { Dialog, DialogContent } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"

interface TerminalModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: React.ReactNode
}

export function TerminalModal({ isOpen, onClose, title, content }: TerminalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose()
    }}>
      <DialogContent className="sm:max-w-[600px] bg-black text-green-400 border border-green-400 p-0 overflow-hidden">
        <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-green-400">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 text-center text-sm text-green-400 font-mono">
            {title}
          </div>
        </div>
        <ScrollArea className="h-[60vh]">
          <div className="p-4 font-mono">
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

