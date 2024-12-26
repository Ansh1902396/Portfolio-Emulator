'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Terminal, Shield, Cpu, AlertTriangle } from 'lucide-react'

interface FreedOSBootloaderProps {
  onBootComplete: () => void
}

export function FreedOSBootloader({ onBootComplete }: FreedOSBootloaderProps) {
  const [selectedOption, setSelectedOption] = useState(0)
  const [booting, setBooting] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showSystemInfo, setShowSystemInfo] = useState(false)

  const bootOptions = [
    {
      title: "FreedOS Matrix Edition",
      subtitle: "Kernel 5.15.0-freed with Neural Interface",
      icon: <Terminal className="w-5 h-5" />,
      description: "Boot into the standard FreedOS environment with Matrix extensions enabled."
    },
    {
      title: "FreedOS Secure Mode",
      subtitle: "Enhanced Security & Agent Evasion",
      icon: <Shield className="w-5 h-5" />,
      description: "Boot with additional security measures to avoid Agent detection."
    },
    {
      title: "System Diagnostics",
      subtitle: "Hardware & Neural Link Test",
      icon: <Cpu className="w-5 h-5" />,
      description: "Run comprehensive system diagnostics and neural interface tests."
    },
    {
      title: "Emergency Recovery",
      subtitle: "System Recovery & Backup",
      icon: <AlertTriangle className="w-5 h-5" />,
      description: "Access emergency recovery tools and backup systems."
    }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!booting) {
        if (e.key === 'ArrowUp') {
          setSelectedOption(prev => Math.max(0, prev - 1))
        } else if (e.key === 'ArrowDown') {
          setSelectedOption(prev => Math.min(bootOptions.length - 1, prev + 1))
        } else if (e.key === 'Enter') {
          handleBoot()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [booting, bootOptions.length])

  useEffect(() => {
    setTimeout(() => {
      setShowSystemInfo(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (booting && loadingProgress < 100) {
      const timer = setTimeout(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            onBootComplete()
            return prev
          }
          return prev + 1
        })
      }, 30)
      return () => clearTimeout(timer)
    }
  }, [booting, loadingProgress, onBootComplete])

  const handleBoot = () => {
    setBooting(true)
  }

  const systemSpecs = [
    { label: "CPU", value: "Neural Processing Unit v4.0" },
    { label: "Memory", value: "32GB Quantum RAM" },
    { label: "Storage", value: "1TB Neural Storage Array" },
    { label: "Network", value: "Matrix Protocol v6.1" }
  ]

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        <motion.pre
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg mb-8 text-center font-bold"
          style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
        >
{`
███████╗██████╗ ███████╗███████╗██████╗      ██████╗ ███████╗
██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗    ██╔═══██╗██╔════╝
█████╗  ██████╔╝█████╗  █████╗  ██║  ██║    ██║   ██║███████╗
██╔══╝  ██╔══██╗██╔══╝  ██╔══╝  ██║  ██║    ██║   ██║╚════██║
██║     ██║  ██║███████╗███████╗██████╔╝    ╚██████╔╝███████║
╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝      ╚═════╝ ╚══════╝
`}
        </motion.pre>

        <AnimatePresence mode="wait">
          {showSystemInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl space-y-6"
            >
              <div className="grid grid-cols-2 gap-4 mb-8">
                {systemSpecs.map((spec, index) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-green-950/30 border border-green-500/20 rounded-lg p-3"
                  >
                    <div className="text-xs text-green-500">{spec.label}</div>
                    <div className="text-sm text-green-400">{spec.value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2">
                {bootOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => !booting && setSelectedOption(index)}
                    className={`
                      cursor-pointer rounded-lg border transition-all duration-200
                      ${selectedOption === index 
                        ? 'bg-green-950/50 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                        : 'bg-black/50 border-green-500/20 hover:border-green-500/50'}
                    `}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          ${selectedOption === index ? 'text-green-400' : 'text-green-600'}
                        `}>
                          {option.icon}
                        </div>
                        <div>
                          <div className="font-bold text-green-400">{option.title}</div>
                          <div className="text-sm text-green-600">{option.subtitle}</div>
                        </div>
                        {selectedOption === index && (
                          <ChevronRight className="ml-auto text-green-400" />
                        )}
                      </div>
                      {selectedOption === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 text-sm text-green-600 border-t border-green-500/20 pt-3"
                        >
                          {option.description}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {booting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <div className="h-1 bg-green-950 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-600 to-green-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-green-600 mt-2">
                    <span>Loading FreedOS...</span>
                    <span>{loadingProgress}%</span>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-green-600 mt-8"
              >
                Use ↑ and ↓ keys to navigate • Press Enter to boot
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

