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

    let animationFrameId: number;

    const render = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.85;
      const dpr = window.devicePixelRatio || 1;
      
      // Handle resize
      if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
          canvas.width = size * dpr;
          canvas.height = size * dpr;
          canvas.style.width = `${size}px`;
          canvas.style.height = `${size}px`;
          ctx.scale(dpr, dpr);
      }

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = (size / 2) - 20;

      // Clear
      ctx.clearRect(0, 0, size, size);

      // 1. Draw Central Pi Symbol
      // Fades out as the complexity increases
      const piOpacity = Math.max(0, 1 - Math.pow(progress * 4, 1.5));
      
      if (piOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = piOpacity;
        ctx.fillStyle = '#ffffff';
        // Elegant serif font
        ctx.font = `italic ${size * 0.25}px "Times New Roman", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Slight offset for visual center of the glyph
        ctx.fillText('π', centerX, centerY + (size * 0.01));
        ctx.restore();
      }

      // 2. Draw Outer Circle Halo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 3. The Walk
      // We need enough iterations to fill the circle visually
      const maxIterations = 5000; 
      // Smooth out the count
      const count = Math.floor(progress * maxIterations);

      if (count > 0) {
        ctx.save();
        // Blend mode for accumulating brightness where lines overlap
        ctx.globalCompositeOperation = 'screen';
        
        // The lines get thinner as they get more numerous to avoid whiteout
        const opacity = Math.max(0.1, 0.6 - (count / maxIterations) * 0.4);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = size < 500 ? 0.5 : 0.8;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        
        // Optimization: calculate points
        // Start at Angle 0
        let startX = centerX + radius;
        let startY = centerY;
        ctx.moveTo(startX, startY);

        // Draw the path
        for (let i = 1; i <= count; i++) {
           const angle = i; // 1 radian step
           const px = centerX + radius * Math.cos(angle);
           const py = centerY + radius * Math.sin(angle);
           ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        // 4. The Leader Point (The "Pen")
        // Draw the active head of the line brighter
        if (count > 0) {
           const headAngle = count;
           const hx = centerX + radius * Math.cos(headAngle);
           const hy = centerY + radius * Math.sin(headAngle);
           
           // Draw a line from the previous point to the head with high opacity
           if (count > 1) {
               const prevAngle = count - 1;
               const px = centerX + radius * Math.cos(prevAngle);
               const py = centerY + radius * Math.sin(prevAngle);
               
               ctx.beginPath();
               ctx.moveTo(px, py);
               ctx.lineTo(hx, hy);
               ctx.strokeStyle = '#ffffff';
               ctx.lineWidth = 1.5;
               ctx.stroke();
           }

           // Glowing dot
           ctx.fillStyle = '#ffffff';
           ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
           ctx.shadowBlur = 10;
           ctx.beginPath();
           ctx.arc(hx, hy, 3, 0, Math.PI * 2);
           ctx.fill();
           ctx.shadowBlur = 0;
        }
      }
    };

    // Use requestAnimationFrame for smooth updates during scroll
    const tick = () => {
        render();
        animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full h-full">
        <canvas ref={canvasRef} className="z-10 block" />
    </div>
  );
};

export default PiVisualizer;