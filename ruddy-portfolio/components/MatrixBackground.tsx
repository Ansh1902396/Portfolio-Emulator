import React, { useEffect, useRef } from 'react'

interface MatrixBackgroundProps {
  isDarkMode: boolean
}

export function MatrixBackground({ isDarkMode }: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    if (isDarkMode) {
      gradient.addColorStop(0, '#1a202c')
      gradient.addColorStop(1, '#2d3748')
    } else {
      gradient.addColorStop(0, '#e2e8f0')
      gradient.addColorStop(1, '#cbd5e0')
    }

    const drawBackground = () => {
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawMatrix = () => {
      const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
      ctx.font = '14px monospace'
      ctx.fillStyle = isDarkMode ? 'rgba(0, 255, 0, 0.05)' : 'rgba(0, 128, 0, 0.05)'

      for (let i = 0; i < canvas.width / 14; i++) {
        const x = i * 14
        const y = Math.random() * canvas.height
        ctx.fillText(characters[Math.floor(Math.random() * characters.length)], x, y)
      }
    }

    const animate = () => {
      drawBackground()
      drawMatrix()
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isDarkMode])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}

