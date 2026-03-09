'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Section {
  title: string;
  content?: string;
  credits?: string[];
  memories?: string[];
  message?: string;
  achievements?: string[];
  closing?: string;
}

interface CreditScrollProps {
  sections: Section[];
  duration: number;
  onComplete: () => void;
}

export default function CreditScroll({
  sections,
  duration,
  onComplete,
}: CreditScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, (duration + 8) * 1000); // Add 8 seconds pause

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-40 overflow-hidden bg-transparent pointer-events-none"
    >
      <motion.div
        ref={containerRef}
        initial={{ y: '100vh' }}
        animate={{ y: '-100%' }}
        transition={{
          duration: duration + 8,
          ease: 'linear',
          delay: 2,
        }}
        className="w-full max-w-4xl mx-auto px-8 text-center"
      >
        <div className="pt-[15vh]"></div>
        {/* Content sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="mb-32 py-16">
            <h2 className="text-5xl md:text-6xl font-light text-accent mb-8 tracking-widest">
              {section.title}
            </h2>

            {section.content && (
              <p className="text-xl md:text-2xl text-foreground leading-relaxed text-balance italic">
                {section.content}
              </p>
            )}

            {section.credits && (
              <div className="space-y-4">
                {section.credits.map((credit, i) => (
                  <p key={i} className="text-lg md:text-xl text-muted-foreground">
                    {credit}
                  </p>
                ))}
              </div>
            )}

            {section.memories && (
              <div className="space-y-6">
                {section.memories.map((memory, i) => (
                  <p
                    key={i}
                    className="text-lg md:text-xl text-foreground leading-relaxed"
                  >
                    {memory}
                  </p>
                ))}
              </div>
            )}

            {section.message && (
              <p className="text-2xl md:text-3xl text-foreground leading-relaxed italic text-balance">
                {section.message}
              </p>
            )}

            {section.achievements && (
              <div className="space-y-4">
                {section.achievements.map((achievement, i) => (
                  <p
                    key={i}
                    className="text-lg md:text-xl text-muted-foreground"
                  >
                    ✦ {achievement}
                  </p>
                ))}
              </div>
            )}

            {section.closing && (
              <p className="text-3xl md:text-4xl text-accent font-light tracking-wider">
                {section.closing}
              </p>
            )}
          </div>
        ))}

        {/* Empty space at bottom */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">Thank you for everything</p>
          </div>
        </div>
      </motion.div>

      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/50" />
    </motion.div>
  );
}
