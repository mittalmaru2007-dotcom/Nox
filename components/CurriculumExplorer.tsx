
import React, { useState, useMemo } from 'react';
import { AcademicMode } from '../types';

interface CurriculumExplorerProps {
  mode: AcademicMode;
  onSelect: (concept: string) => void;
  darkMode: boolean;
}

const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({ mode, onSelect, darkMode }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const curriculumMap: Record<AcademicMode, { category: string; topics: { name: string; desc: string; icon: string }[] }[]> = {
    '11th': [
      {
        category: 'Business Foundations',
        topics: [
          { name: 'Nature and Purpose of Business', desc: 'Understand economic activities and business objectives.', icon: '🌱' },
          { name: 'Forms of Business Organizations', desc: 'Sole proprietorship, partnership, and companies.', icon: '🏢' },
        ]
      },
      {
        category: 'Accounting Principles',
        topics: [
          { name: 'Introduction to Accounting', desc: 'The language of business and basic terminology.', icon: '📊' },
          { name: 'Journal & Ledger Posting', desc: 'Mastering the double-entry bookkeeping system.', icon: '✍️' },
        ]
      }
    ],
    '12th': [
      {
        category: 'Management Theory',
        topics: [
          { name: 'Principles of Management', desc: 'Fayol and Taylor’s scientific management.', icon: '📐' },
          { name: 'Business Environment', desc: 'Analyzing macro and micro economic factors.', icon: '🌍' },
        ]
      },
      {
        category: 'Business Functions',
        topics: [
          { name: 'Marketing Management', desc: 'The 4 Ps and customer-centric strategies.', icon: '📣' },
          { name: 'Financial Markets', desc: 'Understanding stock exchanges and instruments.', icon: '📈' },
        ]
      }
    ],
    'BBA': [
      {
        category: 'Professional Management',
        topics: [
          { name: 'Organizational Behavior', desc: 'Individual and group dynamics in corporate settings.', icon: '👥' },
          { name: 'Human Resource Management', desc: 'Talent acquisition and performance appraisal.', icon: '🤝' },
        ]
      },
      {
        category: 'Strategic Operations',
        topics: [
          { name: 'Supply Chain Management', desc: 'Logistics and value chain optimization.', icon: '🚛' },
          { name: 'Business Communication', desc: 'Mastering corporate correspondence.', icon: '📧' },
        ]
      }
    ],
    'MBA': [
      {
        category: 'Executive Strategy',
        topics: [
          { name: 'Disruptive Innovation', desc: 'Strategies for changing industry paradigms.', icon: '⚡' },
          { name: 'Mergers & Acquisitions', desc: 'Strategic corporate restructuring and valuation.', icon: '🔗' },
        ]
      },
      {
        category: 'Advanced Finance & Ethics',
        topics: [
          { name: 'Strategic Financial Modeling', desc: 'Projecting corporate performance for decision-making.', icon: '📉' },
          { name: 'Global Leadership & Ethics', desc: 'Leading multicutural teams with integrity.', icon: '🗺️' },
        ]
      }
    ]
  };

  const sections = curriculumMap[mode];
  
  const categories = useMemo(() => {
    return ['All', ...sections.map(s => s.category)];
  }, [sections]);

  const filteredSections = useMemo(() => {
    if (activeFilter === 'All') return sections;
    return sections.filter(s => s.category === activeFilter);
  }, [sections, activeFilter]);

  return (
    <div className={`h-full overflow-y-auto p-8 transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h2 className={`text-4xl font-serif font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Executive Curriculum</h2>
            <p className="text-slate-500 mt-2">Select a core concept to trigger a deep-dive mentorship session.</p>
          </div>
          
          {/* Category Filter Bar */}
          <div className={`p-1.5 rounded-2xl flex flex-wrap gap-1 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-sm border border-slate-100'}`}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : `${darkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50'}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          {filteredSections.map((section, sIdx) => (
            <div key={sIdx} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className={`text-xs font-bold uppercase tracking-[0.3em] mb-8 pb-4 border-b flex items-center gap-3 ${darkMode ? 'text-indigo-400 border-slate-800' : 'text-indigo-600 border-slate-200'}`}>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {section.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.topics.map((topic, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => onSelect(topic.name)}
                    className={`group text-left p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.25)] ${
                      darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/60' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]`}>
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold mb-1 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{topic.name}</h4>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{topic.desc}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-widest group-hover:translate-x-2 transition-all">
                      Initiate Lesson <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {filteredSections.length === 0 && (
             <div className="py-20 text-center">
                <p className="text-slate-500 italic">No topics found in this category.</p>
             </div>
          )}
        </div>

        <div className={`mt-20 p-8 rounded-3xl border border-dashed text-center transition-all hover:border-indigo-500/50 ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-300 bg-white/50'}`}>
           <p className={`text-sm italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
             Want to learn something else? Type any topic in the Direct Mentorship chat.
           </p>
        </div>
      </div>
    </div>
  );
};

export default CurriculumExplorer;
