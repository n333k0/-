import React, { useState, useEffect, useRef } from 'react';
import PiVisualizer from './components/PiVisualizer';
import Menu from './components/Menu';

function App() {
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // We need a reference to the scroll container to calculate progress
  // In this implementation, we use the window scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      
      // Calculate how far we've scrolled. 
      // We want the animation to complete when we are near the bottom.
      const maxScroll = documentHeight - windowHeight;
      
      if (maxScroll <= 0) {
        setProgress(1); // If no scroll, just show full
        return;
      }

      const rawProgress = scrollY / maxScroll;
      // Clamp between 0 and 1
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      setProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Container has a large height to enable scrolling
    <div className="relative w-full min-h-[400vh] bg-black selection:bg-white selection:text-black">
      
      {/* Fixed Overlay for Header & Menu Button */}
      <header className="fixed top-0 left-0 w-full z-40 p-6 flex justify-between items-start mix-blend-difference text-white pointer-events-none">
        <div className="max-w-xs pointer-events-auto">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
            Visual demonstration of why <span className="font-serif italic">Pi (π)</span> is irrational
          </h1>
          <p className="mt-2 text-sm text-gray-400 opacity-80">
            Scroll to trace the infinite path
          </p>
        </div>

        {/* The Menu Dot / Button */}
        <button 
            onClick={() => setIsMenuOpen(true)}
            className="pointer-events-auto group relative w-12 h-12 flex items-center justify-center"
            aria-label="Open Menu"
        >
           {/* The "Point" visually representing the menu trigger */}
           <div className="w-3 h-3 bg-white rounded-full group-hover:scale-150 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
           
           {/* Ripple effect hint */}
           <div className="absolute inset-0 border border-white/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
        </button>
      </header>

      {/* Sticky Visualizer Container */}
      <main className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10">
         <PiVisualizer progress={progress} />
      </main>

      {/* Menu Overlay */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Scroll Indicators / Content at various depths to guide user */}
      <div className="absolute top-[20vh] w-full text-center pointer-events-none z-0 opacity-20">
          <p className="text-white/50 text-sm tracking-[0.5em] uppercase">Begin the walk</p>
      </div>

      <div className="absolute top-[150vh] w-full text-center pointer-events-none z-0 opacity-20">
          <p className="text-white/50 text-sm tracking-[0.5em] uppercase">Filling the void</p>
      </div>

      <div className="absolute bottom-[10vh] w-full text-center pointer-events-none z-0 opacity-20">
          <p className="text-white/50 text-sm tracking-[0.5em] uppercase">Never repeating</p>
      </div>

    </div>
  );
}

export default App;
