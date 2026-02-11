import React from 'react';
import { SlamBookContainer } from './components/SlamBookContainer';
import { Toaster } from 'sonner@2.0.3';

const App = () => {
  // Using the leather texture for cover, and wood for background
  const woodBackgroundUrl = "https://images.unsplash.com/photo-1673924968581-c18b53d64e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB0YWJsZSUyMHRvcCUyMHZpZXd8ZW58MXx8fHwxNzcwNzkzMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden"
      style={{
        backgroundColor: '#e2d4b7', // Fallback color
        backgroundImage: `url(${woodBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Toaster position="top-center" richColors />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Indie+Flower&family=Patrick+Hand&family=Courier+Prime:wght@400;700&family=Permanent+Marker&display=swap');
          
          .font-handwriting {
            font-family: 'Permanent Marker', 'Patrick Hand', 'Caveat', cursive;
          }
          
          .font-typewriter {
            font-family: 'Courier Prime', monospace;
          }

          /* 3D Utilities */
          .perspective-1500 {
            perspective: 1500px;
          }
          
          .perspective-1000 {
            perspective: 1000px;
          }
          
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          
          .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          
          .origin-left {
            transform-origin: left center;
          }

          /* Animations */
          @keyframes flipNext {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(-180deg); }
          }

          @keyframes flipPrev {
            0% { transform: rotateY(-180deg); }
            100% { transform: rotateY(0deg); }
          }
          
          .animate-flip-next {
            animation: flipNext 1s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards;
          }
          
          .animate-flip-prev {
            animation: flipPrev 1s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards;
          }

          /* Open Book Animation */
          @keyframes bookOpen {
             0% { opacity: 0; transform: scale(0.9) translateY(20px); }
             100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          
          .animate-book-appear {
            animation: bookOpen 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .translate-z-10 {
            transform: translateZ(10px);
          }
        `}
      </style>
      
      {/* Overlay to darken background slightly for better contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Scattered background items could go here if we wanted */}

      <div className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        <SlamBookContainer />
      </div>
    </div>
  );
};

export default App;
