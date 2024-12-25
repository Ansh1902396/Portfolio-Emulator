import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContextMenu } from './ContextMenu'

interface Project {
  name: string
  description: string
  technologies: string[]
  icon: React.ReactNode
}

interface SocialApp {
  name: string
  url: string
  icon: React.ReactNode
}

interface DockProps {
  projects: Project[]
  socialApps: SocialApp[]
  onOpenApp: (appName: string) => void
  onOpenLink: (url: string, title: string) => void
  isDarkMode: boolean
  onRemoveFromDock: (appName: string) => void
}

export function Dock({ projects, socialApps, onOpenApp, onOpenLink, isDarkMode, onRemoveFromDock }: DockProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: Project | SocialApp } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, item: Project | SocialApp) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleOpenItem = (item: Project | SocialApp) => {
    if ('url' in item) {
      onOpenLink(item.url, item.name)
    } else {
      onOpenApp(item.name)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`flex gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-black/10`}
      >
        {projects.map((project) => (
          <DockIcon key={project.name} item={project} onOpenItem={handleOpenItem} isDarkMode={isDarkMode} handleContextMenu={handleContextMenu} />
        ))}
        {socialApps.map((app) => (
          <DockIcon key={app.name} item={app} onOpenItem={handleOpenItem} isDarkMode={isDarkMode} handleContextMenu={handleContextMenu} />
        ))}
      </motion.div>
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            item={contextMenu.item}
            onClose={() => setContextMenu(null)}
            isDarkMode={isDarkMode}
            onOpenItem={handleOpenItem}
            onRemoveFromDock={onRemoveFromDock}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface DockIconProps {
  item: Project | SocialApp
  onOpenItem: (item: Project | SocialApp) => void
  isDarkMode: boolean
  handleContextMenu: (e: React.MouseEvent, item: Project | SocialApp) => void;
}

function DockIcon({ item, onOpenItem, isDarkMode, handleContextMenu }: DockIconProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.2, 
        y: -10,
        transition: { type: 'spring', stiffness: 300, damping: 10 }
      }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer"
      onClick={() => onOpenItem(item)}
      onContextMenu={(e) => handleContextMenu(e, item)}
    >
      {item.icon}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        } border-2 border-black/10 rounded-lg whitespace-nowrap`}
      >
        <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {item.name}
        </span>
      </motion.div>
    </motion.div>
  )
}

