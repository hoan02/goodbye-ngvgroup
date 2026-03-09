'use client';

import { RotateCcw, SkipForward, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsPanelProps {
  onRestart: () => void;
  onSkip: () => void;
  onFullscreen: () => void;
}

export default function ControlsPanel({
  onRestart,
  onSkip,
  onFullscreen,
}: ControlsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="fixed bottom-8 right-8 z-50 flex flex-col gap-3"
    >
      <button
        onClick={onFullscreen}
        className="p-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
        title="Fullscreen"
      >
        <Maximize2 className="w-5 h-5 text-accent" />
      </button>

      <button
        onClick={onSkip}
        className="p-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
        title="Skip to End"
      >
        <SkipForward className="w-5 h-5 text-accent" />
      </button>

      <button
        onClick={onRestart}
        className="p-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
        title="Restart"
      >
        <RotateCcw className="w-5 h-5 text-accent" />
      </button>
    </motion.div>
  );
}
