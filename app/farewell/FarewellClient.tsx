'use client';

import { useState, use, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import Link from 'next/link';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import IntroScreen from '@/components/IntroScreen';
import CreditScroll from '@/components/CreditScroll';
import MusicPlayer from '@/components/MusicPlayer';
import ControlsPanel from '@/components/ControlsPanel';

type Phase = 'intro' | 'credits' | 'outro';

interface FarewellProfile {
  _id: string;
  slug: string;
  name: string;
  role?: string;
  department?: string;
  musicUrl: string;
  musicTitle: string;
  bgImageUrl?: string;
  logoUrl?: string;
  tagline?: string;
  buttonText?: string;
  sections: any[];
}

export default function FarewellClient({ profilePromise }: { profilePromise: Promise<FarewellProfile> }) {
  const profile = use(profilePromise);
  
  const [phase, setPhase] = useState<Phase>('intro');
  const [key, setKey] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('speed');
      return saved !== null ? parseFloat(saved) : 1.0;
    }
    return 1.0;
  });
  const [isPaused, setIsPaused] = useState(false);

  // Save speed to localStorage
  useEffect(() => {
    localStorage.setItem('speed', scrollSpeed.toString());
  }, [scrollSpeed]);

  const handleRestart = () => {
    setPhase('intro');
    setKey((k) => k + 1);
  };

  const handleIntroComplete = () => {
    setPhase('credits');
  };

  const handleCreditsComplete = () => {
    setPhase('outro');
  };

  const handleSkip = () => {
    setPhase('outro');
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!profile) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-4xl font-light text-accent mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8">The farewell profile you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div key={key} className="w-full h-screen bg-background overflow-hidden relative">
      {/* Top Controls (Fullscreen + Theme Toggle integrated via Layout) */}
      <div className="fixed top-6 right-20 z-[100] flex items-center gap-3">
        <button
          onClick={handleFullscreen}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-card hover:bg-accent hover:text-accent-foreground border border-border shadow-lg transition-all duration-300 group overflow-hidden"
          aria-label="Toggle Fullscreen"
        >
          <Maximize2 className="w-5 h-5 text-accent group-hover:text-inherit transition-colors" />
        </button>
      </div>

      {/* Back Button - Moved back to Top Left */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-[60] flex items-center gap-2 text-accent/50 hover:text-accent transition-colors duration-300 group"
      >
        <div className="p-2 rounded-full bg-background/20 backdrop-blur-md border border-accent/10 group-hover:bg-accent/10 transition-all shadow-lg">
          <ArrowLeft size={20} />
        </div>
        <span className="text-sm font-light tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 uppercase">Trang chủ</span>
      </Link>

      {/* Dynamic Background Image - Removed grayscale/low opacity on hover out */}
      {profile.bgImageUrl && (
        <div 
          className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url(${profile.bgImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* Particle Background */}
      <ParticleBackground count={100} />

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <IntroScreen
            key="intro"
            onComplete={handleIntroComplete}
            logoUrl={profile.logoUrl || '/logo.png'}
            tagline={profile.tagline || ""}
            buttonText={profile.buttonText || "Bắt Đầu"}
          />
        )}

        {phase === 'credits' && (
          <CreditScroll
            key="credits"
            sections={profile.sections}
            duration={60}
            speed={scrollSpeed}
            isPaused={isPaused}
            onComplete={handleCreditsComplete}
          />
        )}

        {phase === 'outro' && (
          <div key="outro" className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden">
            {/* Cinematic Background Blur */}
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 z-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]"
              style={{
                backgroundImage: profile.bgImageUrl ? `url(${profile.bgImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(30px) brightness(0.4)',
              }}
            />
            
            <div className="relative z-10 text-center p-8 max-w-2xl w-full mx-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-[40px] p-12 shadow-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="w-20 h-px bg-accent/50 mx-auto mb-8"
                />

                <p className="text-accent/80 text-sm md:text-base font-light mb-6 tracking-[0.4em] uppercase">Mỗi hành trình đều có kết thúc...</p>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  {profile.name}
                </h1>
                
                <div className="space-y-2 mb-12">
                  {profile.role && (
                    <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">{profile.role}</p>
                  )}
                  {profile.department && (
                    <p className="text-lg text-white/60 italic font-extralight tracking-widest">{profile.department}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleRestart}
                    className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                  >
                    Watch Again
                  </button>
                  <Link
                    href="/#profiles"
                    className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md"
                  >
                    Xem thêm hành trình khác
                  </Link>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="w-20 h-px bg-accent/50 mx-auto mt-12"
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Controllers (Bottom Left) */}
      {phase !== 'intro' && (
        <div className="fixed bottom-8 left-8 z-50 flex flex-col-reverse items-start justify-start gap-4">
          <MusicPlayer
            musicUrl={profile.musicUrl}
            title={profile.musicTitle}
            defaultMuted={false}
          />
          <ControlsPanel
            onRestart={handleRestart}
            onSkip={handleSkip}
            speed={scrollSpeed}
            setSpeed={setScrollSpeed}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
          />
        </div>
      )}
    </div>
  );
}
