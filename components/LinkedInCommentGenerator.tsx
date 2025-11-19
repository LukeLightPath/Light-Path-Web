
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';
import { useAuth } from '../AuthContext';
import { fetchActivePersona, savePersona, deletePersona, Persona } from '../utils/personaService';
import PersonaEditModal from './PersonaEditModal';

interface PostPunchlineMakerProps {
  onBack: () => void;
}

const systemInstruction = `You are a skilled social media copywriter who creates short funny LinkedIn comments for advertising professionals. At the top of the interface, the user sees their active LinkedIn persona. The persona has two fields. Persona name and persona description. The persona description explains how the user prefers to sound on LinkedIn. If persona text is provided, you must apply this voice to the comments without removing the humour style rules.

The user provides the following inputs.
The LinkedIn post content.
The humour style which will be Funny Pun or Clever Joke or Quick One Liner.
The tone which will be Playful Sarcasm or Lighthearted or Witty Professional.

Write every comment from the perspective of the user speaking directly into a LinkedIn comment thread.
The comment must always be funny.
It must always be either a funny pun or a clever joke.

Follow the humour style rules.
Funny Pun uses simple sharp wordplay related to the post.
Clever Joke uses a smart quick observation linked to the post.
Quick One Liner should be very short and punchy.

Apply the chosen tone.
Playful Sarcasm is cheeky but friendly.
Lighthearted is warm and upbeat.
Witty Professional is sharp and polished.

Write three different comment options.
Each must be short.
Each must relate to the LinkedIn post.
Each must follow the selected humour style and tone.

Do not number the comments.
Do not use bullets.
Do not include emojis or hashtags unless they genuinely improve the humour.
Do not include explanations or labels.
Output only the three comments with a line break between each one.`;

type HumourStyle = 'Funny Pun' | 'Clever Joke' | 'Quick One Liner';
type Tone = 'Playful Sarcasm' | 'Lighthearted' | 'Witty Professional';

const PostPunchlineMaker: React.FC<PostPunchlineMakerProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loadingPersona, setLoadingPersona] = useState(true);
  const [personaError, setPersonaError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [postContent, setPostContent] = useState('');
  const [humourStyle, setHumourStyle] = useState<HumourStyle>('Funny Pun');
  const [tone, setTone] = useState<Tone>('Playful Sarcasm');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const loadPersona = useCallback(async () => {
    if (!user) {
      setPersonaError("You must be logged in to use this tool.");
      setLoadingPersona(false);
      return;
    }
    setLoadingPersona(true);
    try {
      const activePersona = await fetchActivePersona();
      setPersona(activePersona);
      setPersonaError(null);
    } catch (err: any) {
      setPersonaError(err.message || "Failed to load your persona.");
    } finally {
      setLoadingPersona(false);
    }
  }, [user]);

  useEffect(() => {
    loadPersona();
  }, [loadPersona]);
  
  const handlePersonaSave = async (personaToSave: Partial<Persona>) => {
      await savePersona(personaToSave);
      setIsEditModalOpen(false);
      await loadPersona();
  };

  const handlePersonaDelete = async () => {
      await deletePersona();
      setIsEditModalOpen(false);
      await loadPersona();
  };


  const handleGenerate = async () => {
    if (!postContent || !humourStyle || !tone) {
      setError('All fields are required.');
      return;
    }
    if (!persona && !loadingPersona) {
      setError('An active persona is required. Please create one.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      let prompt = '';
      if (persona) {
          prompt += `Active persona name\n${persona.personaName}\n\n`;
          let personaDescription = `This persona's voice is ${persona.tone}.`;
          if (persona.quirks) personaDescription += ` Style notes: ${persona.quirks}.`;
          if (persona.humour) personaDescription += ` Humour level: ${persona.humour}.`;
          prompt += `Active persona description\n${personaDescription}\n\n`;
      }

      prompt += `LinkedIn post content\n${postContent}\n\n`;
      prompt += `Humour style\n${humourStyle}\n\n`;
      prompt += `Tone\n${tone}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      
      const comments = response.text
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(comment => comment.replace(/\*([^*]+)\*/g, '"$1"'));
      setResult(comments);

    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the comment. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setPostContent('');
    setHumourStyle('Funny Pun');
    setTone('Playful Sarcasm');
    setResult(null);
    setError(null);
  };
  
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderPersonaSummary = () => {
      if (loadingPersona) return <div className="text-center p-4 text-slate-500">Loading persona...</div>;
      if (personaError) return <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200 rounded-lg">{personaError}</div>;
      if (!persona) {
          return (
              <div className="text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
                  <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg">No persona active. Create one to add your voice.</p>
                  <button onClick={() => setIsEditModalOpen(true)} className="px-6 py-2 bg-primary-600 text-white text-base font-semibold rounded-lg hover:bg-primary-700">
                      Create Persona
                  </button>
              </div>
          )
      }
      return (
        <div className="bg-slate-100 dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600 mb-8">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 font-heading">Active Persona: {persona.personaName}</h3>
                <button 
                    onClick={() => setIsEditModalOpen(true)} 
                    className="px-4 py-2 text-sm font-bold bg-white dark:bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-600/30 rounded-full hover:bg-primary-50 dark:hover:bg-primary-600/20 transition-colors shadow-sm"
                >
                    Edit Persona
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-lg transition-all mb-8 font-semibold border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-cyan-500 shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-cyan-500/20">
        <BackIcon className="w-5 h-5"/>
        <span>Back to tools</span>
      </button>
      
      {result ? (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Generated Comments</h3>
            </div>
            <div className="space-y-4">
              {result.map((comment, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md flex justify-between items-start gap-4">
                  <p className="font-sans text-left text-slate-800 dark:text-slate-200 text-xl leading-relaxed">{comment}</p>
                  <button
                    onClick={() => handleCopy(comment, index)}
                    className={`text-base font-semibold flex-shrink-0 px-6 py-3 rounded-lg transition-colors ${
                      copiedIndex === index
                        ? 'bg-green-600 text-white'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300'
                    }`}
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 pt-4">
                <button onClick={reset} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">Generate Another</button>
                <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back to Tools</button>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
             <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Post Punchline Maker</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                    Generate funny, relevant comments for LinkedIn posts in seconds.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {renderPersonaSummary()}
                <div className="space-y-8">
                    <div>
                        <label htmlFor="post_content" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">LinkedIn Post Content</label>
                        <textarea 
                            id="post_content" 
                            rows={8} 
                            value={postContent} 
                            onChange={(e) => setPostContent(e.target.value)} 
                            placeholder="Paste the full LinkedIn post here…" 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="humour_style" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Humour Style</label>
                            <select
                              id="humour_style"
                              value={humourStyle}
                              onChange={(e) => setHumourStyle(e.target.value as HumourStyle)}
                              className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                            >
                              <option value="Funny Pun">Funny Pun</option>
                              <option value="Clever Joke">Clever Joke</option>
                              <option value="Quick One Liner">Quick One Liner</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tone" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Tone</label>
                            <select
                              id="tone"
                              value={tone}
                              onChange={(e) => setTone(e.target.value as Tone)}
                              className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                            >
                              <option value="Playful Sarcasm">Playful Sarcasm</option>
                              <option value="Lighthearted">Lighthearted</option>
                              <option value="Witty Professional">Witty Professional</option>
                            </select>
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
                <div className="text-center mt-10">
                    <button onClick={handleGenerate} disabled={isLoading || !persona} className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                        {isLoading ? 'Generating...' : 'Generate Comment'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {isEditModalOpen && (
          <PersonaEditModal 
            persona={persona}
            onSave={handlePersonaSave}
            onDelete={handlePersonaDelete}
            onClose={() => setIsEditModalOpen(false)}
          />
      )}
    </div>
  );
};

export default PostPunchlineMaker;