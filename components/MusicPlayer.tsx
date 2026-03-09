'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';

interface MusicPlayerProps {
  musicUrl: string;
  title: string;
  defaultMuted?: boolean;
}

export default function MusicPlayer({
  musicUrl,
  title,
  defaultMuted = false,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('muted');
      return saved === 'true' || defaultMuted;
    }
    return defaultMuted;
  });
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('volume');
      return saved !== null ? parseFloat(saved) : 0.5;
    }
    return 0.5;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('muted', isMuted.toString());
  }, [isMuted]);

  const isExpanded = isHovered || isPinned;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const onLoadedMetadata = () => setDuration(audio.duration);
      const onTimeUpdate = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('timeupdate', onTimeUpdate);

      // Autoplay since the user previously interacted by clicking "Bắt Đầu"
      audio.volume = volume;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Autoplay failed:', err));

      return () => {
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('timeupdate', onTimeUpdate);
      };
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        muted={isMuted}
        preload="metadata"
      />

      <button
        onClick={() => setIsPinned(!isPinned)}
        className={`w-12 h-12 flex items-center justify-center bg-card/80 border border-border hover:bg-muted rounded-full backdrop-blur-md shadow-lg transition-colors ${
          isPinned ? 'ring-2 ring-accent' : ''
        }`}
        aria-label="Toggle Music Player"
      >
        <Music className={`w-5 h-5 ${isPlaying && !isExpanded ? 'text-accent animate-pulse' : 'text-foreground'}`} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-w-[500px] opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4 bg-card/80 border border-border rounded-full ml-2 px-2 py-2 backdrop-blur-md shadow-lg w-max">
          <button
            onClick={togglePlay}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-accent" />
            ) : (
              <Play className="w-5 h-5 text-accent" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-accent" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-muted rounded cursor-pointer accent-accent"
            aria-label="Volume"
          />

          <div className="flex flex-col justify-center pr-4">
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {title}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
