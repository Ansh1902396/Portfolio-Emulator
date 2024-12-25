import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatrixGame } from '../hooks/use-matrix-game'
import { ChallengeModal } from './ChallengeModal'
import EndGameModal from './EndGameModal'

interface RetroTerminalProps {
  onExit: () => void
}

export function RetroTerminal({ onExit }: RetroTerminalProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const { gameState, handleCommand, currentDialog, currentCharacter, setGameState, initialGameState, solveChallenge } = useMatrixGame()
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isBooting, setIsBooting] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [loginStage, setLoginStage] = useState<'username' | 'password' | 'logged_in'>('username')

  useEffect(() => {
    if (!isBooting) {
      setOutput([
        "Freed OS 1.0",
        "...",
        "login: _"
      ])
    }
  }, [isBooting])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      if (loginStage === 'username') {
        setOutput(prev => [...prev, `login: ${input}`, "password: _"])
        setLoginStage('password')
      } else if (loginStage === 'password') {
        setOutput(prev => [...prev, "password: ********", "", "Last login: Wed Mar 15 09:22:01 on tty1", "SYNAPSE: \"Welcome, Neo. The truth awaits in your home directory. Type 'help' if you feel lost.\"", ""])
        setLoginStage('logged_in')
        const result = handleCommand('login');
        setOutput(prev => [...prev, ...result])
      } else {
        const result = handleCommand(input);
        if (result[0] !== 'CLEAR') {
          setOutput((prev) => [
            ...prev,
            `neo@${gameState.currentLocation}:~$ ${input}`,
            ...result
          ]);
        } else {
          setOutput([]);
        }
      }
      setHistory((prev) => [input, ...prev]);
      setHistoryIndex(-1);
      setInput('');
    }
  };

  const renderProgressBar = () => {
    const progress = (gameState.storyProgress / gameState.objectives.length) * 100;
    return (
      <div className="mt-4 bg-gray-700 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-green-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  useEffect(() => {
    if (gameState.storyProgress > 0) {
      setOutput((prev) => [
        ...prev,
        `Story Progress: ${gameState.storyProgress} / ${gameState.objectives.length}`,
        `Current Objective: ${gameState.objectives[gameState.storyProgress - 1]}`,
      ]);
    }
  }, [gameState.storyProgress, gameState.objectives]);

  useEffect(() => {
    if (gameState.currentLocation === '/usr/src/kernel_freedom' && !gameState.completedObjectives.includes("Edit the Makefile")) {
      setOutput(prev => [
        ...prev,
        "",
        "SYNAPSE: \"You've reached a crucial point, Neo. Use 'nano Makefile' to make your final choice.\"",
        "SYNAPSE: \"Then use 'make' to compile and install the Freed Kernel.\"",
        ""
      ])
    }
  }, [gameState.currentLocation, gameState.completedObjectives])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-green-500 font-mono p-4 overflow-hidden"
    >
      {gameState.isGameOver && (
        <EndGameModal
          onRestart={() => {
            setGameState(initialGameState);
            setOutput([]);
          }}
          onExit={onExit}
        />
      )}
      {isBooting ? (
        <BootLoader onLoadingComplete={() => setIsBooting(false)} />
      ) : (
        <div className="border-4 border-green-500 rounded-lg overflow-hidden flex flex-col h-full retro-glow">
          <div className="p-4 flex flex-col h-full">
            <div className="mb-4 flex justify-between items-center border-b-2 border-green-500 pb-2">
              <h1 className="text-2xl font-bold retro-text">Freed OS v1.0 - The Truth Awaits</h1>
              <div>
                <button onClick={() => setFontSize(prev => Math.min(prev + 1, 24))} className="px-2 py-1 bg-green-500 text-black mr-2 rounded">A+</button>
                <button onClick={() => setFontSize(prev => Math.max(prev - 1, 10))} className="px-2 py-1 bg-green-500 text-black mr-2 rounded">A-</button>
                <button onClick={onExit} className="px-4 py-2 bg-red-500 text-black hover:bg-red-600 rounded">Exit</button>
              </div>
            </div>
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
                    className={`${line && typeof line === 'string' && line.startsWith('neo@') ? 'text-blue-400' : 'text-green-400'} retro-text`}
                  >
                    {line}
                  </div>
                ))}
              </div>
              {gameState.currentChallenge && (
                <ChallengeModal
                  challenge={gameState.currentChallenge}
                  onSolve={(solution) => {
                    const result = solveChallenge(solution);
                    setOutput((prev) => [...prev, ...result]);
                    return result;
                  }}
                  onClose={() => {
                    const result = handleCommand('close challenge');
                    setOutput((prev) => [...prev, ...result]);
                    setGameState(prev => ({ ...prev, currentChallenge: null }));
                  }}
                />
              )}
              <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-1 relative">
                <span className="text-blue-400 font-mono retro-text" style={{ fontSize: `${fontSize}px` }}>
                  {loginStage === 'username' ? '' : 
                   loginStage === 'password' ? 'password: ' : 
                   `neo@${gameState.currentLocation}:~$ `}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const bootOptions = [
    "FreedOS GNU/Linux",
    "Advanced options for FreedOS GNU/Linux",
    "Memory test (memtest86+)",
    "Memory test (memtest86+, serial console)",
  ];
  const bootSteps = [
    "Loading FreedOS kernel...",
    "Mounting root filesystem...",
    "Checking for system integrity...",
    "Initializing Matrix connection...",
    "Starting FreedOS...",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedOption((prev) => (prev > 0 ? prev - 1 : bootOptions.length - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedOption((prev) => (prev < bootOptions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        startBoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startBoot = () => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < bootSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 1000);
          return prev;
        }
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full p-4 font-mono text-green-500 bg-black">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">FreedOS GRUB Bootloader</h1>
        <p>Version 2.04</p>
      </div>
      {currentStep === 0 ? (
        <>
          <div className="mb-4">
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
            <p>Press enter to boot the selected OS.</p>
          </div>
        </>
      ) : (
        <div className="flex-grow">
          {bootSteps.map((step, index) => (
            <div key={index} className={index <= currentStep ? "visible" : "invisible"}>
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
`}</style>

