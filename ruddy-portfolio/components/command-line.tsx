'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'

interface CommandLineProps {
  onCommand: (command: string) => void
  username: string
  hostname: string
  currentDirectory: string
  showCursor: boolean
}

export function CommandLine({ onCommand, username, hostname, currentDirectory, showCursor }: CommandLineProps) {
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onCommand(input.trim())
      setCommandHistory(prev => [...prev, input.trim()])
      setInput('')
      setHistoryIndex(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex])
      }
    }
  }

  const displayDirectory = currentDirectory === '/home/user' ? '~' : currentDirectory
  const prompt = `${username}@${hostname}:${displayDirectory}$`

  return (
    <div 
      className="flex items-center space-x-2 mt-1 relative"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-emerald-300">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`flex-1 bg-transparent border-none outline-none text-emerald-400 font-mono ${showCursor ? '' : 'caret-transparent'}`}
        spellCheck="false"
        autoComplete="off"
        autoCapitalize="off"
      />
    </div>
  )
}

