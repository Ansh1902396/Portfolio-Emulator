export const gameRoadmap = [
  {
    stage: 'The Construct',
    description: 'Your journey begins in the Construct, where you must choose between the red and blue pill.',
    objectives: ['Take the red pill to continue the journey'],
  },
  {
    stage: 'Training',
    description: 'Learn the basics of manipulating the Matrix and honing your skills.',
    objectives: ['Complete basic training', 'Achieve 50% awareness', 'Exit training to enter the Matrix'],
  },
  {
    stage: 'The Matrix',
    description: 'Navigate the digital world, avoiding agents and hacking systems.',
    objectives: ['Hack multiple systems', 'Increase awareness to 75%', 'Collect key items'],
  },
  {
    stage: 'Zion',
    description: 'Return to the last human city to regroup and prepare for the final confrontation.',
    objectives: ['Defend Zion from machine attacks', 'Upgrade your abilities', 'Prepare for the journey to the Machine City'],
  },
  {
    stage: 'Machine City',
    description: 'Confront the source and attempt to broker peace between humans and machines.',
    objectives: ['Navigate the dangerous city', 'Achieve 90% awareness', 'Negotiate with the machines to end the war'],
  },
]

export const gameSoftware = [
  {
    name: 'NeoVision',
    description: 'Enhances your ability to see the true nature of the Matrix',
    effect: 'Increases awareness gain by 20%',
  },
  {
    name: 'Cipher',
    description: 'Advanced encryption and decryption tool',
    effect: 'Improves hacking success rate by 30%',
  },
  {
    name: 'Zion Shield',
    description: 'Digital defense system',
    effect: 'Reduces damage taken in the Matrix by 25%',
  },
  {
    name: 'Morpheus Mentor',
    description: 'AI training assistant',
    effect: 'Doubles the effectiveness of training sessions',
  },
  {
    name: 'Oracle Insight',
    description: 'Provides cryptic hints about your journey',
    effect: 'Occasionally reveals hidden objectives or shortcuts',
  },
]

export const gameCommands = [
  { command: 'look', description: 'Examine your surroundings' },
  { command: 'inventory', description: 'Check your current items and software' },
  { command: 'hack', description: 'Attempt to hack a nearby system' },
  { command: 'train', description: 'Undergo training to increase your skills' },
  { command: 'use [item]', description: 'Use an item or software from your inventory' },
  { command: 'talk [character]', description: 'Interact with a character in your current location' },
  { command: 'move [location]', description: 'Travel to a different area within your current stage' },
  { command: 'status', description: 'Check your current health, awareness, and progress' },
  { command: 'help', description: 'Display available commands' },
  { command: 'quit', description: 'Exit the game' },
]

