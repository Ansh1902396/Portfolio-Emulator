import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize, ExternalLink } from 'lucide-react'

interface IframeModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export function IframeModal({ isOpen, onClose, url, title }: IframeModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const openInNewTab = () => {
    window.open(url, '_blank')
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
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl h-3/4 border-4 border-black"
          >
            <div className="flex items-center justify-between p-4 border-b-4 border-black bg-gray-100">
              <h2 className="text-xl font-bold">{title}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={openInNewTab}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors border-2 border-black"
                  title="Open in new tab"
                >
                  <ExternalLink size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors border-2 border-black"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="relative h-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-16 h-16 border-t-4 border-b-4 border-black rounded-full animate-spin"></div>
                </div>
              )}
              <iframe
                src={url}
                title={title}
                className="w-full h-full border-none"
                onLoad={handleIframeLoad}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

