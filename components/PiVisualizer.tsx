import React, { useRef, useEffect } from 'react';

interface PiVisualizerProps {
  progress: number; // 0 to 1
}

const PiVisualizer: React.FC<PiVisualizerProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      // Make it responsive but keep it square-ish or fit within viewport
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.8; 
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      
      ctx.scale(dpr, dpr);
      
      // Redraw immediately on resize
      draw(ctx, size);
    };

    const draw = (context: CanvasRenderingContext2D, size: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = (size / 2) - 20; // Padding

      // Clear
      context.clearRect(0, 0, size, size);

      // Draw Base Circle
      context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();

      // Animation Logic
      // We want to show lines connecting points stepped by 1 radian.
      // 1 radian = radius length along circumference.
      // Max iterations to fully fill nicely ~ 2000 lines
      const maxIterations = 1500;
      const currentIterations = Math.floor(progress * maxIterations);
      
      // Optimization: If progress is 0, don't draw paths
      if (currentIterations < 1) return;

      context.lineWidth = 0.5;
      // Use a lighter color for earlier iterations to create depth
      // or just a solid semi-transparent white
      context.strokeStyle = 'rgba(255, 255, 255, 0.15)';

      context.beginPath();
      
      let prevX = centerX + radius * Math.cos(0);
      let prevY = centerY + radius * Math.sin(0);
      
      // If we want to just draw lines from 0 to N
      // The visual in the prompt looks like lines cutting across the circle.
      // A walk of 1 radian:
      // Point n is at angle n radians.
      // Draw line from Point n-1 to Point n.
      
      // Start path
      context.moveTo(prevX, prevY);

      for (let i = 1; i <= currentIterations; i++) {
        const angle = i; // 1 radian step
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        context.lineTo(x, y);
        
        // Optional: visual flair - add a tiny dot at the head if it's the very last point
        if (i === currentIterations) {
           // We will draw the "head" separately to not mess up the path stroke
        }
      }
      context.stroke();

      // Draw the "head" dot
      if (currentIterations > 0) {
        const lastAngle = currentIterations;
        const headX = centerX + radius * Math.cos(lastAngle);
        const headY = centerY + radius * Math.sin(lastAngle);

        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(headX, headY, 3, 0, Math.PI * 2);
        context.fill();
        
        // Draw a glow around the head
        context.shadowBlur = 10;
        context.shadowColor = "white";
        context.fill();
        context.shadowBlur = 0;
      }
    };

    // Initial sizing
    updateSize();

    // Attach resize listener
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [progress]); // Re-run effect when progress changes

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full h-full relative">
        {/* Center Pi Symbol - Fades out as complexity grows */}
        <div 
            className="absolute pointer-events-none select-none transition-opacity duration-500"
            style={{ opacity: Math.max(0, 1 - progress * 3) }}
        >
            <span className="text-6xl md:text-9xl font-serif text-white opacity-80">π</span>
        </div>
        <canvas ref={canvasRef} className="z-10" />
    </div>
  );
};

export default PiVisualizer;
