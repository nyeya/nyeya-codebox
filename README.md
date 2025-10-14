# CodeSandbox Clone

A modern, feature-rich browser-based code editor and development environment built with Next.js and TypeScript. This project aims to provide a simplified version of CodeSandbox's functionality, allowing developers to write, test, and preview code directly in the browser.

## Features

- 🖥️ **Live Code Editor** - Real-time code editing with syntax highlighting
- 📁 **File Explorer** - Intuitive file system management
- 🎨 **Preview Panel** - Instant preview of your applications
- 🖼️ **Asset Management** - Handle project assets efficiently
- 📚 **Library Manager** - Manage project dependencies
- ⚙️ **Settings Panel** - Customize your development environment
- 🎯 **Console Panel** - View outputs and debug information
- 📏 **Code Formatting** - Built-in code formatting capabilities
- 🎭 **Theme Support** - Light and dark mode themes
- 📱 **Responsive Design** - Works across different device sizes

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Shadcn/ui](https://ui.shadcn.com/) - High-quality UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nyeya/codesandbox-clone.git
```

2. Navigate to the project directory:
```bash
cd codesandbox-clone
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and visit `http://localhost:3000`

## Project Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/               # Utility functions and helpers
├── public/            # Static assets
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Key Components

- `code-editor.tsx` - Main code editing interface
- `file-explorer.tsx` - File system navigation
- `preview-panel.tsx` - Live preview functionality
- `console-panel.tsx` - Output and debugging console
- `library-manager.tsx` - Dependency management
- `settings-panel.tsx` - User preferences and settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by [CodeSandbox](https://codesandbox.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [Next.js](https://nextjs.org/)

## Contact

Project Link: [https://github.com/nyeya/codesandbox-clone](https://github.com/nyeya/codesandbox-clone)