import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FreedOSBootloaderProps {
  onBootComplete: () => void
}

export function FreedOSBootloader({ onBootComplete }: FreedOSBootloaderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [memoryAddress, setMemoryAddress] = useState('0x00000000')
  const [loadingMessage, setLoadingMessage] = useState('')
  const [assemblyCode, setAssemblyCode] = useState('')

  const bootSteps = [
    { address: '0x00000000', message: 'BIOS POST...', assembly: 'MOV AX, 0x0000\nMOV SS, AX\nMOV SP, 0xFFFF' },
    { address: '0x000A1000', message: 'Loading MBR...', assembly: 'MOV AH, 0x02\nMOV AL, 0x01\nMOV CH, 0x00\nMOV CL, 0x01\nMOV DH, 0x00\nMOV DL, 0x80\nINT 0x13' },
    { address: '0x000B2000', message: 'Initializing FreedOS kernel...', assembly: 'JMP 0x0000:0x7C00\nXOR AX, AX\nMOV DS, AX\nMOV ES, AX' },
    { address: '0x000C3000', message: 'Loading core system modules...', assembly: 'PUSH ES\nPOP DS\nMOV SI, 0x7C00\nMOV DI, 0x0600\nMOV CX, 0x0100\nREP MOVSW' },
    { address: '0x000D4000', message: 'Detecting hardware configurations...', assembly: 'MOV AH, 0x0E\nMOV AL, 0x0A\nINT 0x10\nMOV AL, 0x0D\nINT 0x10' },
    { address: '0x000E5000', message: 'Mounting root filesystem...', assembly: 'MOV AX, 0x1000\nMOV ES, AX\nMOV BX, 0x0000\nMOV AH, 0x02\nMOV AL, 0x10\nMOV CH, 0x00\nMOV CL, 0x02\nMOV DH, 0x00\nINT 0x13' },
    { address: '0x000F6000', message: 'Initializing network interfaces...', assembly: 'MOV DX, 0x0300\nMOV AL, 0x03\nOUT DX, AL\nINC DX\nIN AL, DX' },
    { address: '0x00A07000', message: 'Loading FreedOS GUI components...', assembly: 'MOV AX, 0x0013\nINT 0x10\nMOV AX, 0xA000\nMOV ES, AX\nXOR DI, DI' },
    { address: '0x00B08000', message: 'Establishing Matrix connection...', assembly: 'MOV AX, 0x0000\nMOV ES, AX\nMOV DI, 0x0500\nMOV CX, 0x0100\nREP STOSW' },
    { address: '0x00C09000', message: 'Applying reality distortion filters...', assembly: 'MOV AX, 0xB800\nMOV ES, AX\nXOR DI, DI\nMOV AX, 0x0720\nMOV CX, 0x07D0\nREP STOSW' },
    { address: '0x00D0A000', message: 'Activating neural interface...', assembly: 'MOV AX, 0x0003\nINT 0x10\nMOV AH, 0x01\nMOV CH, 0x00\nMOV CL, 0x07\nINT 0x10' },
    { address: '0x00E0B000', message: 'FreedOS boot sequence complete.', assembly: 'JMP 0x08:KernelMain\nHLT' },
  ]

  useEffect(() => {
    const bootInterval = setInterval(() => {
      if (currentStep < bootSteps.length) {
        setMemoryAddress(bootSteps[currentStep].address)
        setLoadingMessage(bootSteps[currentStep].message)
        setAssemblyCode(bootSteps[currentStep].assembly)
        setCurrentStep(prev => prev + 1)
      } else {
        clearInterval(bootInterval)
        setTimeout(onBootComplete, 1000)
      }
    }, 1000)

    return () => clearInterval(bootInterval)
  }, [currentStep, onBootComplete])

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg mb-8 text-center"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex justify-between text-sm">
            <span className="text-blue-400">Memory Address:</span>
            <span className="text-yellow-400">{memoryAddress}</span>
          </div>
          <div className="h-2 bg-green-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / bootSteps.length) * 100}%` }}
            />
          </div>
          <div className="text-sm">{loadingMessage}</div>
          <div className="mt-4 bg-gray-900 p-2 rounded text-xs">
            <pre className="whitespace-pre-wrap">{assemblyCode}</pre>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

