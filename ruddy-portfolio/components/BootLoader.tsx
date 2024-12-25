import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface BootLoaderProps {
  onLoadingComplete: () => void
}

const bootSequence = [
  "Initializing system...",
  "Loading kernel modules...",
  "Mounting file systems...",
  "Starting network services...",
  "Configuring GUI interface...",
  "Launching user environment..."
]

const asciiArt = `
 _______  __   __  ______   ______   __   __
|       ||  | |  ||      | |      | |  | |  |
|    ___||  | |  ||  _    ||  _    ||  |_|  |
|   | __ |  |_|  || | |   || | |   ||       |
|   ||  ||       || |_|   || |_|   ||       |
|   |_| ||       ||       ||       | |     |
|_______||_______||______| |______|   |___|
`

export function BootLoader({ onLoadingComplete }: BootLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < bootSequence.length - 1) {
          return prev + 1
        } else {
          clearInterval(timer)
          setTimeout(onLoadingComplete, 1000) // Delay before completing
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-emerald-400 font-mono">
      <motion.pre
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-xs sm:text-sm md:text-base lg:text-lg mb-8"
      >
        {asciiArt}
      </motion.pre>
      <div className="w-64 sm:w-80 md:w-96">
        {bootSequence.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: index <= currentStep ? 1 : 0, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2"
          >
            {step}
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${((currentStep + 1) / bootSequence.length) * 100}%` }}
        className="h-2 bg-emerald-400 mt-4 rounded-full"
        style={{ width: 256 }}
      />
    </div>
  )
}
