'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import IntroScreen from '@/components/IntroScreen';
import CreditScroll from '@/components/CreditScroll';
import MusicPlayer from '@/components/MusicPlayer';
import ControlsPanel from '@/components/ControlsPanel';
import farewell from '@/data/farewell.json';

type Phase = 'intro' | 'credits' | 'outro';

export default function FarewellPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [key, setKey] = useState(0);

  const handleIntroComplete = () => {
    setPhase('credits');
  };

  const handleCreditsComplete = () => {
    setPhase('outro');
  };

  const handleRestart = () => {
    setPhase('intro');
    setKey((k) => k + 1);
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

  return (
    <div key={key} className="w-full h-screen bg-background overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground count={farewell.animations.particleCount} />

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <IntroScreen
            key="intro"
            onComplete={handleIntroComplete}
            logoUrl={farewell.intro.logoUrl}
            tagline={farewell.intro.tagline}
            buttonText={farewell.intro.buttonText}
          />
        )}

        {phase === 'credits' && (
          <CreditScroll
            key="credits"
            sections={farewell.sections}
            duration={farewell.animations.creditScrollDuration}
            onComplete={handleCreditsComplete}
          />
        )}

        {phase === 'outro' && (
          <div key="outro" className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-background to-black">
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl font-light text-accent mb-8">
                {farewell.company.name}
              </h1>
              <p className="text-2xl text-muted-foreground mb-12">
                Forever in our hearts
              </p>
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Watch Again
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {phase !== 'intro' && (
        <>
          <MusicPlayer
            musicUrl={farewell.music.url}
            title={farewell.music.title}
            defaultMuted={farewell.music.defaultMuted}
          />
          <ControlsPanel
            onRestart={handleRestart}
            onSkip={handleSkip}
            onFullscreen={handleFullscreen}
          />
        </>
      )}
    </div>
  );
}
