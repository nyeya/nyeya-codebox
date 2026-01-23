"use client"

import React, { useState } from "react"
import { Sparkles, Copy, Check, Plus, Code2, Layers, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Snippet {
  id: string
  title: string
  category: "HTML" | "CSS" | "JavaScript" | "Tailwind"
  description: string
  code: string
}

const snippets: Snippet[] = [
  {
    id: "tw-navbar",
    title: "Tailwind Glassmorphic Navbar",
    category: "Tailwind",
    description: "Sticky frosted navigation bar with logo, links, and action button",
    code: `<nav class="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-white/10 px-6 py-4 flex items-center justify-between">
  <div class="flex items-center gap-2">
    <div class="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">◈</div>
    <span class="font-bold text-white tracking-tight">StudioBrand</span>
  </div>
  <div class="hidden md:flex items-center gap-6 text-sm text-zinc-400">
    <a href="#" class="hover:text-white transition-colors">Features</a>
    <a href="#" class="hover:text-white transition-colors">Solutions</a>
    <a href="#" class="hover:text-white transition-colors">Pricing</a>
  </div>
  <button class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20">Get Started</button>
</nav>`,
  },
  {
    id: "tw-hero",
    title: "Tailwind Radiant Hero Section",
    category: "Tailwind",
    description: "High-impact hero banner with gradient typography and action buttons",
    code: `<section class="relative max-w-5xl mx-auto px-6 py-24 text-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
    <span class="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span> Live Alpha 2.0
  </div>
  <h1 class="text-5xl sm:text-6xl font-black tracking-tight text-white mb-6">
    Build faster with <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">Autonomous Tools</span>
  </h1>
  <p class="text-zinc-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
    Empower your engineering workflow with state-of-the-art live development environments.
  </p>
  <div class="flex items-center justify-center gap-4">
    <button class="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all shadow-lg">Start Free</button>
    <button class="px-6 py-3 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-all">Documentation</button>
  </div>
</section>`,
  },
  {
    id: "dark-mode-toggle",
    title: "Dark Mode Theme Controller",
    category: "JavaScript",
    description: "Automatic OS preference detection with local storage persistence",
    code: `// Theme controller with localStorage persistence
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  console.log('[Theme] Switched to:', isDark ? 'dark' : 'light');
}

initTheme();`,
  },
  {
    id: "canvas-particles",
    title: "HTML5 Canvas Starfield Loop",
    category: "JavaScript",
    description: "Smooth 60FPS particle constellation animation on canvas",
    code: `const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: (Math.random() - 0.5) * 1.5,
  vy: (Math.random() - 0.5) * 1.5,
  radius: Math.random() * 2 + 1
}));

function animate() {
  ctx.clearRect(0, 0, 0, 0);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, w, h);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(129, 140, 248, 0.7)';
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();`,
  },
  {
    id: "css-glass-card",
    title: "Luminous Glassmorphism Card",
    category: "CSS",
    description: "Frosted obsidian glass card with border glow and backdrop filter",
    code: `.glass-card {
  background: rgba(18, 18, 21, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.25);
}`,
  },
  {
    id: "async-fetcher",
    title: "Async Data Fetcher with Loading State",
    category: "JavaScript",
    description: "Robust async/await request helper with try/catch and error toasts",
    code: `async function fetchJSON(url) {
  try {
    console.log('[API] Requesting:', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
    const data = await res.json();
    console.log('[API] Response received:', data);
    return data;
  } catch (err) {
    console.error('[API] Error fetching:', err.message);
    throw err;
  }
}`,
  },
]

interface SnippetsManagerProps {
  onInsertCode: (code: string) => void
}

export function SnippetsManager({ onInsertCode }: SnippetsManagerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const handleCopy = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code)
    setCopiedId(snippet.id)
    toast.success(`Copied "${snippet.title}" to clipboard!`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleInsert = (snippet: Snippet) => {
    onInsertCode(snippet.code)
    toast.success(`Appended "${snippet.title}" into active file!`)
  }

  const filtered = snippets.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    const matchesCat = categoryFilter === "all" || s.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCat
  })

  return (
    <div className="h-full flex flex-col bg-[#121215] text-zinc-200">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-bold text-white tracking-tight">Snippet Vault</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-3 border-b border-white/[0.08] space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snippets..."
            className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {["all", "tailwind", "javascript", "css"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                  : "text-zinc-400 hover:text-white bg-white/[0.03]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filtered.map((snippet) => (
          <div
            key={snippet.id}
            className="p-3.5 rounded-xl bg-[#18181b] border border-white/[0.08] hover:border-indigo-500/40 transition-all group"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">
                {snippet.title}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 font-mono">
                {snippet.category}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">{snippet.description}</p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleCopy(snippet)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Copy snippet code"
              >
                {copiedId === snippet.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleInsert(snippet)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-medium border border-indigo-500/30 transition-all"
                title="Insert at cursor or append"
              >
                <Plus className="h-3 w-3" />
                <span>Insert</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
