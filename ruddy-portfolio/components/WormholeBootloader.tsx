import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function WormholeBootloader() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])

  // Lines to simulate a GRUB bootloader screen
  const bootMenuLines = [
    'GNU GRUB  version 2.06',
    '',
    ' +-------------------------------------+',
    ' |   NeoSec Terminal (default)         |',
    ' |   Advanced options for NeoSec       |',
    ' |   Memory test (memtest86+)          |',
    ' +-------------------------------------+',
    'Use ↑ and ↓ keys to navigate, Enter to boot.',
    'Press e to edit commands before booting.'
  ]

  useEffect(() => {
    // Reveal each line in sequence with a slight delay
    let lineIndex = 0
    const intervalId = setInterval(() => {
      if (lineIndex < bootMenuLines.length) {
        setVisibleLines(prev => [...prev, bootMenuLines[lineIndex]])
        lineIndex++
      } else {
        clearInterval(intervalId)
      }
    }, 700) // Adjust to change how quickly lines appear

    return () => clearInterval(intervalId)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-black text-green-500 font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* GRUB-like menu text */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
        {visibleLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-lg"
            style={{ whiteSpace: 'pre' }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* “Loading” or status message at the bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-green-500 text-sm font-bold">
        Loading bootloader components...
      </div>
    </motion.div>
  )
}

