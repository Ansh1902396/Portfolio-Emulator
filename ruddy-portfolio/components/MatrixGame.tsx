'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Sword, Brain, Signal, Heart, Cpu } from 'lucide-react'
import { ChallengeTerminal } from './ChallengeTerminal'

interface GameState {
  location: string
  inventory: string[]
  awareness: number
  health: number
  isGameOver: boolean
}

interface ChallengeState {
  currentChallenge: string | null
  challengeProgress: number
  challengeSolved: boolean
}

interface GameProps {
  gameState: GameState
  challengeState: ChallengeState
  onCommand: (command: string) => void
  openModal: (content: { title: string; description: string; hint: string }) => void
  closeModal: () => void
  isModalOpen: boolean
  modalContent: { title: string; description: string; hint: string } | null
  onSolveChallenge: (solution: string) => void
}

export function MatrixGame({ 
  gameState, 
  challengeState, 
  onCommand, 
  openModal, 
  closeModal, 
  isModalOpen, 
  modalContent,
  onSolveChallenge
}: GameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<{ name: string; description: string; hint: string } | null>(null);

  const getLocationColor = () => {
    switch (gameState.location) {
      case 'construct':
        return 'text-blue-400'
      case 'training':
        return 'text-yellow-400'
      case 'matrix':
        return 'text-green-400'
      case 'zion':
        return 'text-red-400'
      case 'machineCity':
        return 'text-purple-400'
      default:
        return 'text-emerald-400'
    }
  }

  const getLocationIcon = () => {
    switch (gameState.location) {
      case 'construct':
        return <Signal className="w-5 h-5" />
      case 'training':
        return <Sword className="w-5 h-5" />
      case 'matrix':
        return <Brain className="w-5 h-5" />
      case 'zion':
        return <Shield className="w-5 h-5" />
      case 'machineCity':
        return <Cpu className="w-5 h-5" />
      default:
        return null
    }
  }

  const handleSubmitSolution = (solution: string) => {
    onSolveChallenge(solution)
    closeModal()
  }

  const handleOpenChallenge = (content: { title: string; description: string; hint: string }) => {
    setCurrentChallenge(content);
    openModal(content);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 bg-black/80 p-4 rounded-lg border border-emerald-400 shadow-lg shadow-emerald-400/20"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {getLocationIcon()}
              <span className={`font-bold ${getLocationColor()}`}>
                Location: {gameState.location.charAt(0).toUpperCase() + gameState.location.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${gameState.health}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-red-400">{gameState.health}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${gameState.awareness}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-blue-400">{gameState.awareness}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">Inventory:</span>
              <span className="text-sm text-emerald-300">
                {gameState.inventory.length > 0
                  ? gameState.inventory.join(', ')
                  : 'Empty'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 bg-black/80 p-4 rounded-lg border border-emerald-400 shadow-lg shadow-emerald-400/20"
        >
          <h3 className="text-lg font-bold text-emerald-400 mb-2">Active Challenge</h3>
          {challengeState.currentChallenge ? (
            <>
              <p className="text-emerald-300 mb-2">{challengeState.currentChallenge}</p>
              <button 
                onClick={() => onCommand('solve challenge')}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              >
                View Challenge
              </button>
            </>
          ) : (
            <p className="text-emerald-300">No active challenge. Hack a terminal to begin.</p>
          )}
        </motion.div>
      </div>

      <div className="game-commands mt-4 mb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-emerald-300"
        >
          Available commands:
          <ul className="ml-4 mt-1 space-y-1">
            <li>• look - Examine your surroundings</li>
            <li>• inventory - Check your items</li>
            <li>• status - Check your health and awareness levels</li>
            <li>• help - Show available commands</li>
            <li>• exit - Leave the game</li>
            {gameState.location === 'matrix' && (
              <>
                <li>• hack terminal - Attempt to hack a nearby terminal</li>
                <li>• solve challenge - View and solve the current challenge</li>
              </>
            )}
            {gameState.location === 'machineCity' && (
              <>
                <li>• negotiate - Attempt to negotiate with the machines</li>
                <li>• fight - Engage in battle with the machines</li>
                <li>• sacrifice - Choose to sacrifice yourself</li>
                <li>• return - Return to Zion</li>
              </>
            )}
          </ul>
        </motion.div>
      </div>

      {isModalOpen && challengeState.currentChallenge && (
        <ChallengeTerminal
          title={challengeState.currentChallenge}
          description={modalContent?.description || "Solve the challenge to progress in the game."}
          hint={modalContent?.hint || "Use your hacking skills to overcome this obstacle."}
          onSubmit={handleSubmitSolution}
          onClose={closeModal}
        />
      )}

      <style jsx global>{`
        .typing-animation {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 2s steps(40, end);
        }
        
        .typing-animation.delay-500 {
          animation-delay: 0.5s;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
      `}</style>
    </motion.div>
  )
}

