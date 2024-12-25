import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Maximize2, ChevronRight } from 'lucide-react'

interface Project {
  name: string
  description: string
  technologies: string[]
  icon: React.ReactNode
}

interface ProjectAppProps {
  project: Project
  onClose: () => void
  isDarkMode: boolean
}

export function ProjectApp({ project, onClose, isDarkMode }: ProjectAppProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  const toggleMinimize = () => setIsMinimized(!isMinimized)
  const toggleMaximize = () => setIsMaximized(!isMaximized)

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            width: isMaximized ? '100%' : '75%',
            height: isMaximized ? 'calc(100% - 6rem)' : '75%',
            top: isMaximized ? '6rem' : '12.5%',
            left: isMaximized ? 0 : '12.5%',
          }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col`}
        >
          <div className={`p-4 flex items-center justify-between border-b-4 border-black ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onClose}
                className="w-8 h-8 bg-red-400 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
              <button 
                onClick={toggleMinimize}
                className="w-8 h-8 bg-yellow-400 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              >
                <Minus size={16} className="text-black" />
              </button>
              <button 
                onClick={toggleMaximize}
                className="w-8 h-8 bg-green-400 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              >
                <Maximize2 size={16} className="text-white" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {project.icon}
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {project.name}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <div className={`mb-8 p-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            } border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {project.description}
              </p>
            </div>
            <h3 className={`text-2xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Technologies
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {project.technologies.map((tech) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center p-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <ChevronRight className={`mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} size={24} />
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{tech}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

