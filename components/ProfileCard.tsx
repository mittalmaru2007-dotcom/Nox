
import React, { useState } from 'react';
import { UserProfile, MentorVoice } from '../types';

interface ProfileCardProps {
  profile: UserProfile;
  onUpdateVoice: (voice: MentorVoice) => void;
  darkMode: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onUpdateVoice, darkMode }) => {
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);

  const voices: { id: MentorVoice; name: string; desc: string }[] = [
    { id: 'Kore', name: 'Executive Kore', desc: 'Professional, firm, and authoritative.' },
    { id: 'Zephyr', name: 'Mentor Zephyr', desc: 'Calm, intellectual, and thoughtful.' },
    { id: 'Puck', name: 'Coach Puck', desc: 'Witty, energetic, and encouraging.' },
    { id: 'Charon', name: 'Professor Charon', desc: 'Deep, wise, and highly academic.' },
    { id: 'Fenrir', name: 'Storyteller Fenrir', desc: 'Strong, narrative-driven, and engaging.' },
  ];

  return (
    <div className="relative flex items-center gap-3 pl-4 border-l transition-colors border-slate-200 dark:border-slate-800">
      <div className="text-right">
        <p className={`text-sm font-bold leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{profile.name}</p>
        <button 
          onClick={() => setShowVoiceMenu(!showVoiceMenu)}
          className={`text-[10px] font-medium uppercase tracking-tighter flex items-center gap-1 justify-end transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
        >
          Voice: {profile.preferredVoice}
          <svg className={`w-3 h-3 transition-transform ${showVoiceMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div className="w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden ml-auto">
          <div 
            className="h-full bg-indigo-600 transition-all duration-1000" 
            style={{ width: `${profile.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className={`w-10 h-10 rounded-full border-2 shadow-sm overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-white'}`}>
        <img 
          src={`https://picsum.photos/seed/${profile.name}/100/100`} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      </div>

      {showVoiceMenu && (
        <div className={`absolute top-full right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 p-3">Select Mentor Voice</p>
          <div className="space-y-1">
            {voices.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  onUpdateVoice(v.id);
                  setShowVoiceMenu(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-0.5 ${
                  profile.preferredVoice === v.id 
                    ? 'bg-indigo-600 text-white' 
                    : `hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`
                }`}
              >
                <span className="text-sm font-bold">{v.name}</span>
                <span className={`text-[10px] ${profile.preferredVoice === v.id ? 'text-indigo-100 opacity-70' : 'text-slate-400'}`}>{v.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
