import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface VimModalProps {
  isOpen: boolean
  onClose: () => void
  initialContent: string
  onSave: (content: string) => void
  fileName: string
}

type Mode = 'normal' | 'insert' | 'visual' | 'command'

export function VimModal({ isOpen, onClose, initialContent, onSave, fileName }: VimModalProps) {
  const [content, setContent] = useState(initialContent)
  const [mode, setMode] = useState<Mode>('normal')
  const [cursor, setCursor] = useState({ row: 0, col: 0 })
  const [visualStart, setVisualStart] = useState<{ row: number; col: number } | null>(null)
  const [commandInput, setCommandInput] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setContent(initialContent)
    setCursor({ row: 0, col: 0 })
  }, [initialContent, fileName])

  const lines = content.split('\n')

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (mode === 'normal') {
      handleNormalModeKeyDown(e)
    } else if (mode === 'insert') {
      handleInsertModeKeyDown(e)
    } else if (mode === 'visual') {
      handleVisualModeKeyDown(e)
    } else if (mode === 'command') {
      handleCommandModeKeyDown(e)
    }
  }

  const handleNormalModeKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    switch (e.key) {
      case 'i': setMode('insert'); break
      case 'v': setMode('visual'); setVisualStart(cursor); break
      case ':': setMode('command'); setCommandInput(':'); break
      case 'h': moveCursor(0, -1); break
      case 'j': moveCursor(1, 0); break
      case 'k': moveCursor(-1, 0); break
      case 'l': moveCursor(0, 1); break
      case 'w': moveWordForward(); break
      case 'b': moveWordBackward(); break
      case '0': moveCursorToLineStart(); break
      case '$': moveCursorToLineEnd(); break
      case 'G': moveCursorToFileEnd(); break
      case 'g':
        if (e.shiftKey) moveCursorToFileEnd()
        else moveCursorToFileStart()
        break
      case 'd':
        if (e.ctrlKey) deleteLine()
        else if (e.repeat) deleteLine()
        break
      case 'y':
        if (e.ctrlKey) yankLine()
        else if (e.repeat) yankLine()
        break
      case 'p': paste(); break
    }
  }

  const handleInsertModeKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setMode('normal')
      moveCursor(0, -1) // Move cursor back one space when exiting insert mode
    }
  }

  const handleVisualModeKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    switch (e.key) {
      case 'Escape': setMode('normal'); setVisualStart(null); break
      case 'h': moveCursor(0, -1); break
      case 'j': moveCursor(1, 0); break
      case 'k': moveCursor(-1, 0); break
      case 'l': moveCursor(0, 1); break
      case 'y': yankSelection(); setMode('normal'); setVisualStart(null); break
      case 'd': deleteSelection(); setMode('normal'); setVisualStart(null); break
    }
  }

  const handleCommandModeKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executeCommand(commandInput)
      setMode('normal')
      setCommandInput('')
    } else if (e.key === 'Escape') {
      setMode('normal')
      setCommandInput('')
    }
  }

  const moveCursor = (rowDelta: number, colDelta: number) => {
    const newRow = Math.max(0, Math.min(cursor.row + rowDelta, lines.length - 1))
    const newCol = Math.max(0, Math.min(cursor.col + colDelta, lines[newRow].length))
    setCursor({ row: newRow, col: newCol })
  }

  const moveWordForward = () => {
    const line = lines[cursor.row]
    const wordRegex = /\w+/g
    let match
    while ((match = wordRegex.exec(line.slice(cursor.col))) !== null) {
      setCursor({ ...cursor, col: cursor.col + match.index + match[0].length })
      return
    }
    if (cursor.row < lines.length - 1) {
      setCursor({ row: cursor.row + 1, col: 0 })
    }
  }

  const moveWordBackward = () => {
    const line = lines[cursor.row]
    const wordRegex = /\w+/g
    let lastMatch = null
    let match
    while ((match = wordRegex.exec(line.slice(0, cursor.col))) !== null) {
      lastMatch = match
    }
    if (lastMatch) {
      setCursor({ ...cursor, col: lastMatch.index })
    } else if (cursor.row > 0) {
      setCursor({ row: cursor.row - 1, col: lines[cursor.row - 1].length })
    }
  }

  const moveCursorToLineStart = () => setCursor({ ...cursor, col: 0 })
  const moveCursorToLineEnd = () => setCursor({ ...cursor, col: lines[cursor.row].length })
  const moveCursorToFileStart = () => setCursor({ row: 0, col: 0 })
  const moveCursorToFileEnd = () => setCursor({ row: lines.length - 1, col: lines[lines.length - 1].length })

  const deleteLine = () => {
    const newLines = [...lines]
    newLines.splice(cursor.row, 1)
    setContent(newLines.join('\n'))
    if (cursor.row >= newLines.length) {
      setCursor({ row: Math.max(0, newLines.length - 1), col: 0 })
    }
  }

  const yankLine = () => {
    navigator.clipboard.writeText(lines[cursor.row])
    setStatusMessage('Line yanked to clipboard')
  }

  const paste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      const newLines = [...lines]
      newLines.splice(cursor.row + 1, 0, clipboardText)
      setContent(newLines.join('\n'))
      setCursor({ row: cursor.row + 1, col: 0 })
      setStatusMessage('Pasted from clipboard')
    } catch (err) {
      setStatusMessage('Failed to paste: clipboard empty or permission denied')
    }
  }

  const yankSelection = () => {
    if (!visualStart) return
    const [startRow, endRow] = [Math.min(visualStart.row, cursor.row), Math.max(visualStart.row, cursor.row)]
    const [startCol, endCol] = [Math.min(visualStart.col, cursor.col), Math.max(visualStart.col, cursor.col)]
    const selectedText = lines.slice(startRow, endRow + 1).map((line, index) => {
      if (startRow === endRow) return line.slice(startCol, endCol)
      if (index === 0) return line.slice(startCol)
      if (index === endRow - startRow) return line.slice(0, endCol)
      return line
    }).join('\n')
    navigator.clipboard.writeText(selectedText)
    setStatusMessage('Selection yanked to clipboard')
  }

  const deleteSelection = () => {
    if (!visualStart) return
    const [startRow, endRow] = [Math.min(visualStart.row, cursor.row), Math.max(visualStart.row, cursor.row)]
    const [startCol, endCol] = [Math.min(visualStart.col, cursor.col), Math.max(visualStart.col, cursor.col)]
    const newLines = [...lines]
    if (startRow === endRow) {
      newLines[startRow] = newLines[startRow].slice(0, startCol) + newLines[startRow].slice(endCol)
    } else {
      newLines[startRow] = newLines[startRow].slice(0, startCol) + newLines[endRow].slice(endCol)
      newLines.splice(startRow + 1, endRow - startRow)
    }
    setContent(newLines.join('\n'))
    setCursor({ row: startRow, col: startCol })
  }

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    if (trimmedCmd === ':w') {
      onSave(content)
      setStatusMessage('File saved')
    } else if (trimmedCmd === ':q') {
      onClose()
    } else if (trimmedCmd === ':wq') {
      onSave(content)
      onClose()
    } else {
      setStatusMessage(`Unknown command: ${cmd}`)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (mode === 'insert') {
      const newContent = e.target.value
      setContent(newContent)
      const newLines = newContent.split('\n')
      const lastLine = newLines[newLines.length - 1]
      setCursor({
        row: newLines.length - 1,
        col: lastLine.length
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl"
          >
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
              <div className="text-emerald-400 font-mono text-sm">
                {fileName} - VIM ({mode.toUpperCase()} MODE)
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <textarea
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                className="w-full h-96 bg-black text-emerald-400 font-mono p-2 resize-none focus:outline-none"
                spellCheck="false"
              />
              <div className="mt-2 flex items-center justify-between text-emerald-400">
                <span>{mode.toUpperCase()} MODE</span>
                <span>{cursor.row + 1}:{cursor.col + 1}</span>
              </div>
              {mode === 'command' && (
                <div className="mt-2 flex items-center">
                  <span className="text-emerald-400 mr-2">:</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={handleCommandModeKeyDown}
                    className="bg-black text-emerald-400 p-1 font-mono flex-grow outline-none"
                    placeholder="Enter command"
                  />
                </div>
              )}
              {statusMessage && (
                <div className="mt-2 text-yellow-400">
                  {statusMessage}
                </div>
              )}
            </div>
            <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400">
              Press 'i' for insert mode, 'v' for visual mode, ':' for command mode, 'Esc' to return to normal mode
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

