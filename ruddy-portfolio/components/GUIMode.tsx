import React from 'react'
import { OSDesktop } from './OSDesktop'

interface GUIModeProps {
  onSwitchToTerminal: () => void
}

export function GUIMode({ onSwitchToTerminal }: GUIModeProps) {
  return (
    <OSDesktop onSwitchToTerminal={onSwitchToTerminal} />
  )
}

