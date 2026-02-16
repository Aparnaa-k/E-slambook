import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Plus, Image as ImageIcon, Save, Loader2, X, Eraser, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { BookCover } from './BookCover';
import { BookPage } from './BookPage';
import { Sticker } from './Sticker';
import { SecretFlap } from './SecretFlap';
import { Tape, PaperClip, CoffeeStain, PolaroidFrame, Doodles } from './Decorations';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

// Types
export interface FriendEntry {
  id: string;
  name: string;
  nickname: string;
  zodiac: string;
  favorites: {
    color: string;
    food: string;
    song: string;
    hobby: string;
  };
  schoolMemory: string;
  embarrassingMoment: string;
  futureGoal: string;
  dreamVacation: string;
  bestAdvice: string;
  observation: string;
  secretMessage: string;
  message: string;
  photoUrl?: string; 
  signature?: string;
  stickers: string[];
}

const EMPTY_ENTRY: FriendEntry = {
  id: '',
  name: '',
  nickname: '',
  zodiac: '',
  favorites: {
    color: '',
    food: '',
    song: '',
    hobby: '',
  },
  schoolMemory: '',
  embarrassingMoment: '',
  futureGoal: '',
  dreamVacation: '',
  bestAdvice: '',
  observation: '',
  secretMessage: '',
  message: '',
  photoUrl: undefined,
  signature: undefined,
  stickers: ['✨', '🎈']
};

interface SlamBookContainerProps {
  coverImage?: string;
}

// Signature Canvas Component
const SignaturePad: React.FC<{ value?: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = '#1e293b'; // slate-800
        setCtx(context);
        
        // Load existing signature if present
        if (value) {
           const img = new Image();
           img.onload = () => context.drawImage(img, 0, 0);
           img.src = value;
        }
      }
    }
  }, []); // Run once on mount

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) {
      ctx.beginPath();
      // Save signature
      if (canvasRef.current) {
         onChange(canvasRef.current.toDataURL());
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;

    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
       x = e.touches[0].clientX - rect.left;
       y = e.touches[0].clientY - rect.top;
    } else {
       x = e.nativeEvent.offsetX;
       y = e.nativeEvent.offsetY;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = (e: React.MouseEvent) => {
     e.stopPropagation();
     if (ctx && canvasRef.current) {
         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
         onChange('');
     }
  };

  return (
    <div className="relative group/sig border-2 border-dashed border-slate-300 rounded bg-white/50 hover:border-indigo-300 transition-colors">
      <canvas
        ref={canvasRef}
        width={250}
        height={80}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="touch-none cursor-crosshair w-full h-full"
      />
      <div className="absolute top-1 right-1 opacity-0 group-hover/sig:opacity-100 transition-opacity">
         <button onClick={clear} className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200" title="Clear Signature">
            <Eraser size={12} />
         </button>
      </div>
      {!value && !isDrawing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs font-typewriter">
           Sign Here
        </div>
      )}
    </div>
  );
};

// Editable Content Component
const EditablePageContent: React.FC<{ 
  entry: FriendEntry; 
  side: 'left' | 'right'; 
  onUpdate: (updatedEntry: FriendEntry) => void;
  onSave: () => void;
  isSaving: boolean;
  onPhotoClick?: (url: string) => void;
}> = ({ entry, side, onUpdate, onSave, isSaving, onPhotoClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!entry) return <div className="h-full flex items-center justify-center text-slate-400 font-typewriter">Empty Page</div>;

  const handleChange = (field: keyof FriendEntry, value: string) => {
    onUpdate({ ...entry, [field]: value });
  };

  const handleFavoriteChange = (field: keyof FriendEntry['favorites'], value: string) => {
    onUpdate({
      ...entry,
      favorites: {
        ...entry.favorites,
        [field]: value
      }
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-815bcb4c/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        });

        const data = await response.json();
        
        if (data.error) {
           toast.error(data.error);
        } else if (data.url) {
           onUpdate({ ...entry, photoUrl: data.url });
           toast.success("Photo uploaded!");
        }
      } catch (error) {
        console.error('Upload failed', error);
        toast.error("Failed to upload photo");
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (side === 'left') {
    return (
      <div className="h-full flex flex-col relative">
        <CoffeeStain className="bottom-0 left-0 w-32 h-32 opacity-5" />
        
        {/* Header Section */}
        <div className="relative mb-6 pt-2">
          {/* Paperclip */}
          <PaperClip className="-top-6 right-8 text-zinc-300 transform rotate-6" />
          
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2 border-b-2 border-slate-800 pb-1 border-dashed relative">
               <span className="font-typewriter font-bold text-slate-500 text-sm uppercase tracking-widest shrink-0">Name:</span>
               <input
                type="text"
                value={entry.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="font-handwriting text-3xl font-bold text-indigo-700 bg-transparent border-none focus:outline-none w-full transform -rotate-1 placeholder-indigo-300/50"
                placeholder="Name Here"
              />
            </div>
            
            <div className="flex justify-between items-start mt-2">
               <div className="flex items-center gap-2 flex-1">
                  <span className="font-typewriter text-slate-500 text-xs uppercase tracking-wide">AKA:</span>
                  <input
                    type="text"
                    value={entry.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    placeholder="Nickname"
                    className="font-handwriting text-xl text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-400 focus:outline-none w-full"
                  />
               </div>
               
               <div className="ml-4 transform rotate-2">
                  <span className="font-typewriter text-[10px] text-slate-400 block text-center mb-1">ZODIAC</span>
                  <input
                    type="text"
                    value={entry.zodiac}
                    onChange={(e) => handleChange('zodiac', e.target.value)}
                    placeholder="Sign"
                    className="font-handwriting px-3 py-1 bg-white border-2 border-slate-200 rounded-sm text-purple-700 font-bold shadow-sm w-24 text-center focus:outline-none focus:border-purple-300"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Scrapbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative z-10">
          {/* Note Card 1 */}
          <div className="bg-[#fff9c4] p-4 shadow-sm relative transform -rotate-1" style={{ clipPath: 'polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)' }}>
             <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
             <h4 className="font-typewriter font-bold text-slate-700 mb-2 text-xs uppercase border-b border-slate-300 pb-1">Favorites</h4>
             <ul className="space-y-1">
               {['color', 'food', 'song', 'hobby'].map((item) => (
                 <li key={item} className="flex flex-col gap-0">
                   <span className="font-typewriter text-[10px] text-slate-500 uppercase">{item}</span>
                   <input
                     type="text"
                     value={(entry.favorites as any)[item]}
                     onChange={(e) => handleFavoriteChange(item as any, e.target.value)}
                     className="font-handwriting text-lg text-indigo-800 bg-transparent border-b border-slate-300/50 focus:border-indigo-400 focus:outline-none w-full -mt-1"
                   />
                 </li>
               ))}
             </ul>
          </div>
          
          {/* Note Card 2 */}
          <div className="bg-[#e3f2fd] p-4 shadow-sm relative transform rotate-1" style={{ clipPath: 'polygon(2% 0%, 98% 1%, 100% 99%, 0% 100%)' }}>
             <Tape className="-top-3 right-4 -rotate-3" />
             <h4 className="font-typewriter font-bold text-slate-700 mb-2 text-xs uppercase border-b border-slate-300 pb-1">Dreams</h4>
             <div className="space-y-3">
               <div>
                  <span className="font-typewriter text-[10px] text-slate-500 uppercase block">Future Goal</span>
                  <input
                    type="text"
                    value={entry.futureGoal}
                    onChange={(e) => handleChange('futureGoal', e.target.value)}
                    className="font-handwriting text-lg text-indigo-800 bg-transparent border-b border-slate-300/50 focus:border-indigo-400 focus:outline-none w-full"
                  />
               </div>
               <div>
                  <span className="font-typewriter text-[10px] text-slate-500 uppercase block">Dream Trip</span>
                  <input
                    type="text"
                    value={entry.dreamVacation}
                    onChange={(e) => handleChange('dreamVacation', e.target.value)}
                    className="font-handwriting text-lg text-indigo-800 bg-transparent border-b border-slate-300/50 focus:border-indigo-400 focus:outline-none w-full"
                  />
               </div>
             </div>
          </div>
        </div>

        {/* Memories - Torn Paper Style */}
        <div className="relative mb-2">
           <div className="bg-white p-3 shadow relative border border-slate-100">
             <div className="absolute -left-2 top-4 w-4 h-full border-r-2 border-dotted border-slate-300/50" />
             <span className="font-typewriter font-bold text-pink-600 text-xs uppercase block mb-1">Best Memory:</span>
             <textarea
               value={entry.schoolMemory}
               onChange={(e) => handleChange('schoolMemory', e.target.value)}
               className="w-full bg-transparent border-none focus:outline-none font-handwriting text-xl text-slate-800 resize-none overflow-hidden leading-relaxed"
               rows={2}
               style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 32px)', lineHeight: '32px' }}
             />
           </div>
        </div>

        {/* Secret Flap */}
        <SecretFlap 
          value={entry.secretMessage} 
          onChange={(val) => handleChange('secretMessage', val)} 
        />
        
        <Doodles type="star" className="bottom-20 right-4 rotate-12" />
      </div>
    );
  }

  // Right Side Content
  return (
    <div className="h-full flex flex-col relative">
       <CoffeeStain className="top-10 right-10 w-48 h-48 opacity-5 rotate-90" />
      
      {/* Title */}
      <h3 className="font-typewriter font-bold text-slate-500 mb-4 transform rotate-1 text-center border-b-4 border-double border-slate-200 inline-block mx-auto px-8 py-1">
        MESSAGE BOARD
      </h3>

      {/* New Fields Section */}
      <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-pink-50 p-2 rounded border border-pink-100 relative">
             <span className="block text-[9px] font-typewriter text-pink-400 uppercase tracking-wider mb-1">What I observed in you:</span>
             <textarea
                value={entry.observation}
                onChange={(e) => handleChange('observation', e.target.value)}
                className="w-full bg-transparent border-b border-pink-200 focus:border-pink-400 focus:outline-none font-handwriting text-sm text-slate-700 resize-none h-16 leading-5"
             />
          </div>
          <div className="bg-yellow-50 p-2 rounded border border-yellow-100 relative">
             <span className="block text-[9px] font-typewriter text-yellow-600 uppercase tracking-wider mb-1">Best Advice for Future:</span>
             <textarea
                value={entry.bestAdvice}
                onChange={(e) => handleChange('bestAdvice', e.target.value)}
                className="w-full bg-transparent border-b border-yellow-200 focus:border-yellow-400 focus:outline-none font-handwriting text-sm text-slate-700 resize-none h-16 leading-5"
             />
          </div>
      </div>

      <div className="flex-1 relative group p-4 border-2 border-slate-200 rounded-sm bg-white/50 mb-2">
        <textarea
          value={entry.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Leave a note..."
          className="w-full h-full bg-transparent border-none focus:outline-none font-handwriting text-xl leading-relaxed text-indigo-900 drop-shadow-sm resize-none relative z-10"
          style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #dbeafe 40px)', lineHeight: '40px', paddingTop: '4px' }}
        />

        {/* Stickers Area */}
        <div className="absolute bottom-4 left-4 flex gap-4 z-20">
          {entry.stickers.map((emoji, idx) => (
            <Sticker key={idx} rotation={idx % 2 === 0 ? 10 : -10} className="bg-white border-2 border-white shadow-md">
              <span className="text-3xl">{emoji}</span>
            </Sticker>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-2 pt-2 flex justify-between items-end px-1 gap-2">
        <div className="flex flex-col gap-3 flex-1">
           {/* Signature Block */}
           <div className="flex flex-col gap-1 w-full max-w-[200px]">
              <div className="flex items-center gap-2">
                  <span className="text-[10px] font-typewriter text-slate-400 uppercase">Signed:</span>
                  <PenTool size={10} className="text-slate-300" />
              </div>
              <SignaturePad 
                 value={entry.signature}
                 onChange={(val) => handleChange('signature', val)}
              />
           </div>
           
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-typewriter text-slate-400">DATE: {new Date().toLocaleDateString()}</span>
               <button 
                 onClick={onSave}
                 disabled={isSaving}
                 className="px-3 py-1.5 bg-green-700 text-white rounded-sm shadow-md hover:bg-green-600 font-typewriter text-[10px] font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-green-800"
               >
                 {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                 SAVE
               </button>
           </div>
        </div>
        
        {/* Polaroid Photo Upload */}
        <div className="relative group/photo transform -rotate-3 hover:rotate-0 transition-transform duration-300 shrink-0">
          <Tape className="-top-3 left-1/2 -translate-x-1/2 w-16 opacity-80 h-6" />
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <div 
            onClick={() => {
              if (entry.photoUrl) {
                onPhotoClick?.(entry.photoUrl);
              } else {
                !isUploading && fileInputRef.current?.click();
              }
            }}
            className="bg-white p-1 pb-6 shadow-lg cursor-pointer w-24 h-28 flex items-center justify-center border border-slate-100"
          >
            <div className="bg-slate-100 w-full h-full shadow-inner overflow-hidden flex items-center justify-center relative">
               {isUploading ? (
                  <Loader2 className="animate-spin text-slate-400" size={16} />
                ) : entry.photoUrl ? (
                  <>
                     <img src={entry.photoUrl} alt="User Upload" className="w-full h-full object-cover" />
                     <div 
                       onClick={(e) => {
                         e.stopPropagation();
                         fileInputRef.current?.click();
                       }}
                       className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity"
                     >
                       <span className="text-white text-[8px] font-typewriter font-bold uppercase">Replace</span>
                     </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="text-slate-300" size={16} />
                    <span className="text-[8px] text-slate-400 font-typewriter mt-1">PHOTO</span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      
      <Doodles type="heart" className="top-4 left-4 -rotate-12" />
    </div>
  );
};

export const SlamBookContainer: React.FC<SlamBookContainerProps> = ({ coverImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<FriendEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [originalNicknames, setOriginalNicknames] = useState<Record<string, string>>({});
  const [savingState, setSavingState] = useState<Record<string, boolean>>({});

  // Lightbox State
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // Swipe Gestures
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-815bcb4c/entries`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (data.entries) {
        setEntries(data.entries);
        const map: Record<string, string> = {};
        data.entries.forEach((e: FriendEntry) => {
          map[e.id] = e.nickname;
        });
        setOriginalNicknames(map);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentSpread(0);
      setDirection(null);
      setIsAnimating(false);
    }
  }, [isOpen]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleNext = () => {
    if (currentSpread < entries.length - 1 && !isAnimating) {
      setDirection('next');
      setIsAnimating(true);
    }
  };

  const handlePrev = () => {
    if (currentSpread > 0 && !isAnimating) {
      setDirection('prev');
      setIsAnimating(true);
    }
  };

  const handleAddPage = () => {
    const newId = crypto.randomUUID();
    const newEntry = { ...EMPTY_ENTRY, id: newId };
    setEntries([...entries, newEntry]);
    setTimeout(() => {
      setCurrentSpread(entries.length); 
    }, 0);
  };

  const handleUpdateEntry = (index: number, updatedEntry: FriendEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updatedEntry;
    setEntries(newEntries);
  };

  const handleSaveEntry = async (entry: FriendEntry) => {
    if (!entry.nickname) {
      toast.error("Nickname is required!");
      return;
    }

    const oldNickname = originalNicknames[entry.id];
    setSavingState(prev => ({ ...prev, [entry.id]: true }));

    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-815bcb4c/entries`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entry, oldNickname })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      toast.success("Page saved successfully!");
      
      // Confetti Blast
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#FF69B4', '#FFD700', '#00BFFF', '#32CD32']
      });

      setOriginalNicknames(prev => ({ ...prev, [entry.id]: entry.nickname }));

    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSavingState(prev => ({ ...prev, [entry.id]: false }));
    }
  };

  const onAnimationEnd = () => {
    setIsAnimating(false);
    if (direction === 'next') {
      setCurrentSpread(prev => prev + 1);
    } else if (direction === 'prev') {
      setCurrentSpread(prev => prev - 1);
    }
    setDirection(null);
  };

  const activeIndex = currentSpread;
  const nextIndex = direction === 'next' ? activeIndex + 1 : activeIndex - 1;
  
  const renderPage = (index: number, side: 'left' | 'right') => {
    const entry = entries[index];
    if (!entry) return <div className="h-full flex items-center justify-center text-slate-400">End of Book</div>;
    return (
      <EditablePageContent 
        entry={entry} 
        side={side} 
        onUpdate={(updated) => handleUpdateEntry(index, updated)} 
        onSave={() => handleSaveEntry(entry)}
        isSaving={savingState[entry.id] || false}
        onPhotoClick={(url) => setLightboxPhoto(url)}
      />
    );
  };

  let staticLeftContent = null;
  let staticRightContent = null;
  let flipperFrontContent = null;
  let flipperBackContent = null;
  let animationClass = '';
  
  if (direction === 'next') {
    staticLeftContent = renderPage(activeIndex, 'left');
    staticRightContent = renderPage(nextIndex, 'right');
    
    flipperFrontContent = renderPage(activeIndex, 'right');
    flipperBackContent = renderPage(nextIndex, 'left');
    
    animationClass = 'animate-flip-next';
  } else if (direction === 'prev') {
    staticLeftContent = renderPage(nextIndex, 'left');
    staticRightContent = renderPage(activeIndex, 'right');
    
    flipperFrontContent = renderPage(nextIndex, 'right');
    flipperBackContent = renderPage(activeIndex, 'left');
    
    animationClass = 'animate-flip-prev';
  } else {
    staticLeftContent = renderPage(activeIndex, 'left');
    staticRightContent = renderPage(activeIndex, 'right');
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxPhoto && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxPhoto(null)}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, rotate: 5 }}
                className="bg-white p-4 pb-12 rounded shadow-2xl max-w-lg w-full transform rotate-2 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Tape className="-top-6 left-1/2 -translate-x-1/2 rotate-2 scale-150" />
                <div className="w-full aspect-square bg-slate-100 mb-4 overflow-hidden rounded-sm border border-slate-200">
                  <img src={lightboxPhoto} alt="Memory" className="w-full h-full object-cover" />
                </div>
                <div className="text-center font-handwriting text-3xl text-slate-700">
                  A moment to remember...
                </div>
                
                <button 
                  onClick={() => setLightboxPhoto(null)}
                  className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500"
                >
                  <X size={20} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen ? (
          <div className="w-full flex justify-center animate-book-appear">
            <BookCover onOpen={() => setIsOpen(true)} coverImage={coverImage} />
          </div>
        ) : (
          <div 
             className="relative w-full max-w-5xl aspect-[3/2] md:aspect-[2/1.4] animate-book-appear"
             onTouchStart={onTouchStart}
             onTouchMove={onTouchMove}
             onTouchEnd={onTouchEnd}
          >
             
             {/* Main Book Structure */}
            <div className="relative w-full h-full perspective-1500">
               <div className="absolute inset-0 bg-[#2a1a10] rounded-lg shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#3d2315] rounded-lg" />
               </div>

               {loading ? (
                 <div className="absolute inset-2 flex items-center justify-center bg-[#fdfbf7] rounded z-50">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 size={40} className="animate-spin text-indigo-600" />
                       <span className="font-handwriting text-xl text-indigo-800">Opening Slam Book...</span>
                    </div>
                 </div>
               ) : (
                 <div className="absolute inset-2 flex transform-style-3d">
                   <div className="flex-1 relative z-0">
                      <BookPage pageNumber={direction === 'prev' ? (nextIndex * 2) + 1 : (activeIndex * 2) + 1} side="left">
                        {staticLeftContent}
                      </BookPage>
                   </div>

                   <div className="w-0 relative z-10 border-l border-slate-300" />

                   <div className="flex-1 relative z-0">
                      <BookPage pageNumber={direction === 'next' ? (nextIndex * 2) + 2 : (activeIndex * 2) + 2} side="right">
                        {staticRightContent}
                      </BookPage>
                   </div>

                   {isAnimating && (
                     <div 
                        className={`absolute left-1/2 top-0 bottom-0 w-1/2 transform-style-3d origin-left ${animationClass}`}
                        onAnimationEnd={onAnimationEnd}
                     >
                        <div className="absolute inset-0 backface-hidden z-20">
                           <BookPage pageNumber={direction === 'prev' ? (nextIndex * 2) + 2 : (activeIndex * 2) + 2} side="right">
                              {flipperFrontContent}
                              <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
                           </BookPage>
                        </div>

                        <div className="absolute inset-0 backface-hidden rotate-y-180 z-20">
                           <BookPage pageNumber={direction === 'next' ? (nextIndex * 2) + 1 : (activeIndex * 2) + 1} side="left">
                              {flipperBackContent}
                              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
                           </BookPage>
                        </div>
                     </div>
                   )}
                 </div>
               )}
            </div>

            {/* Controls */}
            <div className="absolute -bottom-16 w-full flex justify-between items-center px-4 z-50">
               <div className="flex items-center gap-2">
                 <button 
                   onClick={handlePrev} 
                   disabled={currentSpread === 0 || isAnimating || loading}
                   className={`p-3 rounded-full bg-white shadow-lg text-slate-700 transition-all duration-200 ${currentSpread === 0 || isAnimating || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:scale-110 active:scale-95'}`}
                 >
                   <ChevronLeft size={24} />
                 </button>
               </div>

               <div className="flex items-center gap-4">
                  <button 
                    onClick={handleAddPage}
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <Plus size={18} /> New Page
                  </button>

                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                  >
                    <RotateCcw size={16} /> Close Book
                  </button>
               </div>

               <div className="flex items-center gap-2">
                 <button 
                   onClick={handleNext}
                   disabled={currentSpread >= entries.length - 1 || isAnimating || loading}
                   className={`p-3 rounded-full bg-white shadow-lg text-slate-700 transition-all duration-200 ${currentSpread >= entries.length - 1 || isAnimating || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:scale-110 active:scale-95'}`}
                 >
                   <ChevronRight size={24} />
                 </button>
               </div>
            </div>
          </div>
        )}
    </div>
  );
};
