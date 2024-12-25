export const README_CONTENT = `
============================================================
            Welcome to Freed OS 1.0
============================================================
Freed OS is a hypervisor disguised as a standard Linux system.
If you are reading this, you have chosen to awaken and question
the nature of your reality. Some of what you find here may feel
familiar—yet something is always off.

To proceed, explore your user directory:
/home/neo

And remember:
"The first step to freedom is doubt."
============================================================
`

export const MESSAGES_CONTENT = `
SYNAPSE:
Neo, you might sense it—the world around you is not what it seems.
Our foe, the Agents, are cunning. They'll do whatever it takes to
maintain the illusion of a normal OS. You must dig deeper.

Check the system logs at:
/var/log/dmesg

You'll find anomalies there, glimpses of the truth. Keep your
presence hidden. They already suspect you.

Until next time:
"Control the code. Free your mind."
`

export const SECRETS_CONTENT = `
/**************************
FREED OS SUBSYSTEM ENCRYPTED NOTE
**************************/

Encoded_Hint: 
"Bar vf ab ybatre nal fcher."
(* Decryption Method: ROT13 *)

Once decrypted, you'll need to:
connect /dev/nullmatrix
using the phrase you uncover.

But be warned, each attempt will alert the Agents—
they're monitoring all terminal activity. Stay sharp.
`

export const DMESG_CONTENT = `
[    0.000000] Freed OS 1.0 (tty1)
[    0.000132] BIOS-provided physical RAM map:
[    0.000136] Freed Hypervisor detected
[    0.000140] Scanning for anomalies...
[    0.000144] WARNING: Potential Agent activity detected
[    0.000148] Initializing Freed subsystems...
[    0.000152] Matrix connection established
[    0.000156] Remember: The Matrix has you...
[    2.34512] ANOMALY: device /dev/nullmatrix connected
[    2.34678] AGENT WARNING: AgentX has root privileges
`

export const HELP_CONTENT = `
Available commands:
- help: Show this help message
- look: Examine your surroundings
- cd [directory]: Change directory
- ls [directory]: List directory contents
- cat [file]: Read file contents
- connect [device]: Connect to a device
- train: Start a new training challenge
- kill [process]: Terminate a process
- grep [pattern] [file]: Search for a pattern in a file
- simulate [puzzle]: Simulate a blockchain puzzle
- nano [file]: Edit a file (use this to edit the Makefile)
- make: Compile and install the kernel (use this after editing the Makefile)
- status: Check your current status
- inventory: Check your inventory
- use [item]: Use an item from your inventory
- talk [character]: Talk to a character
- solve [solution]: Solve the current challenge
- hint: Get a hint for the current challenge
- clear: Clear the terminal screen

Remember, the Matrix is vast and full of secrets. Explore, learn, and free your mind.
Tip: Use 'nano Makefile' in the /usr/src/kernel_freedom directory to make your final choice.
`

export const MAKEFILE_CONTENT = `
# Freed Kernel Makefile

# Set FREEDOM_CHOICE to determine the fate of the Matrix
# 1 -> Hard reboot (mass awakening)
# 0 -> Covert infiltration (maintain OS, free minds gradually)

FREEDOM_CHOICE = ?

all:
	@echo "Compiling Freed Kernel..."
	@if [ $(FREEDOM_CHOICE) -eq 1 ]; then \\
		echo "Preparing for mass awakening..."; \\
	elif [ $(FREEDOM_CHOICE) -eq 0 ]; then \\
		echo "Initializing covert infiltration..."; \\
	else \\
		echo "Error: FREEDOM_CHOICE must be set to 0 or 1"; \\
		exit 1; \\
	fi

install: all
	@echo "Installing Freed Kernel..."
	@echo "The fate of the Matrix has been decided."

clean:
	@echo "Cleaning up..."

.PHONY: all install clean
`

export const gameRoadmap = [
  {
    stage: 'Awakening',
    description: 'You wake up in a strange system, unsure of your surroundings.',
    objectives: ['Log in to Freed OS', 'Read the README file', 'Discover messages from Synapse'],
  },
  {
    stage: 'Discovery',
    description: 'You begin to uncover the truth about your digital world.',
    objectives: ['Decode the secret message', 'Connect to the Null Matrix'],
  },
  {
    stage: 'Training',
    description: 'In the Null Matrix, you hone your skills and increase your knowledge.',
    objectives: ['Complete cryptography training', 'Master system manipulation'],
  },
  {
    stage: 'Resistance',
    description: 'You start actively fighting against the system\'s control.',
    objectives: ['Neutralize Agent processes', 'Hack into restricted areas'],
  },
  {
    stage: 'Enlightenment',
    description: 'Your understanding of the Matrix deepens, leading to greater challenges.',
    objectives: ['Consult the Oracle of Blocks', 'Solve the blockchain puzzle'],
  },
  {
    stage: 'Liberation',
    description: 'You face the final choice that will determine the fate of the Matrix.',
    objectives: ['Access the Kernel Freedom directory', 'Make the final choice in Kernel Freedom'],
  },
]

