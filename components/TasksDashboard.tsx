
import React, { useState } from 'react';
import { Task } from '../types';

interface TasksDashboardProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string, description: string, type: 'task' | 'challenge' | 'goal') => void;
  darkMode: boolean;
}

const TasksDashboard: React.FC<TasksDashboardProps> = ({ tasks, onToggle, onDelete, onAdd, darkMode }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'task' | 'challenge' | 'goal'>('task');

  const categories = {
    goal: { 
      label: 'Daily Goal', 
      light: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dark: 'bg-emerald-900/20 text-emerald-400 border-emerald-800'
    },
    challenge: { 
      label: 'Executive Challenge', 
      light: 'bg-amber-50 text-amber-700 border-amber-100',
      dark: 'bg-amber-900/20 text-amber-400 border-amber-800'
    },
    task: { 
      label: 'Practical Task', 
      light: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      dark: 'bg-indigo-900/20 text-indigo-400 border-indigo-800'
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd(newTitle, newDesc, newType);
    setNewTitle('');
    setNewDesc('');
    setNewType('task');
    setShowAddForm(false);
  };

  return (
    <div className={`h-full overflow-y-auto p-8 transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-3xl font-serif font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Professional Roadmap</h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Manage your assignments and professional milestones.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-lg active:scale-95 ${
              darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]'
            }`}
          >
            {showAddForm ? 'CANCEL' : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                ADD MILESTONE
              </>
            )}
          </button>
        </div>

        {showAddForm && (
          <form 
            onSubmit={handleAdd} 
            className={`mb-10 p-6 rounded-2xl border animate-in slide-in-from-top-4 duration-300 shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Create New Professional Task</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Milestone Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Analyze Quarterly Marketing ROI"
                  className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Description & Context</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detail the steps needed to complete this professional goal..."
                  className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all min-h-[80px] ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Priority Level</label>
                <div className="flex gap-2">
                  {(['task', 'challenge', 'goal'] as const).map(type => (
                    <button 
                      key={type}
                      type="button"
                      onClick={() => setNewType(type)}
                      className={`flex-1 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                        newType === type 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' 
                          : `${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500' : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-indigo-400'}`
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]"
              >
                PROCEED TO ROADMAP
              </button>
            </div>
          </form>
        )}

        {tasks.length === 0 ? (
          <div className={`rounded-3xl border border-dashed p-20 text-center transition-all hover:border-indigo-500/50 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50 transition-transform hover:scale-110">
               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
             </div>
             <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} italic text-sm mb-4`}>No tasks assigned yet. Your professional roadmap is empty.</p>
             <button onClick={() => setShowAddForm(true)} className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline decoration-indigo-300 underline-offset-4 hover:decoration-indigo-600 transition-all">Add your first milestone</button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className={`group p-6 rounded-2xl border transition-all duration-500 animate-in fade-in ${
                task.completed 
                  ? `${darkMode ? 'opacity-40 grayscale border-slate-800 bg-slate-900/50' : 'opacity-60 grayscale border-slate-200 bg-white shadow-inner'}` 
                  : `${darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'} hover:shadow-xl hover:scale-[1.01] hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.2)]`
              }`}>
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => onToggle(task.id)}
                    className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' 
                        : `${darkMode ? 'border-slate-700 hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(79,70,229,0.2)]' : 'border-slate-300 hover:border-indigo-400 hover:shadow-[0_0_10px_rgba(79,70,229,0.1)]'}`
                    }`}
                  >
                    {task.completed && <svg className="w-5 h-5 animate-in zoom-in duration-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border transition-colors group-hover:bg-opacity-100 ${darkMode ? categories[task.type].dark : categories[task.type].light}`}>
                        {categories[task.type].label}
                      </span>
                      <button 
                        onClick={() => onDelete(task.id)}
                        className={`text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-125 ${task.completed ? 'hidden' : ''}`}
                        title="Delete Milestone"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                    <h3 className={`text-lg font-bold transition-all ${task.completed ? 'line-through opacity-50' : ''} ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{task.title}</h3>
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mt-1 leading-relaxed ${task.completed ? 'opacity-40' : ''}`}>{task.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksDashboard;
