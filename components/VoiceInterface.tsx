
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AcademicMode, MentorVoice } from '../types';

interface VoiceInterfaceProps {
  onClose: () => void;
  darkMode: boolean;
  academicMode: AcademicMode;
  preferredVoice: MentorVoice;
  onTranscriptionComplete?: (userText: string, modelText: string) => void;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
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

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onClose, darkMode, academicMode, preferredVoice, onTranscriptionComplete }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'error'>('connecting');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [modelTranscript, setModelTranscript] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  useEffect(() => {
    const initVoice = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputCtx;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        let nextStartTime = 0;
        const sources = new Set<AudioBufferSourceNode>();

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('active');
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                const base64 = encode(new Uint8Array(int16.buffer));
                sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              // Handle Transcriptions
              if (msg.serverContent?.inputTranscription) {
                currentInputTranscription.current += msg.serverContent.inputTranscription.text;
                setUserTranscript(currentInputTranscription.current);
              }
              if (msg.serverContent?.outputTranscription) {
                currentOutputTranscription.current += msg.serverContent.outputTranscription.text;
                setModelTranscript(currentOutputTranscription.current);
              }

              // Handle Audio Output
              const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioData) {
                setIsSpeaking(true);
                const bytes = decode(audioData);
                const audioBuffer = await decodeAudioData(bytes, outputCtx, 24000, 1);
                
                nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputCtx.destination);
                source.onended = () => { 
                  sources.delete(source); 
                  if (sources.size === 0) setIsSpeaking(false); 
                };
                source.start(nextStartTime);
                nextStartTime += audioBuffer.duration;
                sources.add(source);
              }

              if (msg.serverContent?.interrupted) { 
                sources.forEach(s => s.stop()); 
                sources.clear(); 
                setIsSpeaking(false); 
                nextStartTime = 0;
              }

              if (msg.serverContent?.turnComplete) {
                if (onTranscriptionComplete && currentInputTranscription.current && currentOutputTranscription.current) {
                  onTranscriptionComplete(currentInputTranscription.current, currentOutputTranscription.current);
                }
                currentInputTranscription.current = '';
                currentOutputTranscription.current = '';
                setUserTranscript('');
                setModelTranscript('');
              }
            },
            onerror: () => setStatus('error'),
            onclose: () => onClose()
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: preferredVoice } } },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: `You are Mr. M, a Professional Mentor in a live voice session. The student is currently in the ${academicMode} track. Provide professional, human-like guidance. Be authoritative yet supportive. Don't sound robotic; use natural cadence. When teaching complex concepts, provide short, impactful explanations. Always aim to be a world-class CEO and MBA mentor.`
          }
        });
        sessionRef.current = await sessionPromise;
      } catch (err) { console.error(err); setStatus('error'); }
    };
    initVoice();
    return () => { 
      streamRef.current?.getTracks().forEach(t => t.stop()); 
      audioContextRef.current?.close(); 
      sessionRef.current?.close(); 
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors ${darkMode ? 'bg-slate-950/95' : 'bg-indigo-950/90'} backdrop-blur-md`}>
      <div className={`relative w-full max-w-2xl mx-4 rounded-3xl p-8 md:p-12 text-center shadow-2xl overflow-hidden border-4 ${darkMode ? 'bg-slate-900 border-indigo-500/20' : 'bg-white border-indigo-400/20'}`}>
        <div className={`absolute inset-0 opacity-50 ${darkMode ? 'bg-indigo-500/5' : 'bg-indigo-50/30'}`}></div>
        
        <div className="relative">
          <button onClick={onClose} className="absolute -top-6 -right-6 p-3 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <h2 className={`text-2xl font-serif mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>Mr. M Voice Link</h2>
          <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'} text-sm mb-8`}>Track: {academicMode} • Voice: {preferredVoice}</p>

          <div className="flex justify-center items-center h-24 gap-1 mb-10">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 rounded-full transition-all duration-200 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'} ${status === 'active' ? (isSpeaking ? 'animate-bounce' : 'h-4 opacity-30') : 'h-1'}`}
                style={{ height: status === 'active' && isSpeaking ? `${Math.random() * 80 + 20}%` : '', animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className={`p-4 rounded-2xl border text-left min-h-[100px] flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
              <span className="text-[10px] font-bold uppercase text-indigo-500 mb-2">You</span>
              <p className={`text-sm italic ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {userTranscript || (status === 'active' ? 'Listening...' : 'Connecting...')}
              </p>
            </div>
            <div className={`p-4 rounded-2xl border text-left min-h-[100px] flex flex-col ${darkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100 shadow-inner'}`}>
              <span className="text-[10px] font-bold uppercase text-indigo-500 mb-2">Mr. M</span>
              <p className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {modelTranscript || (isSpeaking ? '...' : (status === 'active' ? 'Mr. M is ready.' : ''))}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <p className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
              {status === 'connecting' ? 'Establishing Professional Link...' : 
               status === 'active' ? (isSpeaking ? 'Mr. M is providing insights...' : 'Awaiting your query...') : 
               'Link Disrupted'}
            </p>
            
            <button 
              onClick={onClose}
              className={`px-8 py-3 font-bold rounded-full border transition-all text-xs tracking-widest ${darkMode ? 'bg-red-950/20 text-red-400 border-red-900/50 hover:bg-red-950/40' : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'}`}
            >
              TERMINATE CALL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
