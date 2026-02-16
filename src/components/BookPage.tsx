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
      className={`relative h-full w-full bg-[#fdfbf7] flex flex-col shadow-inner overflow-hidden ${isLeft ? 'md:rounded-l-lg md:border-r border-gray-300 rounded-t-lg md:rounded-tr-none border-b md:border-b-0' : 'md:rounded-r-lg rounded-b-lg md:rounded-bl-none'} ${className}`}
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
      
      {/* Binding shadow - Responsive: Vertical on mobile (top/bottom), Horizontal on desktop (left/right) */}
      <div className={`absolute pointer-events-none z-10 
        ${isLeft 
          ? 'bottom-0 h-8 w-full md:w-8 md:h-full md:top-0 md:right-0 bg-gradient-to-t md:bg-gradient-to-l' 
          : 'top-0 h-8 w-full md:w-8 md:h-full md:bottom-0 md:left-0 bg-gradient-to-b md:bg-gradient-to-r'} 
        from-black/10 to-transparent`} 
      />

      {/* Content Area - Responsive Padding */}
      <div className="flex-1 p-4 pb-8 md:p-8 md:pb-12 relative z-0 overflow-y-auto md:overflow-visible scrollbar-hide">
        {children}
      </div>

      {/* Page Number */}
      <div className="absolute bottom-2 md:bottom-3 w-full text-center text-gray-400 font-handwriting text-xs md:text-sm">
        {pageNumber}
      </div>
    </div>
  );
};
