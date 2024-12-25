'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface ChallengeTerminalProps {
  title: string
  description: string
  hint: string
  onSubmit: (solution: string) => void
  onClose: () => void
}

export function ChallengeTerminal({ title, description, hint, onSubmit, onClose }: ChallengeTerminalProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(input)
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl max-h-[80vh] bg-black border border-emerald-400 rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-emerald-400">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 text-center text-sm text-emerald-400 font-mono">
            matrix-challenge -- {title}
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-4 font-mono text-emerald-400 space-y-4 overflow-y-auto flex-grow">
          <div className="typing-animation">
            <span className="text-emerald-300">system@matrix:~$</span> echo "<span className='text-lg mb-4'>{description}</span>"
          </div>
          <div className="typing-animation delay-500">
            <span className="text-emerald-300">system@matrix:~$</span> echo "Hint: <span className='text-lg mb-4'>{hint}</span>"
          </div>
          <div className="mt-auto p-4 border-t border-emerald-400">
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex items-center">
                <span className="text-emerald-300">hacker@matrix:~$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 ml-2 bg-transparent border-none outline-none text-emerald-400 font-mono"
                  placeholder="Enter your solution..."
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

