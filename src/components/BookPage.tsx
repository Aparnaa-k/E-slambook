import React from 'react';

interface BookPageProps {
  children: React.ReactNode;
  pageNumber: number;
  side: 'left' | 'right';
  className?: string;
}

export const BookPage: React.FC<BookPageProps> = ({ children, pageNumber, side, className = '' }) => {
  const isLeft = side === 'left';
  
  return (
    <div 
      className={`relative h-full w-full bg-[#fdfbf7] flex flex-col shadow-inner overflow-hidden ${isLeft ? 'rounded-l-lg border-r border-gray-300' : 'rounded-r-lg'} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
        backgroundSize: '100% 2rem',
        marginTop: 0 // Reset margin for layout
      }}
    >
      {/* Paper texture overlay (subtle noise) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Binding shadow */}
      <div className={`absolute top-0 bottom-0 w-8 pointer-events-none z-10 ${isLeft ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent`} />

      {/* Content Area */}
      <div className="flex-1 p-8 pb-12 relative z-0">
        {children}
      </div>

      {/* Page Number */}
      <div className="absolute bottom-3 w-full text-center text-gray-400 font-handwriting text-sm">
        {pageNumber}
      </div>
    </div>
  );
};
