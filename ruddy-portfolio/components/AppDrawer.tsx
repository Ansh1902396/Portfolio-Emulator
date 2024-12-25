import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, Linkedin, Twitter, Terminal, ChevronLeft, ChevronRight } from 'lucide-react'

interface Project {
  name: string
  description: string
  technologies: string[]
  icon: React.ReactNode
}

interface SocialApp {
  name: string
  icon: React.ReactNode
  url: string
}

interface AppDrawerProps {
  projects: Project[]
  socialApps: SocialApp[]
  onOpenApp: (appName: string) => void
  onClose: () => void
  isDarkMode: boolean
  onOpenGame: () => void
}

export function AppDrawer({ projects, socialApps, onOpenApp, onClose, isDarkMode, onOpenGame }: AppDrawerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const appsPerPage = 8
  const allApps = [
    ...projects,
    ...socialApps,
    {
      name: "Matrix Game",
      icon: (
        <div className="w-16 h-16 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <Terminal size={32} className="text-white" />
        </div>
      ),
      description: "Enter the Matrix and uncover the truth",
      technologies: ["React", "TypeScript", "Framer Motion"]
    }
  ]
  const totalPages = Math.ceil(allApps.length / appsPerPage)

  const startIndex = currentPage * appsPerPage
  const endIndex = startIndex + appsPerPage
  const currentApps = allApps.slice(startIndex, endIndex)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`w-full max-w-5xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
        } border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 overflow-y-auto max-h-[80vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>
            App Launcher
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-12 h-12 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
          >
            <X size={24} className="text-white" />
          </motion.button>
        </div>
        <div className="space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentApps.map((item) => (
              <AppIcon
                key={item.name}
                name={item.name}
                icon={item.icon}
                onClick={() => {
                  if ('url' in item) {
                    window.open(item.url, '_blank')
                  } else if (item.name === "Matrix Game") {
                    onOpenGame()
                  } else {
                    onOpenApp(item.name)
                  }
                  onClose()
                }}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevPage}
                className={`w-12 h-12 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                } border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center`}
              >
                <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-black'} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextPage}
                className={`w-12 h-12 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                } border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center`}
              >
                <ChevronRight size={24} className={isDarkMode ? 'text-white' : 'text-black'} />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface AppIconProps {
  name: string
  icon: React.ReactNode
  onClick: () => void
  isDarkMode: boolean
}

function AppIcon({ name, icon, onClick, isDarkMode }: AppIconProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {icon}
      </motion.div>
      <span className={`mt-4 font-bold text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {name}
      </span>
    </motion.div>
  )
}

