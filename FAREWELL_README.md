# Cinematic Farewell Webpage

A beautifully crafted farewell experience with smooth animations, scrolling credits, background music, and interactive controls. Perfect for honoring journeys, celebrating achievements, and bidding thoughtful goodbyes.

## Features

✨ **Cinematic Intro Screen**
- Elegant logo fade-in animation
- Typewriter effect for your farewell message
- Smooth transitions between phases

🎬 **Scrolling Credits**
- Movie-style credit roll that auto-scrolls
- Multiple customizable sections (Thank You, Special Thanks, Memories, etc.)
- Text glow effects and proper typography
- 60-second configurable scroll duration

🎵 **Music Player**
- Floating music control with play/pause
- Volume slider for ambient audio
- Muted by default (user can enable)
- Supports any audio file format

🎮 **Interactive Controls**
- Restart button to replay the experience
- Skip button to jump to the outro
- Fullscreen mode for immersive viewing

✨ **Particle Background**
- Animated star field with twinkling effect
- Subtle vignette for cinematic feel
- Optimized Canvas rendering

## Project Structure

```
/app
  /farewell
    page.tsx           # Main farewell experience page
  page.tsx             # Home page with entry button
  layout.tsx           # Root layout with metadata
  globals.css          # Theme and styling

/components
  IntroScreen.tsx      # Opening screen with typewriter effect
  CreditScroll.tsx     # Main scrolling credits section
  ParticleBackground.tsx # Animated background with particles
  MusicPlayer.tsx      # Audio player controls
  ControlsPanel.tsx    # Interactive control buttons

/data
  farewell.json        # Configuration and content

/public
  logo.png             # Your logo/symbol (generated placeholder)
  /music
    farewell.mp3       # Background music file (optional)
```

## Customization

### 1. Update Content (`/data/farewell.json`)

Edit all text, company name, and message content:

```json
{
  "intro": {
    "tagline": "Your custom farewell message...",
    "buttonText": "Begin Experience"
  },
  "sections": [
    {
      "title": "Thank You",
      "content": "Your message here..."
    }
    // ... more sections
  ]
}
```

### 2. Add Your Logo

Replace `/public/logo.png` with your own logo file (any image format).

### 3. Add Background Music

1. Place your audio file at `/public/music/farewell.mp3`
2. Update the music URL in `farewell.json` if using a different filename

### 4. Adjust Animation Timings

In `farewell.json`, modify the `animations` section:

```json
"animations": {
  "introFadeDuration": 2,        // Logo fade-in duration (seconds)
  "typewriterSpeed": 100,        // Typewriter effect speed (ms per character)
  "creditScrollDuration": 60,    // Total scroll duration (seconds)
  "particleCount": 100,          // Number of background particles
  "glowIntensity": 0.8           // Text glow effect strength
}
```

### 5. Customize Colors

Edit `/app/globals.css` to change the dark theme:

```css
:root {
  --background: oklch(0.08 0 0);     /* Very dark background */
  --foreground: oklch(0.95 0 0);     /* Off-white text */
  --accent: oklch(0.7 0.15 60);      /* Golden accent color */
  --muted-foreground: oklch(0.65 0 0); /* Muted text */
}
```

## Usage

### Development

```bash
npm run dev
# or
pnpm dev
```

Then visit:
- `http://localhost:3000` - Home page
- `http://localhost:3000/farewell` - Full farewell experience

### Building for Production

```bash
npm run build
npm start
```

## Components Overview

### IntroScreen
- Shows logo and typewriter text
- Displays "Begin Farewell" button once animation completes
- Smooth fade transitions

### CreditScroll
- Auto-scrolls through configurable credit sections
- Renders content from `farewell.json`
- Automatic outro trigger after scroll duration

### ParticleBackground
- Canvas-based star field animation
- Twinkling stars with smooth movement
- Performance optimized with requestAnimationFrame

### MusicPlayer
- Floating control panel (bottom-left)
- Play/Pause and volume controls
- Appears during credits and outro phases

### ControlsPanel
- Floating buttons (bottom-right)
- Fullscreen, Skip, and Restart actions
- Only visible during credits and outro

## Keyboard Shortcuts

- **ESC** - Exit fullscreen (if enabled)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Android Chrome)

## Performance Tips

1. **Optimize images**: Compress your logo file for faster loading
2. **Audio file size**: Use MP3 or WebM format (20-30MB max recommended)
3. **Particle count**: Reduce from 100 to 50 on older devices
4. **Fullscreen**: Works best on modern browsers

## Customization Examples

### Change scroll duration to 90 seconds
```json
"creditScrollDuration": 90
```

### Add more credit sections
```json
"sections": [
  // ... existing sections
  {
    "title": "Custom Section",
    "content": "Your custom content..."
  }
]
```

### Slower typewriter effect
```json
"typewriterSpeed": 150  // Instead of default 100
```

## Troubleshooting

**Music not playing?**
- Ensure `farewell.mp3` is in `/public/music/`
- Check browser audio permissions
- Use browser console to check for errors

**Logo not showing?**
- Verify logo.png exists in `/public/`
- Check file format (PNG recommended)
- Try regenerating the logo

**Scroll too fast/slow?**
- Adjust `creditScrollDuration` in `farewell.json`
- Increase for slower, more contemplative pacing

**Particles not visible?**
- Check browser console for Canvas support
- Ensure JavaScript is enabled
- Try reducing `particleCount` if performance is poor

## Deployment

The project is ready for deployment to Vercel:

```bash
npm install
npm run build
```

Then deploy using Vercel's dashboard or CLI:

```bash
vercel deploy
```

## License

This project is open source and available for personal and commercial use.

---

Created with love for meaningful farewells. 🌟
