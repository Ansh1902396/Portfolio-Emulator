'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Sword, 
  Brain, 
  Signal, 
  Heart, 
  Cpu, 
  Eye, 
  User 
} from 'lucide-react'
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

  // 1) LOCATION-BASED COLOR STYLING
  const getLocationColor = () => {
    switch (gameState.location) {
      case 'construct':
        return 'text-blue-400'
      case 'training':
        return 'text-yellow-400'
      case 'matrix':
        return 'text-green-400'
      case 'oracleTemple':
        return 'text-pink-400'         // New color for Oracle Temple
      case 'zion':
        return 'text-red-400'
      case 'machineCity':
        return 'text-purple-400'
      default:
        return 'text-emerald-400'
    }
  }

  // 2) LOCATION-BASED ICONS
  const getLocationIcon = () => {
    switch (gameState.location) {
      case 'construct':
        return <Signal className="w-5 h-5" />
      case 'training':
        return <Sword className="w-5 h-5" />
      case 'matrix':
        return <Brain className="w-5 h-5" />
      case 'oracleTemple':
        return <Eye className="w-5 h-5" />     // New icon for Oracle Temple
      case 'zion':
        return <Shield className="w-5 h-5" />
      case 'machineCity':
        return <Cpu className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
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

  // 3) RENDER LOCATION-SPECIFIC COMMAND HINTS
  const renderLocationCommands = () => {
    switch (gameState.location) {
      case 'construct':
        return (
          <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
            <li><span className="text-emerald-300">take red pill</span> - Embrace the truth</li>
            <li><span className="text-emerald-300">take blue pill</span> - Return to comfortable ignorance</li>
            <li><span className="text-emerald-300">talk to morpheus</span> - Gain insight</li>
            <li><span className="text-emerald-300">examine pills</span> - Inspect the pills closely</li>
          </ul>
        )
      case 'training':
        return (
          <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
            <li><span className="text-emerald-300">train combat</span></li>
            <li><span className="text-emerald-300">practice dodge</span></li>
            <li><span className="text-emerald-300">learn techniques</span></li>
            <li><span className="text-emerald-300">spar</span></li>
            <li><span className="text-emerald-300">meditate</span> - Possibly reach the Matrix!</li>
          </ul>
        )
      case 'matrix':
        return (
          <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
            <li><span className="text-emerald-300">hack terminal</span> - Attempt to hack for a challenge</li>
            <li><span className="text-emerald-300">solve challenge</span> - View or solve the current puzzle</li>
            <li><span className="text-emerald-300">enter oracle's temple</span> - Seek deeper truths (requires awareness)</li>
            <li><span className="text-emerald-300">dodge bullet</span></li>
            <li><span className="text-emerald-300">find phone</span></li>
            <li><span className="text-emerald-300">fight agent</span></li>
            <li><span className="text-emerald-300">analyze code</span></li>
          </ul>
        )
      case 'oracleTemple':
        return (
          <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
            <li><span className="text-emerald-300">talk to oracle</span> - Gain cryptic wisdom</li>
            <li><span className="text-emerald-300">offer cookies</span> - Show kindness (if you have them!)</li>
            <li><span className="text-emerald-300">ask question</span> - Learn about your destiny</li>
            <li><span className="text-emerald-300">decipher symbols</span> - Study the temple walls</li>
          </ul>
        )
      case 'zion':
        return (
          <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
            <li><span className="text-emerald-300">train skills</span></li>
            <li><span className="text-emerald-300">meet morpheus</span></li>
            <li><span className="text-emerald-300">defend zion</span></li>
            <li><span className="text-emerald-300">rally humans</span></li>
            <li><span className="text-emerald-300">upgrade weapons</span></li>
          </ul>
        )
      case 'machineCity':
        return (
          <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
            <li><span className="text-emerald-300">negotiate</span> - Attempt peace</li>
            <li><span className="text-emerald-300">fight</span> - Engage the central AI in combat</li>
            <li><span className="text-emerald-300">sacrifice</span> - A bittersweet end</li>
            <li><span className="text-emerald-300">return</span> - Back to Zion</li>
          </ul>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT PANEL: Status Bars & Inventory */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 bg-black/80 p-4 rounded-lg border border-emerald-400 shadow-lg shadow-emerald-400/20"
        >
          <div className="flex flex-col gap-3">
            {/* LOCATION */}
            <div className="flex items-center gap-2">
              {getLocationIcon()}
              <span className={`font-bold ${getLocationColor()}`}>
                Location: {gameState.location.charAt(0).toUpperCase() + gameState.location.slice(1)}
              </span>
            </div>

            {/* HEALTH BAR */}
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

            {/* AWARENESS BAR */}
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

            {/* INVENTORY */}
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

        {/* RIGHT PANEL: Active Challenge */}
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
            <p className="text-emerald-300">No active challenge. <strong>hack terminal</strong> to begin.</p>
          )}
        </motion.div>
      </div>

      {/* LOCATION-SPECIFIC COMMANDS */}
      <div className="game-commands mt-4 mb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-emerald-300"
        >
          <p className="mb-1">Location-specific commands:</p>
          {renderLocationCommands()}
          <div className="mt-2">
            <p>Universal commands:</p>
            <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
              <li><span className="text-emerald-300">look</span> - Examine surroundings</li>
              <li><span className="text-emerald-300">inventory</span> - Check your items</li>
              <li><span className="text-emerald-300">status</span> - Check health &amp; awareness</li>
              <li><span className="text-emerald-300">help</span> - Show commands</li>
              <li><span className="text-emerald-300">exit</span> - Leave the simulation</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* CHALLENGE MODAL */}
      {isModalOpen && challengeState.currentChallenge && (
        <ChallengeTerminal
          title={modalContent?.title || "Challenge"}
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

