import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ClockProps {
  isDarkMode: boolean
}

export function Clock({ isDarkMode }: ClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`px-4 py-2 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      } border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </motion.div>
  )
}

