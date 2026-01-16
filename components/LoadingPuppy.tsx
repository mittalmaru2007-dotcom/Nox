
import React from 'react';

interface LoadingPuppyProps {
  darkMode: boolean;
}

const LoadingPuppy: React.FC<LoadingPuppyProps> = ({ darkMode }) => {
  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-all animate-in fade-in duration-300 ${darkMode ? 'bg-slate-950/80' : 'bg-slate-50/80'} backdrop-blur-sm`}>
      <div className="relative w-64 h-64 flex flex-col items-center justify-center">
        {/* Cute Puppy SVG with tail wag animation */}
        <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-2xl">
          <style>
            {`
              @keyframes wag {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(25deg); }
                100% { transform: rotate(0deg); }
              }
              @keyframes blink {
                0%, 100% { transform: scaleY(1); }
                5% { transform: scaleY(0.1); }
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
              .tail {
                animation: wag 0.4s infinite ease-in-out;
                transform-origin: 80px 145px;
              }
              .eye {
                animation: blink 4s infinite;
                transform-origin: center;
              }
              .puppy {
                animation: bounce 1s infinite ease-in-out;
              }
            `}
          </style>
          
          <g className="puppy">
            {/* Tail */}
            <path className="tail" d="M80,145 Q65,130 50,150" fill="none" stroke="#6366f1" strokeWidth="12" strokeLinecap="round" />
            
            {/* Body */}
            <rect x="70" y="100" width="80" height="60" rx="30" fill="#indigo-600" className={darkMode ? 'fill-indigo-500' : 'fill-indigo-600'} />
            
            {/* Head */}
            <circle cx="140" cy="90" r="45" fill="#indigo-700" className={darkMode ? 'fill-indigo-400' : 'fill-indigo-700'} />
            
            {/* Ears */}
            <ellipse cx="105" cy="70" rx="15" ry="25" fill="#4338ca" transform="rotate(-30 105 70)" />
            <ellipse cx="175" cy="70" rx="15" ry="25" fill="#4338ca" transform="rotate(30 175 70)" />
            
            {/* Eyes */}
            <circle className="eye" cx="125" cy="85" r="5" fill="white" />
            <circle className="eye" cx="155" cy="85" r="5" fill="white" />
            
            {/* Nose */}
            <circle cx="140" cy="105" r="4" fill="#1e1b4b" />
            
            {/* Paws */}
            <circle cx="85" cy="160" r="10" fill="#4338ca" />
            <circle cx="135" cy="160" r="10" fill="#4338ca" />
          </g>
        </svg>

        <div className="mt-8 text-center space-y-2">
          <h3 className={`text-xl font-serif font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>Mr. M is fetching your lesson...</h3>
          <p className={`text-sm tracking-widest font-bold uppercase opacity-60 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}> Buddy is working hard</p>
          <div className="flex gap-1 justify-center mt-4">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPuppy;
