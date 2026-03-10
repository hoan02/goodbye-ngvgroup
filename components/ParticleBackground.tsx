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
  color?: string;
  rotation?: number;
  rotationSpeed?: number;
}

const CONFETTI_COLORS = ['#ffcc00', '#ff0033', '#00ccff', '#ff6699', '#33cc33'];

export default function ParticleBackground({ count = 100, theme = 'stars' }: { count?: number, theme?: string }) {
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

    // Initialize particles based on theme
    particlesRef.current = [];
    let actualCount = count;
    if (theme === 'rain') actualCount = count * 2; // More rain drops
    if (theme === 'snow') actualCount = count * 1.5;

    for (let i = 0; i < actualCount; i++) {
      let vx = 0, vy = 0, size = 1, color;
      
      switch (theme) {
        case 'rain':
          vy = Math.random() * 10 + 10;
          vx = Math.random() * 2 - 1; // Slight angle
          size = Math.random() * 1.5 + 0.5;
          break;
        case 'confetti':
          vy = Math.random() * 3 + 1;
          vx = (Math.random() - 0.5) * 4;
          size = Math.random() * 6 + 4;
          color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
          break;
        case 'snow':
          vy = Math.random() * 2 + 0.5;
          vx = (Math.random() - 0.5) * 1.5;
          size = Math.random() * 3 + 1;
          break;
        case 'stars':
        default:
          vx = (Math.random() - 0.5) * 0.5;
          vy = (Math.random() - 0.5) * 0.5;
          size = Math.random() * 2 + 0.5;
          break;
      }

      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        opacity: Math.random() * 0.5 + 0.1,
        vx,
        vy,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        targetOpacity: Math.random() * 0.5 + 0.1,
        color,
        rotation: theme === 'confetti' ? Math.random() * Math.PI * 2 : 0,
        rotationSpeed: theme === 'confetti' ? (Math.random() - 0.5) * 0.2 : 0,
      });
    }

    // Animation loop
    const animate = () => {
      if (theme === 'stars') {
        if (isDark) {
          ctx.fillStyle = 'rgba(13, 13, 13, 0.1)'; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      } else {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges dynamically based on theme
        if (theme === 'rain' || theme === 'snow' || theme === 'confetti') {
           if (particle.y > canvas.height) {
              particle.y = -20;
              particle.x = Math.random() * canvas.width;
           }
           if (particle.x > canvas.width) particle.x = 0;
           if (particle.x < 0) particle.x = canvas.width;
        } else {
           if (particle.x < 0) particle.x = canvas.width;
           if (particle.x > canvas.width) particle.x = 0;
           if (particle.y < 0) particle.y = canvas.height;
           if (particle.y > canvas.height) particle.y = 0;
        }

        // Apply theme-specific physics/drawing
        if (theme === 'rain') {
           ctx.beginPath();
           ctx.moveTo(particle.x, particle.y);
           ctx.lineTo(particle.x + particle.vx * 1.5, particle.y + particle.vy * 1.5);
           ctx.strokeStyle = `rgba(174, 194, 224, ${particle.opacity * 1.5})`;
           ctx.lineWidth = particle.size;
           ctx.lineCap = 'round';
           ctx.stroke();
        } 
        else if (theme === 'confetti') {
           if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
             particle.rotation += particle.rotationSpeed;
           }
           ctx.save();
           ctx.translate(particle.x, particle.y);
           ctx.rotate(particle.rotation || 0);
           ctx.fillStyle = particle.color || '#fff';
           ctx.globalAlpha = particle.opacity;
           ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.5);
           ctx.restore();
        } 
        else { // stars or snow
           if (theme === 'stars') {
              if (Math.random() > 0.97) {
                particle.targetOpacity = Math.random() * 0.5 + 0.1;
              }
              particle.opacity += (particle.targetOpacity - particle.opacity) * particle.twinkleSpeed;
           }

           const particleColor = isDark || theme === 'snow' ? 255 : 0; 
           ctx.fillStyle = `rgba(${particleColor}, ${particleColor}, ${particleColor}, ${theme === 'snow' ? particle.opacity * 1.5 : particle.opacity})`;
           ctx.beginPath();
           ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
           ctx.fill();
        }
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
  }, [count, resolvedTheme, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none transition-colors duration-1000 ${theme === 'rain' ? 'bg-black/20' : 'bg-transparent'}`}
      style={{ zIndex: 0 }}
    />
  );
}
