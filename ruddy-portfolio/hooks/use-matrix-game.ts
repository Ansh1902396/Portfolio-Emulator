import { useState, useCallback, useEffect } from 'react'
import { README_CONTENT, MESSAGES_CONTENT, SECRETS_CONTENT, DMESG_CONTENT, gameRoadmap } from '../game/gameContent'

// Freed OS file dictionary
const gameContent: { [key: string]: string } = {
  '/home/neo/README': README_CONTENT,
  '/home/neo/messages': MESSAGES_CONTENT,
  '/home/neo/secrets': SECRETS_CONTENT,
  '/var/log/dmesg': DMESG_CONTENT,
}

// Type for Freed OS state
interface GameState {
  stage: number
  currentLocation: string
  inventory: string[]
  completedObjectives: string[]
  objectives: string[]
  health: number
  knowledge: number
  currentChallenge: {
    command: string
    description: string
    solution: string
  } | null
  storyProgress: number
  isLoggedIn: boolean
  completedCommands: string[]
  isGameOver: boolean
  freedomChoice: number | null
}

// The initial Freed OS game state
const initialGameState: GameState = {
  stage: 0,
  currentLocation: 'login',
  inventory: [],
  completedObjectives: [],
  objectives: gameRoadmap.flatMap(stage => stage.objectives),
  health: 100,
  knowledge: 0,
  currentChallenge: null,
  storyProgress: 0,
  isLoggedIn: false,
  completedCommands: [],
  isGameOver: false,
  freedomChoice: null,
}

/**
 * The main Freed OS logic as a React hook. 
 * Exports handleCommand for user input, plus gameState, etc.
 */
export function useMatrixGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [currentDialog, setCurrentDialog] = useState<string[]>([])
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null)

  // Helper: progress story
  const progressStory = useCallback(() => {
    if (gameState.storyProgress < gameState.objectives.length - 1) {
      setGameState(prev => ({
        ...prev,
        storyProgress: prev.storyProgress + 1,
        stage: Math.floor(prev.storyProgress / gameRoadmap[0].objectives.length)
      }))
      return gameState.objectives[gameState.storyProgress + 1]
    }
    return "You've reached the end of the current storyline."
  }, [gameState.storyProgress, gameState.objectives])

  // The main command parser
  const handleCommand = useCallback((command: string): string[] => {
    const [action, ...args] = command.toLowerCase().split(' ')

    if (gameState.completedCommands.includes(command)) {
      return ["You've already completed this step. Move on to the next command."]
    }
    if (!gameState.isLoggedIn && action !== 'login') {
      return ["Please log in first. Type 'login' to begin."]
    }

    switch (action) {
      case 'login':
        return login()
      case 'help':
        return showHelp()
      case 'look':
        return lookAround()
      case 'cd':
        return changeDirectory(args.join(' '))
      case 'ls':
        return listDirectory(args.join(' '))
      case 'cat':
        return readFile(args.join(' '))
      case 'connect':
        return connectToDevice(args.join(' '))
      case 'train':
        return startChallenge()
      case 'kill':
        return killProcess(args.join(' '))
      case 'grep':
        return grepFile(args.join(' '))
      case 'nano':
        return nano(args.join(' '))
      case 'make':
        return compileMakefile()
      case 'status':
        return checkStatus()
      case 'inventory':
        return checkInventory()
      case 'use':
        return useItem(args.join(' '))
      case 'talk':
        return talkTo(args.join(' '))
      case 'solve':
        return solveChallenge(args.join(' '))
      case 'hint':
        return getHint()
      case 'close':
      case 'close challenge':
        return closeChallenge()
      case 'exit':
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return ["Exiting Freed OS simulation..."]
      case 'clear':
        return ['CLEAR']
      default:
        return [`Command not recognized. Type 'help' for a list of available commands.`]
    }
  }, [gameState, progressStory])

  // Implementations of Freed OS commands:

  const login = () => {
    setGameState(prev => ({
      ...prev,
      isLoggedIn: true,
      currentLocation: '/home/neo',
      storyProgress: 1,
      completedObjectives: [...prev.completedObjectives, "Log in to Freed OS"]
    }))
    return [
      "Last login: Wed May 15 09:22:01 on tty1",
      "SYNAPSE: \"Welcome, Neo. Have you ever questioned the nature of your reality?\"",
      "Type 'help' if you need to see what commands are available.",
      "",
      "(Objective completed: Log in to Freed OS)"
    ]
  }

  const showHelp = () => {
    return [
      "Available commands:",
      "- help: Show this help message",
      "- ls: List directory contents",
      "- cd [directory]: Change directory",
      "- cat [file]: Read file contents",
      "- grep [pattern] [file]: Search logs or files",
      "- connect [device]: Connect to a device (like /dev/nullmatrix)",
      "- kill [process]: Terminate a process (e.g. AgentSmith)",
      "- nano [file]: Edit a file (e.g. Makefile)",
      "- make: Compile the Freed Kernel",
      "- status: Check your current status/progress",
      "- inventory: Check your items",
      "- use [item]: Use an item from your inventory",
      "- talk [character]: Talk to Freed NPCs (synapse, cipherkey, flowstate)",
      "- solve [solution]: Solve a puzzle challenge",
      "- hint: Get a hint for the current puzzle",
      "- exit: Exit Freed OS simulation",
      "- clear: Clear the screen",
      "",
      "SYNAPSE: \"Explore /home/neo for something important.\""
    ]
  }

  const lookAround = () => {
    switch (gameState.currentLocation) {
      case '/home/neo':
        return ["You're in Neo's home directory. Files: README, messages, secrets."]
      case '/dev':
        return ["A device directory containing 'nullmatrix'... suspicious."]
      case 'construct':
        return ["You're in the Freed Construct. CipherKey, FlowState watch you train."]
      case '/etc/agent_config':
        return ["Agent config directory. There's a watchlist file here."]
      case '/var/log':
        return ["System logs. Could check agent_warnings or dmesg files."]
      case '/usr/src/kernel_freedom':
        return ["Kernel directory with Makefile for Freed OS choice."]
      default:
        return ["It's an unknown path in Freed OS. The Matrix is silent... for now."]
    }
  }

  const changeDirectory = (directory: string) => {
    setGameState(prev => ({ ...prev, currentLocation: directory }))
    return [`Changed directory to ${directory}`]
  }

  const listDirectory = (directory: string) => {
    const currentDir = directory || gameState.currentLocation
    switch (currentDir) {
      case '/home/neo':
        return ["README  messages  secrets"]
      case '/dev':
        return ["nullmatrix"]
      case '/etc/agent_config':
        return ["watchlist"]
      case '/var/log':
        return ["system.log  agent_warnings  dmesg"]
      case '/usr/src/kernel_freedom':
        return ["Makefile"]
      default:
        return ["No files found in this directory."]
    }
  }

  const readFile = (file: string) => {
    const normalizedFile = file.toUpperCase()
    const filePath = gameState.currentLocation === '/home/neo'
      ? `/home/neo/${normalizedFile}`
      : `${gameState.currentLocation}/${normalizedFile}`
    const fileContent = gameContent[filePath] || gameContent[filePath.toLowerCase()]

    if (fileContent) {
      if (normalizedFile === 'README' && !gameState.completedObjectives.includes("Read the README file")) {
        setGameState(prev => ({
          ...prev,
          completedObjectives: [...prev.completedObjectives, "Read the README file"],
          storyProgress: prev.storyProgress + 1
        }))
        return [...fileContent.split('\n'), "", "(Objective completed: Read the README file)"]
      }
      if (normalizedFile === 'MESSAGES' && !gameState.completedObjectives.includes("Discover messages from Synapse")) {
        setGameState(prev => ({
          ...prev,
          completedObjectives: [...prev.completedObjectives, "Discover messages from Synapse"],
          storyProgress: prev.storyProgress + 1
        }))
        return [...fileContent.split('\n'), "", "(Objective completed: Discover messages from Synapse)"]
      }
      return fileContent.split('\n')
    } else if (normalizedFile === 'DMESG' && gameState.currentLocation === '/var/log') {
      return gameContent['/var/log/dmesg'].split('\n')
    }
    return [`cat: ${file}: No such file or directory`]
  }

  const connectToDevice = (device: string) => {
    if (device === '/dev/nullmatrix') {
      if (!gameState.completedObjectives.includes("Connect to the Null Matrix")) {
        setGameState(prev => ({
          ...prev,
          currentLocation: 'construct',
          completedObjectives: [...prev.completedObjectives, "Connect to the Null Matrix"],
          storyProgress: prev.storyProgress + 1
        }))
        return [
          "Connected to the Null Matrix. You're in the Freed Construct.",
          "(Objective completed: Connect to the Null Matrix)",
          "",
          "SYNAPSE: \"Welcome, Neo. Let's begin your real training...\""
        ]
      }
      setGameState(prev => ({ ...prev, currentLocation: 'construct' }))
      return ["Connected to the Freed Construct again."]
    }
    return ["Cannot connect to the specified device."]
  }

  const startChallenge = () => {
    // Freed training puzzles
    const challenges = [
      {
        command: 'decrypt',
        description: 'Decrypt base64: "VGhlcmUgaXMgbm8gc3Bvb24u"',
        solution: 'There is no spoon.'
      },
      {
        command: 'hack system',
        description: 'To hack the Freed mainframe, type "hack system".',
        solution: 'hack system'
      },
      {
        command: 'solve turing',
        description: 'Tape: "101001". Move head to final "1". Provide L/R, e.g. "RRLLLR".',
        solution: 'RRLLLR'
      }
    ]
    const challenge = challenges[Math.floor(Math.random() * challenges.length)]
    const trainingObjective = gameState.objectives.find(o => o.includes("Complete Freed Training") && !gameState.completedObjectives.includes(o))

    if (trainingObjective) {
      setGameState(prev => ({
        ...prev,
        currentChallenge: challenge,
        storyProgress: prev.storyProgress + 1
      }))
      return [
        `New challenge started: ${challenge.description}`,
        "SYNAPSE: \"Your first training session begins, Neo.\""
      ]
    } else {
      setGameState(prev => ({ ...prev, currentChallenge: challenge }))
      return [`New challenge started: ${challenge.description}`]
    }
  }

  const killProcess = (proc: string) => {
    if (proc.includes('agentsmith')) {
      if (!gameState.completedObjectives.includes("Neutralize Agent processes")) {
        setGameState(prev => ({
          ...prev,
          completedObjectives: [...prev.completedObjectives, "Neutralize Agent processes"],
          storyProgress: prev.storyProgress + 1
        }))
        return [
          "AgentSmith process terminated successfully.",
          "(Objective completed: Neutralize Agent processes)",
          "",
          "SYNAPSE: \"Well done. But be cautious, the Agents adapt.\""
        ]
      }
      return ["AgentSmith process terminated successfully."]
    }
    return ["No such process. Possibly 'kill AgentSmith'?"]
  }

  const grepFile = (args: string) => {
    if (args.includes('agent_traffic') && args.includes('/var/log/agent_warnings')) {
      return [
        "AGENT_TRAFFIC detected at 02:14:33",
        "ENCRYPTED MESSAGE: 0x4D6173746572204B6579",
        "",
        "SYNAPSE: \"Important logs found. Keep going, Neo.\""
      ]
    }
    return ["No matches found."]
  }

  const nano = (file: string) => {
    if (file === 'Makefile' && gameState.currentLocation === '/usr/src/kernel_freedom') {
      setGameState(prev => ({
        ...prev,
        currentChallenge: {
          command: 'edit',
          description: 'Edit the Makefile: Set FREEDOM_CHOICE to 1 for mass awakening, 0 for stealth infiltration.',
          solution: '' // We'll check for "solve 1" or "solve 0" in solveChallenge
        }
      }))
      return [
        "Makefile opened for editing. Current content:",
        "",
        "FREEDOM_CHOICE = ?",
        "",
        "# 1 -> Hard reboot (mass awakening)",
        "# 0 -> Covert infiltration (maintain OS, free minds gradually)",
        "",
        "Use 'solve 1' or 'solve 0' to set FREEDOM_CHOICE."
      ]
    }
    return ["File not found or permission denied."]
  }

  const simulateBlockchain = (puzzle: string) => {
    if (!gameState.completedObjectives.includes("Consult the Oracle of Blocks")) {
      setGameState(prev => ({
        ...prev,
        completedObjectives: [...prev.completedObjectives, "Consult the Oracle of Blocks"],
        storyProgress: prev.storyProgress + 1
      }))
      const challenge = {
        command: 'mine block',
        description: 'SHA256("FREED + nonce") needs 2 leading zeroes. Solve with "mine block".',
        solution: 'mine block'
      }
      setGameState(prev => ({ ...prev, currentChallenge: challenge }))
      return [
        "ORACLE OF BLOCKS:",
        "FreedBlock #1 => data: FREED",
        "Required Hash Prefix: 00",
        "Nonce: ???",
        "",
        "Type 'solve mine block' if you find the correct nonce.",
        "(Objective completed: Consult the Oracle of Blocks)"
      ]
    }
    return ["No blockchain puzzle available."]
  }


  const compileMakefile = () => {
    if (gameState.currentLocation !== '/usr/src/kernel_freedom') {
      return ["Cannot run 'make' here. Try '/usr/src/kernel_freedom'."]
    }
    if (!gameState.completedObjectives.includes("Edit the Makefile")) {
      return ["You must edit the Makefile first. (Use 'nano Makefile') Then solve 1 or 0."]
    }
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      completedObjectives: [...prev.completedObjectives, "Compile and install the Freed Kernel"]
    }))
    return [
      "Compiling Freed Kernel...",
      "Installation complete.",
      "The Freed Kernel choice is shaping Freed OS reality.",
      "GAME OVER: Freed OS storyline complete.",
      "Type 'exit' to leave the simulation."
    ]
  }

  const checkStatus = () => {
    return [
      `Stage: ${gameState.stage}`,
      `Location: ${gameState.currentLocation}`,
      `Health: ${gameState.health}%`,
      `Knowledge: ${gameState.knowledge}%`,
      `Completed Objectives: ${gameState.completedObjectives.join(', ') || '(none)'}`,
      `Current Objectives: ${
        gameState.objectives.filter(o => !gameState.completedObjectives.includes(o)).join(', ') || '(none)'
      }`,
      `Story Progress: ${gameState.storyProgress} / ${gameState.objectives.length}`,
      gameState.isGameOver ? "GAME OVER: Freed OS story concluded. Type 'exit' to leave." : ""
    ]
  }

  const checkInventory = () => {
    if (gameState.inventory.length === 0) {
      return ["Your inventory is empty."]
    }
    return [`Inventory: ${gameState.inventory.join(', ')}`]
  }

  const useItem = (item: string) => {
    if (gameState.inventory.includes(item)) {
      return [`You used ${item}.`]
    }
    return ["You don't have that item."]
  }

  const talkTo = (character: string) => {
    setCurrentCharacter(character)
    switch (character.toLowerCase()) {
      case 'synapse':
        setCurrentDialog(["SYNAPSE: \"Remember, illusions define Freed OS. Keep exploring.\""])
        break
      case 'cipherkey':
        setCurrentDialog(["CIPHERKEY: \"Crypto puzzles are the key to rewriting Freed OS.\""])
        break
      case 'flowstate':
        setCurrentDialog(["FLOWSTATE: \"I sense Agent traffic in the logs, Neo. Stay hidden.\""])
        break
      default:
        setCurrentDialog([`${character} isn't here.`])
    }
    return [`Talking to ${character}...`]
  }

  const solveChallenge = (solution: string) => {
    // If there's no puzzle, maybe the user tries setting FREEDOM_CHOICE
    if (!gameState.currentChallenge) {
      // Freed kernel choice
      if (solution === '1' || solution === '0') {
        setGameState(prev => ({
          ...prev,
          freedomChoice: parseInt(solution, 10),
          completedObjectives: [...prev.completedObjectives, "Edit the Makefile"]
        }))
        return [
          `Makefile updated. FREEDOM_CHOICE set to ${solution}.`,
          "Use 'make' to compile and install the Freed Kernel."
        ]
      }
      return ["No active challenge to solve."]
    }

    if (gameState.currentChallenge.command === 'edit') {
      if (solution === '1' || solution === '0') {
        setGameState(prev => ({
          ...prev,
          currentChallenge: null,
          freedomChoice: parseInt(solution, 10),
          completedObjectives: [...prev.completedObjectives, "Edit the Makefile"]
        }))
        return [
          `Makefile updated. FREEDOM_CHOICE set to ${solution}.`,
          "Use 'make' to compile and install the Freed Kernel."
        ]
      } else {
        return ["Invalid choice. Use 'solve 1' for mass awakening or 'solve 0' for gradual infiltration."]
      }
    }

    // Check puzzle solution
    if (solution.toLowerCase() === gameState.currentChallenge.solution.toLowerCase()) {
      // Freed training?
      if (
        (gameState.currentChallenge.command === 'decrypt'
         || gameState.currentChallenge.command === 'hack system'
         || gameState.currentChallenge.command === 'solve turing')
        && !gameState.completedObjectives.includes("Complete Freed Training")
      ) {
        setGameState(prev => ({
          ...prev,
          currentChallenge: null,
          knowledge: Math.min(prev.knowledge + 10, 100),
          completedObjectives: [...prev.completedObjectives, "Complete Freed Training"],
          storyProgress: prev.storyProgress + 1
        }))
        return [
          "Correct! Freed training puzzle solved.",
          "Knowledge +10%.",
          "(Objective completed: Complete Freed Training)",
          "SYNAPSE: \"You're stronger now. Continue your path...\""
        ]
      } else if (gameState.currentChallenge.command === 'mine block') {
        // Oracle puzzle
        setGameState(prev => ({
          ...prev,
          currentChallenge: null,
          knowledge: Math.min(prev.knowledge + 10, 100)
        }))
        return [
          "Correct! Blockchain puzzle solved. Knowledge +10%.",
          "SYNAPSE: \"The Oracle trusts you. Move on to the kernel...\""
        ]
      }
      setGameState(prev => ({
        ...prev,
        currentChallenge: null,
        knowledge: Math.min(prev.knowledge + 10, 100)
      }))
      return ["Puzzle solved. Knowledge +10%."]
    }
    return ["Incorrect solution. Try again or 'hint' for a clue."]
  }

  const getHint = () => {
    if (!gameState.currentChallenge) {
      return ["No puzzle active. 'train' or 'simulate' to start one?"]
    }
    return [`Hint: ${gameState.currentChallenge.description}`]
  }

  const closeChallenge = () => {
    setGameState(prev => ({ ...prev, currentChallenge: null }))
    return ["Challenge closed."]
  }

  // Initialize story if needed
  useEffect(() => {
    if (gameState.stage === 0 && gameState.storyProgress === 0) {
      setGameState(prev => ({ ...prev, storyProgress: 1 }))
    }
  }, [gameState.stage, gameState.storyProgress])

  return {
    gameState,
    handleCommand,
    currentDialog,
    currentCharacter,
    setCurrentDialog,
    setGameState,
    initialGameState,
    closeChallenge,
    solveChallenge
  }
}

