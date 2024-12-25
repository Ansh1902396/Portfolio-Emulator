import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dock } from './Dock'
import { AppDrawer } from './AppDrawer'
import { ProjectApp } from './ProjectApp'
import { InfoModal } from './InfoModal'
import { InstructionsModal } from './InstructionsModal'
import { MatrixHackingSimulator } from './MatrixHackingSimulator'
import { ContextMenu } from './ContextMenu'
import { Clock } from './Clock'
import { CustomCursor } from './CustomCursor'
import { Project, SocialApp } from '../types/app-types'

const projects: Project[] = [
  {
    name: "Augmentium",
    description: "A decentralized stablecoin pegged to gold using CosmWasm smart contracts.",
    technologies: ["CosmWasm", "Rust", "Cosmos SDK"],
    icon: <div className="w-16 h-16 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl font-bold">Au</div>,
    github: "https://github.com/Ansh1902396/Augmentium"
  },
  {
    name: "On-Chain-Data-Encryption",
    description: "Encryption framework using ChaCha20-Poly1305 within Artela Blockchain smart contracts.",
    technologies: ["Solidity", "ChaCha20-Poly1305", "Artela Blockchain"],
    icon: <div className="w-16 h-16 bg-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl">🔒</div>,
    github: "https://github.com/Ansh1902396/On-Chain-Data-Encryption"
  },
  {
    name: "AE-Forge",
    description: "Low-code platform for Sophia smart contract creation with LLM-based guidance.",
    technologies: ["TypeScript", "React", "Web3Auth"],
    icon: <div className="w-16 h-16 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl">⚒️</div>,
    github: "https://github.com/Ansh1902396/AE-forge"
  },
  {
    name: "KageGroove",
    description: "A memory-efficient music player in Rust with SDL.",
    technologies: ["Rust", "SDL"],
    icon: <div className="w-16 h-16 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl">🎵</div>,
    github: "https://github.com/Ansh1902396/KageGroove"
  },
  {
    name: "Drona-AI",
    description: "AI-Powered Personalized Education Platform inspired by Dronacharya's teachings.",
    technologies: ["Next.js 13", "OpenAI API", "Tailwind CSS"],
    icon: <div className="w-16 h-16 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl">🧠</div>,
    github: "https://github.com/Ansh1902396/Drona"
  },
  {
    name: "Matrix Hacking Simulator",
    description: "A challenging game to test your decoding and hacking skills in the Matrix.",
    technologies: ["React", "TypeScript", "Framer Motion"],
    icon: <div className="w-16 h-16 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl">🕵️</div>,
    github: "https://github.com/Ansh1902396/matrix-terminal-portfolio"
  },
  {
    name: "Terminal",
    description: "Access the command-line interface",
    technologies: ["React", "TypeScript"],
    icon: <div className="w-16 h-16 bg-black border-4 border-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
    </div>,
    github: "https://github.com/Ansh1902396/matrix-terminal-portfolio"
  },
]

const socialApps: SocialApp[] = [
  {
    name: "GitHub",
    icon: <div className="w-16 h-16 bg-gray-800 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-github" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.872c0-.532-.05-.787-.145-.927-.095-.14-.233-.098-.387.003-.154.1-.317.23-.458.41-.14.18-.28.396-.387.611-.107.215-.069.663.073.927.144.264.346.469.617.637.27.168.68.272 1.09.362.72.186 1.53.293 2.36.293 5 0 9-4 9-9c0-1.31-.21-2.57-.59-3.79-.37-.12-.77-.183-1.19-.183-.42 0-.82.063-1.19.183-.38 1.22-.59 2.48-.59 3.79 0 4.99 4 9 9 9z"/></svg>
    </div>,
    url: "https://github.com/Ansh1902396"
  },
  {
    name: "LinkedIn",
    icon: <div className="w-16 h-16 bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-linkedin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
    </div>,
    url: "https://www.linkedin.com/in/rudransh-shinghal-264b37206/"
  },
  {
    name: "Twitter",
    icon: <div className="w-16 h-16 bg-sky-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-twitter" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
    </div>,
    url: "https://twitter.com/rudransh190204"
  },
  {
    name: "Telegram",
    icon: <div className="w-16 h-16 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.968.193 1.798.919 2.286 1.61.516 3.275 1.009 4.654 1.472.509 1.793.997 3.592 1.48 5.388.16.36.506.494.864.498.355.004.857-.106 1.045-.499.19-.323.485-.772.773-1.215.152-.229.346-.509.524-.769.385-.565.392-.56.741-.56.232 0 .765.196 1.412.491.647.294 1.29.587 1.862.87.687.262 1.17.827 1.484 1.048.159.112.499.256.976.256.322 0 .755-.12 1.017-.525.262-.405.308-.935.35-1.469.042-.534.082-1.204.125-2.286.043-1.082.088-2.222.127-3.401.04-1.18.079-2.341.103-3.358.008-.339.021-.67.013-.982-.016-.311-.059-.448-.163-.557-.1-.11-.364-.142-.563-.156-.2-.01-.453-.014-.754-.013-.302 0-.611.001-.931.021-.32.02-.605.041-.882.071z"/></svg>
    </div>,
    url: "https://t.me/That_guy_Rudransh"
  },
  {
    name: "Warpcast",
    icon: <div className="w-16 h-16 bg-purple-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 12V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 28V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 16H28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>,
    url: "https://warpcast.com/kakashi-hatake19"
  }
]

interface OSDesktopProps {
  onSwitchToTerminal: () => void
}

export function OSDesktop({ onSwitchToTerminal }: OSDesktopProps) {
  const [openApp, setOpenApp] = useState<string | null>(null)
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true) 
  const [dockItems, setDockItems] = useState([...projects, ...socialApps])
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false)
  const [isGameOpen, setIsGameOpen] = useState(false)

  const toggleAppDrawer = () => setIsAppDrawerOpen(!isAppDrawerOpen)
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  const toggleInfoModal = () => setIsInfoModalOpen(!isInfoModalOpen)
  const toggleInstructionsModal = () => setIsInstructionsModalOpen(!isInstructionsModalOpen)
  const toggleGame = () => setIsGameOpen(!isGameOpen)

  const handleRemoveFromDock = (appName: string) => {
    setDockItems(dockItems.filter(item => item.name !== appName))
  }

  const handleOpenLink = (url: string, title: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleOpenApp = (appName: string) => {
    if (appName === "Matrix Hacking Simulator") {
      setIsGameOpen(true);
    } else if (appName === "Terminal") {
      onSwitchToTerminal();
    } else {
      setOpenApp(appName);
    }
  }

  return (
    <div className={`h-screen w-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} transition-colors duration-300`}> 
      <CustomCursor isDarkMode={isDarkMode} />
      <div className="absolute inset-0 z-0">
        <img 
          src="https://wallpapercave.com/wp/wp9324707.jpg" 
          alt="background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      </div>
      
      <div className="relative z-10">
        <motion.div 
          className={`absolute top-4 left-4 right-4 h-16 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6`}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAppDrawer}
            className={`w-12 h-12 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-400'} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-grid" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </motion.button>
          <span className={`text-black font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>NeoOS</span>
          <div className="flex items-center space-x-6">
            <Clock isDarkMode={isDarkMode} />
            <ContextMenu
              isDarkMode={isDarkMode}
              onToggleTheme={toggleDarkMode}
              onSwitchToTerminal={onSwitchToTerminal}
              onOpenInfo={toggleInfoModal}
              onOpenInstructions={toggleInstructionsModal}
              onOpenGame={toggleGame}
            />
          </div>
        </motion.div>
        <AnimatePresence>
          {isAppDrawerOpen && (
            <div className="relative z-10 flex items-center justify-center min-h-screen">
              <AppDrawer 
                projects={projects} 
                socialApps={socialApps}
                onOpenApp={handleOpenApp} 
                onClose={toggleAppDrawer} 
                isDarkMode={isDarkMode} 
                onOpenGame={toggleGame}
              />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {openApp && (
            <ProjectApp
              project={projects.find(p => p.name === openApp)!}
              onClose={() => setOpenApp(null)}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>
        <Dock 
          projects={dockItems.filter(item => 'technologies' in item)} 
          socialApps={dockItems.filter(item => 'url' in item)} 
          onOpenApp={handleOpenApp} 
          onOpenLink={handleOpenLink}
          isDarkMode={isDarkMode} 
          onRemoveFromDock={handleRemoveFromDock}
        />
        <InfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          isDarkMode={isDarkMode}
        />
        <InstructionsModal
          isOpen={isInstructionsModalOpen}
          onClose={() => setIsInstructionsModalOpen(false)}
          isDarkMode={isDarkMode}
        />
        <AnimatePresence>
          {isGameOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl"
              >
                <MatrixHackingSimulator
                  onClose={() => setIsGameOpen(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
