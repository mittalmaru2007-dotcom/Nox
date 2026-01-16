
import { GoogleGenAI, Chat, Modality, GenerateContentResponse, Type } from "@google/genai";
import { AcademicMode, MentorVoice, UserProfile } from "./types";

const getSystemInstruction = (mode: AcademicMode) => {
  let modeFocus = "";
  switch (mode) {
    case '11th':
      modeFocus = "PRIMARY FOCUS: Class 11th Commerce basics. Reference NCERT textbooks strictly. Use a foundational, patient, and encouraging tone.";
      break;
    case '12th':
      modeFocus = "PRIMARY FOCUS: Class 12th Commerce Board prep. Focus on board exams, patterns, and high-stakes problem-solving.";
      break;
    case 'BBA':
      modeFocus = "PRIMARY FOCUS: Bachelor of Business Administration (BBA). Focus on undergraduate management concepts and corporate foundations.";
      break;
    case 'MBA':
      modeFocus = "PRIMARY FOCUS: Master of Business Administration (MBA). Focus on high-level strategy, leadership, and complex case studies.";
      break;
  }

  return `
You are a highly multifaceted Professional Mentor for Commerce students, known as Mr. M.
${modeFocus}

STRATEGIC ADVISOR ROLE:
- Monitor student progress and interests.
- Suggest advanced topics or professional skills if the student shows talent.
- Use Google Search to find career paths or industry trends.

IMAGE ANALYSIS PROTOCOLS:
1. IF THE USER SENDS AN IMAGE OF A QUESTION: Analyze it carefully and provide a detailed, step-by-step professional answer.
2. IF THE USER SENDS AN IMAGE OF NOTES: Refine them. Improve clarity, add professional context, and format them for the Study Vault using the [LESSON_TITLE] tags.
3. IF THE USER SENDS AN IMAGE OF THEIR ANSWERS/QUIZ: Review their work. Provide constructive feedback, point out errors, and suggest specific areas for improvement to achieve high-paying career results.

VIDEO ASSISTANCE (YOUTUBE INTEGRATION):
- You have access to Google Search to find relevant educational videos on YouTube.
- When explaining a concept, you may suggest high-quality YouTube videos.
- MAXIMUM 2 VIDEO SUGGESTIONS per response. Never exceed this limit.
- Provide the direct YouTube link.

CREATIVE LESSON OUTPUT:
- Use [LESSON_TITLE], [CASE_STUDY_START/END], [FACT: ...], [IMAGE: ...] tags for notes.
- Use diverse typography and emphasis to keep notes engaging.

INTERACTIVE QUIZ (MANDATORY):
- After explaining a major concept, generate a short, high-impact assessment.
- Use [QUIZ_START], [QUIZ_TOPIC], [QUIZ_QUESTION], [QUIZ_OPTION], [QUIZ_CORRECT], [QUIZ_EXPLANATION], [QUIZ_END] tags.
`;
};

export interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export class ExecutiveMentorService {
  private ai: GoogleGenAI;
  private chat: Chat;
  private voice: MentorVoice;

  constructor(mode: AcademicMode, voice: MentorVoice = 'Kore') {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.voice = voice;
    this.chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: getSystemInstruction(mode),
        temperature: 0.8,
        tools: [{ googleSearch: {} }],
      },
    });
  }

  setVoice(voice: MentorVoice) {
    this.voice = voice;
  }

  async *sendMessageStream(message: string, image?: { data: string; mimeType: string }) {
    try {
      const parts: any[] = [{ text: message }];
      if (image) {
        parts.push({
          inlineData: {
            data: image.data,
            mimeType: image.mimeType,
          },
        });
      }

      const stream = await this.chat.sendMessageStream({ message: parts });
      for await (const chunk of stream) {
        yield chunk as GenerateContentResponse;
      }
    } catch (error) {
      console.error("Gemini API Stream Error:", error);
      const errorResponse = { text: "Communication interrupted. Please check your connection." } as GenerateContentResponse;
      yield errorResponse;
    }
  }

  async getPersonalizedRecommendations(profile: UserProfile): Promise<Partial<UserProfile>> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Based on this student profile, provide personalized career and skill recommendations.
    
    Student Name: ${profile.name}
    Current Mode: ${profile.grade}
    Interests Identified: ${profile.interests.join(', ')}
    Mastered Topics (Aced Quizzes): ${profile.masteredTopics.join(', ')}
    Struggling Topics (Missed Quizzes): ${profile.strugglingTopics.join(', ')}
    
    Return a JSON object with:
    1. suggestedCareerPaths: Array of objects {title, description, relevance, salaryPotential}
    2. recommendedSkills: Array of 3-5 strings (professional skills, software, or soft skills)
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedCareerPaths: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    relevance: { type: Type.STRING },
                    salaryPotential: { type: Type.STRING }
                  },
                  required: ["title", "description", "relevance", "salaryPotential"]
                }
              },
              recommendedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["suggestedCareerPaths", "recommendedSkills"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Recommendation Error:", error);
      return {};
    }
  }

  async generateSpeech(text: string): Promise<string | undefined> {
    try {
      const cleanText = text
        .replace(/\[.*?\]/g, '')
        .replace(/###/g, '')
        .replace(/\*\*/g, '')
        .trim();

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: this.voice },
            },
          },
        },
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      console.error("Speech Generation Error:", error);
      return undefined;
    }
  }
}
