import React, { useRef, useEffect } from 'react';

interface PiVisualizerProps {
  progress: number; // 0 to 1
}

const PiVisualizer: React.FC<PiVisualizerProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      // Use a large portion of the viewport, but keep padding
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.9; 
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      
      ctx.scale(dpr, dpr);
      
      draw(ctx, size);
    };

    const draw = (context: CanvasRenderingContext2D, size: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = (size / 2) - 10;

      // Clear
      context.clearRect(0, 0, size, size);

      // Draw Outer Circle (very faint)
      context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();

      // Animation Logic
      // 1 radian steps.
      // Max iterations ~ 1000 to 2000 creates the nice dense shape.
      const maxIterations = 2500; 
      
      // Non-linear progress for dramatic effect
      // Starts slow then speeds up
      const easedProgress = progress === 0 ? 0 : Math.pow(progress, 1.5);
      const currentIterations = Math.floor(easedProgress * maxIterations);
      
      if (currentIterations < 1) return;

      context.lineWidth = 0.8; // Thin, crisp lines
      context.lineJoin = 'round';
      context.lineCap = 'round';
      
      context.beginPath();
      
      // Start at angle 0
      let prevX = centerX + radius * Math.cos(0);
      let prevY = centerY + radius * Math.sin(0);
      context.moveTo(prevX, prevY);

      // Optimization: Batch paths to avoid too many draw calls, but for < 3000 points, single path is fine.
      // However, we want to change opacity based on iteration count to avoid blown out white immediately.
      
      // For the "Brutalist" look, uniform white lines are actually better than fading ones
      // but we lower the global alpha.
      context.strokeStyle = 'rgba(255, 255, 255, 0.15)';

      for (let i = 1; i <= currentIterations; i++) {
        // The walk is simple: angle = i * 1 radian
        const angle = i; 
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        context.lineTo(x, y);
      }
      context.stroke();

      // Highlight the current "head"
      if (currentIterations > 0) {
        const lastAngle = currentIterations;
        const headX = centerX + radius * Math.cos(lastAngle);
        const headY = centerY + radius * Math.sin(lastAngle);

        // Draw the connecting line from previous to current brighter
        if (currentIterations > 1) {
            const prevAngle = currentIterations - 1;
            const pX = centerX + radius * Math.cos(prevAngle);
            const pY = centerY + radius * Math.sin(prevAngle);
            
            context.beginPath();
            context.moveTo(pX, pY);
            context.lineTo(headX, headY);
            context.strokeStyle = '#ffffff';
            context.lineWidth = 2;
            context.stroke();
        }

        // The Point
        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(headX, headY, 4, 0, Math.PI * 2);
        context.fill();
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [progress]);

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full h-full relative">
        <canvas ref={canvasRef} className="z-10" />
    </div>
  );
};

export default PiVisualizer;