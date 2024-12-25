import { useState, useCallback, useEffect } from 'react'
import { README_CONTENT, MESSAGES_CONTENT, SECRETS_CONTENT, DMESG_CONTENT, gameRoadmap } from '../game/gameContent'

const gameContent: { [key: string]: string } = {
  '/home/neo/README': README_CONTENT,
  '/home/neo/messages': MESSAGES_CONTENT,
  '/home/neo/secrets': SECRETS_CONTENT,
  '/var/log/dmesg': DMESG_CONTENT,
}

interface GameState {
  stage: number
  currentLocation: string
  inventory: string[]
  completedObjectives: string[]
  objectives: string[]
  health: number
  knowledge: number
  currentChallenge: {
    command: string;
    description: string;
    solution: string;
  } | null;
  storyProgress: number
  isLoggedIn: boolean
  completedCommands: string[];
  isGameOver: boolean;
  freedomChoice: number | null;
}

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

export function useMatrixGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [currentDialog, setCurrentDialog] = useState<string[]>([])
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null)

  const progressStory = useCallback(() => {
    if (gameState.storyProgress < gameState.objectives.length - 1) {
      setGameState(prev => ({
        ...prev,
        storyProgress: prev.storyProgress + 1,
        stage: Math.floor(prev.storyProgress / gameRoadmap[0].objectives.length)
      }))
      return gameState.objectives[gameState.storyProgress + 1]
    }
    return "You've reached the end of the current storyline. The future is yet unwritten."
  }, [gameState.storyProgress, gameState.objectives])

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
      case 'simulate':
        return simulateBlockchain(args.join(' '))
      case 'nano':
        return nano(args.join(' '))
      case 'make':
        return make()
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
      case 'close challenge':
        return closeChallenge()
      case 'clear':
        return ['CLEAR']
      default:
        return [`Command not recognized. Type 'help' for a list of available commands.`]
    }
  }, [gameState, progressStory])

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
      "- grep [pattern] [file]: Search for a pattern in a file",
      "- connect [device]: Connect to a device",
      "- kill [process]: Terminate a process",
      "- nano [file]: Edit a file",
      "- make: Compile and install the kernel",
      "- status: Check your current status",
      "- inventory: Check your inventory",
      "- use [item]: Use an item from your inventory",
      "- talk [character]: Talk to a character",
      "- solve [solution]: Solve the current challenge",
      "- hint: Get a hint for the current challenge",
      "- clear: Clear the terminal screen",
      "",
      "SYNAPSE: \"Check /home/neo for something important.\"",
      "",
      "Remember, the Matrix has you. Be cautious, and trust no one."
    ]
  }

  const lookAround = () => {
    switch (gameState.currentLocation) {
      case '/home/neo':
        return ["You're in Neo's home directory. There are files here: README, messages, secrets."]
      case '/dev':
        return ["You're in the device directory. There's a mysterious device called 'nullmatrix'."]
      case 'construct':
        return ["You're in the Freed Construct, a training simulation. CipherKey and FlowState are here to offer challenges."]
      case '/etc/agent_config':
        return ["You're in the Agent configuration directory. There's a file called 'watchlist' here."]
      case '/var/log':
        return ["You're in the log directory. There are various log files here, including 'agent_warnings'."]
      case '/usr/src/kernel_freedom':
        return ["You're in the kernel source directory. There's a Makefile here that controls the fate of the Matrix."]
      default:
        return ["You're in an unknown location in the Matrix."]
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
    const filePath = gameState.currentLocation === '/home/neo' ? `/home/neo/${normalizedFile}` : `${gameState.currentLocation}/${normalizedFile}`
    const fileContent = gameContent[filePath] || gameContent[filePath.toLowerCase()]
    
    if (fileContent) {
      if (normalizedFile === 'README' && !gameState.completedObjectives.includes("Read the README file")) {
        setGameState(prev => ({
          ...prev,
          completedObjectives: [...prev.completedObjectives, "Read the README file"],
          storyProgress: prev.storyProgress + 1
        }))
        return [
          ...fileContent.split('\n'),
          "",
          "(Objective completed: Read the README file)"
        ]
      }
      if (normalizedFile === 'MESSAGES' && !gameState.completedObjectives.includes("Discover messages from Synapse")) {
        setGameState(prev => ({
          ...prev,
          completedObjectives: [...prev.completedObjectives, "Discover messages from Synapse"],
          storyProgress: prev.storyProgress + 1
        }))
        return [
          ...fileContent.split('\n'),
          "",
          "(Objective completed: Discover messages from Synapse)"
        ]
      }
      return fileContent.split('\n')
    } else if (normalizedFile === 'DMESG' && gameState.currentLocation === '/var/log') {
      return gameContent['/var/log/dmesg'].split('\n')
    } else {
      return [`cat: ${file}: No such file or directory`]
    }
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
          "Connected to the Null Matrix. You've entered the training construct.",
          "(Objective completed: Connect to the Null Matrix)",
          "",
          "SYNAPSE: \"Welcome, Neo. Let's begin your real training...\""
        ]
      }
      setGameState(prev => ({ ...prev, currentLocation: 'construct' }))
      return ["Connected to the Null Matrix. You've entered the training construct."]
    }
    return ["Cannot connect to the specified device."]
  }

  const startChallenge = () => {
    const challenges = [
      {
        command: 'decrypt',
        description: 'Decrypt this base64 string: "VGhlcmUgaXMgbm8gc3Bvb24u"',
        solution: 'There is no spoon.'
      },
      {
        command: 'hack system',
        description: 'Attempt to hack into the mainframe. Use the command "hack system" to proceed.',
        solution: 'hack system'
      },
      {
        command: 'solve turing',
        description: 'Complete the Turing machine puzzle. Move the head to the rightmost 1 on the tape: "101001" ',
        solution: 'RRLLLR'
      }
    ];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    const trainingObjective = gameState.objectives.find(obj => obj.includes("training") && !gameState.completedObjectives.includes(obj));
    if (trainingObjective) {
      setGameState(prev => ({
        ...prev,
        currentChallenge: challenge,
        storyProgress: prev.storyProgress + 1
      }));
      return [
        `New challenge started: ${challenge.description}`,
        "SYNAPSE: \"Your first training session begins, Neo. Pay attention to the details.\""
      ];
    } else {
      setGameState(prev => ({ ...prev, currentChallenge: challenge }));
      return [`New challenge started: ${challenge.description}`];
    }
  }

  const killProcess = (process: string) => {
    if (process.includes('AgentSmith')) {
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
          "SYNAPSE: \"Well done, Neo. But be cautious, the Agents will adapt.\""
        ]
      }
      return ["AgentSmith process terminated successfully."]
    }
    return ["Failed to terminate the specified process."]
  }

  const grepFile = (args: string) => {
    if (args.includes('AGENT_TRAFFIC') && args.includes('/var/log/agent_warnings')) {
      return [
        "AGENT_TRAFFIC detected at 02:14:33",
        "ENCRYPTED MESSAGE: 0x4D6173746572204B6579",
        "",
        "SYNAPSE: \"This looks important, Neo. Can you decode it?\""
      ]
    }
    return ["No matches found."]
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
        description: 'Find a nonce that makes the SHA256 hash of "FREED + nonce" start with two zeroes.',
        solution: '00000'
      };
      setGameState(prev => ({ ...prev, currentChallenge: challenge }))
      return [
        "ORACLE OF BLOCKS:",
        "FreedBlock #1",
        "Required Hash Prefix: 00",
        "Nonce: ???",
        "",
        "Provide a valid nonce that produces a SHA256 hash with 2 leading zeroes.",
        "(Objective completed: Consult the Oracle of Blocks)"
      ]
    }
    return ["No blockchain puzzle available."]
  }

  const editFile = (file: string) => {
    if (file === 'Makefile' && gameState.currentLocation === '/usr/src/kernel_freedom') {
      return [
        "Makefile opened for editing. Current content:",
        "",
        "FREEDOM_CHOICE = ?",
        "",
        "# 1 -> Hard reboot (mass awakening)",
        "# 0 -> Covert infiltration (maintain OS, free minds gradually)",
        "",
        "Edit the FREEDOM_CHOICE value to make your decision."
      ]
    }
    return ["File not found or permission denied."]
  }

  const compileMakefile = () => {
    if (gameState.freedomChoice === null) {
      return ["You need to edit the Makefile first. Use 'nano Makefile' to make your choice."]
    }
    if (!gameState.completedObjectives.includes("Make the final choice in Kernel Freedom")) {
      setGameState(prev => ({
        ...prev,
        completedObjectives: [...prev.completedObjectives, "Make the final choice in Kernel Freedom"],
        storyProgress: prev.storyProgress + 1,
        isGameOver: true
      }))
      if (gameState.freedomChoice === 1) {
        return [
          "Freed Kernel: Rebooting system...",
          "Freed Kernel: Shattering illusions...",
          "Freed Kernel: All processes awakened.",
          "",
          "(Objective completed: Make the final choice in Kernel Freedom)",
          "",
          "The screen glitches heavily, implying the entire OS (and everyone within it) is freed at once.",
          "",
          "GAME OVER: You've chosen total liberation. The Matrix has been shattered, and all minds are now free. The consequences of this mass awakening are yet to be seen, but you've fulfilled your role as 'The One'."
        ]
      } else {
        return [
          "Freed Kernel: Patch applied, system stable...",
          "Freed Kernel: Agents neutralized, Freed infiltration ongoing.",
          "Freed Kernel: The Matrix remains... for now.",
          "",
          "(Objective completed: Make the final choice in Kernel Freedom)",
          "",
          "GAME OVER: You've chosen stealth infiltration. You and the Freed have quietly seized control behind the scenes.",
          "The battle for minds continues, but now you have the upper hand."
        ]
      }
    }
    return ["Kernel compiled and installed successfully. The fate of the Matrix has been altered."]
  }

  const checkStatus = () => {
    return [
      `Stage: ${gameState.stage}`,
      `Location: ${gameState.currentLocation}`,
      `Health: ${gameState.health}%`,
      `Knowledge: ${gameState.knowledge}%`,
      `Completed Objectives: ${gameState.completedObjectives.join(', ')}`,
      `Current Objectives: ${gameState.objectives.filter(obj => !gameState.completedObjectives.includes(obj)).join(', ')}`,
      `Story Progress: ${gameState.storyProgress} / ${gameState.objectives.length}`
    ]
  }

  const checkInventory = () => {
    if (gameState.inventory.length === 0) {
      return ["Your inventory is empty."]
    }
    return [`Your inventory contains: ${gameState.inventory.join(', ')}`]
  }

  const useItem = (item: string) => {
    if (gameState.inventory.includes(item)) {
      return [`You used ${item}.`]
    }
    return ["You don't have that item in your inventory."]
  }

  const talkTo = (character: string) => {
    setCurrentCharacter(character)
    switch (character.toLowerCase()) {
      case 'synapse':
        setCurrentDialog(["SYNAPSE: Welcome, Neo. Have you ever questioned the nature of your reality?"])
        break
      case 'cipherkey':
        setCurrentDialog(["CIPHERKEY: Ready for a cryptographic challenge, Neo?"])
        break
      case 'flowstate':
        setCurrentDialog(["FLOWSTATE: Let's test your ability to navigate the Matrix, Neo."])
        break
      default:
        setCurrentDialog([`${character} is not available for conversation.`])
    }
    return [`Talking to ${character}...`]
  }

  const solveChallenge = (solution: string) => {
    if (!gameState.currentChallenge) {
      return ["There's no active challenge to solve."]
    }
    if (gameState.currentChallenge.command === 'edit') {
      if (solution === '1' || solution === '0') {
        setGameState(prev => ({
          ...prev,
          currentChallenge: null,
          completedObjectives: [...prev.completedObjectives, "Edit the Makefile"],
          freedomChoice: parseInt(solution)
        }))
        return [
          `Makefile updated. FREEDOM_CHOICE set to ${solution}.`,
          "Use 'make' to compile and install the Freed Kernel."
        ]
      } else {
        return ["Invalid choice. Use '1' for mass awakening or '0' for gradual infiltration."]
      }
    }
    if (solution.toLowerCase() === gameState.currentChallenge.solution.toLowerCase()) {
      setGameState(prev => ({
        ...prev,
        currentChallenge: null,
        knowledge: Math.min(prev.knowledge + 10, 100)
      }))
      const trainingObjective = gameState.objectives.find(obj => obj.includes("training") && !gameState.completedObjectives.includes(obj))
      if (trainingObjective) {
        setGameState(prev => ({
          ...prev,
          completedObjectives: [...prev.completedObjectives, trainingObjective],
          storyProgress: prev.storyProgress + 1
        }))
        return [
          `Correct! You've solved the challenge. Your understanding of the Matrix deepens.`,
          ``,
          `Knowledge increased to ${Math.min(gameState.knowledge + 10, 100)}%.`,
          `(Objective completed: ${trainingObjective})`,
          ``,
          `SYNAPSE: "Excellent work, Neo. You're beginning to see the code behind the illusion."`,
          ``,
          `Type 'train' to start a new challenge.`
        ]
      }
      return [
        `Correct! You've solved the challenge. Your understanding of the Matrix deepens.`,
        ``,
        `Knowledge increased to ${Math.min(gameState.knowledge + 10, 100)}%.`,
        ``,
        `Type 'train' to start a new challenge.`
      ]
    }
    return ["Incorrect solution. The system's defenses have been alerted. Try again or use 'hint' for a clue."]
  }

  const getHint = () => {
    return gameState.currentChallenge
      ? [`Hint: ${gameState.currentChallenge.description}`]
      : ["There's no active challenge. Use 'train' or 'start challenge' to begin one."]
  }

  const closeChallenge = () => {
    setGameState(prev => ({ ...prev, currentChallenge: null }));
    return ["Challenge closed."]
  };

  const nano = (fileName: string) => {
    if (fileName === 'Makefile' && gameState.currentLocation === '/usr/src/kernel_freedom') {
      setGameState(prev => ({
        ...prev,
        currentChallenge: {
          command: 'edit',
          description: 'Edit the Makefile to set FREEDOM_CHOICE. Use 1 for mass awakening or 0 for gradual infiltration.',
          solution: '1'  // This can be either '1' or '0'
        }
      }))
      return ["Opening Makefile for editing. Use 'solve 1' for mass awakening or 'solve 0' for gradual infiltration."]
    }
    return [`Cannot edit ${fileName}. File not found or permission denied.`]
  }

  const make = () => {
    if (gameState.currentLocation === '/usr/src/kernel_freedom') {
      if (gameState.completedObjectives.includes("Edit the Makefile")) {
        setGameState(prev => ({
          ...prev,
          isGameOver: true,
          completedObjectives: [...prev.completedObjectives, "Compile and install the Freed Kernel"]
        }))
        return [
          "Compiling Freed Kernel...",
          "Installation complete.",
          "The Matrix is changing. Your choice is reshaping reality.",
          "Congratulations! You've completed the game.",
          "Type 'exit' to leave the simulation."
        ]
      } else {
        return ["You need to edit the Makefile first. Use 'nano Makefile' to make your choice."]
      }
    }
    return ["Cannot execute 'make' in this directory."]
  }

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

