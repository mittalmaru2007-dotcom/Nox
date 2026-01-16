
import React from 'react';
import { UserProfile } from '../types';

interface PersonalizedRoadmapProps {
  profile: UserProfile;
  darkMode: boolean;
}

const PersonalizedRoadmap: React.FC<PersonalizedRoadmapProps> = ({ profile, darkMode }) => {
  const hasRecs = profile.suggestedCareerPaths.length > 0;

  return (
    <div className={`h-full overflow-y-auto p-8 transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className={`text-4xl font-serif font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>AI Strategic Roadmap</h2>
          <p className="text-slate-500 mt-2">Dynamic career guidance synthesized from your performance and identified interests.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Overview */}
          <div className={`lg:col-span-1 p-8 rounded-3xl border transition-all hover:border-indigo-500/30 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Track Performance
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Academic Progress</p>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${profile.progress}%` }}></div>
                </div>
                <p className="text-[10px] text-right mt-1 opacity-60 font-bold">{profile.progress}% Mastery</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Mastered Concepts</p>
                <div className="flex flex-wrap gap-2">
                  {profile.masteredTopics.length > 0 ? profile.masteredTopics.map((t, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold transition-transform hover:scale-110">{t}</span>
                  )) : <p className="text-[10px] text-slate-500 italic">No topics mastered yet. Complete quizzes with 100% accuracy.</p>}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">Focus Required</p>
                <div className="flex flex-wrap gap-2">
                  {profile.strugglingTopics.length > 0 ? profile.strugglingTopics.map((t, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-bold transition-transform hover:scale-110">{t}</span>
                  )) : <p className="text-[10px] text-slate-500 italic">Excellent focus. No struggle points identified.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Career Paths */}
          <div className="lg:col-span-2 space-y-8">
            <div className={`p-8 rounded-3xl border min-h-[400px] flex flex-col ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Personalized Career Paths
              </h3>

              {!hasRecs ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-all hover:scale-110">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Awaiting Data Mastery</p>
                  <p className="text-xs max-w-xs mt-2">The AI Mentor needs more session data. Complete more quizzes and explore curriculum topics to unlock strategic advice.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.suggestedCareerPaths.map((path, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.3)] ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50' : 'bg-indigo-50 border-indigo-100 hover:border-indigo-400'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-lg ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{path.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white uppercase shadow-sm">{path.salaryPotential}</span>
                      </div>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{path.description}</p>
                      <div className={`pt-3 border-t text-[11px] italic ${darkMode ? 'border-slate-700 text-slate-400' : 'border-indigo-100 text-indigo-700'}`}>
                        <strong>AI Insight:</strong> {path.relevance}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-8 rounded-3xl border transition-all hover:border-indigo-500/30 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Recommended Professional Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.recommendedSkills.length > 0 ? profile.recommendedSkills.map((skill, i) => (
                  <span key={i} className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] ${darkMode ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'}`}>
                    {skill}
                  </span>
                )) : <p className="text-sm opacity-50 italic">Personalized skill list will appear as you progress.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRoadmap;
