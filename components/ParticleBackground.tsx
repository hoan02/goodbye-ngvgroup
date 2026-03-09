import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  twinkleSpeed: number;
  targetOpacity: number;
}

export default function ParticleBackground({ count = 100 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = resolvedTheme === 'dark';

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          targetOpacity: Math.random() * 0.5 + 0.1,
        });
      }
    }

    // Animation loop
    const animate = () => {
      // Clear canvas (no trailing effect on light mode to keep it clean)
      if (isDark) {
        ctx.fillStyle = 'rgba(13, 13, 13, 0.1)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Twinkling effect
        if (Math.random() > 0.97) {
          particle.targetOpacity = Math.random() * 0.5 + 0.1;
        }
        particle.opacity += (particle.targetOpacity - particle.opacity) * particle.twinkleSpeed;

        // Draw particle
        const particleColor = isDark ? 255 : 0; // white for dark, black for light
        ctx.fillStyle = `rgba(${particleColor}, ${particleColor}, ${particleColor}, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 bg-transparent pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
