
import React from 'react';
import { AcademicMode } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: 'chat' | 'notes' | 'tasks' | 'vault' | 'curriculum' | 'roadmap';
  setActiveTab: (tab: 'chat' | 'notes' | 'tasks' | 'vault' | 'curriculum' | 'roadmap') => void;
  onReset: () => void;
  taskCount: number;
  darkMode: boolean;
  academicMode: AcademicMode;
  onSwitchMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, setActiveTab, onReset, taskCount, darkMode, academicMode, onSwitchMode }) => {
  const navItemClass = (tab: typeof activeTab) => `
    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
    ${activeTab === tab 
      ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-[1.02]' 
      : 'hover:bg-indigo-900/40 text-indigo-300 hover:scale-[1.02] hover:text-white hover:shadow-[0_0_15px_rgba(79,70,229,0.2)]'
    }
  `;

  return (
    <div className={`bg-indigo-950 text-indigo-100 w-64 flex flex-col shrink-0 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full absolute z-50 h-full'}`}>
      <div className="p-6 flex flex-col h-full">
        <div className="mb-10">
          <div className="bg-indigo-900/40 p-4 rounded-xl mb-6 border border-indigo-800 transition-all hover:border-indigo-500/50">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Track</span>
                <button onClick={onSwitchMode} className="text-[10px] text-indigo-500 hover:text-white transition-colors underline decoration-indigo-800 underline-offset-4 hover:decoration-indigo-400">Change</button>
             </div>
             <p className="text-xl font-serif text-white font-bold">{academicMode}</p>
          </div>

          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 px-2 opacity-60">Core Modalities</h2>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('chat')} className={navItemClass('chat')}>
              <svg className="w-5 h-5 transition-transform group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              <span className="font-medium">Direct Mentorship</span>
            </button>
            <button onClick={() => setActiveTab('roadmap')} className={navItemClass('roadmap')}>
              <svg className="w-5 h-5 transition-transform group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.483V6a2 2 0 011.236-1.843l5.447-2.724a2 2 0 011.634 0l5.447 2.724A2 2 0 0118 6v9.483a2 2 0 01-1.236 1.843L11.317 20a2 2 0 01-1.634 0z"></path></svg>
              <span className="font-medium">AI Strategy Roadmap</span>
            </button>
            <button onClick={() => setActiveTab('curriculum')} className={navItemClass('curriculum')}>
              <svg className="w-5 h-5 transition-transform group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <span className="font-medium">Explore Curriculum</span>
            </button>
            <button onClick={() => setActiveTab('vault')} className={navItemClass('vault')}>
              <svg className="w-5 h-5 transition-transform group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
              <span className="font-medium">Study Vault (PDFs)</span>
            </button>
            <button onClick={() => setActiveTab('tasks')} className={navItemClass('tasks')}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 transition-transform group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                <span className="font-medium">Tasks & Goals</span>
              </div>
              {taskCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">{taskCount}</span>}
            </button>
          </nav>
        </div>

        <div className="mt-auto">
          <div className="mb-6 pt-6 border-t border-indigo-900/50">
            <button onClick={onReset} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-indigo-400 hover:text-red-400 text-sm transition-all italic hover:bg-red-950/20 group">
              <span className="opacity-50 group-hover:opacity-100 uppercase text-[10px] font-bold tracking-widest">Wipe Academic Record</span>
            </button>
          </div>
          <div className="bg-indigo-900/40 p-4 rounded-xl text-center border border-indigo-800 transition-all hover:shadow-[0_0_15px_rgba(79,70,229,0.25)]">
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Mr. M Status: Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
