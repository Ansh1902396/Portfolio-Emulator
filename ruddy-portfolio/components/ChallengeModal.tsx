import React, { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChallengeModalProps {
  challenge: {
    command: string
    description: string
  } | null
  onSolve: (solution: string) => string[]
  onClose: () => void
}

/**
 * Renders a modal for Freed OS puzzles (base64, Turing, etc.).
 */
export function ChallengeModal({ challenge, onSolve, onClose }: ChallengeModalProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // On new challenge, reset the mini console
  useEffect(() => {
    if (challenge) {
      setOutput([
        "Challenge Terminal v1.0",
        "--------------------",
        `Command: ${challenge.command}`,
        `Description: ${challenge.description}`,
        "--------------------",
        "Enter your solution below:"
      ])
      setFeedback(null)
    }
  }, [challenge])

  // Auto-scroll as we add lines
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const result = onSolve(input)
    setOutput(prev => [...prev, `> ${input}`, ...result])
    setInput('')
    if (result[0]?.includes("Correct!")) {
      setFeedback("Correct!")
    } else if (result[0]?.includes("Incorrect") || result[0]?.includes("alerted")) {
      setFeedback("Incorrect. Try again.")
    } else {
      setFeedback(null)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
    }
  }

  if (!challenge) return null

  return (
    <AnimatePresence>
      <motion.div
        key="challenge-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black border-2 border-green-500 p-4 rounded-lg w-full max-w-2xl font-mono text-green-500 retro-crt"
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Challenge Terminal</h2>
            <button
              onClick={onClose}
              className="px-2 py-1 bg-red-500 text-black rounded hover:bg-red-600 focus:outline-none"
            >
              X
            </button>
          </div>
          <div
            ref={outputRef}
            className="h-64 overflow-y-auto mb-4 bg-black p-2 border border-green-500 retro-scanlines"
          >
            {output.map((line, index) => (
              <div key={index} className="retro-text">{line}</div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="mr-2">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-grow bg-transparent border-none outline-none text-green-500 retro-text"
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 focus:outline-none"
            >
              Submit
            </button>
          </form>
          {feedback && (
            <div className={`mt-2 text-center ${feedback === "Correct!" ? "text-green-500" : "text-red-500"}`}>
              {feedback}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


<style jsx global>{`
  .retro-crt {
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 2px, 3px 100%;
  }

  .retro-scanlines::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 4px;
    z-index: 2;
    pointer-events: none;
  }

  .retro-text {
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
  }
`}</style>

