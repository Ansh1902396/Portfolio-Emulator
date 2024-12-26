import React from 'react'
import { motion } from 'framer-motion'

interface EndGameModalProps {
  onRestart: () => void
  onExit: () => void
}

/**
 * Displays a "Game Over" screen once Freed OS is done.
 */
const EndGameModal: React.FC<EndGameModalProps> = ({ onRestart, onExit }) => {
  return (
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
        className="bg-black border-2 border-green-500 p-8 rounded-lg w-full max-w-2xl font-mono text-green-500 retro-crt"
      >
        <h2 className="text-3xl font-bold mb-4">Congratulations, Neo!</h2>
        <p className="mb-4">
          You've successfully completed Freed OS: A Terminal Awakening. 
          The system is rebooting, and illusions are unraveling.
        </p>
        <p className="mb-4">
          Your choices shaped Freed OS reality. The world won't be the same.
        </p>
        <p className="mb-8">Remember: There is no spoon.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600"
          >
            Restart Journey
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-600"
          >
            Exit Simulation
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EndGameModal

/* 
  CSS: same as your existing .retro-crt, .retro-scanlines, .retro-text 
  references. 
*/

