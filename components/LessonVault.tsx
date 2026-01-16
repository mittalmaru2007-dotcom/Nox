
import React, { useState } from 'react';
import { PDFLesson } from '../types';

interface LessonVaultProps {
  lessons: PDFLesson[];
  darkMode: boolean;
}

const LessonVault: React.FC<LessonVaultProps> = ({ lessons, darkMode }) => {
  const [selectedLesson, setSelectedLesson] = useState<PDFLesson | null>(null);

  const printLesson = () => {
    window.print();
  };

  if (selectedLesson) {
    return (
      <div className={`h-full overflow-y-auto p-4 md:p-12 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <button 
          onClick={() => setSelectedLesson(null)}
          className="mb-8 flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs hover:translate-x-[-4px] transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Return to Folder
        </button>

        <div id="printable-area" className={`max-w-4xl mx-auto shadow-2xl rounded-sm overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-slate-900'}`}>
          {/* Executive Header */}
          <div className="bg-indigo-900 text-white p-8 md:p-12 flex justify-between items-start">
            <div>
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Subject: {selectedLesson.subject}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{selectedLesson.topic}</h1>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-serif">M</span>
              </div>
              <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">{selectedLesson.date.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Introductory Image Placeholder */}
            <div className="w-full h-64 bg-indigo-50 rounded-2xl overflow-hidden relative">
              <img 
                src={`https://images.unsplash.com/photo-1454165833767-027ffea9e4ae?auto=format&fit=crop&q=80&w=1000`} 
                alt="Executive Overview" 
                className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-xs font-bold uppercase bg-indigo-600 px-3 py-1 rounded-full">Interactive Concept View</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-light">
              {selectedLesson.content.split('\n\n').map((p, i) => (
                <p key={i} className="mb-6">{p}</p>
              ))}
            </div>

            {/* Case Study Box */}
            {selectedLesson.caseStudy && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border-l-8 border-amber-500 p-8 rounded-r-2xl my-12">
                <h3 className="text-amber-800 dark:text-amber-400 font-bold uppercase text-sm tracking-widest mb-4">Strategic Case Insight</h3>
                <h4 className="text-xl font-bold mb-4">{selectedLesson.caseStudy.title}</h4>
                <p className="italic text-slate-700 dark:text-slate-400 leading-relaxed">{selectedLesson.caseStudy.content}</p>
              </div>
            )}

            {/* Facts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedLesson.facts.map((fact, i) => (
                <div key={i} className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl flex gap-4">
                   <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0">!</div>
                   <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 text-center border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Mr. M Mentorship Summary • Proprietary Information</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 flex justify-end">
           <button 
             onClick={printLesson}
             className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
             Download Professional PDF
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-y-auto p-8 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className={`text-4xl font-serif font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Professional Study Folder</h2>
          <p className="text-slate-500 mt-2">Access your deep-dive sessions, formatted as creative reports by Mr. M.</p>
        </div>

        {lessons.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-32 text-center">
            <p className="text-slate-400 italic">No formal lessons stored. Ask Mr. M for a deep-dive on a topic to generate a PDF report.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`group p-8 rounded-3xl border transition-all cursor-pointer hover:shadow-2xl hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lesson.date.toLocaleDateString()}</span>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{lesson.topic}</h3>
                <p className={`text-sm line-clamp-3 mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{lesson.content.substring(0, 150)}...</p>
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                  Open Report <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonVault;
