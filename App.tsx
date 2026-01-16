
import React, { useState, useEffect, useRef } from 'react';
import { ExecutiveMentorService } from './geminiService';
import { Message, Note, UserProfile, Task, PDFLesson, AcademicMode, MentorVoice, Quiz } from './types';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import NotesGallery from './components/NotesGallery';
import ProfileCard from './components/ProfileCard';
import TasksDashboard from './components/TasksDashboard';
import VoiceInterface from './components/VoiceInterface';
import LessonVault from './components/LessonVault';
import ModeSelector from './components/ModeSelector';
import CurriculumExplorer from './components/CurriculumExplorer';
import LoadingPuppy from './components/LoadingPuppy';
import PersonalizedRoadmap from './components/PersonalizedRoadmap';

const STORAGE_KEY_MESSAGES = 'executive_mentor_history';
const STORAGE_KEY_NOTES = 'executive_mentor_notes';
const STORAGE_KEY_TASKS = 'executive_mentor_tasks';
const STORAGE_KEY_VAULT = 'executive_mentor_vault';
const STORAGE_KEY_THEME = 'executive_mentor_theme';
const STORAGE_KEY_MODE = 'executive_mentor_mode';
const STORAGE_KEY_VOICE = 'executive_mentor_voice';
const STORAGE_KEY_PROFILE = 'executive_mentor_profile';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vault, setVault] = useState<PDFLesson[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [academicMode, setAcademicMode] = useState<AcademicMode | null>(null);
  const [isConceptLoading, setIsConceptLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Aspirant",
    grade: "Executive Path",
    focusArea: "Commerce",
    progress: 15,
    preferredVoice: 'Kore',
    interests: [],
    masteredTopics: [],
    strugglingTopics: [],
    suggestedCareerPaths: [],
    recommendedSkills: []
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'tasks' | 'vault' | 'curriculum' | 'roadmap'>('chat');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const mentorService = useRef<ExecutiveMentorService | null>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE) as AcademicMode;
    const savedVoice = localStorage.getItem(STORAGE_KEY_VOICE) as MentorVoice || 'Kore';
    const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    if (savedMode) {
      setAcademicMode(savedMode);
      mentorService.current = new ExecutiveMentorService(savedMode, savedVoice);
      setProfile(p => ({ ...p, grade: savedMode, preferredVoice: savedVoice }));
    }

    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'dark') setDarkMode(true);

    const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (savedMessages) setMessages(JSON.parse(savedMessages).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    else if (savedMode) setMessages([{ role: 'model', text: `Welcome back. I am Mr. M, your mentor, ready to guide you through the ${savedMode} curriculum. What shall we tackle today?`, timestamp: new Date() }]);

    const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
    if (savedNotes) setNotes(JSON.parse(savedNotes).map((n: any) => ({ ...n, date: new Date(n.date) })));
    
    const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    
    const savedVault = localStorage.getItem(STORAGE_KEY_VAULT);
    if (savedVault) setVault(JSON.parse(savedVault).map((v: any) => ({ ...v, date: new Date(v.date) })));
  }, []);

  useEffect(() => {
    if (academicMode) {
      localStorage.setItem(STORAGE_KEY_MODE, academicMode);
      localStorage.setItem(STORAGE_KEY_VOICE, profile.preferredVoice);
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      if (!mentorService.current) mentorService.current = new ExecutiveMentorService(academicMode, profile.preferredVoice);
    }
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(vault));
    localStorage.setItem(STORAGE_KEY_THEME, darkMode ? 'dark' : 'light');
  }, [messages, notes, tasks, vault, darkMode, academicMode, profile]);

  const updateRecommendations = async (currentProfile: UserProfile) => {
    if (!mentorService.current) return;
    const recs = await mentorService.current.getPersonalizedRecommendations(currentProfile);
    setProfile(p => ({
      ...p,
      suggestedCareerPaths: recs.suggestedCareerPaths || p.suggestedCareerPaths,
      recommendedSkills: recs.recommendedSkills || p.recommendedSkills
    }));
  };

  const handleSelectMode = (mode: AcademicMode) => {
    setAcademicMode(mode);
    setProfile(p => ({ ...p, grade: mode }));
    mentorService.current = new ExecutiveMentorService(mode, profile.preferredVoice);
    setMessages([{ role: 'model', text: `Mode Activated: ${mode}. I have synchronized my knowledge base. This is Mr. M, let's begin our session. What is your primary objective today?`, timestamp: new Date() }]);
  };

  const handleUpdateVoice = (voice: MentorVoice) => {
    setProfile(p => ({ ...p, preferredVoice: voice }));
    if (mentorService.current) {
      mentorService.current.setVoice(voice);
    }
  };

  const handleSendMessage = async (text: string, silent: boolean = false, image?: { data: string; mimeType: string }) => {
    if (!mentorService.current) return;
    
    if (!silent) {
      const userMsg: Message = { role: 'user', text, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
    }

    let assistantText = '';
    let assistantSources: { uri: string; title: string }[] = [];
    const assistantMsg: Message = { role: 'model', text: '', timestamp: new Date() };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const stream = mentorService.current.sendMessageStream(text, image);
      let firstChunk = true;
      for await (const responseChunk of stream) {
        if (firstChunk) {
          setIsConceptLoading(false);
          firstChunk = false;
        }
        
        const chunkText = responseChunk.text || "";
        assistantText += chunkText;

        const groundingChunks = responseChunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
              if (!assistantSources.find(s => s.uri === chunk.web.uri)) {
                assistantSources.push({ uri: chunk.web.uri, title: chunk.web.title });
              }
            }
          });
        }

        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { 
            ...newMsgs[newMsgs.length - 1], 
            text: assistantText,
            sources: assistantSources.length > 0 ? assistantSources : undefined
          };
          return newMsgs;
        });
      }
      
      const audioData = await mentorService.current.generateSpeech(assistantText);
      if (audioData) {
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], audioData };
          return newMsgs;
        });
      }

      processMentorOutput(assistantText);
    } catch (error) { 
      console.error(error); 
      setIsConceptLoading(false);
    }
  };

  const processMentorOutput = (text: string) => {
    // Extract Quiz
    const quizMatch = text.match(/\[QUIZ_START\]([\s\S]*?)\[QUIZ_END\]/);
    if (quizMatch) {
      const quizContent = quizMatch[1];
      const topic = quizContent.match(/\[QUIZ_TOPIC\]:\s*(.*)/)?.[1]?.trim() || "Concept Check";
      const question = quizContent.match(/\[QUIZ_QUESTION\]:\s*(.*)/)?.[1]?.trim() || "Analyze the scenario...";
      const options: string[] = [];
      const optionRegex = /\[QUIZ_OPTION\]:\s*(.*)/g;
      let oMatch;
      while ((oMatch = optionRegex.exec(quizContent)) !== null) {
        options.push(oMatch[1].trim());
      }
      const correctIndex = parseInt(quizContent.match(/\[QUIZ_CORRECT\]:\s*(\d+)/)?.[1] || "0");
      const explanation = quizContent.match(/\[QUIZ_EXPLANATION\]:\s*(.*)/)?.[1]?.trim() || "Great insight.";

      const quiz: Quiz = { topic, question, options, correctIndex, explanation };
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg.role === 'model') {
          newMsgs[newMsgs.length - 1] = { ...lastMsg, quiz };
        }
        return newMsgs;
      });
    }

    // Extract Lesson PDF
    if (text.includes('[LESSON_TITLE]')) {
      const titleMatch = text.match(/\[LESSON_TITLE\]\s*(.*)/);
      const title = titleMatch ? titleMatch[1].trim() : "New Lesson";
      
      const caseStudyStart = text.indexOf('[CASE_STUDY_START]');
      const caseStudyEnd = text.indexOf('[CASE_STUDY_END]');
      let caseStudyText = "";
      if (caseStudyStart !== -1 && caseStudyEnd !== -1) {
        caseStudyText = text.substring(caseStudyStart + 18, caseStudyEnd).trim();
      }

      const facts: string[] = [];
      const factRegex = /\[FACT:\s*([^\]]+)\]/g;
      let fMatch;
      while ((fMatch = factRegex.exec(text)) !== null) {
        facts.push(fMatch[1].trim());
      }

      const newLesson: PDFLesson = {
        id: `${Date.now()}-v`,
        subject: academicMode || "General Commerce",
        class: academicMode || "Advanced",
        chapter: "Session Archive",
        topic: title,
        content: text.replace(/\[[^\]]+\]/g, '').trim(),
        caseStudy: caseStudyText ? { title: "Case Insight", content: caseStudyText } : undefined,
        facts: facts,
        date: new Date(),
        tone: 'semi-formal'
      };
      setVault(prev => [newLesson, ...prev]);
    }

    const taskRegex = /\[(TASK|CHALLENGE|GOAL)\]\s*([^:]+):\s*([^\n]+)/gi;
    let tMatch;
    const newTasks: Task[] = [];
    while ((tMatch = taskRegex.exec(text)) !== null) {
      newTasks.push({ id: `${Date.now()}-t-${tMatch.index}`, type: tMatch[1].toLowerCase() as any, title: tMatch[2].trim(), description: tMatch[3].trim(), completed: false });
    }
    if (newTasks.length > 0) setTasks(prev => [...newTasks, ...prev]);
  };

  const handleQuizAnswer = (messageIdx: number, answerIdx: number) => {
    setMessages(prev => {
      const newMsgs = [...prev];
      const msg = newMsgs[messageIdx];
      if (msg.quiz) {
        const isCorrect = answerIdx === msg.quiz.correctIndex;
        const topic = msg.quiz.topic;
        
        newMsgs[messageIdx] = { 
          ...msg, 
          quiz: { ...msg.quiz, userAnswer: answerIdx } 
        };
        
        setProfile(p => {
          const mastered = isCorrect 
            ? Array.from(new Set([...p.masteredTopics, topic])) 
            : p.masteredTopics.filter(t => t !== topic);
          const struggling = !isCorrect 
            ? Array.from(new Set([...p.strugglingTopics, topic])) 
            : p.strugglingTopics.filter(t => t !== topic);
          
          const newProfile = {
            ...p,
            progress: Math.min(100, p.progress + (isCorrect ? 2 : 0)),
            masteredTopics: mastered,
            strugglingTopics: struggling
          };

          // Periodically update career recs after quizzes
          if (newProfile.masteredTopics.length % 2 === 0) {
            updateRecommendations(newProfile);
          }

          return newProfile;
        });
      }
      return newMsgs;
    });
  };

  const handleSelectConcept = (conceptName: string) => {
    setIsConceptLoading(true);
    setActiveTab('chat');
    setProfile(p => ({
      ...p,
      interests: Array.from(new Set([...p.interests, conceptName]))
    }));
    handleSendMessage(`Provide a detailed lesson on "${conceptName}". Include practical applications, a creative case study, and a professional assessment quiz.`, true);
  };

  const handleVoiceTranscription = (userText: string, modelText: string) => {
    const timestamp = new Date();
    const newMsgs: Message[] = [
      { role: 'user', text: userText, timestamp },
      { role: 'model', text: modelText, timestamp }
    ];
    setMessages(prev => [...prev, ...newMsgs]);
    processMentorOutput(modelText);
  };

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const addTask = (title: string, description: string, type: 'task' | 'challenge' | 'goal') => {
    const newTask: Task = {
      id: `${Date.now()}-manual`,
      title,
      description,
      type,
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
  };

  if (!academicMode) {
    return <ModeSelector onSelect={handleSelectMode} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={() => { localStorage.clear(); window.location.reload(); }}
        taskCount={tasks.filter(t => !t.completed).length}
        darkMode={darkMode}
        academicMode={academicMode}
        onSwitchMode={() => { 
          if(window.confirm("Switch academic focus? Your current chat history will remain, but Mr. M's focus will shift.")) {
            setAcademicMode(null);
          }
        }}
      />

      <main className="flex-1 flex flex-col transition-all duration-300">
        <header className={`h-16 border-b flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center text-white font-serif text-xl">M</div>
            <h1 className="text-xl font-semibold tracking-tight">Mr. M <span className="text-indigo-600 font-normal">| {academicMode} Path</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} title="Theme Toggle">
               {darkMode ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>}
             </button>
             <button onClick={() => setIsVoiceActive(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-colors ${darkMode ? 'bg-indigo-900/40 text-indigo-400 hover:bg-indigo-900/60' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
               </span>
               VOICE MODE
             </button>
             <ProfileCard profile={profile} onUpdateVoice={handleUpdateVoice} darkMode={darkMode} />
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'chat' && (
            <ChatWindow 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              onVoiceStart={() => setIsVoiceActive(true)} 
              onQuizAnswer={handleQuizAnswer}
              darkMode={darkMode} 
            />
          )}
          {activeTab === 'curriculum' && (
            <CurriculumExplorer 
              mode={academicMode} 
              onSelect={handleSelectConcept} 
              darkMode={darkMode} 
            />
          )}
          {activeTab === 'notes' && <NotesGallery notes={notes} darkMode={darkMode} />}
          {activeTab === 'tasks' && <TasksDashboard tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onAdd={addTask} darkMode={darkMode} />}
          {activeTab === 'vault' && <LessonVault lessons={vault} darkMode={darkMode} />}
          {activeTab === 'roadmap' && <PersonalizedRoadmap profile={profile} darkMode={darkMode} />}

          {isConceptLoading && <LoadingPuppy darkMode={darkMode} />}
        </div>
      </main>

      {isVoiceActive && (
        <VoiceInterface 
          onClose={() => setIsVoiceActive(false)} 
          darkMode={darkMode} 
          academicMode={academicMode} 
          preferredVoice={profile.preferredVoice}
          onTranscriptionComplete={handleVoiceTranscription}
        />
      )}
    </div>
  );
};

export default App;
