'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const gifs = [
  "https://media.giphy.com/media/j5KRhI0lTgrq0yumdB/giphy.gif?cid=790b7611rudzgzquvo8gmzsqzd10035rb1k2xl1jd1vf2vo5&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media.giphy.com/media/5iWX6XFTndU0YP0Yut/giphy.gif?cid=790b76112prb9rgc3ryltnmibxy4iqrwobzwqygn57p68ej5&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2w2Z3RwMnRrNjZhcnI0MjdldG13ZjVueDg3ZzdrMHF1aGhnNmdnNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JRlqKEzTDKci5JPcaL/giphy.gif",
  "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmpvdjRwdjFtZnNlY2puaHlqajF0eDljdXQxa3c2ZHJld2tsNW56cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v9bipbbqgOmCSSpPgl/giphy.gif",
  "https://media.giphy.com/media/0lGOCxq1V8N7E1icuQ/giphy.gif?cid=790b76112prb9rgc3ryltnmibxy4iqrwobzwqygn57p68ej5&ep=v1_gifs_search&rid=giphy.gif&ct=g"
]

const bootMessages = [
  "Initializing BIOS...",
  "Checking memory...",
  "Detecting hardware...",
  "Loading kernel...",
  "Mounting file systems...",
  "Starting system services...",
  "Initializing network interfaces...",
  "Loading user environment...",
  "Applying system policies...",
  "Launching RuddyOS..."
]

const asciiArt = `
 ____            _     _       ___  ____  
|  _ \\ _   _  __| | __| |_   _/ _ \\/ ___| 
| |_) | | | |/ _\` |/ _\` | | | | | | \\___ \\ 
|  _ <| |_| | (_| | (_| | |_| | |_| |___) |
|_| \\_\\\\__,_|\\__,_|\\__,_|\\__, |\\___/|____/ 
                         |___/            
`

export default function Loading() {
  const [currentGif, setCurrentGif] = useState(0)
  const [currentText, setCurrentText] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showAscii, setShowAscii] = useState(false)

  useEffect(() => {
    const gifInterval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % gifs.length)
    }, 3000)

    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % bootMessages.length)
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setShowAscii(true)
          return 100
        }
        return prev + 1
      })
    }, 100)

    return () => {
      clearInterval(gifInterval)
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4 overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        body {
          font-family: 'VT323', monospace;
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
        .flicker {
          animation: flicker 0.15s infinite;
        }
        @keyframes flicker {
          0% {opacity: 0.27861}
          5% {opacity: 0.34769}
          10% {opacity: 0.23604}
          15% {opacity: 0.90626}
          20% {opacity: 0.18128}
          25% {opacity: 0.83891}
          30% {opacity: 0.65583}
          35% {opacity: 0.67807}
          40% {opacity: 0.26559}
          45% {opacity: 0.84693}
          50% {opacity: 0.96019}
          55% {opacity: 0.08594}
          60% {opacity: 0.20313}
          65% {opacity: 0.71988}
          70% {opacity: 0.53455}
          75% {opacity: 0.37288}
          80% {opacity: 0.71428}
          85% {opacity: 0.70419}
          90% {opacity: 0.7003}
          95% {opacity: 0.36108}
          100% {opacity: 0.24387}
        }
      `}</style>
      <div className="w-full max-w-2xl crt">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flicker">RuddyOS v1.0</h1>
          <p className="text-xl">Booting System...</p>
        </motion.div>

        <div className="border-2 border-green-500 p-4 rounded-lg mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGif}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full"
              style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
            >
              <Image
                src={gifs[currentGif]}
                alt="Loading animation"
                layout="fill"
                objectFit="contain"
                className="rounded"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-4">
          <div className="h-2 bg-green-900 rounded-full">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-right">{progress}%</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="h-8 text-center"
          >
            {bootMessages[currentText]}
          </motion.div>
        </AnimatePresence>

        {showAscii && (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-xs mt-8 text-center"
          >
            {asciiArt}
          </motion.pre>
        )}

        <div className="mt-8 text-xs text-center flicker">
          <p>Press F8 to enter Safe Mode</p>
          <p className="mt-2">© 2023 RuddyTech Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

