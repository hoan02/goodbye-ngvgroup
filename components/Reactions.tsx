'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface Reaction {
  id: string;
  type: string;
  x: number;
}

const EMOJIS = [
  { id: 'heart', icon: '❤️', label: 'Heart' },
  { id: 'clap', icon: '👏', label: 'Clap' },
  { id: 'cry', icon: '😢', label: 'Cry' },
  { id: 'star', icon: '⭐', label: 'Star' },
  { id: 'fire', icon: '🔥', label: 'Fire' },
];

export default function Reactions() {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleReact = useCallback((type: string) => {
    const newReaction = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      x: Math.random() * 60 - 30, // Random horizontal offset between -30 and 30
    };

    setReactions((prev) => [...prev, newReaction]);

    // Remove reaction after animation completes (3 seconds)
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 3000);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-4">
      {/* Floating Emojis Area */}
      <div className="absolute bottom-16 right-0 w-20 h-[400px] pointer-events-none flex justify-center">
        <AnimatePresence>
          {reactions.map((reaction) => {
            const emojiObj = EMOJIS.find((e) => e.id === reaction.type);
            return (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 0, y: 0, x: reaction.x, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: -300 - (reaction.id.length % 5) * 20, // Drift up deterministic
                  x: reaction.x + ((reaction.id.charCodeAt(0) % 2) ? 20 : -20), // Drift horizontally slightly
                  scale: [0.5, 1.2, 1, 1] 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5 + (reaction.id.length % 3) * 0.2, ease: "easeOut" }}
                className="absolute bottom-0 text-3xl md:text-4xl drop-shadow-md"
              >
                {emojiObj?.icon}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Emoji Palette */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-2 bg-card/80 backdrop-blur-xl border border-border p-2 rounded-full shadow-2xl mb-2"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji.id}
                onClick={() => handleReact(emoji.id)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent hover:scale-110 active:scale-95 transition-all text-xl"
                title={emoji.label}
              >
                {emoji.icon}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          isOpen ? 'bg-accent text-accent-foreground rotate-12 scale-110' : 'bg-card text-foreground hover:bg-accent/10 border border-border'
        }`}
      >
        <Heart className={`w-6 h-6 ${isOpen ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}
