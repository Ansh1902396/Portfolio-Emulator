import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CustomCursorProps {
  isDarkMode: boolean
}

export function CustomCursor({ isDarkMode }: CustomCursorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
      }}
    >
      <motion.div
        className={`w-8 h-8 border-4 ${
          isDarkMode ? 'border-white' : 'border-black'
        } rounded-none transform -translate-x-1/2 -translate-y-1/2`}
        initial={{ scale: 0.5, rotate: 0 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      />
      <motion.div
        className={`w-2 h-2 ${
          isDarkMode ? 'bg-white' : 'bg-black'
        } rounded-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.1,
        }}
      />
    </motion.div>
  )
}

