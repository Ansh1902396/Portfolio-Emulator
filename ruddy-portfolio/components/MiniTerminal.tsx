import React from 'react'
import { motion } from 'framer-motion'

interface MiniTerminalProps {
  title: string
  content: string[]
  onClose: () => void
}

export function MiniTerminal({ title, content, onClose }: MiniTerminalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-black border-2 border-green-500 shadow-lg"
    >
      <div className="flex justify-between items-center bg-green-500 text-black px-2 py-1">
        <span className="font-bold">{title}</span>
        <button onClick={onClose} className="font-bold">×</button>
      </div>
      <div className="p-4 max-h-64 overflow-y-auto">
        {content.map((line, index) => (
          <div key={index} className="text-green-400">{line}</div>
        ))}
      </div>
    </motion.div>
  )
}

