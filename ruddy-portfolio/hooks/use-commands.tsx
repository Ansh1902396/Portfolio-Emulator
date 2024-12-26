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
  const [files, setFiles] = useState<Record<string, string>>({
    'notes.txt': `The Matrix Simulation Game Notes:

1. Immersive Experience: The game brilliantly captures the essence of the Matrix universe, making you feel like you're truly jacking in.

2. Challenging Puzzles: The hacking challenges and cryptographic puzzles add an exciting layer of depth to the gameplay.

3. Character Growth: Watching your awareness and skills increase as you progress is incredibly satisfying.

4. Multiple Paths: The ability to make choices that affect the outcome adds great replay value.

5. Atmospheric Writing: The descriptions of each location really bring the digital world to life.

6. Balanced Difficulty: The game provides a good challenge without being frustratingly hard.

7. Easter Eggs: Keep an eye out for references to the movies and other cyberpunk media!

8. Strategic Gameplay: Managing your health and awareness adds a nice strategic element.

9. Engaging Story: The narrative keeps you invested in your character's journey from confused newcomer to potential savior.

10. Cool Commands: Using terminal-style commands to interact with the game world is a neat touch that fits the hacker aesthetic perfectly.

Remember: The Matrix has you... Have fun and free your mind!` , 

    'resume.txt' : `Rudransh Shinghal
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
•Organizer, LNMHacks 6.0:  Secured USD 7,000 in sponsorships, driving blockchain innovation.` , 

    'books&anime.txt' : `
  1 . God Equation by Michio Kaku
  2 . Bitcoin Programming
  3 . 
`
  })
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
  const [isVimModalOpen, setIsVimModalOpen] = useState(false) // For VimModal visibility

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

  // ----------------------------
  // PROJECT INFO & SOCIAL INFO
  // ----------------------------
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
      description: '🕹 Classic Tetris game implemented in Rust, showcasing systems programming and game development skills.',
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
    },
    telegram: {
      username: 'That_guy_Rudransh',
      url: 'https://t.me/That_guy_Rudransh',
      description: 'Chat with me on Telegram'
    }
  }

  // ----------------------------
  // FILE SYSTEM
  // ----------------------------
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
                'resume.pdf': { type: 'file', content: 'https://drive.google.com/file/d/1ejcVHLxkwZoVUDEWsMetoirEUWg4Et_1/view' },
                'notes.txt': { type: 'file', content: `The Matrix Simulation Game Notes:

1. Immersive Experience: The game brilliantly captures the essence of the Matrix universe, making you feel like you're truly jacking in.

2. Challenging Puzzles: The hacking challenges and cryptographic puzzles add an exciting layer of depth to the gameplay.

3. Character Growth: Watching your awareness and skills increase as you progress is incredibly satisfying.

4. Multiple Paths: The ability to make choices that affect the outcome adds great replay value.

5. Atmospheric Writing: The descriptions of each location really bring the digital world to life.

6. Balanced Difficulty: The game provides a good challenge without being frustratingly hard.

7. Easter Eggs: Keep an eye out for references to the movies and other cyberpunk media!

8. Strategic Gameplay: Managing your health and awareness adds a nice strategic element.

9. Engaging Story: The narrative keeps you invested in your character's journey from confused newcomer to potential savior.

10. Cool Commands: Using terminal-style commands to interact with the game world is a neat touch that fits the hacker aesthetic perfectly.

Remember: The Matrix has you... Have fun and free your mind!` },
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

  // ----------------------------
  // GAME LOCATIONS & STORY
  // ----------------------------
  const gameLocations = {
    construct: {
      description: "You find yourself in the Construct, a pristine white void. Before you stands a table with two pills - one red, one blue. Morpheus waits for your choice. Type 'look' or choose your pill.",
      availableCommands: [
        "look",
        "take red pill",
        "take blue pill",
        "talk to morpheus",
        "examine pills"
      ]
    },
    training: {
      description: "You're in the Construct's training program. A minimalist dojo stands ready, surrounded by racks of virtual weapons. This is where you learn to bend the rules of the Matrix.",
      availableCommands: [
        "look",
        "train combat",
        "practice dodge",
        "learn techniques",
        "spar",
        "meditate"
      ]
    },
    matrix: {
      description: "Cascading green code shapes a city around you. Agents lurk in every shadow. A flickering neon sign reads 'Follow the White Rabbit'.",
      availableCommands: [
        "look",
        "hack terminal",
        "dodge bullet",
        "find phone",
        "fight agent",
        "analyze code",
        "solve challenge",
        "submit_solution",
        "enter oracle's temple"
      ]
    },
    // NEW: Oracle's Temple for advanced puzzles and lore
    oracleTemple: {
      description: "You enter the Oracle's Temple. Incense drifts through the air. The walls are covered in cryptic symbols—a merging of Greek oracles and digital code. At the center is the Oracle, smiling calmly, waiting for you to ask the right question.",
      availableCommands: [
        "look",
        "talk to oracle",
        "offer cookies",
        "ask question",
        "decipher symbols"
      ]
    },
    // Original location
    zion: {
      description: "The last human city, deep beneath the Earth's surface. Machinery thrums all around, and the resistance stands on the brink of war.",
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
      description: "You've reached the heart of the machine world. Towering structures hum with synthetic life. A single, monumental AI overseer stares down at you.",
      availableCommands: [
        "look",
        "negotiate",
        "fight",
        "sacrifice",
        "return"
      ]
    }
  }

  // ----------------------------
  // HANDLE COMMANDS PER LOCATION
  // ----------------------------
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
        return "You swallow the red pill. Reality bends, the Construct fades, and you awaken groggily in a training simulation. Your health dips from the shock, but your awareness grows."

      case 'take blue pill':
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return "You take the blue pill and drift back into comfortable ignorance. Game Over."

      case 'talk to morpheus':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 5 }))
        return "Morpheus: 'I can only show you the door. You're the one who has to walk through it.' Your awareness increases slightly."

      case 'examine pills':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 2 }))
        return "One pill to continue believing what you want, another to learn the truth of the Matrix. Awareness nudges upward as you ponder your choice."

      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  const handleTrainingCommands = (command: string) => {
    switch (command) {
      case 'train combat':
        if (Math.random() > 0.7) {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 15, health: Math.max(prev.health - 5, 0) }))
          return "You throw yourself into intense combat training. Your awareness leaps forward, but you take a few bruising hits."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 10 }))
          return "Your muscles memorize each move as you spar against simulated foes. Awareness rises steadily."
        }

      case 'practice dodge':
        if (gameState.awareness >= 30) {
          if (Math.random() > 0.6) {
            setGameState(prev => ({ ...prev, awareness: prev.awareness + 20 }))
            return "Bullets slow to a crawl as you twist your body. Your mastery of the Matrix grows quickly."
          } else {
            setGameState(prev => ({ ...prev, health: Math.max(prev.health - 15, 0) }))
            return "A near miss draws a line of pain across your arm. You're not fast enough yet."
          }
        } else {
          return "You feel the bullet whiz by before you can dodge. Perhaps you need higher awareness to pull this off consistently."
        }

      case 'learn techniques':
        setGameState(prev => ({
          ...prev,
          awareness: prev.awareness + 10,
          inventory: [...prev.inventory, 'combat_training']
        }))
        return "A surge of data floods your mind. Krav Maga, Kung Fu, and more—knowledge instantly uploaded to your neural interface."

      case 'spar':
        if (Math.random() > 0.5) {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 10, health: Math.max(prev.health - 10, 0) }))
          return "You trade blows with a skilled AI opponent. Pain is the best teacher, and you come away more aware but battered."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 5 }))
          return "You deftly deflect every strike. The AI can't touch you. Well done."
        }

      case 'meditate':
        if (gameState.awareness >= 50) {
          setGameState(prev => ({ ...prev, location: 'matrix', health: Math.min(prev.health + 20, 100) }))
          return "You find inner calm, stepping beyond the boundaries of the Construct. The next time you open your eyes, you're in the Matrix. Your health improves."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 5, health: Math.min(prev.health + 5, 100) }))
          return "You clear your mind, aligning body and code. Awareness and health improve slightly. Keep training to unlock the next step."
        }

      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  // Extended with possibility to enter Oracle’s Temple
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
          return `Success! You've hacked into a terminal. A new ${challengeType} challenge is available. Type 'solve challenge' to view it.`
        } else {
          setGameState(prev => ({ ...prev, awareness: Math.max(0, prev.awareness - 10), health: Math.max(prev.health - 20, 0) }))
          return "The hack triggers an alert. Agents swarm your location, and you escape with injuries. Awareness drops slightly."
        }

      case 'solve challenge':
        if (currentChallenge) {
          setModalContent({
            title: currentChallenge.name,
            description: currentChallenge.description,
            hint: currentChallenge.hint,
          })
          setIsModalOpen(true)
          return `Challenge: ${currentChallenge.name}\n\nOpening challenge details. Check the terminal window for the puzzle.`
        }
        return "No active challenge. Try hacking a terminal."

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
            return "Correct! You've outsmarted the system. Your awareness soars, and you collect a new item."
          } else {
            setGameState(prev => ({ ...prev, health: Math.max(prev.health - 10, 0) }))
            return "Wrong solution. The system retaliates, causing damage. Try again."
          }
        }
        return "No active challenge or wrong format."

      case 'enter oracle\'s temple':
        if (gameState.awareness >= 40) {
          setGameState(prev => ({ ...prev, location: 'oracleTemple' }))
          return "You follow cryptic graffiti through a back alley. The world flickers, and you step into the Oracle’s Temple."
        } else {
          return "A strange door appears in the alley, but it remains firmly locked. Maybe you need more awareness to perceive it."
        }

      default:
        return undefined
    }
  }

  // NEW: Oracle’s Temple Commands
  const handleOracleTempleCommands = (command: string) => {
    switch (command) {
      case 'talk to oracle':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 10 }))
        return "The Oracle: 'You already know what I'm going to say, don't you?' A wave of insight hits you, increasing your awareness."

      case 'offer cookies':
        if (!gameState.inventory.includes('cookie_tin')) {
          setGameState(prev => ({
            ...prev,
            inventory: [...prev.inventory, 'cookie_tin'],
            awareness: prev.awareness + 5
          }))
          return "You hand the Oracle a tin of cookies you somehow have in your pack. She smiles knowingly. 'I knew you would.'"
        } else {
          return "She already has a tin of your cookies, and you sense too many sweets might break the simulation."
        }

      case 'ask question':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 5 }))
        return "You ask the Oracle about your destiny. She offers cryptic reassurance: 'Know thyself, and you shall know the path.'"

      case 'decipher symbols':
        if (Math.random() > 0.5) {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 15 }))
          return "You translate ancient texts that reference cycles of the One. The lines between code and prophecy blur in your mind."
        } else {
          setGameState(prev => ({ ...prev, health: Math.max(prev.health - 10, 0) }))
          return "Your mind recoils from the riddles. Reality flickers, and you feel a sharp headache. You lose some health."
        }
      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  const handleZionCommands = (command: string) => {
    switch (command) {
      case 'train skills':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 25, health: Math.min(prev.health + 10, 100) }))
        return "You fine-tune your powers with top Zion warriors. Your awareness and health climb."

      case 'meet morpheus':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 15 }))
        return "Morpheus shares new intel on Machine attacks. 'Hope is our most powerful weapon,' he says. Your awareness expands."

      case 'defend zion':
        if (gameState.awareness >= 90 && gameState.health >= 80) {
          setGameState(prev => ({ ...prev, location: 'machineCity' }))
          return "Your leadership repels a massive assault. The machines call for negotiation. You leave for the Machine City."
        } else if (gameState.awareness >= 90) {
          setGameState(prev => ({ ...prev, health: Math.max(prev.health - 30, 0) }))
          return "Zion stands, but you sustain wounds in the battle. You must recover before you confront the Machine City."
        } else {
          setGameState(prev => ({ ...prev, health: Math.max(prev.health - 50, 0) }))
          return "You fight bravely, but your underdeveloped awareness leaves you vulnerable. Heavy casualties burden Zion."
        }

      case 'rally humans':
        setGameState(prev => ({ ...prev, awareness: prev.awareness + 15, health: Math.min(prev.health + 5, 100) }))
        return "You inspire the city with your tales of the Matrix. Morale surges, and your own health recovers a bit."

      case 'upgrade weapons':
        if (!gameState.inventory.includes('emp_device')) {
          setGameState(prev => ({ 
            ...prev,
            inventory: [...prev.inventory, 'emp_device'],
            awareness: prev.awareness + 10
          }))
          return "You design a portable EMP that disrupts machine signals. Your understanding of the Matrix deepens."
        } else {
          setGameState(prev => ({ ...prev, awareness: prev.awareness + 5 }))
          return "You've already built the ultimate EMP, but you refine the design a bit, boosting your awareness."
        }

      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  const handleMachineCityCommands = (command: string) => {
    switch (command) {
      case 'look':
        return gameLocations.machineCity.description
      case 'negotiate':
        if (gameState.awareness >= 95) {
          setGameState(prev => ({ ...prev, isGameOver: true }))
          return "Your expanded awareness helps you negotiate peace. Both man and machine find a new dawn. Congratulations—you’ve won!|GAME_OVER"
        } else {
          return "Your arguments fall on deaf sensors. The Machine AI sees through your inexperience. Boost awareness and try again."
        }

      case 'fight':
        if (gameState.health >= 90) {
          setGameState(prev => ({ ...prev, isGameOver: true }))
          return "You unleash everything you've learned. Sparks fly as machine overlords crumble. Victory is yours, but the future remains uncertain. You have finished the Matrix Simulation!|GAME_OVER"
        } else {
          setGameState(prev => ({ ...prev, health: Math.max(prev.health - 40, 0) }))
          return "A fierce battle leaves you wounded. If health hits 0, you lose. You might need a different approach."
        }

      case 'sacrifice':
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return "You surrender yourself as a catalyst to restart the Matrix's cycle, hoping humanity gets another chance. Bittersweet ending.|GAME_OVER"

      case 'return':
        setGameState(prev => ({ ...prev, location: 'zion' }))
        return "You retreat to Zion to regroup, your mind still reeling from the sheer scale of Machine City."

      default:
        return "Unknown command. Type 'help' to see available commands."
    }
  }

  // ----------------------------
  // COMBAT & CHALLENGE HANDLERS
  // ----------------------------
  // Expanded with Cicada 3301–style puzzles
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
    {
      name: 'Cicada 3301 #1',
      description: `
In one of the famous Cicada 3301 puzzles, participants encountered cryptographic references to prime numbers and steganography. 
This puzzle asks: "What large, commercially used cipher has a 128-bit block size and various key lengths from 128 to 256 bits?" 
(Hint: It's often used in secure HTTPS connections.)
      `.trim(),
      solution: 'aes',
      hint: 'It replaced DES officially.'
    },
  ]

  const codingChallenges = [
    {
      name: 'Anime Trivia',
      description: 'In "Ghost in the Shell", what is the name of the cyber-brain virus that allows hackers to take over minds?',
      solution: 'puppet master',
      hint: 'It\'s also known as Project 2501.',
    },
    {
      name: 'Matrix Knowledge',
      description: 'What is the name of the last human city in The Matrix?',
      solution: 'zion',
      hint: 'Located near the Earth’s core.',
    },
    {
      name: 'Cyberpunk Anime',
      description: 'In "Akira", what is the name of the powerful psychic force that Tetsuo awakens?',
      solution: 'akira',
      hint: 'The film shares its name with this power.',
    },
    {
      name: 'Cicada 3301 #2',
      description: `
Cicada 3301 famously posted images with hidden messages. One method to find them is to look at the least significant bits of an image or to extract text from the image file. 
What is this general technique called?
      `.trim(),
      solution: 'steganography',
      hint: 'Hiding messages in plain sight.'
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
        return "Correct! The puzzle unravels, and you gain deeper insight into the Matrix. Your awareness spikes."
      } else {
        setGameState(prev => ({ ...prev, health: Math.max(prev.health - 10, 0) }))
        return "Incorrect. The system’s defense punishes your mistake. Try again or look for more clues."
      }
    }
    return "No active challenge or invalid command format."
  }

  // ----------------------------
  // FILE OPERATIONS
  // ----------------------------
  const handleFileOperation = (operation: 'read' | 'write', fileName: string, content?: string) => {
    switch (operation) {
      case 'read':
        return files[fileName] || ''
      case 'write':
        setFiles(prev => ({ ...prev, [fileName]: content || '' }))
        return `File ${fileName} saved.`
    }
  }

  // ----------------------------
  // MAIN COMMANDS OBJECT
  // ----------------------------
  const commands: Record<string, (args?: string[]) => string | JSX.Element | Promise<string>> = {
    help: () => `Available commands:
ℹ  help     - Show this help message
👤 about    - Display information about me
🚀 skills   - List my technical skills
💼 projects - Show my project list
📞 contact  - Display my contact information
🎨 ascii    - Show ASCII art
🧹 clear    - Clear the terminal screen
🗣  echo     - Repeat the given text
🕰  date     - Show current date and time
📂 ls       - List contents of current directory
📁 cd       - Change directory
🗺  pwd      - Print working directory
✨ touch    - Create a new file or access a link
📝 vim      - Open vim-style editor
🎮 play     - Start "The Matrix Simulation" text adventure game
🔍 grep     - Search for project information
💰 eth      - Ethereum-related commands (balance, gas, block)
📄 resume   - Open my resume PDF in a new tab
🐙 github   - Open my GitHub profile
🐦 twitter  - Open my Twitter profile
💼 linkedin - Open my LinkedIn profile
📱 telegram - Open my Telegram profile
📄 cat      - Display the content of a file
🖥️  gui      - Switch to GUI mode
Matrix Simulation Game Commands (once in "play"):
- look
- inventory
- status
- help
- exit
... plus various location-based commands like "take red pill", "hack terminal", etc.`,

    about: () => {
      setInfoModalContent({
        title: 'About Rudransh Shinghal',
        content: React.createElement('div', { className: "space-y-4" },
          React.createElement('p', null, "👋 Hi, I'm Rudransh Shinghal, a passionate software developer with a knack for blockchain innovation and clean, scalable code. 🚀"),

          React.createElement('p', { className: "font-semibold" }, "🦀 Rust Expertise:"),
          React.createElement('ul', { className: "list-disc list-inside space-y-2" },
            React.createElement('li', null, "⚡ Mastery in Rust: Proficient in building fast, efficient, and memory-safe applications."),
            React.createElement('li', null, "🛠 Developed production-grade systems using Rust for blockchain and decentralized solutions."),
            React.createElement('li', null, "📜 Passion for clean and idiomatic Rust code with a focus on performance and scalability.")
          ),

          React.createElement('p', { className: "font-semibold" }, "🔗 Blockchain Development:"),
          React.createElement('ul', { className: "list-disc list-inside space-y-2" },
            React.createElement('li', null, "📝 Designed and deployed smart contracts with CosmWasm and Solidity."),
            React.createElement('li', null, "🏗 Architected account abstraction models and cross-chain messaging systems."),
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
⚛ Next.js
🐹 Go (Golang)
🦀 Rust
🔗 Solidity
🐳 Docker
🖥 C
📝 Vim
💡 Notion
🐰 Bun
⚛ React
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
📧 Email: rudransh9shinghal@gmail.com
💼 LinkedIn: rudransh-shinghal-264b37206
🐦 Twitter: rudransh190204
📱 Telegram: That_guy_Rudransh`,

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
      let fileContent = files[fileName] || ''
      
      setVimContent(fileContent)
      setCurrentFileName(fileName)
      setIsVimActive(true)
      setIsVimModalOpen(true)
      return `Opening ${fileName} in vim...`
    },

    play: () => {
      // RESET the game
      setGameState({
        location: 'construct',
        inventory: [],
        awareness: 0,
        health: 100,
        isGameOver: false
      })
      return `Welcome to the Matrix Simulation!

You find yourself in the Construct, a loading program for the Matrix. 
Your mission: navigate the real and digital worlds, raise your awareness, and defend Zion.

Commands:
- "look" to examine your surroundings
- "inventory" to view your items
- "status" to check awareness & health
- Type context-sensitive commands ("take red pill", "hack terminal", etc.)
- "help" shows location-specific commands
- "exit" ends the game

Free your mind. Type "look" to begin.`
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
      const resumeUrl = 'https://drive.google.com/file/d/1ejcVHLxkwZoVUDEWsMetoirEUWg4Et_1/view?usp=drive_link'
      window.open(resumeUrl, '_blank')
      return 'Opening resume in a new tab...'
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

    'close_vim_modal': () => {
      setIsVimModalOpen(false)
      setIsVimActive(false)
      return "Vim modal closed."
    },

    github: () => {
      window.open(socialInfo.github.url, '_blank')
      return `Opening GitHub profile: ${socialInfo.github.url}`
    },

    twitter: () => {
      window.open(socialInfo.twitter.url, '_blank')
      return `Opening Twitter profile: ${socialInfo.twitter.url}`
    },

    linkedin: () => {
      window.open(socialInfo.linkedin.url, '_blank')
      return `Opening LinkedIn profile: ${socialInfo.linkedin.url}`
    },

    telegram: () => {
      window.open(socialInfo.telegram.url, '_blank')
      return `Opening Telegram chat: ${socialInfo.telegram.url}`
    },

    cat: (args) => {
      if (!args || args.length === 0) {
        return 'Usage: cat <filename>'
      }
      const fileName = args[0]
      const currentDir = navigateToPath(currentPath)
      if (typeof currentDir === 'string') {
        return currentDir
      }
      if (currentDir.type !== 'directory') {
        return `cat: ${currentPath.join('/')}: Not a directory`
      }
      const file = (currentDir.content as FileSystem)[fileName]
      if (!file) {
        return `cat: ${fileName}: No such file or directory`
      }
      if (file.type === 'directory') {
        return `cat: ${fileName}: Is a directory`
      }
      if (typeof file.content === 'string' && file.content.startsWith('http')) {
        window.open(file.content, '_blank')
        return `Opening ${fileName} in a new tab...`
      }
      return file.content
    },

    write: (args) => {
      if (!args || args.length < 2) {
        return "Usage: write <filename> <content>"
      }
      const fileName = args[0]
      const content = args.slice(1).join(' ')
      return handleFileOperation('write', fileName, content)
    },

    read: (args) => {
      if (!args || args.length === 0) {
        return "Usage: read <filename>"
      }
      const fileName = args[0]
      return handleFileOperation('read', fileName)
    },

    gui: () => {
      return "Switching to GUI mode..."
    },
    kernel: () => {
      return "Initiating Freed OS kernel... Please wait."
    },
    warpcast: () => {
      window.open('https://warpcast.com/kakashi-hatake19', '_blank')
      return 'Opening Warpcast profile in a new tab...'
    },
  }

  // ----------------------------
  // UTILITY FUNCTIONS
  // ----------------------------
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

  function handleGameCommand(args: string[]) {
    const command = args.join(' ').toLowerCase()
    const currentLocation = gameLocations[gameState.location as keyof typeof gameLocations]

    if (gameState.isGameOver) {
      return "The simulation is over. Type 'exit' to stop playing."
    }

    if (gameState.health <= 0) {
      setGameState(prev => ({ ...prev, isGameOver: true }))
      return "Your health hit 0. You collapse, and the simulation ends.|GAME_OVER"
    }

    // Universal commands
    switch (command) {
      case 'look':
        return currentLocation.description
      case 'inventory':
        return `Inventory: ${gameState.inventory.join(', ') || 'Empty'}`
      case 'status':
        return `Awareness: ${gameState.awareness}%, Health: ${gameState.health}%`
      case 'help':
        return `Available commands in ${gameState.location}:
${currentLocation.availableCommands.join('\n')}

Universal commands:
- look
- inventory
- status
- help
- exit (ends the simulation)
`
      case 'exit':
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return "Exiting the Matrix simulation. Thanks for playing!"
    }

    // Location-specific
    if (currentLocation.availableCommands.includes(command)) {
      switch (gameState.location) {
        case 'construct':
          return handleConstructCommands(command)
        case 'training':
          return handleTrainingCommands(command)
        case 'matrix':
          return handleMatrixCommands(command, args) || "Unknown command. Type 'help' to see available commands."
        case 'oracleTemple':
          return handleOracleTempleCommands(command)
        case 'zion':
          return handleZionCommands(command)
        case 'machineCity':
          return handleMachineCityCommands(command)
      }
    }

    return "Unknown command. Type 'help' to see available commands."
  }

  // ----------------------------
  // HOOK RETURN
  // ----------------------------
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
    }, 300)
  }

  const executeCommand = (command: string): string | JSX.Element | Promise<string> => {
    const [cmd, ...args] = command.trim().split(' ')
    if (cmd === 'kernel') {
      // Signal to the terminal component that we should enter Freed OS mode
      return 'ENTER_FREED_OS'
    }
    if (cmd in commands) {
      return commands[cmd](args)
    }
    return `Command not found: ${command}. Type 'help' for a list of available commands.`
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
    infoModalContent,
    isVimModalOpen,
    setIsVimModalOpen, 
    handleFileOperation
  }
}

