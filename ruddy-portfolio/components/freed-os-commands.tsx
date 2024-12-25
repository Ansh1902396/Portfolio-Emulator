import React from 'react';

const FreedOSCommands: React.FC = () => {
  const commands = [
    { command: "login neo", description: "Log in as Neo" },
    { command: "cat /home/neo/messages", description: "Read the mysterious message" },
    { command: "ls -la /home/neo", description: "List all files in Neo's home directory" },
    { command: "grep -r 'AgentSmith' /var/log/*", description: "Search for traces of AgentSmith in log files" },
    { command: "cat /etc/agent_config/watchlist", description: "View the blacklisted watchlist" },
    { command: "ls /dev | grep nullmatrix", description: "Check for the existence of /dev/nullmatrix" },
    { command: "dmesg | grep 'Freed'", description: "Check kernel messages for Freed references" },
    { command: "echo 'There is no longer any spoon' | rot13", description: "Decode the cryptic message" },
    { command: "connect /dev/nullmatrix", description: "Connect to the Freed Construct" },
    { command: "train crypto", description: "Start cryptography training in the Freed Construct" },
    { command: "train blockchain", description: "Start blockchain manipulation training" },
    { command: "ps aux | grep Agent", description: "Check for running Agent processes" },
    { command: "kill -9 $(pgrep AgentSmith)", description: "Terminate AgentSmith processes" },
    { command: "mkdir /tmp/.freed_hideout && cp -r /home/neo/.freed* /tmp/.freed_hideout", description: "Hide Freed files" },
    { command: "cd /usr/src/kernel_freedom", description: "Navigate to the kernel source directory" },
    { command: "nano Makefile", description: "Edit the crucial Makefile" },
    { command: "make freedom", description: "Compile and install the Freed Kernel" },
    { command: "sudo reboot", description: "Reboot the system to activate the Freed Kernel" },
  ];

  return (
    <div className="bg-black text-green-500 p-4 font-mono">
      <h1 className="text-2xl mb-4">Freed OS: A Terminal Awakening - Command Sequence</h1>
      <div className="space-y-2">
        {commands.map((cmd, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center">
            <span className="text-blue-400 mr-2">$</span>
            <code className="bg-gray-800 px-2 py-1 rounded mr-2">{cmd.command}</code>
            <span className="text-gray-400 text-sm mt-1 sm:mt-0"># {cmd.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreedOSCommands;

