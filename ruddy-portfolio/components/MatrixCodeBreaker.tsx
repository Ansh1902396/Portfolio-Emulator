import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from 'next-themes'

interface MatrixCodeBreakerProps {
  isDarkMode: boolean
  onClose: () => void
}

const messages = [
  "The Matrix has you...",
  "Follow the white rabbit.",
  "Knock, knock, Neo.",
  "There is no spoon.",
  "Free your mind.",
]

export function MatrixCodeBreaker({ isDarkMode, onClose }: MatrixCodeBreakerProps) {
  const [fallingCode, setFallingCode] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [hint, setHint] = useState('')

  const generateCode = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length: 20 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFallingCode(prev => [...prev, generateCode()].slice(-15))
    }, 800)

    return () => clearInterval(interval)
  }, [generateCode])

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameOver(true)
    }
  }, [timeLeft, gameOver])

  useEffect(() => {
    if (!gameOver) {
      const newMessage = messages[Math.floor(Math.random() * messages.length)]
      setMessage(newMessage)
      setHint(newMessage.split(' ')[0]) // Set the first word as a hint
    }
  }, [gameOver])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.toLowerCase().includes(message.toLowerCase()) || message.toLowerCase().includes(userInput.toLowerCase())) {
      setScore(score + 1)
      const newMessage = messages[Math.floor(Math.random() * messages.length)]
      setMessage(newMessage)
      setHint(newMessage.split(' ')[0])
      setUserInput('')
      setTimeLeft(prev => Math.min(prev + 10, 90)) // Add 10 seconds for correct answer, up to max of 90
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black border-2 border-green-500 text-green-500 font-mono">
      <CardHeader className="border-b-2 border-green-500">
        <CardTitle className="text-2xl font-bold glitch-text">Matrix Code Breaker</CardTitle>
        <CardDescription className="text-green-400">Decode the hidden message in the falling code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="h-60 overflow-hidden mb-4 relative border-2 border-green-500 p-2">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
          {fallingCode.map((code, index) => (
            <motion.div
              key={index}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-green-400 font-mono text-sm"
            >
              {code}
            </motion.div>
          ))}
        </div>
        <div className="mb-4 p-2 border-2 border-green-500">
          <strong className="text-green-400">Hidden Message:</strong> 
          <span className="ml-2 glitch-text">
            {message.split('').map((char, index) => (
              <span key={index} className={score > 0 ? 'text-green-400' : 'text-red-400'}>
                {index < message.length / 3 ? char : char === ' ' ? '\u00A0' : '*'}
              </span>
            ))}
          </span>
        </div>
        <div className="mb-4 p-2 border-2 border-green-500">
          <strong className="text-green-400">Hint:</strong> 
          <span className="ml-2 text-yellow-400">{hint}</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter the hidden message"
            className="bg-black text-green-500 border-green-500 placeholder-green-700"
          />
          <Button type="submit" className="w-full bg-green-500 text-black hover:bg-green-400">
            Decode
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-between border-t-2 border-green-500">
        <div className="text-green-400">Score: {score}</div>
        <div className="text-green-400">Time Left: {timeLeft}s</div>
      </CardFooter>
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90"
          >
            <Card className="w-64 bg-black text-green-500 border-2 border-green-500">
              <CardHeader>
                <CardTitle className="glitch-text">Game Over</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-400">Your final score: {score}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={onClose} className="w-full bg-green-500 text-black hover:bg-green-400">Close</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

<style jsx global>{`
  .glitch-text {
    position: relative;
    animation: glitch 3s infinite;
  }

  @keyframes glitch {
    0% {
      text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                   -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                   0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
    }
    14% {
      text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                   -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                   0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
    }
    15% {
      text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                   0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                   -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
    }
    49% {
      text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                   0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                   -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
    }
    50% {
      text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                   0.05em 0 0 rgba(0, 255, 0, 0.75),
                   0 -0.05em 0 rgba(0, 0, 255, 0.75);
    }
    99% {
      text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                   0.05em 0 0 rgba(0, 255, 0, 0.75),
                   0 -0.05em 0 rgba(0, 0, 255, 0.75);
    }
    100% {
      text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
                   -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
                   -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
    }
  }
`}</style>

