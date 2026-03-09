'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface IntroScreenProps {
  onComplete: () => void;
  logoUrl: string;
  tagline: string;
  buttonText: string;
}

export default function IntroScreen({
  onComplete,
  logoUrl,
  tagline,
  buttonText,
}: IntroScreenProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Typewriter effect
  useEffect(() => {
    if (displayedText.length < tagline.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(tagline.slice(0, displayedText.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    } else if (displayedText.length === tagline.length) {
      setIsComplete(true);
    }
  }, [displayedText, tagline]);

  // Auto-start countdown
  useEffect(() => {
    if (isComplete && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isComplete && countdown === 0) {
      onComplete();
    }
  }, [isComplete, countdown, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-colors duration-500"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="mb-12"
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="text-4xl font-bold text-accent">∞</div>
        </div>
      </motion.div>

      {/* Typewriter Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-wide text-balance">
          {displayedText}
          {!isComplete && <span className="animate-pulse">_</span>}
        </h1>
      </motion.div>

      {/* Button and Countdown */}
      {isComplete && (
        <div className="mt-16 flex flex-col items-center gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onClick={onComplete}
            className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {buttonText}
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground uppercase tracking-widest"
          >
            Tự động bắt đầu sau {countdown}s...
          </motion.p>
        </div>
      )}
    </motion.div>
  );
}
