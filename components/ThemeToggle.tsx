"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-10 h-10 rounded-xl bg-card border border-border" />
  )

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-card hover:bg-accent hover:text-accent-foreground border border-border shadow-lg transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-accent group-hover:text-inherit transition-colors" />
          ) : (
            <Sun className="w-5 h-5 text-orange-500 group-hover:text-inherit transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Subtle background effect */}
      <motion.div
        className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId="theme-toggle-bg"
      />
    </button>
  )
}
