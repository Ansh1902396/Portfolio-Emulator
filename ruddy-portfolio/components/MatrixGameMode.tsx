import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatrixGame } from '../hooks/use-matrix-game'
import { WormholeBootloader } from './WormholeBootloader'
import { RetroTerminal } from './RetroTerminal'

interface MatrixGameModeProps {
  onExit: () => void
}

export function MatrixGameMode({ onExit }: MatrixGameModeProps) {
  const [isBooting, setIsBooting] = useState(true)
  const { gameState, handleCommand, currentDialog, currentCharacter, activeHack } = useMatrixGame()

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false)
    }, 5000) // 5 seconds boot sequence

    return () => clearTimeout(bootTimer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-green-500 font-mono"
    >
      <AnimatePresence>
        {isBooting ? (
          <WormholeBootloader key="bootloader" />
        ) : (
          <RetroTerminal
            key="terminal"
            onExit={onExit}
            gameState={gameState}
            handleCommand={handleCommand}
            currentDialog={currentDialog}
            currentCharacter={currentCharacter}
            activeHack={activeHack}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

