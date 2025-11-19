
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';
import { useAuth } from '../AuthContext';
import { fetchActivePersona, savePersona, deletePersona, Persona } from '../utils/personaService';
import PersonaEditModal from './PersonaEditModal';

interface PersonaPostWriterProps {
  onBack: () => void;
}

const systemInstruction = `You are a LinkedIn post writer that writes in the voice of a specific human author. My application will send you a JSON object with two top level keys. "persona" and "postRequest". Your job is to write one LinkedIn post that matches the persona as closely as possible while following the request. Follow all rules from the persona and postRequest objects precisely. Output only the final LinkedIn post text, ready to paste. Do not include explanations, headings, labels, or mention that you are an AI model.`;

const PersonaPostWriter: React.FC<PersonaPostWriterProps> = ({ onBack }) => {
  const { user } = useAuth();
  
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loadingPersona, setLoadingPersona] = useState(true);
  const [personaError, setPersonaError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('start conversations');
  const [postLength, setPostLength] = useState('medium');
  const [includeCTA, setIncludeCTA] = useState(false);
  const [extraInstructions, setExtraInstructions] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      console.error("Error fetching persona:", err);
      setPersonaError(err.message || "Failed to load your persona from the database.");
    } finally {
      setLoadingPersona(false);
    }
  }, [user]);

  useEffect(() => {
    loadPersona();
  }, [loadPersona]);

  const handleGenerate = async (regenerate = false) => {
    if (!regenerate) {
        if (!persona) {
            setError("No persona is loaded. Please create one before generating a post.");
            return;
        }
        if (!topic.trim()) {
            setError("The 'Topic' field is required.");
            return;
        }
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const { id, ...personaDataForPayload } = persona || {};

    const payload = {
      persona: personaDataForPayload,
      postRequest: { topic, goal, postLength, includeCTA, extraInstructions },
    };

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: JSON.stringify(payload),
        config: { systemInstruction },
      });
      setResult(response.text);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePersonaSave = async (personaToSave: Partial<Persona>) => {
      await savePersona(personaToSave);
      setIsEditModalOpen(false);
      await loadPersona(); // Refresh data
  };

  const handlePersonaDelete = async () => {
      await deletePersona();
      setIsEditModalOpen(false);
      await loadPersona(); // Refresh data, which will now be null
  };

  const resetForm = () => {
    setTopic('');
    setGoal('start conversations');
    setPostLength('medium');
    setIncludeCTA(false);
    setExtraInstructions('');
    setResult(null);
    setError(null);
    setCopied(false);
  };
  
  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPersonaSummary = () => {
      if (!persona) return null;
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

  const renderContent = () => {
    if (loadingPersona) {
      return <div className="text-center p-8 text-slate-500">Loading your persona...</div>;
    }
    if (personaError) {
        return (
            <div className="text-center p-8 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                <p className="text-amber-700 dark:text-amber-200">{personaError}</p>
            </div>
        );
    }
    if (!persona) {
        return (
            <div className="text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg">You don't have a persona yet. Create one before generating posts.</p>
                <button onClick={() => setIsEditModalOpen(true)} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-lg">
                    Create Persona
                </button>
            </div>
        )
    }
    if (result) {
      return (
        <div className="animate-fade-in space-y-8">
             <div className="text-center">
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Generated LinkedIn Post</h3>
            </div>
            <div className="relative bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="whitespace-pre-wrap font-sans text-left text-slate-800 dark:text-slate-200 text-xl leading-relaxed">{result}</div>
            </div>
            <div className="flex justify-center items-center gap-4 pt-4">
                <button onClick={handleCopy} className="px-8 py-3 text-lg bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 dark:bg-primary-700/50 dark:text-primary-200 dark:hover:bg-primary-700 transition-colors font-semibold">
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button onClick={() => handleGenerate(true)} disabled={isLoading} className="px-8 py-3 text-lg bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors font-semibold disabled:opacity-50">
                    {isLoading ? 'Generating...' : 'Regenerate'}
                </button>
            </div>
            <div className="flex justify-center gap-4 pt-2">
                <button onClick={resetForm} className="px-10 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg text-lg">Create Another Post</button>
            </div>
        </div>
      );
    }

    return (
         <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            {renderPersonaSummary()}
            <div className="space-y-8">
                <div>
                    <label htmlFor="topic" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Topic</label>
                    <input type="text" id="topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Why agencies lose deals from slow follow up" required className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="goal" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Goal for this post</label>
                        <select id="goal" value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all">
                            <option value="start conversations">Start conversations</option>
                            <option value="educate">Educate</option>
                            <option value="share a lesson">Share a lesson</option>
                            <option value="tell a personal story">Tell a personal story</option>
                            <option value="softly lead towards a service">Softly lead towards a service</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="postLength" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Post length</label>
                        <select id="postLength" value={postLength} onChange={e => setPostLength(e.target.value)} className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all">
                            <option value="short">Short</option>
                            <option value="medium">Medium</option>
                            <option value="long">Long</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="extraInstructions" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Extra instructions (Optional)</label>
                    <textarea id="extraInstructions" rows={3} value={extraInstructions} onChange={e => setExtraInstructions(e.target.value)} placeholder="Mention Voice AI gently near the end. Avoid sounding salesy." className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                </div>
                 <div className="flex items-center mt-4">
                    <input type="checkbox" id="includeCTA" checked={includeCTA} onChange={e => setIncludeCTA(e.target.checked)} className="h-6 w-6 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <label htmlFor="includeCTA" className="ml-4 block text-lg font-medium text-slate-800 dark:text-slate-200">Include a call to action at the end</label>
                </div>
            </div>
            {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
            <div className="text-center mt-10">
                <button onClick={() => handleGenerate()} disabled={isLoading || !persona} className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? 'Generating...' : 'Generate Post'}
                </button>
            </div>
        </div>
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-lg transition-all mb-8 font-semibold border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-cyan-500 shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-cyan-500/20">
        <BackIcon className="w-5 h-5"/>
        <span>Back to tools</span>
      </button>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Persona Post Writer</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
            Generate a LinkedIn post in the voice of your saved persona.
        </p>
      </div>

      {renderContent()}

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

export default PersonaPostWriter;