import React from 'react';

// ... existing imports ... (I will include previous components and add new ones)

export const Tape: React.FC<{ className?: string; rotation?: number }> = ({ className = '', rotation = -5 }) => (
  <div 
    className={`absolute h-8 w-24 bg-white/40 border-l border-r border-white/60 shadow-sm backdrop-blur-sm ${className}`}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <div className="w-full h-full opacity-30 bg-repeat-x" style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 90%, rgba(255,255,255,0.5) 90%, rgba(255,255,255,0.5) 100%)', backgroundSize: '10px 100%' }} />
  </div>
);

export const PaperClip: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 50" className={`absolute w-8 h-16 drop-shadow-md opacity-80 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 10V38C8 42.4183 11.5817 46 16 46C20.4183 46 24 42.4183 24 38V12C24 6.47715 19.5228 2 14 2C8.47715 2 4 6.47715 4 12V36" className="text-zinc-400" />
    <path d="M8 10V38C8 42.4183 11.5817 46 16 46C20.4183 46 24 42.4183 24 38V12C24 6.47715 19.5228 2 14 2C8.47715 2 4 6.47715 4 12V36" className="text-zinc-300 stroke-[1px]" />
  </svg>
);

export const CoffeeStain: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute pointer-events-none opacity-10 mix-blend-multiply ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full fill-[#4a3b2a]">
       <path d="M100,20 C140,20 175,50 175,100 C175,145 140,180 100,180 C60,180 25,145 25,100 C25,50 60,20 100,20 M100,10 C50,10 10,55 10,100 C10,155 50,190 100,190 C150,190 190,155 190,100 C190,55 150,10 100,10" />
       {/* Irregularities */}
       <circle cx="40" cy="90" r="5" />
       <circle cx="160" cy="110" r="8" />
       <path d="M100,25 Q130,25 150,50" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  </div>
);

export const PolaroidFrame: React.FC<{ children: React.ReactNode; className?: string; rotation?: number }> = ({ children, className = '', rotation = 2 }) => (
  <div 
    className={`bg-white p-2 pb-8 shadow-md transform transition-transform hover:scale-105 hover:z-10 ${className}`}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <div className="bg-slate-100 w-full h-full shadow-inner overflow-hidden">
      {children}
    </div>
  </div>
);

export const Doodles: React.FC<{ className?: string; type: 'star' | 'heart' | 'underline' | 'arrow' | 'flower' }> = ({ className = '', type }) => {
  if (type === 'star') {
    return (
      <svg viewBox="0 0 50 50" className={`absolute w-8 h-8 opacity-60 text-indigo-500 fill-transparent stroke-current stroke-2 ${className}`}>
        <path d="M25 2 L32 18 L49 18 L36 29 L41 46 L25 36 L9 46 L14 29 L1 18 L18 18 Z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'heart') {
    return (
      <svg viewBox="0 0 50 50" className={`absolute w-8 h-8 opacity-60 text-pink-500 fill-transparent stroke-current stroke-2 ${className}`}>
        <path d="M25 39.7l-.6-.5C11.5 28.7 4 21.5 4 14c0-5.2 4.1-9.3 9.3-9.3 3.3 0 6.2 1.6 8 4.3l3.7 5.8 3.7-5.8c1.8-2.7 4.7-4.3 8-4.3 5.2 0 9.3 4.1 9.3 9.3 0 7.5-7.5 14.7-20.4 25.2l-.6.5z" />
      </svg>
    );
  }
  if (type === 'arrow') {
    return (
        <svg viewBox="0 0 100 50" className={`absolute w-24 h-12 opacity-80 text-slate-600 fill-none stroke-current stroke-2 ${className}`}>
          <path d="M10,25 Q50,5 90,25" markerEnd="url(#arrowhead)" />
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
        </svg>
    );
  }
  if (type === 'flower') {
      return (
        <svg viewBox="0 0 50 50" className={`absolute w-10 h-10 opacity-70 text-pink-400 fill-current ${className}`}>
            <circle cx="25" cy="25" r="8" className="text-yellow-400" />
            <circle cx="25" cy="10" r="8" />
            <circle cx="40" cy="25" r="8" />
            <circle cx="25" cy="40" r="8" />
            <circle cx="10" cy="25" r="8" />
            <circle cx="15" cy="15" r="6" />
            <circle cx="35" cy="15" r="6" />
            <circle cx="35" cy="35" r="6" />
            <circle cx="15" cy="35" r="6" />
        </svg>
      )
  }
  return null;
};

export const Rhinestone: React.FC<{ className?: string; color?: string }> = ({ className = '', color = 'white' }) => (
    <div className={`absolute rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.5)] ${className}`}
         style={{
             background: `radial-gradient(circle at 30% 30%, white, ${color}, ${color === 'white' ? 'gray' : 'black'})`
         }}
    >
        <div className="absolute inset-0 rounded-full bg-white opacity-40 animate-pulse" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', transform: 'scale(0.6)' }} />
    </div>
);

export const DenimPatch: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`relative bg-indigo-800 p-2 shadow-lg ${className}`}
        style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1664095885291-80e42e5692ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwZGVuaW0lMjBmYWJyaWMlMjB0ZXh0dXJlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzA3OTQ5NDR8MA&ixlib=rb-4.1.0&q=80&w=200')`,
             backgroundSize: '100px',
        }}
    >
        <div className="border-2 border-dashed border-yellow-500/80 w-full h-full p-2 flex items-center justify-center">
            {children}
        </div>
        {/* Frayed Edges effect could be complex, keeping it simple for now */}
    </div>
);
