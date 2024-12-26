import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMatrixGame } from '../hooks/use-matrix-game'
import { ChallengeModal } from './ChallengeModal'
import EndGameModal from './EndGameModal'

interface RetroTerminalProps {
  onExit: () => void
  setPreviousMode: React.Dispatch<React.SetStateAction<'gui' | 'terminal'>>;
}

/**
 * The main Freed OS terminal UI component.
 * - Boot loader simulation
 * - Login flow
 * - Command input + output
 * - Renders ChallengeModal if there's a puzzle
 * - Renders EndGameModal if Freed OS is concluded
 */
export function RetroTerminal({ onExit, setPreviousMode, }: RetroTerminalProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isBooting, setIsBooting] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [loginStage, setLoginStage] = useState<'username' | 'password' | 'logged_in'>('username')

  // Freed OS game logic from our hook
  const {
    gameState,
    handleCommand,
    currentDialog,
    currentCharacter,
    setGameState,
    initialGameState,
    solveChallenge
  } = useMatrixGame()

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // After boot, show Freed OS lines
  useEffect(() => {
    if (!isBooting) {
      setOutput(["Freed OS 1.0", "...", "login: _"])
    }
  }, [isBooting])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  // Focus on input automatically
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keyboard handler for arrow up/down, Ctrl +/- (zoom)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.ctrlKey && e.key === '+') {
      e.preventDefault()
      setFontSize(prev => Math.min(prev + 1, 24))
    } else if (e.ctrlKey && e.key === '-') {
      e.preventDefault()
      setFontSize(prev => Math.max(prev - 1, 10))
    }
  }

  // Handling user input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // If boot is done, we handle login stages:
    if (loginStage === 'username') {
      // 1) Username
      setOutput(prev => [...prev, `login: ${input}`, "password: _"])
      setLoginStage('password')
      setHistory(h => [input, ...h])
      setHistoryIndex(-1)
      setInput('')
      return
    }
    if (loginStage === 'password') {
      // 2) Password
      setOutput(prev => [
        ...prev,
        "password: ********",
        "",
        "Last login: Wed Mar 15 09:22:01 on tty1",
        "SYNAPSE: \"Welcome, Neo. The truth awaits in your home directory. Type 'help' if you feel lost.\"",
        ""
      ])
      setLoginStage('logged_in')
      // Freed OS login command
      const result = handleCommand('login')
      setOutput(prev => [...prev, ...result])
      setHistory(h => [input, ...h])
      setHistoryIndex(-1)
      setInput('')
      return
    }

    // 3) Normal Freed OS usage
    const result = handleCommand(input)
    if (result[0] !== 'CLEAR') {
      if (input.startsWith('nano')) {
        setOutput(prev => [
          ...prev,
          `neo@${gameState.currentLocation}:~$ ${input}`,
          ...result,
          "Type 'solve 1' or 'solve 0' to edit the Makefile."
        ])
      } else {
        setOutput(prev => [
          ...prev,
          `neo@${gameState.currentLocation}:~$ ${input}`,
          ...result
        ])
      }
    } else {
      setOutput([])
    }
    setHistory(h => [input, ...h])
    setHistoryIndex(-1)
    setInput('')
  }

  // Story Progress: each time storyProgress updates, Freed OS can show next objective.
  useEffect(() => {
    if (gameState.storyProgress > 0) {
      setOutput(prev => [
        ...prev,
        `Story Progress: ${gameState.storyProgress} / ${gameState.objectives.length}`,
        `Current Objective: ${gameState.objectives[gameState.storyProgress - 1]}`
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.storyProgress])

  // If user enters /usr/src/kernel_freedom, Freed OS may hint about nano Makefile
  useEffect(() => {
    if (
      gameState.currentLocation === '/usr/src/kernel_freedom' &&
      !gameState.completedObjectives.includes("Edit the Makefile") &&
      !gameState.isGameOver
    ) {
      setOutput(prev => [
        ...prev,
        "",
        "SYNAPSE: \"You've reached a crucial point, Neo. Use 'nano Makefile' to make your final choice.\"",
        "SYNAPSE: \"Then use 'make' to compile and install the Freed Kernel.\"",
        ""
      ])
    }
  }, [gameState.currentLocation, gameState.completedObjectives, gameState.isGameOver])

  // A small progress bar at bottom if logged_in
  const renderProgressBar = () => {
    const progress = (gameState.storyProgress / gameState.objectives.length) * 100
    return (
      <div className="mt-4 bg-gray-700 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    )
  }

  const handleExit = () => {
    setPreviousMode('freed');
    onExit();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-green-500 font-mono p-4 overflow-hidden"
    >
      {/* If Freed OS is concluded, show EndGameModal */}
      {gameState.isGameOver && (
        <EndGameModal
          onRestart={() => {
            setGameState(initialGameState)
            setOutput([])
            setLoginStage('username')
          }}
          onExit={onExit}
        />
      )}

      {isBooting ? (
        <BootLoader onLoadingComplete={() => setIsBooting(false)} />
      ) : (
        <div className="border-4 border-green-500 rounded-lg overflow-hidden flex flex-col h-full retro-glow">
          <div className="p-4 flex flex-col h-full">
            {/* Terminal Header */}
            <div className="mb-4 flex justify-between items-center border-b-2 border-green-500 pb-2">
              <h1 className="text-2xl font-bold retro-text">Freed OS v1.0 - The Truth Awaits</h1>
              <div>
                <button
                  onClick={() => setFontSize(prev => Math.min(prev + 1, 24))}
                  className="px-2 py-1 bg-green-500 text-black mr-2 rounded"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize(prev => Math.max(prev - 1, 10))}
                  className="px-2 py-1 bg-green-500 text-black mr-2 rounded"
                >
                  A-
                </button>
                <button
                  onClick={handleExit}
                  className="px-4 py-2 bg-red-500 text-black hover:bg-red-600 rounded"
                >
                  Exit
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div 
              className="flex-grow flex flex-col"
              onClick={() => inputRef.current?.focus()}
            >
              <div
                ref={terminalRef}
                className="flex-grow overflow-y-scroll mb-4 bg-black bg-opacity-50 p-2 font-mono leading-normal whitespace-pre-wrap h-[calc(100vh-250px)] retro-scanlines"
                style={{
                  fontSize: `${fontSize}px`,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {output.map((line, index) => (
                  <div
                    key={index}
                    className={
                      line.startsWith('neo@')
                        ? 'text-blue-400 retro-text'
                        : 'text-green-400 retro-text'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Challenge Modal, if a puzzle is active */}
              {gameState.currentChallenge && (
                <ChallengeModal
                  challenge={gameState.currentChallenge}
                  onSolve={(solution) => {
                    const result = solveChallenge(solution)
                    setOutput(prev => [...prev, ...result])
                    return result
                  }}
                  onClose={() => {
                    const out = handleCommand('close challenge')
                    setOutput(prev => [...prev, ...out])
                    setGameState(prev => ({ ...prev, currentChallenge: null }))
                  }}
                />
              )}

              {/* Terminal Input */}
              <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-1 relative">
                <span
                  className="text-blue-400 font-mono retro-text"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {loginStage === 'username'
                    ? ''
                    : loginStage === 'password'
                      ? 'password: '
                      : `neo@${gameState.currentLocation}:~$ `
                  }
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-green-500 font-mono retro-text"
                  style={{ fontSize: `${fontSize}px` }}
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {loginStage === 'logged_in' && renderProgressBar()}
    </motion.div>
  )
}

function BootLoader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [memoryAddress, setMemoryAddress] = useState('0x00000000')
  const [loadingMessage, setLoadingMessage] = useState('')
  const [assemblyCode, setAssemblyCode] = useState('')
  const [randomMessage, setRandomMessage] = useState('')
  const [glitchText, setGlitchText] = useState('')

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
    { address: '0x00E0B000', message: 'Bypassing ICE protocols...', assembly: 'CLI\nMOV AL, 0xFF\nOUT 0x21, AL\nOUT 0xA1, AL\nSTI' },
    { address: '0x00F0C000', message: 'Initializing quantum entanglement...', assembly: 'MOV EAX, CR0\nOR EAX, 0x80000000\nMOV CR0, EAX\nJMP 0x08:PModeMain' },
    { address: '0x0A00D000', message: 'Loading AI subroutines...', assembly: 'MOV EAX, 0x1000\nMOV CR3, EAX\nMOV EAX, CR0\nOR EAX, 0x80000000\nMOV CR0, EAX' },
    { address: '0x0B00E000', message: 'Establishing secure data tunnels...', assembly: 'MOV AX, 0x0000\nMOV ES, AX\nMOV DI, 0x0500\nMOV CX, 0x0100\nREP STOSW' },
    { address: '0x0C00F000', message: 'Compiling neural network pathways...', assembly: 'MOV EAX, [0x1000]\nTEST EAX, EAX\nJZ InitNeuralNetwork\nCALL LoadExistingNetwork' },
    { address: '0x0D010000', message: 'Synchronizing with global grid...', assembly: 'MOV ECX, 1000000\nXOR EAX, EAX\n.loop:\nRDTSC\nADD EAX, EDX\nLOOP .loop' },
    { address: '0x0E011000', message: 'FreedOS boot sequence complete.', assembly: 'JMP 0x08:KernelMain\nHLT' },
  ]

  const hackerMessages = [
    'Bypassing firewall...',
    'Cracking encryption...',
    'Injecting payload...',
    'Evading detection...',
    'Spoofing IP address...',
    'Exploiting vulnerabilities...',
    'Intercepting data streams...',
  ]

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      if (currentStep < bootSteps.length) {
        setMemoryAddress(bootSteps[currentStep].address)
        setLoadingMessage(bootSteps[currentStep].message)
        setAssemblyCode(bootSteps[currentStep].assembly)
        setCurrentStep(prev => prev + 1)
        if (Math.random() > 0.7) {
          setRandomMessage(hackerMessages[Math.floor(Math.random() * hackerMessages.length)])
        } else {
          setRandomMessage('')
        }
        setGlitchText(generateGlitchText(bootSteps[currentStep].message))
      } else {
        clearInterval(loadingInterval)
        setTimeout(onLoadingComplete, 1000)
      }
    }, 1000)

    return () => clearInterval(loadingInterval)
  }, [currentStep, onLoadingComplete])

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
    <div className="flex flex-col h-full justify-center items-center space-y-4 bg-black p-4 font-mono overflow-hidden">
      <div className="w-full max-w-4xl space-y-2 crt">
        <pre className="text-green-500 text-xs mb-4 glitch-text">
{`
 ______              _ _____ _____ 
|  ____|            | |  __ \\_   _|
| |__ _ __ ___  ___| | |  | | | |  
|  __| '__/ _ \\/ _ \\ | |  | | | |  
| |  | | |  __/  __/ | |__| |_| |_ 
|_|  |_|  \\___|\\___|_|_____/|_____|
                                   
`}
        </pre>
        <div className="text-2xl font-bold mb-4 glitch-text" data-text="FreedOS v1.0">FreedOS v1.0</div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-400">Memory Address:</span>
          <span className="text-yellow-400 glitch-text">{memoryAddress}</span>
        </div>
        <div className="h-1 bg-green-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / bootSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-sm text-green-400 glitch-text" data-text={loadingMessage}>{loadingMessage}</div>
        <div className="text-sm text-red-500 glitch-text" data-text={glitchText}>{glitchText}</div>
        {randomMessage && (
          <div className="text-xs text-red-500 mt-2 glitch-text">{randomMessage}</div>
        )}
        <div className="mt-4 bg-gray-900 p-2 rounded text-xs">
          <pre className="text-green-300">{assemblyCode}</pre>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className="text-blue-400">CPU: Intel 80386</span>
          <span className="text-blue-400">RAM: 4096 KB</span>
          <span className="text-blue-400">VRAM: 1024 KB</span>
        </div>
        <div className="text-xs text-yellow-400 mt-2">
          WARNING: Unauthorized access detected. Initiating countermeasures...
        </div>
      </div>
      <div className="mt-8 text-xs text-green-600 animate-blink">
        Press any key to interrupt boot sequence...
      </div>
    </div>
  )
}

<style jsx global>{`
  .retro-text {
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
  }

  .retro-scanlines::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 4px;
    z-index: 2;
    pointer-events: none;
  }

  .retro-glow {
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3), 0 0 30px rgba(0, 255, 0, 0.1);
  }

  .animate-pulse {
    animation: pulse 1s infinite;
  }

  .animate-blink {
    animation: blink 1s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

  .glitch-text {
    position: relative;
    display: inline-block;
  }

  .glitch-text::before,
  .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
  }

  .glitch-text::before {
    left: 2px;
    text-shadow: -2px 0 #ff00c1;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
  }

  .glitch-text::after {
    left: -2px;
    text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
    animation: glitch-anim2 1s infinite linear alternate-reverse;
  }

  @keyframes glitch-anim {
    0% {
      clip: rect(31px, 9999px, 94px, 0);
    }
    4% {
      clip: rect(70px, 9999px, 19px, 0);
    }
    8% {
      clip: rect(13px, 9999px, 67px, 0);
    }
    12% {
      clip: rect(57px, 9999px, 98px, 0);
    }
    16% {
      clip: rect(79px, 9999px, 26px, 0);
    }
    20% {
      clip: rect(17px, 9999px, 33px, 0);
    }
    24% {
      clip: rect(47px, 9999px, 91px, 0);
    }
    28% {
      clip: rect(86px, 9999px, 29px, 0);
    }
    32% {
      clip: rect(5px, 9999px, 59px, 0);
    }
    36% {
      clip: rect(82px, 9999px, 48px, 0);
    }
    40% {
      clip: rect(11px, 9999px, 74px, 0);
    }
    44% {
      clip: rect(96px, 9999px, 23px, 0);
    }
    48% {
      clip: rect(40px, 9999px, 55px, 0);
    }
    52% {
      clip: rect(1px, 9999px, 88px, 0);
    }
    56% {
      clip: rect(78px, 9999px, 39px, 0);
    }
    60% {
      clip: rect(25px, 9999px, 62px, 0);
    }
    64% {
      clip: rect(68px, 9999px, 15px, 0);
    }
    68% {
      clip: rect(9px, 9999px, 85px, 0);
    }
    72% {
      clip: rect(51px, 9999px, 97px, 0);
    }
    76% {
      clip: rect(37px, 9999px, 41px, 0);
    }
    80% {
      clip: rect(93px, 9999px, 6px, 0);
    }
    84% {
      clip: rect(30px, 9999px, 60px, 0);
    }
    88% {
      clip: rect(7px, 9999px, 92px, 0);
    }
    92% {
      clip: rect(83px, 9999px, 34px, 0);
    }
    96% {
      clip: rect(52px, 9999px, 75px, 0);
    }
    100% {
      clip: rect(20px, 9999px, 45px, 0);
    }
  }

  @keyframes glitch-anim2 {
    0% {
      clip: rect(65px, 9999px, 100px, 0);
    }
    4% {
      clip: rect(27px, 9999px, 73px, 0);
    }
    8% {
      clip: rect(54px, 9999px, 12px, 0);
    }
    12% {
      clip: rect(45px, 9999px, 89px, 0);
    }
    16% {
      clip: rect(86px, 9999px, 31px, 0);
    }
    20% {
      clip: rect(38px, 9999px, 99px, 0);
    }
    24% {
      clip: rect(18px, 9999px, 76px, 0);
    }
    28% {
      clip: rect(71px, 9999px, 42px, 0);
    }
    32% {
      clip: rect(2px, 9999px, 60px, 0);
    }
    36% {
      clip: rect(94px, 9999px, 25px, 0);
    }
    40% {
      clip: rect(10px, 9999px, 87px, 0);
    }
    44% {
      clip: rect(57px, 9999px, 36px, 0);
    }
    48% {
      clip: rect(79px, 9999px, 6px, 0);
    }
    52% {
      clip: rect(23px, 9999px, 93px, 0);
    }
    56% {
      clip: rect(84px, 9999px, 48px, 0);
    }
    60% {
      clip: rect(40px, 9999px, 15px, 0);
    }
    64% {
      clip: rect(69px, 9999px, 81px, 0);
    }
    68% {
      clip: rect(5px, 9999px, 52px, 0);
    }
    72% {
      clip: rect(97px, 9999px, 21px, 0);
    }
    76% {
      clip: rect(33px, 9999px, 66px, 0);
    }
    80% {
      clip: rect(8px, 9999px, 95px, 0);
    }
    84% {
      clip: rect(50px, 9999px, 11px, 0);
    }
    88% {
      clip: rect(75px, 9999px, 39px, 0);
    }
    92% {
      clip: rect(16px, 9999px, 88px, 0);
    }
    96% {
      clip: rect(61px, 9999px, 30px, 0);
    }
    100% {
      clip: rect(92px, 9999px, 54px, 0);
    }
  }

  .crt::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 2;
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
  }

  .crt {
    animation: flicker 0.15s infinite;
  }

  @keyframes flicker {
    0% {
      opacity: 0.27861;
    }
    5% {
      opacity: 0.34769;
    }
    10% {
      opacity: 0.23604;
    }
    15% {
      opacity: 0.90626;
    }
    20% {
      opacity: 0.18128;
    }
    25% {
      opacity: 0.83891;
    }
    30% {
      opacity: 0.65583;
    }
    35% {
      opacity: 0.67807;
    }
    40% {
      opacity: 0.26559;
    }
    45% {
      opacity: 0.84693;
    }
    50% {
      opacity: 0.96019;
    }
    55% {
      opacity: 0.08594;
    }
    60% {
      opacity: 0.20313;
    }
    65% {
      opacity: 0.71988;
    }
    70% {
      opacity: 0.53455;
    }
    75% {
      opacity: 0.37288;
    }
    80% {
      opacity: 0.71428;
    }
    85% {
      opacity: 0.70419;
    }
    90% {
      opacity: 0.7003;
    }
    95% {
      opacity: 0.36108;
    }
    100% {
      opacity: 0.24387;
    }
  }

  .crt::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(18, 16, 16, 0.1);
    opacity: 0;
    z-index: 2;
    pointer-events: none;
    animation: flicker 0.15s infinite;
  }
`}</style>

