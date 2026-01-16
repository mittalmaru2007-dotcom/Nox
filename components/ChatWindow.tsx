
import React, { useState, useRef, useEffect } from 'react';
import { Message, Quiz } from '../types';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string, silent?: boolean, image?: { data: string; mimeType: string }) => void;
  onVoiceStart: () => void;
  onQuizAnswer: (msgIdx: number, answerIdx: number) => void;
  darkMode: boolean;
}

const MAX_CHARS = 2000;

// Manual decoding functions for base64 and raw PCM
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const QuizUI: React.FC<{ quiz: Quiz; onAnswer: (idx: number) => void; darkMode: boolean }> = ({ quiz, onAnswer, darkMode }) => {
  const isAnswered = quiz.userAnswer !== undefined;

  return (
    <div className={`mt-8 rounded-3xl border-2 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-700 relative ${darkMode ? 'bg-slate-900 border-indigo-500/30 shadow-indigo-500/10' : 'bg-white border-indigo-100 shadow-indigo-100'}`}>
      {/* Visual Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`}></div>
      
      <div className={`p-5 flex items-center justify-between border-b relative z-10 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-indigo-600 border-indigo-500'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-2xl shadow-inner ${darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-white text-indigo-600'}`}>
            ?
          </div>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] block ${darkMode ? 'text-indigo-300' : 'text-indigo-100'}`}>Executive Assessment</span>
            <span className={`text-xs font-bold ${darkMode ? 'text-slate-100' : 'text-white'}`}>{quiz.topic}</span>
          </div>
        </div>
        {isAnswered && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-[10px] tracking-wider animate-in zoom-in ${quiz.userAnswer === quiz.correctIndex ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            {quiz.userAnswer === quiz.correctIndex ? 'PROFICIENT' : 'REVIEW REQ'}
          </div>
        )}
      </div>
      
      <div className="p-8 relative z-10">
        <h4 className={`text-xl font-serif font-bold mb-8 leading-snug ${darkMode ? 'text-white' : 'text-slate-900'}`}>{quiz.question}</h4>
        <div className="grid grid-cols-1 gap-4">
          {quiz.options.map((option, idx) => {
            const isUserSelection = quiz.userAnswer === idx;
            const isCorrect = idx === quiz.correctIndex;
            
            let btnClasses = `w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 font-bold flex items-center justify-between group/opt `;
            if (!isAnswered) {
              btnClasses += `${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-750 text-slate-200 hover:scale-[1.02]' : 'bg-white border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 hover:scale-[1.02]'}`;
            } else {
              if (isCorrect) {
                btnClasses += `bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]`;
              } else if (isUserSelection) {
                btnClasses += `bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]`;
              } else {
                btnClasses += `opacity-40 grayscale ${darkMode ? 'bg-slate-800 border-slate-800 text-slate-500' : 'bg-white border-slate-50 text-slate-400'}`;
              }
            }

            return (
              <button 
                key={idx} 
                onClick={() => !isAnswered && onAnswer(idx)}
                disabled={isAnswered}
                className={btnClasses}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] border transition-colors ${
                    !isAnswered ? 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600' : (isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-200 border-slate-300')
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {isAnswered && isCorrect && <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg></div>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-8 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 border relative overflow-hidden ${darkMode ? 'bg-slate-800/80 text-slate-300 border-slate-700' : 'bg-indigo-50/50 text-slate-600 border-indigo-100'}`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${quiz.userAnswer === quiz.correctIndex ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Mr. M Intelligence
            </p>
            <p className="text-sm leading-relaxed font-medium italic">{quiz.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, onVoiceStart, onQuizAnswer, darkMode }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [autoPlayedIndices, setAutoPlayedIndices] = useState<Set<number>>(new Set());
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Auto-play effect
  useEffect(() => {
    const lastIdx = messages.length - 1;
    const lastMsg = messages[lastIdx];
    
    if (
      lastMsg && 
      lastMsg.role === 'model' && 
      lastMsg.audioData && 
      !autoPlayedIndices.has(lastIdx)
    ) {
      playVoice(lastMsg.audioData, lastIdx);
      setAutoPlayedIndices(prev => new Set(prev).add(lastIdx));
    }
  }, [messages]);

  const stopCurrentAudio = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Source might have already stopped
      }
      currentSourceRef.current = null;
    }
    setPlayingId(null);
  };

  const playVoice = async (audioData: string, messageId: number) => {
    try {
      if (playingId === messageId) {
        stopCurrentAudio();
        return;
      }

      stopCurrentAudio();

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const bytes = decodeBase64(audioData);
      const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        if (currentSourceRef.current === source) {
          setPlayingId(null);
          currentSourceRef.current = null;
        }
      };

      currentSourceRef.current = source;
      setPlayingId(messageId);
      source.start();
    } catch (error) {
      console.error("Audio Playback Error:", error);
      setPlayingId(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type,
          preview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !selectedImage) return;
    if (input.length > MAX_CHARS) return;

    onSendMessage(input || (selectedImage ? "Analyze this professional material." : ""), false, selectedImage || undefined);
    setInput('');
    setSelectedImage(null);
  };

  const formatMessageText = (text: string) => {
    // Clean up all technical tags for display
    const cleanedText = text
      .replace(/\[QUIZ_START\][\s\S]*?\[QUIZ_END\]/g, '')
      .replace(/\[LESSON_TITLE\].*/g, '')
      .replace(/\[CASE_STUDY_START\]/g, '')
      .replace(/\[CASE_STUDY_END\]/g, '')
      .replace(/\[FACT:.*\]/g, '')
      .replace(/\[IMAGE:.*\]/g, '');

    if (!cleanedText.trim()) return null;

    return cleanedText.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      if (line.startsWith('### ')) return <h3 key={i} className={`text-xl font-bold mt-6 mb-2 ${darkMode ? 'text-indigo-300' : 'text-slate-800'}`}>{line.replace('### ', '')}</h3>;
      if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className={`ml-4 mb-1 list-disc ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{line.substring(2)}</li>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className={`font-bold my-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>{line.replace(/\*\*/g, '')}</p>;
      
      if (line.includes('[TASK]') || line.includes('[CHALLENGE]') || line.includes('[GOAL]')) {
        return <div key={i} className={`my-4 p-4 border-l-4 rounded-r-lg font-medium italic ${darkMode ? 'bg-indigo-900/20 border-indigo-400 text-indigo-300' : 'bg-indigo-50 border-indigo-500 text-indigo-900'}`}>{line}</div>;
      }
      return <p key={i} className={`mb-2 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{line}</p>;
    });
  };

  const isInputEmpty = !input.trim() && !selectedImage;
  const isOverLimit = input.length > MAX_CHARS;

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32">
        {messages.map((msg, idx) => {
          const isModelThinking = msg.role === 'model' && !msg.text.trim();
          
          return (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-5 shadow-sm border relative group/msg transition-all duration-300 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                  : `${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'} rounded-tl-none`
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{msg.role === 'user' ? 'Aspirant' : 'Mr. M'}</span>
                    <span className="text-[10px] opacity-40">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  {msg.role === 'model' && msg.audioData && (
                    <button 
                      onClick={() => playVoice(msg.audioData!, idx)}
                      className={`p-1.5 rounded-full transition-all ${
                        playingId === idx 
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30' 
                          : `${darkMode ? 'bg-slate-800 text-indigo-400 hover:bg-slate-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`
                      }`}
                      title={playingId === idx ? "Stop Reading" : "Read Answer"}
                    >
                      {playingId === idx ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586A2 2 0 007 16h3.586l4.707 4.707C15.923 21.334 17 20.89 17 20V4c0-.89-1.077-1.334-1.707-.707L10.586 8H7a2 2 0 00-1.414.586l-1 1z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="prose prose-sm max-w-none min-h-[1.5rem]">
                  {isModelThinking ? (
                    <div className="space-y-3 py-1">
                      {/* Advanced Skeleton Loader */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] opacity-50 ml-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>Mr. M is thinking...</span>
                      </div>
                      <div className="space-y-2 animate-pulse">
                        <div className={`h-2.5 rounded-full w-[90%] ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                        <div className={`h-2.5 rounded-full w-[70%] ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                        <div className={`h-2.5 rounded-full w-[80%] ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                      </div>
                    </div>
                  ) : (
                    msg.role === 'user' ? <p className="whitespace-pre-wrap">{msg.text}</p> : formatMessageText(msg.text)
                  )}
                </div>

                {!isModelThinking && msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Reference Materials & Videos</p>
                    <div className="flex flex-col gap-2">
                      {msg.sources.map((source, sIdx) => {
                        const isYouTube = source.uri.includes('youtube.com') || source.uri.includes('youtu.be');
                        return (
                          <a 
                            key={sIdx}
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 hover:bg-indigo-50 text-slate-800'}`}
                          >
                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isYouTube ? 'bg-red-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                              {isYouTube ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate">{source.title}</p>
                              <p className="text-[10px] opacity-50 truncate">{source.uri}</p>
                            </div>
                            <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isModelThinking && msg.role === 'model' && msg.quiz && (
                  <QuizUI quiz={msg.quiz} onAnswer={(ansIdx) => onQuizAnswer(idx, ansIdx)} darkMode={darkMode} />
                )}

                {msg.role === 'model' && playingId === idx && (
                  <div className="mt-3 flex items-center gap-1.5 overflow-hidden">
                    <div className="flex gap-0.5 h-3 items-end">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-indigo-400 animate-pulse" 
                          style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-medium text-indigo-400 italic">Mr. M is reading...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 border-t transition-colors z-20 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Image Preview Area */}
          {selectedImage && (
            <div className="mb-4 relative inline-block group/preview animate-in zoom-in duration-200">
              <img src={selectedImage.preview} alt="Upload Preview" className="h-24 w-auto rounded-xl border-2 border-indigo-500 shadow-lg object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:scale-110 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}

          <div className="flex items-end gap-3 mb-2">
            <button 
              onClick={onVoiceStart} 
              className={`p-3 rounded-xl transition-all shadow-sm ${darkMode ? 'text-indigo-400 bg-slate-800 hover:bg-slate-700' : 'text-indigo-600 bg-slate-100 hover:bg-slate-200'}`} 
              title="Real-time Voice Mode"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={`p-3 rounded-xl transition-all shadow-sm ${darkMode ? 'text-indigo-400 bg-slate-800 hover:bg-slate-700' : 'text-indigo-600 bg-slate-100 hover:bg-slate-200'}`} 
              title="Upload Photos/Materials"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSubmit(); 
                  } 
                }}
                placeholder={selectedImage ? "Add context for Mr. M..." : "Type your query or upload a photo..."}
                className={`w-full border rounded-2xl py-3 px-4 pr-12 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition-colors min-h-[52px] ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 shadow-inner'
                }`}
                rows={1}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isInputEmpty || isOverLimit} 
                  className={`p-2 rounded-lg transition-all ${
                    isInputEmpty || isOverLimit
                      ? 'bg-transparent text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end px-1">
            <span className={`text-[10px] font-medium tracking-tight ${isOverLimit ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
              {input.length} / {MAX_CHARS}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
