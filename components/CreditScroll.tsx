import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

interface Section {
  title: string;
  content?: string;
  items?: any; // Updated to match schema
}

interface CreditScrollProps {
  sections: Section[];
  duration: number;
  speed: number;
  isPaused: boolean;
  onComplete: () => void;
}

export default function CreditScroll({
  sections,
  duration: baseDuration,
  speed,
  isPaused,
  onComplete,
}: CreditScrollProps) {
  const controls = useAnimation();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initial start
    if (!hasStarted) {
      controls.start({
        y: '-100%',
        transition: {
          duration: (baseDuration + 8) / speed,
          ease: 'linear',
        }
      });
      setHasStarted(true);
    }
  }, [baseDuration, controls, hasStarted, speed]);

  useEffect(() => {
    // Handle Pause/Speed changes
    if (isPaused) {
      controls.stop();
    } else {
      // Calculate remaining distance and time to continue smoothly
      controls.start({
        y: '-100%',
        transition: {
          duration: (baseDuration + 8) / speed, // This is a simplified approach
          ease: 'linear',
        }
      });
    }
  }, [isPaused, speed, controls, baseDuration]);

  // Better approach for speed/pause control: using a custom loop
  const containerRef = useRef<HTMLDivElement>(null);
  const position = useMotionValue(0); 
  const requestRef = useRef<number>(null!);

  useEffect(() => {
    let lastTime = performance.now();
    const totalHeight = containerRef.current?.scrollHeight || 2000;
    const windowHeight = window.innerHeight;
    
    // Convert baseDuration to a standard pixels-per-second
    // Base speed: move totalHeight + windowHeight in baseDuration seconds
    const basePixelsPerSec = (totalHeight + windowHeight) / (baseDuration + 8);

    const animate = (time: number) => {
      if (!isPaused) {
        const deltaTime = (time - lastTime) / 1000;
        const currentY = position.get();
        const nextY = currentY - (basePixelsPerSec * speed * deltaTime);
        
        position.set(nextY);

        if (nextY < -totalHeight) {
          onComplete();
          return;
        }
      }
      lastTime = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, speed, baseDuration, onComplete, position]);

  // Set initial position
  useEffect(() => {
    position.set(window.innerHeight * 0.8);
  }, [position]);

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
        style={{ y: position }}
        className="w-full max-w-4xl mx-auto px-8 text-center"
      >
        <div className="pt-[15vh]"></div>
        {sections.map((section, idx) => (
          <div key={idx} className="mb-32 py-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-accent mb-10 tracking-[0.1em] uppercase italic">
              {section.title}
            </h2>

            {section.content && (
              <p className="text-2xl md:text-3xl text-foreground leading-relaxed text-balance italic font-light">
                {section.content}
              </p>
            )}

            {section.items && Array.isArray(section.items) && (
              <div className="space-y-6 mt-8">
                {section.items.map((item: any, i: number) => (
                  <p key={i} className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="h-screen flex items-center justify-center">
          <div className="text-center opacity-40">
            <p className="text-muted-foreground text-xl uppercase tracking-[0.5em] font-light">Thank you for everything</p>
          </div>
        </div>
      </motion.div>

      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-background via-transparent to-background/50" />
    </motion.div>
  );
}
