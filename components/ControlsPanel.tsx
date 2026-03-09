import { RotateCcw, SkipForward, Maximize2, Play, Pause, FastForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsPanelProps {
  onRestart: () => void;
  onSkip: () => void;
  onFullscreen: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export default function ControlsPanel({
  onRestart,
  onSkip,
  onFullscreen,
  speed,
  setSpeed,
  isPaused,
  setIsPaused,
}: ControlsPanelProps) {
  const speeds = [0.5, 1.0, 1.5, 2.0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 items-end"
    >
      {/* Speed Controls */}
      <div className="flex bg-card/80 backdrop-blur-md border border-border rounded-xl p-1 gap-1 shadow-2xl">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              speed === s 
                ? 'bg-accent text-accent-foreground shadow-lg' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-4 bg-accent text-accent-foreground rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={onFullscreen}
              className="p-3 bg-card/80 backdrop-blur-md border border-border rounded-xl hover:bg-muted transition-colors shadow-xl"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-accent" />
            </button>

            <button
              onClick={onSkip}
              className="p-3 bg-card/80 backdrop-blur-md border border-border rounded-xl hover:bg-muted transition-colors shadow-xl"
              title="Skip to End"
            >
              <SkipForward className="w-5 h-5 text-accent" />
            </button>

            <button
              onClick={onRestart}
              className="p-3 bg-card/80 backdrop-blur-md border border-border rounded-xl hover:bg-muted transition-colors shadow-xl"
              title="Restart"
            >
              <RotateCcw className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
