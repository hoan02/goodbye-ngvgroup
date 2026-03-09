"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false)
  const pathname = usePathname()

  // Hide on farewell page
  const isFarewellPage = pathname?.startsWith("/farewell")

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (isFarewellPage) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-2xl transition-all duration-300 group overflow-hidden backdrop-blur-md"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          
          {/* Subtle background pulse */}
          <motion.div
            className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
            layoutId="scroll-top-bg"
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
