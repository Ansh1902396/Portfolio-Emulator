<div align="center">
  <img src="https://tenor.com/1BU573dkMf.gif" alt="Matrix Code" width="300"/>
</div>

<style>
  body {
    background-color: #000;
    color: #00ff00;
    font-family: 'Courier New', monospace;
    line-height: 1.6;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  .container {
    border: 1px solid #00ff00;
    padding: 20px;
    margin-top: 20px;
    position: relative;
    overflow: hidden;
  }
  .container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(to bottom, #00ff00, transparent);
    animation: scan 2s linear infinite;
  }
  @keyframes scan {
    0% { transform: translateY(-20px); }
    100% { transform: translateY(100%); }
  }
  h1, h2 {
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
    animation: glow 1.5s ease-in-out infinite alternate;
  }
  @keyframes glow {
    from { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
    to { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; }
  }
  .bootloader {
    font-family: monospace;
    white-space: pre;
    line-height: 1.2;
    animation: bootup 5s steps(50, end);
  }
  @keyframes bootup {
    from { height: 0; }
    to { height: 100%; }
  }
  .blink {
    animation: blink 1s steps(1, end) infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .terminal {
    background-color: #001100;
    border: 1px solid #00ff00;
    padding: 10px;
    margin: 10px 0;
  }
  .terminal::before {
    content: '$ ';
    color: #00ff00;
  }
  .matrix-rain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }
  .feature-list {
    list-style-type: none;
    padding-left: 0;
  }
  .feature-list li {
    margin-bottom: 10px;
    padding-left: 25px;
    position: relative;
  }
  .feature-list li::before {
    content: '>';
    position: absolute;
    left: 0;
    color: #00ff00;
    animation: blink 1s infinite;
  }
  .typing {
    overflow: hidden;
    white-space: nowrap;
    animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
    border-right: 2px solid #00ff00;
  }
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #00ff00 }
  }
  .glitch {
    position: relative;
    animation: glitch 1s linear infinite;
  }
  @keyframes glitch {
    2%, 64% { transform: translate(2px,0) skew(0deg); }
    4%, 60% { transform: translate(-2px,0) skew(0deg); }
    62% { transform: translate(0,0) skew(5deg); }
  }
  .glitch:before,
  .glitch:after {
    content: attr(title);
    position: absolute;
    left: 0;
  }
  .glitch:before {
    animation: glitchTop 1s linear infinite;
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  }
  @keyframes glitchTop {
    2%, 64% { transform: translate(2px,-2px); }
    4%, 60% { transform: translate(-2px,2px); }
    62% { transform: translate(13px,-1px) skew(-13deg); }
  }
  .glitch:after {
    animation: glitchBotom 1.5s linear infinite;
    clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
    -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
  }
  @keyframes glitchBotom {
    2%, 64% { transform: translate(-2px,0); }
    4%, 60% { transform: translate(-2px,0); }
    62% { transform: translate(-22px,5px) skew(21deg); }
  }
</style>

<div class="matrix-rain"></div>

<script>
  // Matrix rain animation
  const canvas = document.createElement('canvas');
  canvas.className = 'matrix-rain';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const columns = canvas.width / 20;
  const drops = [];
  for (let x = 0; x < columns; x++) drops[x] = 1;
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    ctx.font = '15px monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = String.fromCharCode(Math.random() * 128);
      ctx.fillText(text, i * 20, drops[i] * 20);
      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 33);

  // Glitch effect
  const glitchElements = document.querySelectorAll('.glitch');
  glitchElements.forEach(el => {
    el.setAttribute('data-text', el.textContent);
  });
</script>

<div class="container">
  <div class="bootloader">
    Initializing NeoSys v2.0.4...
    [OK] Quantum processor online
    [OK] Neural network calibrated
    [OK] Reality distortion field active
    [OK] Cryptographic protocols engaged
    [OK] Dimensional stabilizers aligned
    Loading Matrix Terminal Portfolio...<span class="blink">█</span>
  </div>
</div>

<h1 class="glitch" title="Matrix Terminal Portfolio">Matrix Terminal Portfolio</h1>

<div align="center">
  <img src="https://tenor.com/bOU0c.gif" alt="Neo waking up" width="300"/>
</div>

<p align="center" class="typing">Wake up, Neo... The Matrix has you...</p>

Welcome to the Matrix Terminal Portfolio, a cybernetic fusion of retro interface and cutting-edge technology. This digital construct serves as a gateway between your perceived reality and the truth that lies beyond. Prepare to question everything you thought you knew about web development and digital presentation.

## 🌐 Core Systems

<div class="terminal">
neo@matrix:~$ cat core_systems.dat
</div>

<ul class="feature-list">
  <li>Quantum Interface Engine: Seamlessly shift between classic terminal and hyper-modern GUI paradigms</li>
  <li>Neural-Reactive Design: Immerse yourself in a living, breathing cyberpunk datascape</li>
  <li>Synaptic Command Interface: Navigate the digital labyrinth through neural-linked command inputs</li>
  <li>Holographic Project Visualizer: Explore multidimensional project representations in an intuitive 3D space</li>
  <li>Cyber-Nexus Challenge Protocol: Test the limits of your hacking skills in mind-bending digital trials</li>
  <li>Adaptive Reality Renderer: Experience consistent immersion across all viewing portals, from pocket devices to wall-sized holo-projectors</li>
  <li>Quantum Content Flux: Instantly update your digital manifestation across all parallel realities</li>
</ul>

## 🧬 Techno-Organic Framework

<div class="terminal">
neo@matrix:~$ neuralink --scan-tech
</div>

- React Nexus Core
- Next.js Quantum Compiler
- TypeScript Synaptic Processor
- TailwindCSS Neural Network
- Framer Motion Reality Warper
- Lucide React Holographic Projector
- shadcn/ui Biomechanical Components

## 🚀 Initialization Protocol

<div class="terminal">
neo@matrix:~$ sudo ./awaken.sh
</div>

1. Clone the digital construct:

