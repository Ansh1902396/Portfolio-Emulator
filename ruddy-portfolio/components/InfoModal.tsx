import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Code, Briefcase, BookOpen, Mail } from 'lucide-react'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

const sections = [
  { id: 'about', name: 'About', icon: User },
  { id: 'skills', name: 'Skills', icon: Code },
  { id: 'projects', name: 'Projects', icon: Briefcase },
  { id: 'education', name: 'Education', icon: BookOpen },
  { id: 'contact', name: 'Contact', icon: Mail },
]

export function InfoModal({ isOpen, onClose, isDarkMode }: InfoModalProps) {
  const [activeSection, setActiveSection] = useState('about')

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://avatars.githubusercontent.com/u/84223519?v=4"
                alt="Rudransh Shinghal"
                className="w-24 h-24 rounded-full border-4 border-black"
              />
              <div>
                <h3 className="text-2xl font-bold">Konichiwa 👋 I'm Rudransh Shinghal</h3>
                <p className="text-lg mt-2">20-year-old tech enthusiast | Open source advocate | Blockchain explorer</p>
              </div>
            </div>
            <p className="text-lg">
              Hey there! 👋 I'm all about open source and development. From DevOps to Blockchain, I love diving into new challenges and crafting innovative solutions. With a passion for clean code and a drive to make a difference, I'm ready to collaborate and build something awesome. Let's connect and create magic together! ✨🚀
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>🌱 Learning: Data Structures & Algorithms, System Programming, Web Assembly</li>
              <li>💼 Open for: Collaborations in DevOps, Blockchain, and Open Source projects</li>
              <li>💬 Let's talk about: System Design, Blockchain Technology, or the latest tech trends</li>
              <li>🎮 Hobbies: Gaming Addict, Watching Anime, Reading Sci-Fi Novels</li>
            </ul>
          </div>
        )
      case 'skills':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">🛠️ Languages & Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Git', 'Rust', 'Docker', 'C', 'Vim', 'Solidity', 'Go', 'Notion', 'Bun', 'Next.js', 'React', 'WebAssembly', 'TypeScript', 'JavaScript'].map((tool) => (
                <div key={tool} className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-bold">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'projects':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">✨ Amazing Open Source Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-bold text-xl">HireSight Frontend</h4>
                <p className="mt-2">"I know frontend."</p>
                <a href="https://github.com/HireSight/Frontend" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-500 hover:underline">View on GitHub</a>
              </div>
              <div className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-bold text-xl">AE-Forge</h4>
                <p className="mt-2">"Let's forge something amazing!"</p>
                <a href="https://github.com/Ansh1902396/AE-forge" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-500 hover:underline">View on GitHub</a>
              </div>
              <div className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-bold text-xl">X_Place</h4>
                <p className="mt-2">"Let's make our mark on the world."</p>
                <a href="https://github.com/Suryansh-23/X_Place" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-500 hover:underline">View on GitHub</a>
              </div>
            </div>
          </div>
        )
      case 'education':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">🎓 Education</h3>
            <div className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="font-bold text-xl">LNM Institute of Information Technology, Jaipur</h4>
              <p className="mt-2">B.Tech-M.Tech in Electronics and Communications</p>
              <p className="mt-1">Sept 2022 – May 2027</p>
            </div>
          </div>
        )
      case 'contact':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">📫 Let's Connect!</h3>
            <p className="text-lg">Ready to embark on an epic coding adventure? Whether you want to debug the matrix, raid a digital dungeon, or just chat about the latest tech, I'm your player two! 🕹️👾</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="mailto:rudransh9shinghal@gmail.com" className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors">
                <h4 className="font-bold text-xl">Email</h4>
                <p className="mt-2">rudransh9shinghal@gmail.com</p>
              </a>
              <a href="https://www.linkedin.com/in/rudransh-shinghal-264b37206/" target="_blank" rel="noopener noreferrer" className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors">
                <h4 className="font-bold text-xl">LinkedIn</h4>
                <p className="mt-2">Rudransh Shinghal</p>
              </a>
              <a href="https://twitter.com/rudransh190204" target="_blank" rel="noopener noreferrer" className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors">
                <h4 className="font-bold text-xl">Twitter</h4>
                <p className="mt-2">@rudransh190204</p>
              </a>
              <a href="https://github.com/Ansh1902396" target="_blank" rel="noopener noreferrer" className="p-4 border-4 border-black bg-white text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors">
                <h4 className="font-bold text-xl">GitHub</h4>
                <p className="mt-2">Ansh1902396</p>
              </a>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className={`w-full max-w-6xl h-[80vh] ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            } rounded-lg shadow-lg border-4 border-black overflow-hidden flex`}
          >
            {/* Sidebar */}
            <div className={`w-64 border-r-4 border-black ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full p-4 flex items-center space-x-2 ${
                    activeSection === section.id
                      ? isDarkMode
                        ? 'bg-gray-600'
                        : 'bg-gray-200'
                      : ''
                  } hover:bg-gray-200 transition-colors`}
                >
                  <section.icon size={24} />
                  <span className="font-bold">{section.name}</span>
                </button>
              ))}
            </div>
            {/* Main content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Rudransh Shinghal - {sections.find(s => s.id === activeSection)?.name}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

