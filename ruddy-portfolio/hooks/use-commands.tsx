import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import CryptoJS from 'crypto-js'
import React from 'react';

interface FileSystemItem {
  type: 'file' | 'directory'
  content?: string | FileSystem
}

interface FileSystem {
  [key: string]: FileSystemItem
}

interface GameState {
  location: string
  inventory: string[]
  awareness: number
  health: number
  isGameOver: boolean
}

interface ChallengeState {
  currentChallenge: string | null
  challengeProgress: number
  challengeSolved: boolean
}

export function useCommands() {
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'user'])
  const [gameState, setGameState] = useState<GameState>({
    location: 'construct',
    inventory: [],
    awareness: 0,
    health: 100,
    isGameOver: false
  })
  const [files, setFiles] = useState<Record<string, string>>({})
  const [isVimActive, setIsVimActive] = useState(false)
  const [vimContent, setVimContent] = useState('')
  const [vimMode, setVimMode] = useState('normal')
  const [cursor, setCursor] = useState({ row: 0, col: 0 })
  const [currentFileName, setCurrentFileName] = useState('')
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    currentChallenge: null,
    challengeProgress: 0,
    challengeSolved: false,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
    hint: string;
  } | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<{
    name: string
    description: string
    solution: string
    hint: string
  } | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: null })

  const handleOpenChallenge = (content: { title: string; description: string; hint: string }) => {
    setModalContent(content)
    setIsModalOpen(true)
  }

  const asciiArt = `
██████╗ ██╗   ██╗██████╗ ██████╗ ██╗   ██╗███████╗
██╔══██╗██║   ██║██╔══██╗██╔══██╗╚██╗ ██╔╝██╔════╝
██████╔╝██║   ██║██║  ██║██║  ██║ ╚████╔╝ ███████╗
██╔══██╗██║   ██║██║  ██║██║  ██║  ╚██╔╝  ╚════██║
██║  ██║╚██████╔╝██████╔╝██████╔╝   ██║   ███████║
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝    ╚═╝   ╚══════╝
                                              
██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 
`.trim()

  const getTimestamp = () => {
    return new Date().toLocaleString('en-US', { hour12: false })
  }

  const projectInfo = {
    'Augmentium': {
      description: 'A decentralized stablecoin pegged to gold using CosmWasm smart contracts on the Cosmos ecosystem.',
      technologies: ['CosmWasm', 'Rust', 'Cosmos SDK'],
      features: ['99.9% transaction success rate', '15% reduction in gas fees', 'Enhanced token interoperability'],
      github: 'https://github.com/Ansh1902396/Augmentium'
    },
    'On-Chain-Data-Encryption': {
      description: 'A cutting-edge encryption framework using ChaCha20-Poly1305 within Artela Blockchain smart contracts.',
      technologies: ['Solidity', 'ChaCha20-Poly1305', 'Artela Blockchain'],
      features: ['256-bit security for sensitive information', 'Improved data integrity and confidentiality'],
      github: 'https://github.com/Ansh1902396/On-Chain-Data-Encryption'
    },
    'AE-Forge': {
      description: 'A low-code platform for seamless Sophia smart contract creation, utilizing LLM-based guidance.',
      technologies: ['TypeScript', 'React', 'Web3Auth'],
      features: ['LLM-based guidance', 'Secure authentication', 'Enhanced contract deployment pipeline'],
      github: 'https://github.com/Ansh1902396/AE-forge'
    },
    'KageGroove': {
      description: 'A memory-efficient music player in Rust with SDL, achieving playback latency of under 50ms.',
      technologies: ['Rust', 'SDL'],
      features: ['Under 50ms playback latency', '20% reduced memory usage', 'MP3 format support'],
      github: 'https://github.com/Ansh1902396/KageGroove'
    },
    'HireSight': {
      description: 'An LLM-powered interview preparation tool, winner of Crack The Code 3.0.',
      technologies: ['TypeScript', 'React', 'Node.js'],
      features: ['AI-powered interview questions', 'Real-time feedback', 'Personalized learning paths'],
      github: 'https://github.com/Ansh1902396/HireSight'
    },
    'Drona-AI': {
      description: '🧠 AI-Powered Personalized Education Platform inspired by Dronacharya\'s teachings.',
      technologies: ['Next.js 13', 'Stripe', 'ShadCN', 'Tailwind CSS', 'OpenAI API', 'ORMs', 'DigitalOcean'],
      features: [
        'AI-Powered Learning Paths',
        'Multilingual support',
        'Dynamic Quiz Generation',
        'Personalized Chatbot for Doubt Resolution',
        'Progress Tracking',
        'Gamification'
      ],
      github: 'https://github.com/Ansh1902396/Drona/tree/main'
    },
    'Cube': {
      description: '🧊 A toy version of an orchestrator using Golang, demonstrating container management and scheduling.',
      technologies: ['Golang', 'Docker'],
      features: [
        'Container orchestration',
        'Resource allocation',
        'Service discovery',
        'Load balancing'
      ],
      github: 'https://github.com/Ansh1902396/Cube-'
    },
    'Tetris.rs': {
      description: '🕹️ Classic Tetris game implemented in Rust, showcasing systems programming and game development skills.',
      technologies: ['Rust', 'SDL2'],
      features: [
        'Classic Tetris gameplay',
        'Responsive controls',
        'Score tracking',
        'Increasing difficulty levels'
      ],
      github: 'https://github.com/Ansh1902396/tetris'
    }
  }

  const socialInfo = {
    github: {
      username: 'Ansh1902396',
      url: 'https://github.com/Ansh1902396',
      description: 'Check out my open-source projects and contributions'
    },
    linkedin: {
      username: 'rudransh-shinghal-264b37206',
      url: 'https://www.linkedin.com/in/rudransh-shinghal-264b37206/',
      description: 'Connect with me professionally and see my work experience'
    },
    twitter: {
      username: 'rudransh190204',
      url: 'https://twitter.com/rudransh190204',
      description: 'Follow me for tech insights and updates on my latest projects'
    }
  }

  const fileSystem: FileSystem = {
    home: {
      type: 'directory',
      content: {
        user: {
          type: 'directory',
          content: {
            projects: {
              type: 'directory',
              content: {
                'HireSight': { type: 'file', content: 'https://github.com/HireSight/Frontend' },
                'AE-Forge': { type: 'file', content: 'https://github.com/Ansh1902396/AE-forge' },
                'X_Place': { type: 'file', content: 'https://github.com/Suryansh-23/X_Place' },
                'Augmentium': { type: 'file', content: 'https://github.com/Ansh1902396/Augmentium' },
                'On-Chain-Data-Encryption': { type: 'file', content: 'https://github.com/Suryansh-23/artela-encryption-aspect' },
                'KageGroove': { type: 'file', content: 'https://github.com/Ansh1902396/KageGroove' },
                'Drona-AI': { type: 'file', content: 'https://dronaai.aviral.software/' },
                'Cube': { type: 'file', content: 'https://github.com/Ansh1902396/Cube-' },
                'Tetris.rs': { type: 'file', content: 'https://github.com/Ansh1902396/tetris' },
              }
            },
            documents: {
              type: 'directory',
              content: {
                'resume.pdf': { type: 'file', content: 'https://example.com/resume.pdf' },
                'notes.txt': { type: 'file', content: 'https://example.com/notes.txt' },
                'resume.txt': { type: 'file', content: `Rudransh Shinghal
rudransh9shinghal@gmail.com+91-6283-890-949§GitHubïLinkedInTwitter
Education
•LNM Institute of Information Technology, JaipurSept 2022 – May 2027
–B.Tech-M.Tech in Electronics and Communications
Skills
•Languages:Rust, Solidity, Golang, TypeScript, JavaScript, Python, C/C++
•Technologies:Geth, Ethers.js, viem, EVM, CosmWasm, GTK-rs, Cryptography, Distributed Systems, React.js,
Node.js
•Other Skills:Web3.js, Web3Auth, IPFS, Chainlink, Consensus Protocols
Work Experience
•Blockchain Developer, Deon LabsApril 2024 – Present
–Spearheaded the development of Account Abstraction Solutions for Cosmos Chains using Rust, creating robust
contracts for Entrypoint, Accounts, and Paymaster.
–Designed and optimized smart contracts and relayers with sub-10ms latency for real-time data oracle integration
across Cosmos and EVM chains.
–Mentored 100+ developers globally, enhancing the adoption of Oraichain and modern blockchain methodolo-
gies.
•Full-Stack Engineer, FreelanceMay 2023 – Aug 2023
–Delivered 10+ responsive decentralized applications (dApps) with seamless blockchain integration, leveraging
Ethereum and Cosmos.
–Enhanced  performance  by  30%  through  optimization  of  Web3.js/Ethers.js,  ensuring  efficient  gas  usage  and
real-time data updates.
–Collaborated with smart contract developers to create user-centric interfaces for DeFi apps, token swaps, and
NFT platforms.
Projects
•Augmentium§GitHub
–Built a decentralized stablecoin pegged to gold using CosmWasm smart contracts on the Cosmos ecosystem.
–Achieved a 99.9% transaction success rate while reducing gas fees by 15%, enabling scalable and reliable DeFi
solutions.
–Enhanced token interoperability across blockchain networks, facilitating seamless trading with real-world as-
sets.
•On-Chain Data Encryption§GitHub
–Engineered a cutting-edge encryption framework using ChaCha20-Poly1305 within Artela Blockchain smart
contracts.
–Improved data integrity and confidentiality for decentralized applications, ensuring 256-bit security for sensitive
information.
•AE Forge§GitHub
–Developed a low-code platform for seamless Sophia smart contract creation, utilizing LLM-based guidance.
–Integrated secure authentication via Web3Auth and enhanced the contract deployment pipeline.
•KageGroove§GitHub
–Created a memory-efficient music player in Rust with SDL, achieving playback latency of under 50ms.
–Reduced memory usage by 20% compared to traditional music players, supporting MP3 formats effectively.
Achievements
•Mantra RWA Hackathon Winner:  Designed and deployed a gold-pegged stablecoin; secured 1st place among
100+ teams.
•Artela Use-Case Buildathon Winner:  Developed innovative encryption solutions; rewarded with USD 500.
•Track Winner, LNMHacks 6.0:  Created AE Forge; secured top prizes across two tracks among 300+ projects.
•Crack The Code 3.0 (1st Position):  Built HireSight, an LLM-powered interview preparation tool.
•Crack The Code 4.0 (1st Position):  Developed Drona AI, a course assistance platform with advanced features.
Research Articles
•International Stablecoin Report
–Analyzed decentralized collateral structures and their scalability potential within DeFi ecosystems.
Extra Curricular Activities
•Organizer, LNMHacks 6.0:  Secured USD 7,000 in sponsorships, driving blockchain innovation.` },
              }
            },
            social: {
              type: 'directory',
              content: {
                github: { type: 'file', content: 'https://github.com/Ansh1902396' },
                linkedin: { type: 'file', content: 'https://www.linkedin.com/in/rudransh-shinghal-264b37206/' },
                twitter: { type: 'file', content: 'https://twitter.com/rudransh190204' },
              }
            },
            '.bashrc': { type: 'file', content: 'Bash configuration file' },
          }
        }
      }
    },
    etc: {
      type: 'directory',
      content: {
        'hosts': { type: 'file', content: 'Hosts file' },
        'passwd': { type: 'file', content: 'Password file' },
      }
    },
    var: {
      type: 'directory',
      content: {
        log: {
          type: 'directory',
          content: {
            'system.log': { type: 'file', content: 'System log file' },
          }
        }
      }
    },
  }

  const gameLocations = {
    construct: {
      description: "You find yourself in the Construct, a pristine white void. Before you stands a table with two pills - one red, one blue. Morpheus waits for your choice.",
      availableCommands: [
        "look",
        "take red pill",
        "take blue pill",
        "talk to morpheus",
        "examine pills"
      ]
    },
    matrix: {
      description: "Cascading green code fills your vision. The familiar city materializes around you, but now you see it for what it really is - a prison for the mind.",
      availableCommands: [
        "look",
        "hack terminal",
        "dodge bullet",
        "find phone",
        "fight agent",
        "analyze code",
        "solve challenge",
        "submit_solution"
      ]
    },
    training: {
      description: "You're in the Construct's training program. The dojo is minimalist, focused. Everything from weapons to training simulations is available here.",
      availableCommands: [
        "look",
        "train combat",
        "practice dodge",
        "learn techniques",
        "spar",
        "meditate"
      ]
    },
    zion: {
      description: "The last human city, deep beneath the Earth's surface. The air hums with machinery, and the hope of humanity surrounds you.",
      availableCommands: [
        "look",
        "train skills",
        "meet morpheus",
        "defend zion",
        "rally humans",
        "upgrade weapons"
      ]
    },
    machineCity: {
      description: "You've reached the heart of the machine world. Towering structures of metal and circuitry surround you. The fate of both humans and machines hangs in the balance.",
      availableCommands: [
        "look",
        "negotiate",
        "fight",
        "sacrifice",
        "return"
      ]
    }
  }

  const handleConstructCommands = (command: string) => {
    switch (command) {
      case 'take red pill':
        setGameState(prev => ({ 
          ...prev, 
          location: 'training',
          awareness: prev.awareness + 20,
          health: Math.max(prev.health - 10, 0),
          inventory: [...prev.inventory, 'neural interface']
        }))
        return "You take the red pill. The world dissolves around you as your mind is freed from the Matrix. You awaken to the harsh reality, ready to begin your training. Your health decreases slightly due to the shock."
      
      case 'take blue pill':
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return "You take the blue pill. The simulation ends, leaving you to return to your comfortable prison. Game Over."
      
      case 'talk to morpheus':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 5 }))
        return "Morpheus explains: 'You've felt it your entire life. Something is wrong with the world. You don't know what it is, but it's there, like a splinter in your mind, driving you mad.' Your awareness increases slightly."
      
      case 'examine pills':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 2 }))
        return "The red pill represents the truth of reality, no matter how difficult. The blue pill offers the comfort of blissful ignorance. Your choice will determine your fate. Your awareness increases slightly as you contemplate the decision."
      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  const handleTrainingCommands = (command: string) => {
    switch (command) {
      case 'train combat':
        if (Math.random() > 0.7) {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 15, health: Math.max(prev.health - 5, 0) }))
          return "You practice martial arts in the dojo. Your movements become faster, more fluid. Your awareness of the system grows, but you sustain minor injuries."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 10 }))
          return "You practice martial arts in the dojo. Your movements become faster, more fluid. Your awareness of the system grows."
        }
      
      case 'practice dodge':
        if (gameState.awareness >= 30) {
          if (Math.random() > 0.6) {
            setGameState(prev => ({ ...prev, awareness: prev.awareness + 20 }))
            return "Time seems to slow as you move. You're beginning to see the code behind the bullets."
          } else {
            setGameState(prev => ({ ...prev, health: Math.max(prev.health - 15, 0) }))
            return "You're not fast enough. A bullet grazes you, causing damage."
          }
        } else {
          return "You're not yet ready. Keep training to increase your awareness."
        }
      
      case 'learn techniques':
        setGameState(prev => ({ 
          ...prev, 
          awareness: prev.awareness + 10,
          inventory: [...prev.inventory, 'combat_training']
        }))
        return "You absorb various combat techniques directly into your mind. The boundaries between the real and digital blur."
      
      case 'spar':
        if (Math.random() > 0.5) {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 10, health: Math.max(prev.health - 10, 0) }))
          return "You spar with an AI simulation, testing your growing abilities. You take some hits but learn from the experience."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 5 }))
          return "You spar with an AI simulation, successfully avoiding most attacks."
        }
      
      case 'meditate':
        if (gameState.awareness >= 50) {
          setGameState(prev => ({ ...prev, location: 'matrix', health: Math.min(prev.health + 20, 100) }))
          return "Through deep meditation, you achieve a new understanding of the Matrix. You're ready to re-enter the system. Your health improves as you center yourself."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 5, health: Math.min(prev.health + 5, 100) }))
          return "You meditate on the nature of reality. Continue training to increase your awareness. Your health improves slightly."
        }
      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  const handleMatrixCommands = (command: string, args: string[]): string | undefined => {
    switch (command) {
      case 'hack terminal':
        if (Math.random() > 0.6) {
          const challengeType = Math.random() > 0.5 ? 'cryptographic' : 'coding'
          const challenges = challengeType === 'cryptographic' ? cryptographicChallenges : codingChallenges
          const challenge = challenges[Math.floor(Math.random() * challenges.length)]
          setCurrentChallenge(challenge)
          setChallengeState({
            currentChallenge: challenge.name,
            challengeProgress: 0,
            challengeSolved: false,
          })
          setGameState(prev => ({ 
            ...prev, 
            awareness: prev.awareness + 15,
            inventory: [...prev.inventory, 'access_codes']
          }))
          return `Success! You've hacked into a terminal. A new ${challengeType} challenge is available. Type 'solve challenge' to view and attempt the challenge.`
        } else {
          setGameState(prev => ({ ...prev, awareness: Math.max(0, prev.awareness - 10), health: Math.max(prev.health - 20, 0) }))
          return "The hack fails. Agents may have been alerted to your presence. Your awareness slightly decreases and you take damage from a system shock."
        }
      
      case 'solve challenge':
        if (currentChallenge) {
          setModalContent({
            title: currentChallenge.name,
            description: currentChallenge.description,
            hint: currentChallenge.hint,
          })
          setIsModalOpen(true)
          return `Challenge: ${currentChallenge.name}

Opening challenge details. Please check the terminal window to view and attempt the challenge.`
        }
        return "No active challenge. Hack a terminal first."

      case 'check_solution':
        if (currentChallenge) {
          const userSolution = args.join(' ').trim().toLowerCase()
          if (userSolution === currentChallenge.solution.toLowerCase()) {
            setChallengeState(prev => ({ ...prev, challengeSolved: true }))
            setGameState(prev => ({ 
              ...prev, 
              awareness: prev.awareness + 25,
              inventory: [...prev.inventory, `solved_${currentChallenge.name.toLowerCase().replace(/\s+/g, '_')}`]
            }))
            setCurrentChallenge(null)
            setIsModalOpen(false)
            setModalContent(null)
            return "Correct! You've solved the challenge. Your awareness of the system has greatly increased, and you've gained a new item in your inventory."
          } else {
            setGameState(prev => ({ ...prev, health: Math.max(prev.health - 10, 0) }))
            return "Incorrect solution. The system's defenses have damaged you. Try again."
          }
        }
        return "No active challenge or invalid command format."
    default:
      return undefined;
  }
  }

  const handleZionCommands = (command: string) => {
    switch (command) {
      case 'train skills':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 25, health: Math.min(prev.health + 10, 100) }))
        return "You spend time in the Zion combat simulator, honing your abilities to their peak. Your health improves slightly."
      
      case 'meet morpheus':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 15 }))
        return "Morpheus shares wisdom about the nature of the Matrix: 'Remember, there is a difference between knowing the path and walking the path.' Your awareness increases."
      
      case 'defend zion':
        if (gameState.awareness >= 90 && gameState.health >= 80) {
          setGameState(prev => ({ ...prev, location: 'machineCity' }))
          return `Your leadership in defending Zion has been crucial. The machines have called for a parley. 
You've been chosen to represent humanity in the Machine City. Prepare for the final confrontation.`
        } else if (gameState.awareness >= 90) {
          setGameState(prev => ({ ...prev, health: Math.max(prev.health - 30, 0) }))
          return "Your awareness is high, but your physical condition isn't at its peak. You fight valiantly but sustain injuries. Zion survives, but at a great cost."
        } else {
          setGameState(prev => ({ ...prev, health: Math.max(prev.health - 50, 0) }))
          return "The machines are too powerful. Zion suffers heavy losses, and you're severely injured. The resistance continues, but the future looks grim."
        }
      
      case 'rally humans':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 15, health: Math.min(prev.health + 5, 100) }))
        return "You share your knowledge and experiences, inspiring others to push their own boundaries of awareness. The unity boosts morale, slightly improving your health."
      
      case 'upgrade weapons':
        if (!gameState.inventory.includes('emp_device')) {
          setGameState(prev => ({ 
            ...prev,
            inventory: [...prev.inventory, 'emp_device'],
            awareness: prev.awareness + 10
          }))
          return "You help upgrade Zion's defensive capabilities, adding EMP devices to your arsenal. Your technical understanding improves, increasing your awareness."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 5 }))
          return "The weapons are already at their peak efficiency. You spend time fine-tuning them, gaining a slight increase in awareness."
        }
      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  const handleMachineCityCommands = (command: string) => {
    switch (command) {
      case 'negotiate':
        if (gameState.awareness >= 95) {
          setGameState(prev => ({ ...prev, isGameOver: true }))
          return `Your high level of awareness allows you to see the bigger picture. You successfully negotiate a truce between humans and machines, establishing a new era of coexistence. Congratulations, you've completed the Matrix simulation!|GAME_OVER`
        } else {
          return `Your attempt at negotiation fails. The machines do not believe in your sincerity or understanding. Keep trying or explore other options.`
        }
      case 'fight':
        if (gameState.health >= 90) {
          setGameState(prev => ({ ...prev, isGameOver: true }))
          return `You engage in an epic battle with the machines. Your peak physical condition allows you to overcome their defenses. You destroy the central AI, freeing humanity. However, the cost is high, and the future remains uncertain. You've completed the Matrix simulation!|GAME_OVER`
        } else {
          setGameState(prev => ({ ...prev, health: Math.max(prev.health - 40, 0) }))
          return `You fight bravely, but the machines overpower you. You're severely injured. If your health reaches 0, the simulation will end.`
        }
      case 'sacrifice':
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return `You choose to sacrifice yourself to reset the Matrix, following the path of The One. Your decision brings temporary peace, but the cycle continues. You've completed the Matrix simulation with a bittersweet ending.|GAME_OVER`
      case 'return':
        setGameState(prev => ({ ...prev, location: 'zion' }))
        return `You decide the risk is too great and return to Zion to regroup and rethink your strategy.`
      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  const handleGameCommand = (args: string[]) => {
    const command = args.join(' ').toLowerCase()
    const currentLocation = gameLocations[gameState.location as keyof typeof gameLocations]
    
    if (gameState.isGameOver) {
      return "The simulation has ended. Type 'exit' to leave the game."
    }

    if (gameState.health <= 0) {
      setGameState(prev => ({ ...prev, isGameOver: true }))
      return "Your health has reached 0. The simulation has ended.|GAME_OVER"
    }

    // Universal commands available in all locations
    switch (command) {
      case 'look':
        return currentLocation.description
      case 'inventory':
        return `Your inventory contains: ${gameState.inventory.join(', ') || 'nothing'}`
      case 'status':
        return `Your current awareness level is ${gameState.awareness}% and your health is ${gameState.health}%`
      case 'help':
        return `Available commands in ${gameState.location}:
${currentLocation.availableCommands.join('\n')}

Universal commands:
- look: Examine your surroundings
- inventory: Check your items
- status: Check your awareness level and health
- help: Show this help message
- exit: Exit the game`
    }

    // Location-specific commands
    if (currentLocation.availableCommands.includes(command)) {
      switch (gameState.location) {
        case 'construct':
          return handleConstructCommands(command)
        case 'training':
          return handleTrainingCommands(command)
        case 'matrix':
          return handleMatrixCommands(command, args) || "Unknown command. Type 'help' to see available commands."
        case 'zion':
          return handleZionCommands(command)
        case 'machineCity':
          return handleMachineCityCommands(command)
      }
    }

    return "Unknown command. Type 'help' to see available commands."
  }

  const cryptographicChallenges = [
    {
      name: 'Blockchain Basics',
      description: 'What consensus mechanism does Bitcoin use to validate transactions and create new blocks?',
      solution: 'proof of work',
      hint: 'It involves miners solving complex mathematical problems.',
    },
    {
      name: 'Smart Contracts',
      description: 'Which blockchain platform first introduced smart contracts?',
      solution: 'ethereum',
      hint: 'Vitalik Buterin created this platform.',
    },
    {
      name: 'Web3 Knowledge',
      description: 'What type of token standard is commonly used for NFTs on Ethereum?',
      solution: 'erc721',
      hint: 'It\'s a non-fungible token standard.',
    },
  ]

  const codingChallenges = [
    {
      name: 'Anime Trivia',
      description: 'In "Ghost in the Shell", what is the name of the cyber-brain augmentation virus that allows hackers to take over people\'s minds?',
      solution: 'puppet master',
      hint: 'It\'s also known as Project 2501.',
    },
    {
      name: 'Matrix Knowledge',
      description: 'What is the name of the last human city in The Matrix?',
      solution: 'zion',
      hint: 'It\'s located near the Earth\'s core.',
    },
    {
      name: 'Cyberpunk Anime',
      description: 'In "Akira", what is the name of the powerful psychic force that Tetsuo develops?',
      solution: 'akira',
      hint: 'The movie shares its name with this power.',
    },
  ]

  const handleSolveChallenge = (solution: string) => {
    if (currentChallenge) {
      const userSolution = solution.trim().toLowerCase()
      if (userSolution === currentChallenge.solution.toLowerCase()) {
        setChallengeState(prev => ({ ...prev, challengeSolved: true }))
        setGameState(prev => ({ 
          ...prev, 
          awareness: prev.awareness + 25,
          inventory: [...prev.inventory, `solved_${currentChallenge.name.toLowerCase().replace(/\s+/g, '_')}`]
        }))
        setCurrentChallenge(null)
        setIsModalOpen(false)
        setModalContent(null)
        return "Correct! You've solved the challenge. Your awareness of the system has greatly increased, and you've gained a new item in your inventory."
      } else {
        setGameState(prev => ({ ...prev, health: Math.max(prev.health - 10, 0) }))
        return "Incorrect solution. The system's defenses have damaged you. Try again."
      }
    }
    return "No active challenge or invalid command format."
  }

  const commands: Record<string, (args?: string[]) => string | JSX.Element | Promise<string>> = {
    help: () => `Available commands:
ℹ️  help     - Show this help message
👤 about    - Display information about me
🚀 skills   - List my technical skills
💼 projects - Show my project list
📞 contact  - Display my contact information
🎨 ascii    - Show ASCII art
🧹 clear    - Clear the terminal screen
🗣️  echo     - Repeat the given text
🕰️  date     - Show current date and time
📂 ls       - List contents of current directory
📁 cd       - Change directory
🗺️  pwd      - Print working directory
✨ touch    - Create a new file or access a link
📝 vim      - Open vim-style editor
🎮 play     - Start "The Matrix Simulation" text adventure game
🔍 grep     - Search for project information
💰 eth      - Ethereum-related commands (balance, gas, block)
📄 resume   - Open my resume PDF in a new tab

Matrix Simulation Game Commands:
- look: Examine your surroundings
- inventory: Check your items
- status: Check your awareness level and health
- [action]: Perform the action shown in the location description
- help: Show this help message

Your goal is to increase your awareness, navigate through the Matrix, and ultimately reach and defend Zion.`,
    about: () => {
      setInfoModalContent({
        title: 'About Rudransh Shinghal',
        content: React.createElement('div', { className: "space-y-4" },
          React.createElement('p', null, "👋 Hi, I'm Rudransh Shinghal, a passionate software developer with a knack for blockchain innovation and clean, scalable code. 🚀"),

          React.createElement('p', { className: "font-semibold" }, "🦀 Rust Expertise:"),
          React.createElement('ul', { className: "list-disc list-inside space-y-2" },
            React.createElement('li', null, "⚡ Mastery in Rust: Proficient in building fast, efficient, and memory-safe applications."),
            React.createElement('li', null, "🛠️ Developed production-grade systems using Rust for blockchain and decentralized solutions."),
            React.createElement('li', null, "📜 Passion for clean and idiomatic Rust code with a focus on performance and scalability.")
          ),

          React.createElement('p', { className: "font-semibold" }, "🔗 Blockchain Development:"),
          React.createElement('ul', { className: "list-disc list-inside space-y-2" },
            React.createElement('li', null, "📝 Designed and deployed smart contracts with CosmWasm and Solidity."),
            React.createElement('li', null, "🏗️ Architected account abstraction models and cross-chain messaging systems."),
            React.createElement('li', null, "🌍 Contributed to blockchain ecosystems like Oraichain, pushing technological boundaries."),
            React.createElement('li', null, "🎓 Mentored 100+ developers in blockchain and Cosmos SDK.")
          ),

          React.createElement('p', { className: "font-semibold" }, "💡 Why Work With Me?"),
          React.createElement('ul', { className: "list-disc list-inside space-y-2" },
            React.createElement('li', null, "🧹 Clean Code Advocate: I prioritize maintainable and scalable codebases."),
            React.createElement('li', null, "🤝 Collaboration-Driven: I thrive in team environments and love sharing knowledge."),
            React.createElement('li', null, "🚀 Always Innovating: I stay ahead of the curve by exploring new tech and solving complex problems.")
          ),

          React.createElement('p', null, "⚡ I'm passionate about creating impactful solutions at the intersection of Rust and blockchain innovation."),

          React.createElement('p', { className: "font-semibold text-center" }, "🤝 Let’s build something extraordinary together! 🚀")
        )
      });
      setTimeout(() => setIsInfoModalOpen(true), 100);
      return "Opening about information...";
    },
    skills: () => `My skills include:
🚀 JavaScript
🔷 TypeScript
⚛️ Next.js
🐹 Go (Golang)
🦀 Rust
🔗 Solidity
🐳 Docker
🖥️ C
📝 Vim
💡 Notion
🐰 Bun
⚛️ React
🌐 WebAssembly
🔧 Git`,
    projects: () => {
      setInfoModalContent({
        title: 'My Projects',
        content: (
          <div className="space-y-6">
            {Object.entries(projectInfo).map(([name, info]) => (
              <div key={name} className="border border-green-400 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">{name}</h3>
                <p className="text-green-300 mb-2">{info.description}</p>
                <p className="mb-2">
                  <span className="font-semibold">Technologies:</span> {info.technologies.join(', ')}
                </p>
                <div className="mb-2">
                  <p className="font-semibold mb-1">Features:</p>
                  <ul className="list-disc list-inside">
                    {info.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <p>
                  <a href={info.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    GitHub Repository
                  </a>
                </p>
              </div>
            ))}
          </div>
        ),
      })
      setTimeout(() => setIsInfoModalOpen(true), 100)
      return "Opening projects information..."
    },
    contact: () => `You can reach me at:
📧 Email
LinkedIn: rudransh-shinghal-264b37206
🐦 Twitter: rudransh190204`,
    ascii: () => asciiArt,
    clear: () => 'CLEAR',
    echo: (args) => args ? args.join(' ') : '',
    date: () => getTimestamp(),
    ls: (args) => {
      let targetPath = currentPath
      if (args && args.length > 0) {
        targetPath = resolvePath(args[0])
      }
      let currentDir = navigateToPath(targetPath)
      if (typeof currentDir === 'string') {
        return currentDir
      }
      if (currentDir.type !== 'directory') {
        return `ls: ${targetPath.join('/')}: Not a directory`
      }
      const fileSystemEntries = Object.entries(currentDir.content as FileSystem)
        .map(([name, item]) => `${item.type === 'directory' ? 'd' : '-'}rw-r--r-- 1 user user ${item.type === 'directory' ? '4096' : '0'} ${getTimestamp()} ${name}`)
      
      const userFiles = Object.entries(files)
        .filter(([name, content]) => targetPath.join('/') === 'home/user')
        .map(([name, content]) => `-rw-r--r-- 1 user user ${content.length} ${getTimestamp()} ${name}`)
      
      return [...fileSystemEntries, ...userFiles].join('\n')
    },
    cd: (args): string => {
      if (!args || args.length === 0) {
        setCurrentPath(['home', 'user'])
        return ''
      }
      const newPath = resolvePath(args[0])
      const result = navigateToPath(newPath)
      if (typeof result === 'string') {
        return result
      }
      if (result.type === 'directory') {
        setCurrentPath(newPath)
        
        // Check if we're entering a projects or social directory
        if (newPath.includes('projects') || newPath.includes('social')) {
          const item = navigateToPath(newPath) as FileSystemItem
          if (item.type === 'file' && typeof item.content === 'string' && item.content.startsWith('http')) {
            window.open(item.content, '_blank')
            return `Opened link: ${item.content}`
          }
        }
        
        return ''
      } else {
        return `cd: ${args[0]}: Not a directory`
      }
    },
    pwd: () => '/' + currentPath.join('/'),
    touch: (args) => {
      if (!args || args.length === 0) {
        return 'touch: missing file operand'
      }
      const fileName = args[0]
      if (files[fileName]) {
        return `File '${fileName}' already exists.`
      }
      setFiles(prevFiles => ({...prevFiles, [fileName]: ''}))
      return `Created file: ${fileName}`
    },
    vim: (args) => {
      if (!args || args.length === 0) {
        return 'vim: missing file operand'
      }
      const fileName = args[0]
      if (!files[fileName]) {
        setFiles(prevFiles => ({...prevFiles, [fileName]: ''}))
      }
      return `Opening ${fileName} in vim...`
    },
    play: () => {
      setGameState({
        location: 'construct',
        inventory: [],
        awareness: 0,
        health: 100,
        isGameOver: false
      })
      return `Welcome to the Matrix Simulation!

You find yourself in the Construct, a loading program for the Matrix. Your mission is to navigate both the real and digital worlds, increase your awareness, and ultimately help defend Zion.

How to play:
1. Use "look" to examine your surroundings
2. Use "inventory" to check your items
3. Use "status" to check your awareness level and health
4. Type actions directly (e.g., "take red pill", "hack terminal", etc.)
5. Use "help" to see available commands in your current location

Remember: "Free your mind."

Type "look" to begin your journey.`
    },
    game: (args) => {
      const [gameCommand, ...gameArgs] = args || []
      if (gameCommand === 'check_solution') {
        return handleMatrixCommands('check_solution', gameArgs) || 'Invalid solution format.'
      }
      return handleGameCommand(args || [])
    },
    grep: (args) => {
      if (!args || args.length === 0) {
        return 'Usage: grep <search_term> [file_name]'
      }
      const searchTerm = args[0].toLowerCase()
      const fileName = args[1]

      if (fileName) {
        if (files[fileName]) {
          const lines = files[fileName].split('\n').filter(line => line.toLowerCase().includes(searchTerm))
          return lines.length > 0 ? lines.join('\n') : `No matches found in ${fileName}`
        } else {
          return `File ${fileName} not found`
        }
      } else {
        const results: string[] = []
        
        // Search in projects
        for (const [name, info] of Object.entries(projectInfo)) {
          if (name.toLowerCase().includes(searchTerm) || 
              info.description.toLowerCase().includes(searchTerm) || 
              info.technologies.some(tech => tech.toLowerCase().includes(searchTerm)) ||
              info.features.some(feature => feature.toLowerCase().includes(searchTerm))) {
            results.push(`Project: ${name}`)
            results.push(`Description: ${info.description}`)
            results.push(`Technologies: ${info.technologies.join(', ')}`)
            results.push(`Features: ${info.features.join(', ')}`)
            results.push(`GitHub: ${info.github}`)
            results.push('')
          }
        }
        
        // Search in social links
        for (const [platform, info] of Object.entries(socialInfo)) {
          if (platform.toLowerCase().includes(searchTerm) || 
              info.username.toLowerCase().includes(searchTerm) ||
              info.description.toLowerCase().includes(searchTerm)) {
            results.push(`Social: ${platform}`)
            results.push(`Username: ${info.username}`)
            results.push(`URL: ${info.url}`)
            results.push(`Description: ${info.description}`)
            results.push('')
          }
        }
        
        // Search in user files
        for (const [name, content] of Object.entries(files)) {
          const lines = content.split('\n').filter(line => line.toLowerCase().includes(searchTerm))
          if (lines.length > 0) {
            results.push(`File: ${name}`)
            results.push(...lines)
            results.push('')
          }
        }
        
        return results.length > 0 ? results.join('\n') : 'No matches found'
      }
    },
    resume: () => {
      const resumeUrl = '/resume.pdf'
      window.open(resumeUrl, '_blank')
      return 'Opening resume PDF in a new tab...'
    },
    'close_modal': () => {
      setIsModalOpen(false)
      setModalContent(null)
      return "Modal closed."
    },
    'close_info_modal': () => {
      setIsInfoModalOpen(false)
      setInfoModalContent({ title: '', content: null })
      return "Modal closed."
    },
  }

  function resolvePath(path: string): string[] {
    if (path === '/') {
      return []
    }
    if (path.startsWith('/')) {
      return path.split('/').filter(Boolean)
    }
    if (path === '~') {
      return ['home', 'user']
    }
    if (path.startsWith('~/')) {
      return ['home', 'user', ...path.slice(2).split('/').filter(Boolean)]
    }
    if (path === '..') {
      return currentPath.slice(0, -1)
    }
    return [...currentPath, ...path.split('/').filter(Boolean)]
      .reduce((acc, part) => {
        if (part === '.') return acc
        if (part === '..') return acc.slice(0, -1)
        return [...acc, part]
      }, [] as string[])
  }

  function navigateToPath(path: string[]): FileSystemItem | string {
    let current: FileSystem | FileSystemItem = fileSystem
    for (const part of path) {
      if (typeof current === 'object' && 'type' in current) {
        if (current.type !== 'directory') {
          return `Not a directory: /${path.join('/')}`
        }
        current = current.content as FileSystem
      }
      if (!(part in current)) {
        return `No such file or directory: /${path.join('/')}`
      }
      current = current[part]
    }
    return current
  }

  const executeCommand = (command: string): string | JSX.Element | Promise<string> => {
    const [cmd, ...args] = command.trim().split(' ')
    if (cmd in commands) {
      return commands[cmd](args)
    }
    return `Command not found: ${command}. Type 'help' for a list of available commands.`
  }

  const resetGame = useCallback(() => {
    setGameState({
      location: 'construct',
      inventory: [],
      awareness: 0,
      health: 100,
      isGameOver: false
    })
  }, [])

  const openModal = (content: { title: string; description: string; hint: string }) => {
    setModalContent(content)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false)
      setModalContent(null)
    }, 300) // 300ms delay
  }

  return { 
    executeCommand, 
    getCurrentPath: () => '/' + currentPath.join('/'), 
    gameState, 
    resetGame, 
    isVimActive, 
    vimContent, 
    vimMode, 
    cursor, 
    setVimContent, 
    setVimMode, 
    setCursor, 
    currentFileName, 
    setCurrentFileName, 
    files, 
    setFiles, 
    challengeState, 
    setChallengeState, 
    openModal,
    closeModal,
    isModalOpen,
    setIsModalOpen,
    modalContent,
    setModalContent,
    handleSolveChallenge,
    isInfoModalOpen,
    setIsInfoModalOpen,
    infoModalContent
  }
}

