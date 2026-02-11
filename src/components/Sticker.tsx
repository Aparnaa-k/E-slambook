import React from 'react';

interface StickerProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
}

export const Sticker: React.FC<StickerProps> = ({ children, className = '', rotation = 0 }) => {
  return (
    <div
      className={`absolute inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-sm border border-white/20 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-md hover:bg-white/20 hover:z-50 ${className}`}
      style={{ 
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
};
