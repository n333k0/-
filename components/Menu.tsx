import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { explainPiIrrationality } from '../services/gemini';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper component for text that lightens up as you scroll
const FadeInText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const elementRef = useRef<HTMLParagraphElement>(null);
  const [opacity, setOpacity] = useState(0.1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
             const ratio = entry.intersectionRatio;
             setOpacity(0.1 + (ratio * 0.9));
          } else {
             setOpacity(0.1);
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i * 0.05), rootMargin: "-10% 0px -10% 0px" }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <p 
      ref={elementRef} 
      className={`transition-opacity duration-500 ${className}`}
      style={{ opacity }}
    >
      {children}
    </p>
  );
};

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [explanation, setExplanation] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setExplanation(null);
    }
  }, [isOpen]);

  const handleAskAI = async () => {
    setIsLoading(true);
    const text = await explainPiIrrationality();
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    setExplanation(sentences);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white font-mono flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-8 bg-black z-50">
        <div className="text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-neutral-600">
          BY NEEKO
        </div>
        <button 
          onClick={onClose}
          className="group flex items-center gap-2 hover:text-white/70 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 md:p-12 flex flex-col">
          <div className="max-w-[1800px] mx-auto w-full flex-1 flex flex-col">
            
            {!explanation ? (
              /* Initial View */
              <div className="flex-1 flex flex-col animate-in fade-in duration-700 relative">
                
                {/* Centered Title and Content Area */}
                <div className="flex-1 flex flex-col justify-center items-center text-center gap-12">
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.85]">
                      WHY Π IS <br/>
                      <span className="text-neutral-500">IRRATIONAL</span>
                    </h1>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-mono uppercase tracking-widest">
                      The circle cannot be squared. The path never closes. 
                      Explore the infinite non-repeating nature of the universe's most famous constant.
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-auto w-full flex justify-center pb-12 md:pb-20">
                  <button 
                    onClick={handleAskAI}
                    disabled={isLoading}
                    className="group relative px-8 py-4 bg-white text-black hover:bg-neutral-200 transition-all w-full md:w-auto max-w-md overflow-hidden"
                  >
                     <div className="relative z-10 flex items-center justify-center gap-4">
                        <span className="text-sm md:text-base font-bold tracking-widest uppercase whitespace-nowrap">
                          {isLoading ? "COMPUTING..." : "GENERATE EXPLANATION"}
                        </span>
                        <ArrowRight size={16} className={`transition-transform duration-300 ${isLoading ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
                     </div>
                  </button>
                </div>

              </div>
            ) : (
              /* AI Response View */
              <div className="py-20 space-y-32">
                 <div className="border-b border-white/20 pb-8 mb-20">
                     <span className="text-xs tracking-[0.5em] uppercase text-neutral-500">Analysis Generated</span>
                 </div>
                 
                 <div className="space-y-16 md:space-y-24">
                   {explanation.map((sentence, idx) => (
                      <FadeInText 
                        key={idx} 
                        className="text-4xl md:text-7xl font-bold leading-tight tracking-tight uppercase"
                      >
                        {sentence.trim()}
                      </FadeInText>
                   ))}
                 </div>

                 <div className="pt-32 border-t border-white/20 mt-32 flex flex-col gap-8">
                     <p className="text-neutral-500 text-sm uppercase tracking-widest">End of analysis</p>
                     <button 
                        onClick={() => setExplanation(null)}
                        className="text-left text-xl underline decoration-1 underline-offset-8 hover:text-neutral-400"
                      >
                         RESET
                     </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;