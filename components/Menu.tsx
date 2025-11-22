import React, { useState, useEffect } from 'react';
import { X, HelpCircle, Terminal } from 'lucide-react';
import { explainPiIrrationality } from '../services/gemini';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setExplanation(null);
    }
  }, [isOpen]);

  const handleAskAI = async () => {
    setIsLoading(true);
    const text = await explainPiIrrationality();
    setExplanation(text);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white font-mono flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-8 border-b border-white">
        <div className="text-sm tracking-widest uppercase">Mathematical Visualizer v1.0</div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center border border-white hover:bg-white hover:text-black transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-4xl w-full border border-white/20 p-8 md:p-16 relative">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white"></div>

            <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter text-center uppercase">
              The Nature <br/> of π
            </h2>
            
            <p className="text-center text-white/60 mb-12 text-sm md:text-base max-w-xl mx-auto leading-relaxed border-l-2 border-white/20 pl-4">
              An exploration of irrationality through geometry. By walking a distance equal to the radius along the circumference, we create a path that never closes, filling the circle with infinite complexity.
            </p>
            
            <div className="flex flex-col items-center gap-6">
            <button 
                onClick={handleAskAI}
                disabled={isLoading}
                className="group relative overflow-hidden px-8 py-4 bg-transparent border border-white transition-all hover:bg-white hover:text-black w-full md:w-auto"
            >
                <div className="flex items-center justify-center gap-4">
                    <HelpCircle size={18} className={isLoading ? "animate-spin" : ""} />
                    <span className="uppercase tracking-widest text-sm font-bold">
                        {isLoading ? "COMPUTING..." : "WHY IS π IRRATIONAL?"}
                    </span>
                </div>
            </button>

            {explanation && (
                <div className="mt-8 w-full bg-neutral-900 border border-white/30 p-6 font-mono text-sm leading-loose">
                    <div className="flex gap-2 mb-2 text-xs text-white/40 uppercase">
                        <Terminal size={12} />
                        <span>AI_RESPONSE_LOG</span>
                    </div>
                    <p className="text-gray-300 typing-effect">
                        {explanation}
                    </p>
                </div>
            )}
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-white flex justify-between items-center text-xs uppercase text-white/50">
        <span>3.1415926535...</span>
        <span>Infinite Non-Repeating</span>
      </div>
    </div>
  );
};

export default Menu;