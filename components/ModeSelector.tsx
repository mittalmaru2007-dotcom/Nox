
import React from 'react';
import { AcademicMode } from '../types';

interface ModeSelectorProps {
  onSelect: (mode: AcademicMode) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect, darkMode, setDarkMode }) => {
  const modes: { id: AcademicMode; title: string; desc: string; icon: string; color: string }[] = [
    { 
      id: '11th', 
      title: 'Class 11th Foundations', 
      desc: 'Master the basics of Accounting, Economics and Business Studies following NCERT curriculum.', 
      icon: '🎓', 
      color: 'from-emerald-500 to-teal-600' 
    },
    { 
      id: '12th', 
      title: 'Class 12th Board Mastery', 
      desc: 'Intensive board preparation, advanced NCERT concepts, and high-performance business analysis.', 
      icon: '🏆', 
      color: 'from-indigo-500 to-blue-600' 
    },
    { 
      id: 'BBA', 
      title: 'BBA Professional', 
      desc: 'Management theories, corporate foundations, and professional skills for undergraduate success.', 
      icon: '🏢', 
      color: 'from-purple-500 to-indigo-600' 
    },
    { 
      id: 'MBA', 
      title: 'MBA Executive Strategy', 
      desc: 'Advanced leadership, CXO-level strategy, global business modeling, and high-stakes case studies.', 
      icon: '💎', 
      color: 'from-amber-500 to-orange-600' 
    },
  ];

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="absolute top-8 right-8">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-xl transition-colors ${darkMode ? 'bg-slate-900 text-amber-400 hover:bg-slate-800' : 'bg-white text-slate-600 shadow-md hover:bg-slate-50'}`}
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>
      </div>

      <div className="max-w-4xl w-full text-center">
        <div className="mb-12">
          <h1 className={`text-5xl font-serif font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Choose Your Academic Focus</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-lg max-w-2xl mx-auto`}>
            Select your professional path. Your mentor will automatically adjust their knowledge base and tone to your level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={`group relative text-left p-8 rounded-3xl border transition-all duration-300 overflow-hidden hover:scale-[1.02] hover:shadow-2xl ${
                darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl -mr-16 -mt-16 rounded-full`}></div>
              
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {mode.icon}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{mode.title}</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{mode.desc}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] group-hover:gap-4 transition-all">
                Select This Track <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
