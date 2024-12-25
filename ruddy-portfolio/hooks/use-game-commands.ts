import { useState, useCallback } from 'react'
import { gameRoadmap, gameSoftware, gameCommands } from '../game/gameData'

// ... (previous interfaces)

export function useGameCommands() {
  // ... (previous state)

  const [inventory, setInventory] = useState<string[]>([])
  const [installedSoftware, setInstalledSoftware] = useState<string[]>([])

  // ... (previous functions)

  const handleGameCommand = useCallback((command: string) => {
    const [action, ...args] = command.toLowerCase().split(' ')

    switch (action) {
      case 'look':
        return getLookDescription()
      case 'inventory':
        return getInventoryDescription()
      case 'hack':
        return performHack()
      case 'train':
        return performTraining()
      case 'use':
        return useItem(args.join(' '))
      case 'talk':
        return talkToCharacter(args.join(' '))
      case 'move':
        return moveToLocation(args.join(' '))
      case 'status':
        return getStatusDescription()
      case 'help':
        return getHelpDescription()
      case 'quit':
        return quitGame()
      default:
        return "Unknown command. Type 'help' for a list of available commands."
    }
  }, [gameState, inventory, installedSoftware])

  const getLookDescription = () => {
    const currentStage = gameRoadmap.find(stage => stage.stage.toLowerCase() === gameState.location)
    return currentStage ? currentStage.description : "You can't make out your surroundings."
  }

  const getInventoryDescription = () => {
    if (inventory.length === 0 && installedSoftware.length === 0) {
      return "Your inventory is empty."
    }
    let description = "Inventory:\n"
    if (inventory.length > 0) {
      description += "Items:\n" + inventory.join('\n') + "\n"
    }
    if (installedSoftware.length > 0) {
      description += "Installed Software:\n" + installedSoftware.join('\n')
    }
    return description
  }

  const performHack = () => {
    const hackingBonus = installedSoftware.includes('Cipher') ? 0.3 : 0
    if (Math.random() + hackingBonus > 0.5) {
      setGameState(prev => ({ ...prev, awareness: Math.min(prev.awareness + 10, 100) }))
      return "Hack successful! You've increased your awareness of the Matrix."
    } else {
      setGameState(prev => ({ ...prev, health: Math.max(prev.health - 10, 0) }))
      return "Hack failed. The system's defenses have damaged you."
    }
  }

  const performTraining = () => {
    const trainingBonus = installedSoftware.includes('Morpheus Mentor') ? 2 : 1
    setGameState(prev => ({ 
      ...prev, 
      awareness: Math.min(prev.awareness + (5 * trainingBonus), 100),
      health: Math.min(prev.health + 5, 100)
    }))
    return "You complete a training session, improving your skills and recovering some health."
  }

  const useItem = (item: string) => {
    if (inventory.includes(item)) {
      // Implement item usage logic here
      return `You used ${item}.`
    } else if (gameSoftware.some(software => software.name.toLowerCase() === item.toLowerCase())) {
      if (installedSoftware.includes(item)) {
        return `${item} is already installed and active.`
      } else {
        setInstalledSoftware(prev => [...prev, item])
        return `You've installed ${item}. ${gameSoftware.find(s => s.name.toLowerCase() === item.toLowerCase())?.effect}`
      }
    } else {
      return `You don't have ${item} in your inventory or available software.`
    }
  }

  const talkToCharacter = (character: string) => {
    // Implement character interaction logic here
    return `You attempt to talk to ${character}, but they don't seem to be here.`
  }

  const moveToLocation = (location: string) => {
    const newLocation = location.toLowerCase()
    if (gameRoadmap.some(stage => stage.stage.toLowerCase() === newLocation)) {
      setGameState(prev => ({ ...prev, location: newLocation }))
      return `You've moved to ${location}.`
    } else {
      return `You can't move to ${location} from here.`
    }
  }

  const getStatusDescription = () => {
    return `Health: ${gameState.health}%\nAwareness: ${gameState.awareness}%\nLocation: ${gameState.location}\nObjectives: ${getCurrentObjectives()}`
  }

  const getCurrentObjectives = () => {
    const currentStage = gameRoadmap.find(stage => stage.stage.toLowerCase() === gameState.location)
    return currentStage ? currentStage.objectives.join(', ') : "No current objectives."
  }

  const getHelpDescription = () => {
    return "Available commands:\n" + gameCommands.map(cmd => `${cmd.command}: ${cmd.description}`).join('\n')
  }

  const quitGame = () => {
    setGameState(prev => ({ ...prev, isGameOver: true }))
    return "You've decided to exit the simulation. Game Over."
  }

  return {
    gameState,
    challengeState,
    resetGame,
    handleGameCommand,
  }
}

