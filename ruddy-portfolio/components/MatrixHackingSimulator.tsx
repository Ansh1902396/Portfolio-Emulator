import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface MatrixHackingSimulatorProps {
  onClose: () => void
}

interface Challenge {
  name: string
  description: string
  puzzle: string
  solution: string
  hint: string
}

const challenges: Challenge[] = [
  {
    name: "Binary Decryption",
    description: "Decrypt the binary code to reveal a hidden message.",
    puzzle: "01010100 01101000 01100101 00100000 01001101 01100001 01110100 01110010 01101001 01111000 00100000 01101000 01100001 01110011 00100000 01111001 01101111 01110101",
    solution: "the matrix has you",
    hint: "Each group of 8 digits represents a single ASCII character."
  },
  {
    name: "Caesar Cipher",
    description: "Decode the message encrypted with a Caesar cipher.",
    puzzle: "Iroorz wkh zklwh udeelw",
    solution: "follow the white rabbit",
    hint: "Each letter has been shifted by 3 positions in the alphabet."
  },
  {
    name: "Morse Code",
    description: "Decipher the Morse code message.",
    puzzle: ".-- .- -.- . / ..- .--. --..-- / -. . ---",
    solution: "wake up, neo",
    hint: "Dots represent short signals, dashes represent long signals."
  },
  {
    name: "Hexadecimal Color Code",
    description: "Find the hidden message in the sequence of color codes.",
    puzzle: "#52E144 #45D137 #44CD30 #50494C #4C4954#59",
    solution: "reality",
    hint: "Convert each hexadecimal color code to its ASCII representation."
  },
  {
    name: "Steganography",
    description: "Extract the hidden message from the image.",
    puzzle: "https://i.imgur.com/3vLd9tX.png",
    solution: "there is no spoon",
    hint: "Use an online steganography tool to reveal the hidden text in the image."
  }
]

export function MatrixHackingSimulator({ onClose }: MatrixHackingSimulatorProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [detectionLevel, setDetectionLevel] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        setDetectionLevel(prev => Math.min(prev + 0.33, 100)) // Increase detection level every 3 seconds
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 || detectionLevel === 100) {
      setGameOver(true)
      setMessage('Hack failed. The system has detected your presence and locked you out.')
    }
  }, [timeLeft, gameOver, detectionLevel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim().toLowerCase() === challenges[currentLevel].solution.toLowerCase()) {
      if (currentLevel === challenges.length - 1) {
        setGameOver(true)
        setMessage('Congratulations! You\'ve successfully hacked the Matrix and uncovered all its secrets!')
      } else {
        setCurrentLevel(currentLevel + 1)
        setUserInput('')
        setTimeLeft(prev => Math.min(prev + 60, 300)) // Add 1 minute for each solved puzzle, max 5 minutes
        setDetectionLevel(prev => Math.max(prev - 20, 0))
      }
    } else {
      setDetectionLevel(prev => Math.min(prev + 10, 100))
    }
  }

  const renderGameContent = () => (
    <>
      <div className="mb-4 p-2 border-2 border-green-500">
        <strong className="text-green-400">Challenge:</strong> 
        <span className="ml-2 text-green-400">{challenges[currentLevel].name}</span>
      </div>
      <div className="mb-4 p-2 border-2 border-green-500">
        <strong className="text-green-400">Description:</strong> 
        <span className="ml-2 text-green-400">{challenges[currentLevel].description}</span>
      </div>
      <div className="mb-4 p-2 border-2 border-green-500 overflow-x-auto">
        <strong className="text-green-400">Puzzle:</strong> 
        <span className="ml-2 text-green-400 font-mono">{challenges[currentLevel].puzzle}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your solution here"
          className="bg-black text-green-500 border-green-500 placeholder-green-700"
        />
        <Button type="submit" className="w-full bg-green-500 text-black hover:bg-green-400">
          Submit Solution
        </Button>
      </form>
      <div className="mt-4">
        <strong className="text-green-400">Hint:</strong> 
        <span className="ml-2 text-yellow-400">{challenges[currentLevel].hint}</span>
      </div>
    </>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black border-2 border-green-500 text-green-500 font-mono">
      <CardHeader className="border-b-2 border-green-500">
        <CardTitle className="text-2xl font-bold glitch-text">Matrix Hacking Simulator</CardTitle>
        <CardDescription className="text-green-400">Decrypt the puzzles, uncover the truth</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {!gameOver ? renderGameContent() : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{message}</h2>
            <Button onClick={onClose} className="bg-green-500 text-black hover:bg-green-400">
              Exit Simulation
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t-2 border-green-500">
        <div className="text-green-400">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
        <div className="w-1/2">
          <strong className="text-green-400">Detection Level:</strong>
          <Progress value={detectionLevel} max={100} className="mt-2" />
        </div>
      </CardFooter>
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

