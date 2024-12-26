'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef } from 'react'
import { CommandLine } from './command-line'
import { Output } from './output'
import { MatrixBackground } from './matrix-background'
import { useCommands } from '../hooks/use-commands'
import { MatrixGame } from './MatrixGame'
import { TerminalModal } from './TerminalModal'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { VimModal } from './VimModal'
import { GUIMode } from './GUIMode'
import { BootLoader } from './BootLoader'
import { FreedOSBootloader } from './FreedOSBootloader'
import { MatrixGameMode } from './MatrixGameMode'

// Dynamically import VimModal with no SSR
const VimModalDynamic = dynamic(() => import('./VimModal').then(mod => ({ default: mod.VimModal })), { 
  ssr: false 
})

interface GameState {
  location: string;
  inventory: string[];
  health: number;
  isGameOver: boolean;
}

const initialGameState: GameState = {
  location: 'entrance',
  inventory: [],
  health: 100,
  isGameOver: false,
};

function Terminal() {
  const [history, setHistory] = useState<(string | JSX.Element)[]>([])
  const [booted, setBooted] = useState(false)
  const [isVimActive, setIsVimActive] = useState(false)
  const [username] = useState('user')
  const [hostname] = useState('matrix-terminal')
  const [asciiArt, setAsciiArt] = useState<string>('')
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null)
  const [isGameActive, setIsGameActive] = useState(false)
  const [currentDirectory, setCurrentDirectory] = useState('/home/user')
  const [files, setFiles] = useState<Record<string, string>>({})
  const [isGUIMode, setIsGUIMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFreedOSMode, setIsFreedOSMode] = useState(false)
  const [previousMode, setPreviousMode] = useState<'gui' | 'terminal'>('terminal');
  const { 
    executeCommand, 
    getCurrentPath, 
    gameState, 
    resetGame, 
    isModalOpen,
    setIsModalOpen,
    modalContent,
    setModalContent,
    openModal,
    closeModal,
    challengeState,
    handleSolveChallenge,
    isInfoModalOpen,
    setIsInfoModalOpen,
    infoModalContent,
    isVimModalOpen,
    setIsVimModalOpen,
    vimContent,
    setVimContent,
    currentFileName,
    setCurrentFileName,
    files: filesFromHook,
    setFiles: setFilesFromHook,
    handleFileOperation,
  } = useCommands()
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    const bootSequence = [
      { text: "Initializing system...", delay: 500 },
      { text: "Loading kernel modules...", delay: 400 },
      { text: "Mounting file systems...", delay: 300 },
      { text: "Starting network services...", delay: 200 },
      { text: "Launching user interface...", delay: 100 },
      { text: "System ready.", delay: 300 },
    ]

    let totalDelay = 0
    bootSequence.forEach(({ text, delay }, index) => {
      totalDelay += delay
      setTimeout(() => {
        setHistory(prev => [...prev, 
          <div key={`boot-${index}`} className="text-emerald-400 opacity-0 animate-fadeIn">
            {text}
          </div>
        ])
      }, totalDelay)
    })

    setAsciiArt(executeCommand('ascii') as string)

    setTimeout(() => {
      setBooted(true)
      setHistory(prev => [
        ...prev,
        '',
        ''
      ])
      startWelcomeMessage()
    }, totalDelay + 500)
  }, [])

  const startWelcomeMessage = () => {
    const message = "Welcome to Ruddy's OverEngineered Terminal Portfolio. Type \"help\" for available commands. and play the game to explore the Matrix simulation."
    setWelcomeMessage(message)
    setHistory(prev => [...prev, ''])
  }

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.split(' ')
    let output: string | JSX.Element | Promise<string>

    const result = executeCommand(command)
    if (result === 'ENTER_FREED_OS') {
      setIsFreedOSMode(true)
      return
    }

    if (cmd.toLowerCase() === 'vim') {
      const fileName = args[0] || 'untitled.txt'
      setCurrentFileName(fileName)
      setVimContent(filesFromHook[fileName] || '')
      setIsVimModalOpen(true)
      return
    }

    if (cmd.toLowerCase() === 'gui') {
      setIsLoading(true);
      setPreviousMode('terminal');
      return;
    }

    if (isGameActive) {
      output = executeCommand(`game ${command}`)
      if (typeof output === 'string' && output.endsWith('|GAME_OVER')) {
        output = output.replace('|GAME_OVER', '')
        setIsGameActive(false)
        resetGame()
        setHistory(prev => [
          ...prev,
          <motion.div
            key={`game-over-${Date.now()}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-yellow-400 font-bold text-xl mb-4"
          >
            {output}
          </motion.div>,
          <motion.div
            key={`game-exit-${Date.now()}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-emerald-400 font-bold text-lg mb-4"
          >
            The Matrix simulation has ended. You have been disconnected and returned to the real world.
          </motion.div>
        ])
        return
      }
    } else {
      output = executeCommand(command)
    }

    if (output === 'CLEAR') {
      setHistory([])
    } else {
      setHistory(prev => [
        ...prev,
        <div key={`cmd-${Date.now()}`} className="flex items-center gap-2 animate-slideIn">
          <span className="text-emerald-300">{isGameActive ? "matrix" : username}@{isGameActive ? gameState.location : hostname}:{isGameActive ? "" : currentDirectory}$</span>
          <span className="text-emerald-400">{command}</span>
        </div>,
        <div key={`out-${Date.now()}`} className="text-emerald-400 animate-fadeIn whitespace-pre-wrap">
          {output}
        </div>,
        ''
      ])
    }

    setCurrentDirectory(getCurrentPath())

    if (cmd.toLowerCase() === 'play' && !isGameActive) {
      setIsGameActive(true)
      setHistory(prev => [
        ...prev,
        <motion.div
          key={`game-start-${Date.now()}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-green-400 font-bold text-xl mb-4"
        >
          Entering the Matrix Simulation...
        </motion.div>
      ])
    } else if (cmd.toLowerCase() === 'exit' && isGameActive) {
      setIsGameActive(false)
      resetGame()
      setHistory(prev => [
        ...prev,
        <motion.div
          key={`game-end-${Date.now()}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-400 font-bold text-xl mb-4"
        >
          Exiting the Matrix Simulation...
        </motion.div>
      ])
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c') {
        if (isGameActive) {
          setIsGameActive(false)
          resetGame()
          setHistory(prev => [
            ...prev,
            <motion.div
              key={`game-interrupt-${Date.now()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400"
            >
              Game terminated. Type "play" to start a new game.
            </motion.div>
          ])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isGameActive, resetGame])

  const WelcomeBox = ({ message }: { message: string }) => (
    <div className="border border-emerald-400 p-4 mb-4 rounded text-center">
      <p className="text-emerald-400">{message}</p>
    </div>
  )

  return (
    <div 
      ref={terminalRef}
      className="relative w-full h-screen overflow-auto bg-black text-emerald-400 font-mono"
    >
      {isFreedOSMode && (
        <MatrixGameMode onExit={(prevMode) => {
          setIsFreedOSMode(false);
          if (prevMode === 'gui') {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setIsGUIMode(true);
            }, 3000);
          }
        }} />
      )}
      {!isFreedOSMode && (
        <>
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50"
              >
                <BootLoader onLoadingComplete={() => {
                  setIsLoading(false)
                  setIsGUIMode(true)
                }} />
              </motion.div>
            )}
          </AnimatePresence>
          {isGUIMode ? (
            <GUIMode onSwitchToTerminal={() => {
              setIsLoading(true)
              setTimeout(() => {
                setIsGUIMode(false)
                setIsLoading(false)
              }, 3000)
            }} />
          ) : (
            <>
              <MatrixBackground />
              <div className="relative z-10 p-4 min-h-full flex flex-col">
                {asciiArt && (
                  <pre className="text-emerald-400 whitespace-pre text-center mb-4 animate-fadeIn font-mono text-sm sm:text-base md:text-lg lg:text-xl animate-subtle-glow">
                    {asciiArt}
                  </pre>
                )}
                {welcomeMessage && <WelcomeBox message={welcomeMessage} />}
                <Output history={history} />
                {isGameActive ? (
                  <>
                    <MatrixGame 
                      gameState={gameState} 
                      challengeState={challengeState}
                      onCommand={handleCommand} 
                      openModal={openModal}
                      closeModal={closeModal}
                      isModalOpen={isModalOpen}
                      modalContent={modalContent}
                      onSolveChallenge={handleSolveChallenge}
                    />
                    <CommandLine 
                      onCommand={handleCommand}
                      username="matrix"
                      hostname={gameState.location}
                      currentDirectory={currentDirectory}
                      showCursor={true}
                      isGameMode={true}
                    />
                  </>
                ) : (
                  booted && (
                    <CommandLine 
                      onCommand={handleCommand}
                      username={username}
                      hostname={hostname}
                      currentDirectory={currentDirectory}
                      showCursor={true}
                      isGameMode={false}
                    />
                  )
                )}
              </div>
              <TerminalModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                title={infoModalContent.title}
                content={infoModalContent.content}
              />
              <VimModal
                isOpen={isVimModalOpen}
                onClose={() => setIsVimModalOpen(false)}
                initialContent={vimContent}
                onSave={(content) => {
                  setFilesFromHook(prev => ({ ...prev, [currentFileName]: content }))
                  handleFileOperation('write', currentFileName, content)
                  setIsVimModalOpen(false)
                }}
                fileName={currentFileName}
              />
            </>
          )}
        </>
      )}
      <style jsx>{`
        @keyframes subtleGlow {
          0%, 100% { text-shadow: 0 0 2px #0f0, 0 0 4px #0f0; }
          50% { text-shadow: 0 0 3px #0f0, 0 0 6px #0f0; }
        }
        .animate-glow {
          animation: subtleGlow 3s ease-in-out infinite;
        }
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

        .font-mono {
          font-family: 'Fira Code', monospace;
        }
      `}</style>
      <style jsx global>{`
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  .typing-effect {
    display: inline-block;
    overflow: hidden;
    border-right: 2px solid #059669;
    white-space: nowrap;
    animation: typing 3s steps(40, end),
               blink-caret 0.75s step-end infinite;
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #059669 }
  }

  /* Input autofill styles */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: #10B981;
    -webkit-box-shadow: 0 0 0px 1000px #000 inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`}</style>
    </div>
  )
}

// Use default export with no SSR
export default dynamic(() => Promise.resolve(Terminal), {
  ssr: false
})

