import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SecretFlapProps {
  value: string;
  onChange: (value: string) => void;
  isEditable?: boolean;
}

export const SecretFlap: React.FC<SecretFlapProps> = ({ value, onChange, isEditable = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[200px] h-24 mx-auto mt-4 perspective-1000 z-30">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 90 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 cursor-pointer group"
          >
            {/* Folded Paper Look */}
            <div className="w-full h-full bg-yellow-100 border border-yellow-200 shadow-md rounded-sm relative overflow-hidden transform transition-transform group-hover:scale-105 group-hover:rotate-1">
              {/* Triangle Fold Effect */}
              <div className="absolute top-0 right-0 border-t-[20px] border-r-[20px] border-t-white/50 border-r-transparent shadow-sm" />
              <div className="absolute bottom-0 left-0 border-b-[20px] border-l-[20px] border-b-black/5 border-l-transparent" />
              
              <div className="h-full flex flex-col items-center justify-center text-center p-2">
                <span className="font-handwriting font-bold text-red-500 text-lg tracking-widest border-2 border-dashed border-red-500/50 p-1 px-2 rounded -rotate-6">
                  TOP SECRET
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-sans uppercase tracking-wider">
                  Tap to Reveal
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -top-4 -left-4 -right-4 -bottom-4 z-50"
          >
             <div className="w-full h-full bg-[#fffdf0] border border-yellow-200 shadow-xl rounded-md p-3 flex flex-col relative transform rotate-1">
                {/* Tape element */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border-l border-r border-white/60 shadow-sm rotate-1 backdrop-blur-sm" />
                
                <span className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider self-center text-center">
                  Secret Memory
                </span>
                
                {isEditable ? (
                  <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Psst... write a secret!"
                    className="w-full flex-1 bg-transparent border-none resize-none font-handwriting text-slate-700 text-lg focus:outline-none leading-tight"
                    autoFocus
                  />
                ) : (
                  <p className="w-full flex-1 font-handwriting text-slate-700 text-lg leading-tight overflow-y-auto">
                    {value || "shhh..."}
                  </p>
                )}

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="self-end text-[10px] text-slate-400 hover:text-red-500 uppercase font-bold mt-1 tracking-wider"
                >
                  Close X
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
