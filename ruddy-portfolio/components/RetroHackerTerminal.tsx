import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameCommands } from '../hooks/use-game-commands'

interface RetroHackerTerminalProps {
  onExit: () => void
}

export function RetroHackerTerminal({ onExit }: RetroHackerTerminalProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const { gameState, handleGameCommand } = useGameCommands()
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = handleGameCommand(input)
    setOutput(prev => [...prev, `> ${input}`, result])
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-green-500 font-mono p-4 overflow-hidden"
    >
      <div className="border-2 border-green-500 h-full p-4 overflow-hidden flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Matrix Hacker Terminal</h1>
          <button onClick={onExit} className="px-4 py-2 bg-green-500 text-black hover:bg-green-600">Exit</button>
        </div>
        <div ref={terminalRef} className="flex-grow overflow-y-auto mb-4">
          {output.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {line}
            </motion.div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <span className="mr-2">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-transparent border-none outline-none"
            autoFocus
          />
        </form>
      </div>
    </motion.div>
  )
}

