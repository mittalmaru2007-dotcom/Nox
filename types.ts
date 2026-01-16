
export type AcademicMode = '11th' | '12th' | 'BBA' | 'MBA';
export type MentorVoice = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';

export interface Quiz {
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  userAnswer?: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  audioData?: string; // Base64 encoded raw PCM audio
  quiz?: Quiz;
  sources?: { uri: string; title: string }[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  date: Date;
}

export interface CaseStudy {
  title: string;
  content: string;
}

export interface PDFLesson {
  id: string;
  subject: string;
  class: string;
  chapter: string;
  topic: string;
  content: string;
  caseStudy?: CaseStudy;
  facts: string[];
  date: Date;
  tone: 'formal' | 'informal' | 'semi-formal';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'challenge' | 'goal';
  completed: boolean;
  dueDate?: Date;
}

export interface UserProfile {
  name: string;
  grade: string;
  focusArea: string;
  progress: number;
  academicMode?: AcademicMode;
  preferredVoice: MentorVoice;
  interests: string[];
  masteredTopics: string[];
  strugglingTopics: string[];
  suggestedCareerPaths: CareerPath[];
  recommendedSkills: string[];
}

export interface CareerPath {
  title: string;
  description: string;
  relevance: string;
  salaryPotential: string;
}
