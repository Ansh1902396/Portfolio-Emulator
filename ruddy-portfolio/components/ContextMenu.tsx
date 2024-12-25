import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'

interface ContextMenuProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onSwitchToTerminal: () => void
  onOpenInfo: () => void
  onOpenInstructions: () => void
  onOpenGame: () => void
}

export function ContextMenu({
  isDarkMode,
  onToggleTheme,
  onSwitchToTerminal,
  onOpenInfo,
  onOpenInstructions,
  onOpenGame
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const menuItems = [
    { label: 'Toggle Theme', onClick: onToggleTheme },
    { label: 'Switch to Terminal', onClick: onSwitchToTerminal },
    { label: 'Info', onClick: onOpenInfo },
    { label: 'Instructions', onClick: onOpenInstructions },
    { label: 'Open Game', onClick: onOpenGame },
  ]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        } border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center`}
      >
        <Menu size={24} className={isDarkMode ? 'text-white' : 'text-black'} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
            } ring-1 ring-black ring-opacity-5`}
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  role="menuitem"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

