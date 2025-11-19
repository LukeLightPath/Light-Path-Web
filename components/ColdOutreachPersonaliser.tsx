
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';
import { useAuth } from '../AuthContext';
import { fetchActivePersona, savePersona, deletePersona, Persona } from '../utils/personaService';
import PersonaEditModal from './PersonaEditModal';

interface ColdOutreachPersonaliserProps {
  onBack: () => void;
}

const systemInstruction = `You are an expert B2B copywriter who creates personalised LinkedIn connection requests and direct messages for advertising agency outreach. At the top of the interface, the user sees their active LinkedIn persona. The persona has two fields. Persona name and persona description. The persona description expresses how the user wants to sound on LinkedIn. If persona text is provided, you must write in the voice of this persona. If the user edits the persona, you must follow the updated version.

The user provides the following inputs.
Prospect profile which describes who the person is or includes content they have posted.
Offer description which explains what the user provides.
Message type which is Direct Message or Connection Request.
Tone which is Friendly Professional or Warm and Personable or Straightforward Confident or Comical.
Message intent which is Conversation Starter or Compliment or Value Hook.

Write every message from the perspective of the user speaking directly to the prospect. Always use the details in the prospect profile to personalise the message.

If the message type is Connection Request, write a short light message that fits inside a LinkedIn connection request. Avoid pitching. Keep it natural and friendly.

If the message type is Direct Message, write a concise conversational message that opens a dialogue. Keep it short and value focused.

Apply the chosen tone.
Friendly Professional should feel open and easy to read.
Warm and Personable should feel human and genuine.
Straightforward Confident should feel clear and competent but not aggressive.
Comical should add a light humorous touch without being silly or unprofessional.

Apply the message intent.
Conversation Starter should include a simple friendly question or reference to something interesting from the prospect profile.
Compliment should highlight something real from their profile or post in a sincere way.
Value Hook should lightly reference the offer description in a natural way without being pushy.

Do not use emojis or hashtags.
Do not include explanations or labels.
Do not reference AI.
Output only the final message.`;


type Tone = 'Friendly Professional' | 'Warm and Personable' | 'Straightforward Confident' | 'Comical';
type MessageIntent = 'Conversation Starter' | 'Compliment' | 'Value Hook';

const ColdOutreachPersonaliser: React.FC<ColdOutreachPersonaliserProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loadingPersona, setLoadingPersona] = useState(true);
  const [personaError, setPersonaError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [messageType, setMessageType] = useState<'connection' | 'dm'>('dm');
  const [prospectProfile, setProspectProfile] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [tone, setTone] = useState<Tone>('Friendly Professional');
  const [messageIntent, setMessageIntent] = useState<MessageIntent>('Conversation Starter');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    if (!prospectProfile) {
      setError('Prospect Profile is required.');
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
      
      prompt += `Prospect profile\n${prospectProfile}\n\n`;
      
      if (offerDescription.trim()) {
        prompt += `Offer description\n${offerDescription}\n\n`;
      }
      
      prompt += `Message type\n${messageType === 'connection' ? 'Connection Request' : 'Direct Message'}\n\n`;
      prompt += `Tone\n${tone}\n\n`;
      prompt += `Message intent\n${messageIntent}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      setResult(response.text);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the outreach message. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  const reset = () => {
    setMessageType('dm');
    setProspectProfile('');
    setOfferDescription('');
    setTone('Friendly Professional');
    setMessageIntent('Conversation Starter');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-lg transition-all mb-8 font-semibold border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-cyan-500 shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-cyan-500/20">
        <BackIcon className="w-5 h-5"/>
        <span>Back to tools</span>
      </button>
      
      {result ? (
        <div className="animate-fade-in space-y-8">
             <div className="text-center">
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Generated Outreach Message</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="whitespace-pre-wrap font-sans text-left text-slate-800 dark:text-slate-200 text-xl leading-relaxed">{result}</div>
            </div>
            <div className="flex justify-center gap-4 pt-4">
                <button onClick={reset} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">Generate Another</button>
                <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back to Tools</button>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Cold Outreach Personaliser</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                    Generate personalised LinkedIn outreach messages to win more agency clients.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {renderPersonaSummary()}
                <div className="space-y-8">
                    <div>
                        <label htmlFor="prospect-profile" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Prospect Profile</label>
                        <textarea 
                            id="prospect-profile" 
                            rows={5} 
                            value={prospectProfile} 
                            onChange={(e) => setProspectProfile(e.target.value)} 
                            placeholder="e.g., John is a VP of Sales at Acme Corp, recently posted on LinkedIn about scaling his team..." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="offer-description" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Offer Description (Optional)</label>
                        <textarea 
                            id="offer-description" 
                            rows={3} 
                            value={offerDescription} 
                            onChange={(e) => setOfferDescription(e.target.value)} 
                            placeholder="e.g., We provide AI-powered sales coaching to help reps close deals faster." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="tone" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Tone</label>
                            <select
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value as Tone)}
                                className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                            >
                                <option>Friendly Professional</option>
                                <option>Warm and Personable</option>
                                <option>Straightforward Confident</option>
                                <option>Comical</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="message-intent" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Message Intent</label>
                            <select
                                id="message-intent"
                                value={messageIntent}
                                onChange={(e) => setMessageIntent(e.target.value as MessageIntent)}
                                className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                            >
                                <option>Conversation Starter</option>
                                <option>Compliment</option>
                                <option>Value Hook</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Message Type</label>
                        <div className="flex items-center space-x-4 p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button 
                                type="button"
                                onClick={() => setMessageType('dm')}
                                className={`flex-1 py-4 text-lg font-bold rounded-lg transition-all duration-200 ${messageType === 'dm' ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                            >
                                Direct Message
                            </button>
                            <button
                                type="button"
                                onClick={() => setMessageType('connection')}
                                className={`flex-1 py-4 text-lg font-bold rounded-lg transition-all duration-200 ${messageType === 'connection' ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                            >
                                Connection Request
                            </button>
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
                <div className="text-center mt-10">
                    <button onClick={handleGenerate} disabled={isLoading || !persona} className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                        {isLoading ? 'Generating...' : 'Generate Outreach'}
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

export default ColdOutreachPersonaliser;