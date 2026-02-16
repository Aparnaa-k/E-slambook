import React from 'react';
import { Heart, Lock } from 'lucide-react';
import { Sticker } from './Sticker';
import { Rhinestone, DenimPatch, Doodles } from './Decorations';

interface BookCoverProps {
  onOpen: () => void;
  coverImage?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpen, coverImage }) => {
  const glitterUrl = "https://images.unsplash.com/photo-1656055448477-94f0757aa0d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBnbGl0dGVyJTIwdGV4dHVyZXxlbnwxfHx8fDE3NzA3OTQ5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000 group">
      <div 
        className="relative w-[340px] md:w-[400px] h-[480px] md:h-[600px] rounded-r-3xl rounded-l-md shadow-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:-rotate-y-6 md:hover:-rotate-y-12"
        style={{
          boxShadow: '25px 25px 60px rgba(0,0,0,0.5), inset 2px 0 5px rgba(255,255,255,0.2)',
        }}
        onClick={onOpen}
      >
        {/* Plain Black Background */}
        <div className="absolute inset-0 bg-[#111111]">
            {/* Subtle lighting gradient to give it form */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/60 pointer-events-none" />
             {/* Subtle noise texture for realism */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]" />
        </div>

        {/* Glitter Spine */}
        <div 
            className="absolute top-0 bottom-0 left-0 w-12 md:w-16 z-20 shadow-xl border-r border-black/20"
            style={{
                backgroundImage: `url(${glitterUrl})`,
                backgroundSize: 'cover'
            }}
        >
            <div className="absolute inset-0 bg-pink-500/20 mix-blend-color" />
        </div>
        
        {/* Stitching Line near spine */}
        <div className="absolute top-0 bottom-0 left-12 md:left-16 border-l-2 border-dashed border-white/20 z-20 h-full" />
        <div className="absolute top-0 bottom-0 left-14 md:left-[70px] border-l-2 border-dashed border-white/20 z-20 h-full" />

        {/* Content Layer */}
        <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8 pl-20">
            
            {/* Title Patch */}
            <div className="transform -rotate-6 mb-8 relative group/title">
                <DenimPatch className="rounded-xl w-64 md:w-72 bg-indigo-700">
                    <div className="flex flex-col items-center justify-center py-4">
                        <h1 className="text-4xl md:text-5xl font-handwriting font-bold text-pink-300 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] stroke-black tracking-widest"
                            style={{ WebkitTextStroke: '1px #4a044e' }}
                        >
                            SLAM
                        </h1>
                        <h1 className="text-5xl md:text-6xl font-handwriting font-bold text-yellow-300 drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)] stroke-black -mt-4 tracking-tighter"
                            style={{ WebkitTextStroke: '1px #422006' }}
                        >
                            BOOK
                        </h1>
                    </div>
                </DenimPatch>
                
                {/* Rhinestones on the patch corners */}
                <Rhinestone className="w-4 h-4 top-2 left-2" color="#ec4899" />
                <Rhinestone className="w-4 h-4 top-2 right-2" color="#ec4899" />
                <Rhinestone className="w-4 h-4 bottom-2 left-2" color="#ec4899" />
                <Rhinestone className="w-4 h-4 bottom-2 right-2" color="#ec4899" />
            </div>

            {/* Subtitle / Owner */}
            <div className="bg-white/90 transform rotate-2 p-3 shadow-lg relative max-w-[200px] w-full mx-auto">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-400/80 w-24 h-6 transform -rotate-2" /> {/* Washi Tape */}
                <p className="font-typewriter text-xs text-center text-slate-500 mb-1">THIS BOOK BELONGS TO:</p>
                <div className="font-handwriting text-2xl text-center text-indigo-800 border-b-2 border-dotted border-indigo-300 min-h-[30px]">
                   Aparnaa!
                </div>
            </div>

            {/* Interactive Lock Button */}
            <div className="mt-12 relative group/lock">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                    className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-xl border-4 border-yellow-200 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group-hover/lock:animate-pulse"
                >
                    <Lock className="text-yellow-950 w-8 h-8" />
                </button>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-8 w-1 h-8 bg-yellow-600/50" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 px-2 py-1 rounded">
                    Tap to Open
                </span>
            </div>
        </div>

        {/* Decorative Stickers everywhere */}
        <Sticker className="absolute top-4 right-4 z-40 bg-white p-1 shadow-md border-white border-2" rotation={10}>
            <Heart className="fill-red-500 text-red-500 w-10 h-10" />
        </Sticker>
        
        <Sticker className="absolute bottom-20 left-16 z-40" rotation={-15}>
             <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full border-2 border-black text-xs uppercase shadow-lg">
                 Friends 4Ever
             </div>
        </Sticker>
        
        <Sticker className="absolute top-1/2 right-2 z-40" rotation={25}>
             <Doodles type="flower" className="w-12 h-12 relative !opacity-100 !text-pink-500" />
        </Sticker>
        
        <Sticker className="absolute bottom-4 right-10 z-40" rotation={-5}>
            <div className="bg-green-400 text-green-900 font-bold px-2 py-2 rounded-lg border-dashed border-2 border-white shadow-lg text-[10px] uppercase text-center w-20 leading-tight">
                Top Secret!
            </div>
        </Sticker>

        {/* Scattered Rhinestones */}
        <Rhinestone className="w-3 h-3 top-10 left-20" color="#60a5fa" />
        <Rhinestone className="w-2 h-2 top-12 left-24" color="#60a5fa" />
        <Rhinestone className="w-4 h-4 bottom-32 right-8" color="#f472b6" />
        <Rhinestone className="w-3 h-3 bottom-10 left-24" color="#facc15" />
        
        {/* Side Page Thickness */}
        <div className="absolute right-0 top-[2%] bottom-[2%] w-4 md:w-6 bg-[#fdfbf7] rounded-r-sm transform translate-x-2 translate-z-[-10px] shadow-lg flex flex-col border-r border-slate-300"
           style={{
             background: 'repeating-linear-gradient(to right, #fdfbf7 0px, #e5e5e5 1px, #fdfbf7 2px)'
           }}
        />
      </div>
    </div>
  );
};
