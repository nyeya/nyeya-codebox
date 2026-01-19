import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Nyeya CodeBox v2.0 — Modern Cloud IDE & Web Sandbox",
  description: "Ultramodern in-browser IDE with real-time preview, TypeScript/JSX support, Prettier formatter, CDN library hub, and instant export.",
  keywords: ["online code editor", "web ide", "codesandbox", "codepen", "html css js", "typescript sandbox", "react playground"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans bg-[#09090b] text-[#f4f4f5] selection:bg-indigo-500/30 selection:text-indigo-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "#18181b",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f4f4f5",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

