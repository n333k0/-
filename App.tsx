import React, { useState, useEffect } from 'react';
import PiVisualizer from './components/PiVisualizer';
import Menu from './components/Menu';

function App() {
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      
      const maxScroll = documentHeight - windowHeight;
      
      if (maxScroll <= 0) {
        setProgress(1);
        return;
      }

      const rawProgress = scrollY / maxScroll;
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      setProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-[400vh] bg-black font-mono selection:bg-white selection:text-black">
      
      {/* Fixed Overlay for Menu Button */}
      <header className="fixed top-0 right-0 p-8 z-40 mix-blend-difference">
        <button 
            onClick={() => setIsMenuOpen(true)}
            className="group flex items-center justify-center w-12 h-12 border border-white bg-black hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Open Menu"
        >
           <div className="w-2 h-2 bg-current"></div>
        </button>
      </header>

      {/* Sticky Visualizer Container */}
      <main className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10">
         <PiVisualizer progress={progress} />
      </main>

      {/* Menu Overlay */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Scroll Indicators / Content at various depths */}
      <div className="absolute top-[40vh] w-full text-center pointer-events-none z-0 opacity-40 mix-blend-difference">
          <p className="text-white text-xs tracking-[0.5em] uppercase border-l border-r border-white/20 inline-block px-4 py-2">Scroll to generate</p>
      </div>

    </div>
  );
}

export default App;