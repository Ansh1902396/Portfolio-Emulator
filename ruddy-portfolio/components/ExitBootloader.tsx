import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ExitBootloaderProps {
  onAnimationComplete: () => void
  previousMode: string;
}

export function ExitBootloader({ onAnimationComplete, previousMode }: ExitBootloaderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [memoryAddress, setMemoryAddress] = useState('0xFFFFFFFF')
  const [loadingMessage, setLoadingMessage] = useState('')
  const [assemblyCode, setAssemblyCode] = useState('')
  const [glitchText, setGlitchText] = useState('')

  const exitSteps = [
    { address: '0xFFFFFFFF', message: 'Initiating system shutdown...', assembly: 'MOV AX, 0x5307\nMOV BX, 0x0001\nMOV CX, 0x0003\nINT 0x15' },
    { address: '0xFFFFFFF0', message: 'Unloading kernel modules...', assembly: 'PUSH EAX\nMOV EAX, CR0\nAND EAX, 0x7FFFFFFF\nMOV CR0, EAX\nPOP EAX' },
    { address: '0xFFFFFFE0', message: 'Flushing file system buffers...', assembly: 'MOV AH, 0x0D\nINT 0x21' },
    { address: '0xFFFFFFD0', message: 'Stopping all processes...', assembly: 'CLI\nHLT' },
    { address: '0xFFFFFFC0', message: 'Saving system state...', assembly: 'PUSHAD\nPUSHFD' },
    { address: '0xFFFFFFB0', message: 'Disconnecting from the Matrix...', assembly: 'MOV AX, 0x0003\nINT 0x10' },
    { address: '0xFFFFFFA0', message: 'Erasing digital footprint...', assembly: 'XOR EAX, EAX\nMOV ECX, 0x100000\nREP STOSD' },
    { address: '0xFFFFFF90', message: 'Restoring reality parameters...', assembly: 'MOV EAX, CR0\nOR EAX, 0x80000000\nMOV CR0, EAX' },
    { address: '0xFFFFFF80', message: 'Finalizing exit sequence...', assembly: 'JMP FAR PTR 0xFFFF:0x0000' },
  ]

  useEffect(() => {
    const exitInterval = setInterval(() => {
      if (currentStep < exitSteps.length) {
        setMemoryAddress(exitSteps[currentStep].address)
        setLoadingMessage(exitSteps[currentStep].message)
        setAssemblyCode(exitSteps[currentStep].assembly)
        setGlitchText(generateGlitchText(exitSteps[currentStep].message))
        setCurrentStep(prev => prev + 1)
      } else {
        clearInterval(exitInterval)
        setTimeout(onAnimationComplete, 1000)
      }
    }, 1000)

    return () => clearInterval(exitInterval)
  }, [currentStep, onAnimationComplete])

  const generateGlitchText = (text: string) => {
    const glitchChars = '!@#$%^&*()_+-={}[]|;:,.<>?'
    let glitched = ''
    for (let i = 0; i < text.length; i++) {
      if (Math.random() > 0.8) {
        glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)]
      } else {
        glitched += text[i]
      }
    }
    return glitched
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 font-mono overflow-hidden"
       style={{ background: previousMode === 'gui' ? 'linear-gradient(to right, #e66465, #9198e5)' : '#000' }}>
      <motion.div
        className={`w-full max-w-4xl space-y-4 ${previousMode === 'gui' ? 'text-white' : 'text-green-500'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl font-bold mb-4 glitch-text" data-text="Exiting Matrix">Exiting Matrix</div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-400">Memory Address:</span>
          <span className="text-yellow-400 glitch-text">{memoryAddress}</span>
        </div>
        <div className="h-2 bg-green-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / exitSteps.length) * 100}%` }}
          />
        </div>
        <div className="text-sm text-green-400 glitch-text" data-text={loadingMessage}>{loadingMessage}</div>
        <div className="text-sm text-red-500 glitch-text" data-text={glitchText}>{glitchText}</div>
        <div className="mt-4 bg-gray-900 p-2 rounded text-xs">
          <pre className="text-green-300 whitespace-pre-wrap">{assemblyCode}</pre>
        </div>
      </motion.div>
    </div>
  )
}

