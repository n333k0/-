import React, { useState, useEffect } from 'react';
import { X, HelpCircle, BookOpen, Github } from 'lucide-react';
import { explainPiIrrationality } from '../services/gemini';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset explanation when menu closes
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
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-8 transition-all duration-500">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} />
      </button>

      <div className="max-w-2xl w-full space-y-8 text-center animate-in fade-in slide-in-from-bottom-10 duration-500">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">The Nature of Pi</h2>
        <p className="text-gray-400 text-lg">3.1415926535...</p>
        
        <div className="grid grid-cols-1 gap-4 mt-12">
          <button 
            onClick={handleAskAI}
            disabled={isLoading}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all"
          >
            <HelpCircle className={isLoading ? "animate-spin" : ""} />
            <span className="text-lg font-medium">
                {isLoading ? "Consulting the Cosmos..." : "Why is Pi irrational?"}
            </span>
          </button>

          {explanation && (
            <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
               <div className="flex items-start gap-3">
                  <div className="mt-1 min-w-[20px]">✨</div>
                  <p className="text-gray-200 leading-relaxed">{explanation}</p>
               </div>
            </div>
          )}
          
          <div className="pt-8 flex justify-center gap-6 text-gray-500 text-sm">
             <span className="flex items-center gap-2"><BookOpen size={14}/> Mathematical Visualizer</span>
             <span className="flex items-center gap-2"><Github size={14}/> v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
