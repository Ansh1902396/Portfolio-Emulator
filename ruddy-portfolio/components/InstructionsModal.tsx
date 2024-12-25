import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface InstructionsModalProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

export function InstructionsModal({ isOpen, onClose, isDarkMode }: InstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className={`w-full max-w-2xl ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            } rounded-lg shadow-lg border-4 border-black overflow-hidden`}
          >
            <div className="flex justify-between items-center p-6 border-b-4 border-black">
              <h2 className="text-3xl font-bold">Welcome to My Portfolio OS!</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold">How to Use:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Click on the app icons in the dock to open projects or social links</li>
                <li>Use the top-left menu to access the app drawer</li>
                <li>Toggle between light and dark mode using the sun/moon icon</li>
                <li>Click the terminal icon to switch to terminal mode</li>
                <li>Right-click on dock icons for more options</li>
              </ul>
              <div className="mt-8 p-4 border-4 border-black rounded-lg">
                <h3 className="text-xl font-bold mb-2">A Message from Rudransh:</h3>
                <p>
                  "Welcome to my digital playground! Feel free to explore my projects, skills, and experiences. 
                  Don't hesitate to reach out if you want to collaborate or just chat about tech. 
                  Remember, in the world of coding, we're all students and teachers. Enjoy your stay! 🚀"
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

