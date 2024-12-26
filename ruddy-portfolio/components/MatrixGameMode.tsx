import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatrixGame } from '../hooks/use-matrix-game'
import { FreedOSBootloader } from './FreedOSBootloader'
import { RetroTerminal } from './RetroTerminal'
import { ExitBootloader } from './ExitBootloader'

interface MatrixGameModeProps {
  onExit: (previousMode: 'gui' | 'terminal') => void; // Pass previous mode
}

export function MatrixGameMode({ onExit }: MatrixGameModeProps) {
  const [isBooting, setIsBooting] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [previousMode, setPreviousMode] = useState<'gui' | 'terminal'>('terminal'); // Store previous mode
  const { gameState, handleCommand, currentDialog, currentCharacter, activeHack } = useMatrixGame()

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false)
    }, 3000) // Reduced boot time

    return () => clearTimeout(bootTimer)
  }, [])

  const handleExit = () => {
    setIsExiting(true)
  }

  // ExitBootloader now takes previousMode as a prop
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-green-500 font-mono"
    >
      <AnimatePresence>
        {isBooting ? (
          <FreedOSBootloader key="bootloader" onBootComplete={() => setIsBooting(false)} />
        ) : isExiting ? (
          <ExitBootloader key="exitbootloader" onAnimationComplete={() => onExit(previousMode)} previousMode={previousMode} />
        ) : (
          <RetroTerminal
            key="terminal"
            onExit={handleExit}
            gameState={gameState}
            handleCommand={handleCommand}
            currentDialog={currentDialog}
            currentCharacter={currentCharacter}
            activeHack={activeHack}
            setPreviousMode={setPreviousMode} // Pass setPreviousMode function
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

