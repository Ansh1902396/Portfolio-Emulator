import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BootLoaderProps {
  onLoadingComplete: () => void
}

export function WormholeBootloader({ onLoadingComplete }: BootLoaderProps) {
  const [selectedOption, setSelectedOption] = useState(0)
  const [bootStage, setBootStage] = useState<'menu' | 'booting'>('menu')
  const [bootProgress, setBootProgress] = useState(0)

  const bootOptions = [
    'FreedOS GNU/Linux',
    'FreedOS GNU/Linux (Recovery Mode)',
    'Memory Test (memtest86+)',
    'Memory Test (memtest86+, serial console)',
  ]

  const bootMessages = [
    'Loading FreedOS kernel...',
    'Initializing ramdisk...',
    'Mounting root filesystem...',
    'Checking for system integrity...',
    'Starting FreedOS...',
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (bootStage === 'menu') {
        if (e.key === 'ArrowUp') {
          setSelectedOption((prev) => (prev > 0 ? prev - 1 : bootOptions.length - 1))
        } else if (e.key === 'ArrowDown') {
          setSelectedOption((prev) => (prev < bootOptions.length - 1 ? prev + 1 : 0))
        } else if (e.key === 'Enter') {
          setBootStage('booting')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [bootStage, bootOptions.length])

  useEffect(() => {
    if (bootStage === 'booting') {
      const interval = setInterval(() => {
        setBootProgress((prev) => {
          if (prev < bootMessages.length - 1) {
            return prev + 1
          } else {
            clearInterval(interval)
            setTimeout(onLoadingComplete, 1000)
            return prev
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [bootStage, onLoadingComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-green-500 font-mono p-4 flex flex-col"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold">FreedOS GRUB Bootloader</h1>
        <p>Version 2.04</p>
      </div>
      {bootStage === 'menu' ? (
        <>
          <div className="flex-grow">
            {bootOptions.map((option, index) => (
              <div
                key={index}
                className={`py-1 ${index === selectedOption ? 'bg-green-500 text-black' : ''}`}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <p>Use the ↑ and ↓ keys to select which entry is highlighted.</p>
            <p>Press enter to boot the selected OS, 'e' to edit the commands</p>
            <p>before booting or 'c' for a command-line.</p>
          </div>
        </>
      ) : (
        <div className="flex-grow">
          {bootMessages.slice(0, bootProgress + 1).map((message, index) => (
            <div key={index} className="py-1">
              {message}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

