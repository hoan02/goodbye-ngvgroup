import { RotateCcw, SkipForward, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsPanelProps {
  onRestart: () => void;
  onSkip: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export default function ControlsPanel({
  onRestart,
  onSkip,
  speed,
  setSpeed,
  isPaused,
  setIsPaused,
}: ControlsPanelProps) {
  const speeds = [0.5, 1.0, 1.5, 2.0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="flex flex-col items-center gap-3 relative"
    >
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-10 h-10 bg-accent text-accent-foreground rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 flex items-center justify-center"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
        </button>

        <div className="flex flex-col gap-2 bg-card/80 backdrop-blur-md border border-border rounded-2xl p-1.5 shadow-xl items-center">
          {/* Default Playback Controls */}
          <button
            onClick={onRestart}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted text-foreground rounded-xl transition-colors"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5 text-accent" />
          </button>

          <button
            onClick={onSkip}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted text-foreground rounded-xl transition-colors"
            title="Skip to End"
          >
            <SkipForward className="w-5 h-5 text-accent" />
          </button>

          {/* Speed Control with Hover Menu */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-muted text-accent font-bold text-[10px] rounded-xl transition-colors"
              title="Speed"
            >
              {speed}x
            </button>
            {/* Hover Space Bridge: covers the gap to the menu */}
            <div className="absolute left-[80%] top-0 bottom-0 w-8 bg-transparent hidden group-hover:block" />
            
            <div className="absolute left-[120%] bottom-0 bg-card/95 border border-border rounded-xl p-1 shadow-2xl opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-200 flex flex-col gap-1 min-w-[3.5rem]">
              {[...speeds].reverse().map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    speed === s 
                      ? 'bg-accent text-accent-foreground shadow-md' 
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
