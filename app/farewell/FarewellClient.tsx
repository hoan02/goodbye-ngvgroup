'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import IntroScreen from '@/components/IntroScreen';
import CreditScroll from '@/components/CreditScroll';
import MusicPlayer from '@/components/MusicPlayer';
import ControlsPanel from '@/components/ControlsPanel';

type Phase = 'intro' | 'credits' | 'outro';

export default function FarewellClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('profile') || 'ngv-group';
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('intro');
  const [key, setKey] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(1.0);
  const [isPaused, setIsPaused] = useState(false);
  const [outroCountdown, setOutroCountdown] = useState(3);

  useEffect(() => {
    fetch(`/api/profiles?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      });
  }, [slug]);

  // Outro auto-restart
  useEffect(() => {
    if (phase === 'outro' && outroCountdown > 0) {
      const timer = setTimeout(() => {
        setOutroCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'outro' && outroCountdown === 0) {
      handleRestart();
    }
  }, [phase, outroCountdown]);

  const handleIntroComplete = () => {
    setPhase('credits');
  };

  const handleCreditsComplete = () => {
    setPhase('outro');
    setOutroCountdown(3); // Reset countdown when entering outro
  };

  const handleRestart = () => {
    setPhase('intro');
    setKey((k) => k + 1);
    setOutroCountdown(3); // Reset countdown
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

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-accent animate-pulse text-2xl font-light tracking-widest">
          LOADING...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-4xl font-light text-accent mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8">The farewell profile you're looking for doesn't exist.</p>
        <a href="/" className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity">
          Go Back Home
        </a>
      </div>
    );
  }

  return (
    <div key={key} className="w-full h-screen bg-background overflow-hidden relative">
      {/* Back Button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-[60] flex items-center gap-2 text-accent/50 hover:text-accent transition-colors duration-300 group"
      >
        <div className="p-2 rounded-full bg-background/20 backdrop-blur-md border border-accent/10 group-hover:bg-accent/10 transition-all">
          <ArrowLeft size={20} />
        </div>
        <span className="text-sm font-light tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 uppercase">Trang chủ</span>
      </Link>

      {/* Dynamic Background Image */}
      {profile.bgImageUrl && (
        <div 
          className="absolute inset-0 z-0 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
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
          <div key="outro" className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-background/80 to-black/90 backdrop-blur-sm">
            <div className="text-center p-8 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
              >
                <p className="text-accent/60 text-lg mb-4 tracking-widest uppercase">Mỗi hành trình đều có kết thúc...</p>
                <h1 className="text-6xl md:text-7xl font-light text-accent mb-4">
                  {profile.name}
                </h1>
                {profile.role && (
                  <p className="text-xl text-accent/60 mb-2">{profile.role}</p>
                )}
                {profile.department && (
                  <p className="text-lg text-muted-foreground mb-12 italic">{profile.department}</p>
                )}
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={handleRestart}
                    className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Watch Again
                  </button>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    Tự động bắt đầu lại sau {outroCountdown}s
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {phase !== 'intro' && (
        <>
          <MusicPlayer
            musicUrl={profile.musicUrl}
            title={profile.musicTitle}
            defaultMuted={false}
          />
          <ControlsPanel
            onRestart={handleRestart}
            onSkip={handleSkip}
            onFullscreen={handleFullscreen}
            speed={scrollSpeed}
            setSpeed={setScrollSpeed}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
          />
        </>
      )}
    </div>
  );
}
