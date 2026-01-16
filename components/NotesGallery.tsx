
import React from 'react';
import { Note } from '../types';

interface NotesGalleryProps {
  notes: Note[];
  darkMode: boolean;
}

const NotesGallery: React.FC<NotesGalleryProps> = ({ notes, darkMode }) => {
  return (
    <div className={`h-full overflow-y-auto p-8 transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-serif ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Executive Library</h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Strategic concepts and professional skills extracted from your mentorship sessions.</p>
          </div>
          <div className="flex gap-2">
            <span className={`text-xs font-bold px-4 py-1.5 rounded-full border animate-pulse ${darkMode ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800' : 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm'}`}>{notes.length} Total Concepts</span>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className={`rounded-3xl border border-dashed p-20 text-center transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all hover:scale-110 ${darkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'}`}>
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>No notes recorded yet</h3>
            <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'} mt-2 max-w-sm mx-auto`}>As you interact with the mentor, key professional concepts will be automatically archived here for your review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note.id} className={`rounded-2xl border p-6 transition-all duration-500 cursor-pointer group hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.3)] ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/60' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest transition-colors ${darkMode ? 'bg-indigo-900/30 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>{note.category}</span>
                  <span className="text-[10px] text-slate-400">{note.date.toLocaleDateString()}</span>
                </div>
                <h3 className={`text-lg font-bold mb-3 transition-colors ${darkMode ? 'text-slate-100 group-hover:text-indigo-400' : 'text-slate-800 group-hover:text-indigo-900'}`}>{note.title}</h3>
                <div className={`text-sm line-clamp-4 prose prose-sm ${darkMode ? 'text-slate-400 prose-invert' : 'text-slate-600'}`}>
                  {note.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div className={`mt-6 pt-4 border-t flex items-center justify-between transition-all duration-300 group-hover:px-2 ${darkMode ? 'border-slate-800 text-indigo-400' : 'border-slate-100 text-indigo-600'}`}>
                  <span className="text-xs font-bold uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">Review Depth</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesGallery;
