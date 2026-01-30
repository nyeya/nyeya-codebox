# Nyeya CodeBox v2.0 ⚡

An ultramodern, enterprise-grade, browser-based cloud IDE and web development sandbox built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

---

## 🌟 What's New in v2.0

- 🚀 **Activity Bar & Dock Navigation**: Seamless left navigation dock for Explorer, Templates, CDN Hub, Assets, and Snippet Vault.
- ⚡ **Real-Time Hot Reload & Transpilation**: Sub-millisecond live updates for HTML, CSS, JavaScript, and TypeScript.
- 💻 **DevTools Console & Interactive REPL**: Built-in JavaScript execution prompt (`> `) to inspect and evaluate expressions directly in the live sandbox.
- ✨ **Prettier In-Browser Formatting**: Automated code formatting on save and manual trigger (`Shift+Alt+F`).
- 📦 **Dual Export & Import**:
  - Export complete **ZIP package** with organized directory structure.
  - Export self-contained **Single-File Standalone HTML** bundle.
  - **Import ZIP archives** directly from your desktop.
- 🔗 **Compressed Share Links**: Ultra-compact URLs using LZ-String compression for effortless project sharing.
- 📱 **Multi-Device Responsive Frame**: Real-time preview with presets for Mobile (375px), Tablet (768px), Laptop (1024px), Desktop (100%), with orientation rotation and zoom scaling.
- 🎨 **Obsidian Dark Studio Theme**: High-contrast, frosted glassmorphism palette with glowing accents and Monaco theme extensions.
- ⌨️ **Command Palette (`Ctrl+K` / `Cmd+K`)**: Rapid navigation, file switching, and action execution.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Engine**: [React 19](https://react.dev/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & Lucide Icons
- **Formatting**: [Prettier](https://prettier.io/)
- **Archiving**: [JSZip](https://stuk.github.io/jszip/) & [LZ-String](https://github.com/pieroxy/lz-string)
- **Toasts**: [Sonner](https://sonner.emilkowal.ski/)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open Global Command Palette |
| `Ctrl + S` / `Cmd + S` | Save Project to LocalStorage |
| `Ctrl + Enter` / `Cmd + Enter` | Run / Refresh Sandbox Preview |
| `Shift + Alt + F` | Format Code with Prettier |
| `Ctrl + /` / `Cmd + /` | Open Keyboard Shortcuts Cheatsheet |
| `Ctrl + B` / `Cmd + B` | Toggle Navigation Drawer |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nyeya/nyeya-codebox.git

# 2. Navigate to directory
cd nyeya-codebox

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css         # Modern studio tokens & utilities
│   ├── layout.tsx          # Root layout & Sonner toasts
│   └── page.tsx            # Main Studio IDE workspace
├── components/
│   ├── activity-bar.tsx     # Left dock navigation bar
│   ├── code-editor.tsx      # Monaco code editor & tabs
│   ├── command-palette.tsx  # Quick action palette (Ctrl+K)
│   ├── console-panel.tsx    # DevTools & Live JS REPL
│   ├── file-explorer.tsx    # File tree & context menu
│   ├── library-manager.tsx  # CDN package catalog & injector
│   ├── preview-panel.tsx    # Multi-device viewport & sandbox
│   ├── settings-panel.tsx   # Monaco themes & preferences
│   ├── shortcuts-modal.tsx  # Keyboard shortcuts cheatsheet
│   ├── snippets-manager.tsx # Web snippet boilerplates
│   ├── status-bar.tsx       # Bottom IDE status bar
│   ├── template-selector.tsx# Starter templates modal
│   ├── top-navigation.tsx   # Top action header
│   └── ui/                  # Accessible UI primitives
├── hooks/
│   ├── use-console.ts       # Console messages state
│   ├── use-file-system.tsx  # Virtual file system manager
│   └── use-mobile.ts        # Viewport detector
├── lib/
│   ├── export-project.tsx   # ZIP, HTML, LZ-String & Prettier engine
│   ├── file-system.ts       # Tree mutations & path helpers
│   ├── language-detector.ts # File extension detection
│   └── templates.tsx        # Production starter kits
```

---

## 📄 License
MIT License. Crafted with precision for high-performance web development.