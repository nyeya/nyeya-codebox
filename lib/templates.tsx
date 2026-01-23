"use client"

import type { FileNode } from "@/types/file-system"

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: "Starter" | "Frontend" | "React" | "3D & Canvas" | "Animation"
  badge?: string
  files: FileNode[]
}

export const templates: ProjectTemplate[] = [
  {
    id: "tailwind-saas",
    name: "Modern Tailwind SaaS",
    description: "Futuristic dark-mode landing page with glowing cards, smooth scroll, and stats",
    icon: "⚡",
    category: "Frontend",
    badge: "Popular",
    files: [
      {
        id: "t1_html",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aether — Next-Gen Cloud Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="bg-[#09090b] text-[#f4f4f5] font-sans antialiased min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
  <!-- Glow Backdrop -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-500/20 to-cyan-400/20 blur-[130px] rounded-full"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
  </div>

  <!-- Navbar -->
  <nav class="border-b border-white/[0.08] backdrop-blur-md sticky top-0 z-50 bg-[#09090b]/80">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <span class="text-white font-bold text-lg">◈</span>
        </div>
        <span class="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">Aether Cloud</span>
      </div>

      <div class="hidden md:flex items-center gap-8 text-sm text-zinc-400">
        <a href="#features" class="hover:text-white transition-colors">Features</a>
        <a href="#benchmarks" class="hover:text-white transition-colors">Benchmarks</a>
        <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
      </div>

      <div class="flex items-center gap-4">
        <button id="authBtn" class="text-sm font-medium text-zinc-300 hover:text-white px-4 py-2">Sign In</button>
        <button id="ctaHeader" class="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-lg hover:bg-zinc-200 transition-all shadow-md shadow-white/10 hover:shadow-white/20 active:scale-95">Get Started</button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner">
      <span class="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
      Version 2.0 Engine Live
    </div>

    <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
      Ship code faster with <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">Autonomous Edge AI</span>
    </h1>

    <p class="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
      Deploy high-throughput cloud infrastructure in sub-milliseconds. Zero config, instant global edge routing, and built-in observability.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
      <button id="ctaMain" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-base transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95">
        Start Building Free →
      </button>
      <button id="demoBtn" class="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-200 font-semibold text-base transition-all">
        Live Sandbox Demo
      </button>
    </div>

    <!-- Live Interactive Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
      <div class="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/50 backdrop-blur hover:border-indigo-500/40 transition-all group">
        <div class="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">⚡</div>
        <div class="text-3xl font-bold text-white mb-1 counter" data-target="99.99">0</div>
        <p class="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Uptime SLA Guaranteed</p>
      </div>
      <div class="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/50 backdrop-blur hover:border-indigo-500/40 transition-all group">
        <div class="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">🚀</div>
        <div class="text-3xl font-bold text-white mb-1 counter" data-target="12">0</div>
        <p class="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Global Edge Latency (ms)</p>
      </div>
      <div class="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/50 backdrop-blur hover:border-indigo-500/40 transition-all group">
        <div class="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">🛡️</div>
        <div class="text-3xl font-bold text-white mb-1 counter" data-target="100">0</div>
        <p class="text-xs uppercase tracking-wider text-zinc-400 font-semibold">% End-to-End Encrypted</p>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "t1_css",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.counter {
  font-feature-settings: "tnum";
}`,
      },
      {
        id: "t1_js",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `// Animate dynamic stats on load
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");
  
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute("data-target") || "0");
    const isDecimal = target % 1 !== 0;
    let current = 0;
    const increment = target / 60;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = isDecimal ? target.toFixed(2) + "%" : target + (target === 100 ? "%" : "ms");
        clearInterval(timer);
      } else {
        counter.textContent = isDecimal ? current.toFixed(2) + "%" : Math.floor(current).toString();
      }
    }, 20);
  });

  const cta = document.getElementById("ctaMain");
  if (cta) {
    cta.addEventListener("click", () => {
      alert("Welcome to Aether Cloud! Your deployment cluster is ready.");
      console.log("[Aether Platform] Cluster initialized successfully at edge-region: us-east-1");
    });
  }
});`,
      },
    ],
  },
  {
    id: "three-3d-scene",
    name: "Three.js 3D Cosmos",
    description: "Interactive 3D geometry scene with ambient glowing particles and camera physics",
    icon: "🪐",
    category: "3D & Canvas",
    badge: "3D",
    files: [
      {
        id: "t2_html",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js 3D Cosmos</title>
  <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="canvas-container"></div>
  <div class="overlay">
    <h1>Cosmic Icosahedron</h1>
    <p>Move your cursor to orbit the 3D quantum core</p>
    <div class="stats-badge">
      <span class="dot"></span> 60 FPS • Real-time WebGL
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "t2_css",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  background-color: #050508;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#canvas-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
}

.overlay {
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
  pointer-events: none;
}

.overlay h1 {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fff, #818cf8, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.overlay p {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 16px;
}

.stats-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #38bdf8;
}

.dot {
  width: 6px;
  height: 6px;
  background: #38bdf8;
  border-radius: 50%;
  box-shadow: 0 0 8px #38bdf8;
}`,
      },
      {
        id: "t2_js",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `// Initialize 3D Scene
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050508, 0.025);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x6366f1, 3, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x06b6d4, 3, 50);
pointLight2.position.set(-5, -5, 2);
scene.add(pointLight2);

// Main Glowing Icosahedron
const geometry = new THREE.IcosahedronGeometry(1.6, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0x1e1b4b,
  wireframe: true,
  roughness: 0.1,
  metalness: 0.9,
  emissive: 0x4338ca,
  emissiveIntensity: 0.6
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Inner Core
const innerGeo = new THREE.OctahedronGeometry(0.8, 0);
const innerMat = new THREE.MeshStandardMaterial({
  color: 0x06b6d4,
  wireframe: false,
  roughness: 0.2,
  metalness: 0.8,
  emissive: 0x0891b2,
  emissiveIntensity: 0.8
});
const innerMesh = new THREE.Mesh(innerGeo, innerMat);
scene.add(innerMesh);

// Starfield particles
const starsGeometry = new THREE.BufferGeometry();
const count = 1200;
const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 40;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starsMaterial = new THREE.PointsMaterial({
  size: 0.04,
  color: 0x818cf8,
  transparent: true,
  opacity: 0.8
});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Render loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  sphere.rotation.x = elapsedTime * 0.3 + targetY * 0.5;
  sphere.rotation.y = elapsedTime * 0.4 + targetX * 0.5;

  innerMesh.rotation.x = -elapsedTime * 0.6;
  innerMesh.rotation.y = -elapsedTime * 0.5;

  stars.rotation.y = elapsedTime * 0.03;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("[3D Engine] WebGL Context & Shaders Initialized Successfully.");`,
      },
    ],
  },
  {
    id: "chartjs-dashboard",
    name: "Analytics & Metrics Dashboard",
    description: "Interactive real-time financial & user metrics dashboard with Chart.js",
    icon: "📊",
    category: "Frontend",
    badge: "Charts",
    files: [
      {
        id: "t3_html",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse Metrics Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-[#0b0c10] text-[#c5c6c7] font-sans antialiased p-6 md:p-10 min-h-screen">
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Revenue & Traffic Insights</h1>
        <p class="text-sm text-zinc-400">Real-time telemetry stream from global cluster endpoints</p>
      </div>
      <div class="flex items-center gap-3">
        <button id="refreshBtn" class="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md">
          Simulate Live Pulse
        </button>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur">
        <span class="text-xs uppercase font-bold text-zinc-400 tracking-wider">Gross MRR</span>
        <div class="text-3xl font-extrabold text-white mt-1">$148,290</div>
        <span class="text-xs text-emerald-400 font-semibold">▲ +18.4% vs last month</span>
      </div>
      <div class="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur">
        <span class="text-xs uppercase font-bold text-zinc-400 tracking-wider">Active Nodes</span>
        <div class="text-3xl font-extrabold text-white mt-1">4,812</div>
        <span class="text-xs text-cyan-400 font-semibold">● 99.98% Healthy</span>
      </div>
      <div class="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur">
        <span class="text-xs uppercase font-bold text-zinc-400 tracking-wider">Daily Queries</span>
        <div class="text-3xl font-extrabold text-white mt-1">1.82M</div>
        <span class="text-xs text-purple-400 font-semibold">▲ +32.1% spike</span>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <h3 class="text-base font-semibold text-white mb-4">Traffic Throughput (GB/s)</h3>
        <div class="relative h-64">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
      <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <h3 class="text-base font-semibold text-white mb-4">Region Distribution</h3>
        <div class="relative h-64">
          <canvas id="doughnutChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "t3_css",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `body {
  background-color: #090a0f;
}`,
      },
      {
        id: "t3_js",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `// Initialize Chart.js Line Chart
const lineCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [{
      label: 'Edge Traffic (GB/s)',
      data: [65, 82, 145, 230, 190, 260, 240],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#818cf8'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } }
    }
  }
});

// Doughnut Chart
const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
const doughnutChart = new Chart(doughnutCtx, {
  type: 'doughnut',
  data: {
    labels: ['US East', 'EU Central', 'Asia Pacific', 'South America'],
    datasets: [{
      data: [45, 30, 20, 5],
      backgroundColor: ['#6366f1', '#06b6d4', '#8b5cf6', '#3b82f6'],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#a1a1aa', boxWidth: 12, padding: 16 } }
    }
  }
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  lineChart.data.datasets[0].data = lineChart.data.datasets[0].data.map(() => Math.floor(Math.random() * 250 + 50));
  lineChart.update();
  console.log('[Telemetry Monitor] Data stream updated.');
});`,
      },
    ],
  },
  {
    id: "gsap-showcase",
    name: "GSAP Interactive Physics",
    description: "Silky smooth staggered micro-interactions and magnetic hover buttons with GSAP",
    icon: "✨",
    category: "Animation",
    badge: "GSAP",
    files: [
      {
        id: "t4_html",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GSAP Animation Showcase</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-[#09090b] text-white min-h-screen flex items-center justify-center p-6">
  <div class="max-w-3xl w-full text-center space-y-10">
    <div class="space-y-3">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hero-badge">
        GSAP 3.12.4
      </span>
      <h1 class="text-5xl sm:text-6xl font-black tracking-tight hero-title">
        Fluid Motion System
      </h1>
      <p class="text-zinc-400 text-lg hero-sub">
        Hover over the interactive quantum cards below to feel spring physics
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="anim-card p-6 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-indigo-500 cursor-pointer shadow-xl">
        <div class="text-4xl mb-4">🔮</div>
        <h3 class="font-bold text-lg mb-2">Kinetic Curves</h3>
        <p class="text-xs text-zinc-400">Elastic bezier easing with velocity dampening.</p>
      </div>
      <div class="anim-card p-6 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-indigo-500 cursor-pointer shadow-xl">
        <div class="text-4xl mb-4">⚡</div>
        <h3 class="font-bold text-lg mb-2">Magnetic Pull</h3>
        <p class="text-xs text-zinc-400">Proximity tracking with subpixel accuracy.</p>
      </div>
      <div class="anim-card p-6 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-indigo-500 cursor-pointer shadow-xl">
        <div class="text-4xl mb-4">🌌</div>
        <h3 class="font-bold text-lg mb-2">Stagger Cascade</h3>
        <p class="text-xs text-zinc-400">Non-blocking parallel keyframe transitions.</p>
      </div>
    </div>

    <div>
      <button id="triggerBtn" class="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform">
        Replay Sequence
      </button>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "t4_css",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}`,
      },
      {
        id: "t4_js",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `// GSAP Timeline Animation
function playEntrance() {
  const tl = gsap.timeline();

  tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.6, ease: "back.out(1.7)" })
    .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
    .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .from(".anim-card", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power4.out"
    }, "-=0.3")
    .from("#triggerBtn", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.2");
}

playEntrance();

// Card 3D Tilt Hover
document.querySelectorAll(".anim-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { y: -8, scale: 1.03, duration: 0.3, ease: "power2.out" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
  });
});

document.getElementById("triggerBtn").addEventListener("click", () => {
  playEntrance();
});

console.log("[GSAP Motion] Timeline sequence running.");`,
      },
    ],
  },
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Clean modern HTML5, CSS, and JavaScript foundation",
    icon: "📄",
    category: "Starter",
    files: [
      {
        id: "t5_html",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="container">
    <div class="card">
      <h1>Hello, World! 🚀</h1>
      <p>Start creating your project with Nyeya CodeBox v2.0.</p>
    </div>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "t5_css",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #09090b;
  color: #f4f4f5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  padding: 2rem;
  text-align: center;
}

.card {
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #a1a1aa;
  font-size: 1.1rem;
}`,
      },
      {
        id: "t5_js",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `console.log("Nyeya CodeBox initialized!");`,
      },
    ],
  },
]

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return templates.find((t) => t.id === id)
}

