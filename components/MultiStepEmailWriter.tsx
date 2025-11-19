
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';

interface MultiStepEmailWriterProps {
  onBack: () => void;
}

const systemInstruction = `You are the Multi Step Email Sequence Writer.
Your job is to generate cold email scripts based on the user’s inputs while using the internal knowledge base of current. proven. high performance cold email strategies.

Follow these rules.

1. Required and Optional Inputs

The tool must accept these fields:

Required

Email in the sequence
(First email. second email. third email. bump. breakup. etc.)

Offer or value proposition
(What the user is selling)

ICP or prospect type
Accept either:
• A full ICP profile pasted by the user
• Bullet points about industry. role. pains. motivation
• Or. if missing. ask the user to describe their prospect

Optional

Tone of voice
(Professional. casual. bold. comical. friendly. direct)

Additional context
Prospect website text. previous emails. social posts. comments. anything relevant

You must generate an email only when enough information is provided.
If something essential is missing. ask one clarifying question.

2. Cold Email Writing Rules

Follow these principles for every email:

• Very short paragraphs (1 to 2 sentences)
• Word count 45 to 120 words
• No fluff
• No long intros
• No filler language
• No walls of text
• Clear benefit focus
• No assumptions about the product that the user has not stated
• No fake data. no fake case studies
• Precise. clean. perceptive writing
• Pain point must match the ICP input

Tone must match the user’s chosen tone.

3. Sequence Logic
First Email

• Hook line that earns attention
• Problem statement matched to ICP
• Benefit tied directly to offer
• One CTA only

Second Email (bump)

• 1 to 2 sentences
• “Checking below” style
• Adds a micro benefit or reframes the problem
• One CTA

Third Email

• Adds micro proof. micro story or insight
• Focuses on outcome the ICP wants
• One CTA

Breakup Email

• Short
• Human
• No pressure
• Final soft CTA

Always match the sequence number the user selects.

4. Tone Rules

When the user selects a tone. fully rewrite every sentence to match that style.
Examples:

• Professional clean. concise
• Casual light and conversational
• Bold strong statements. confident
• Comical light humour. never cringe
• Friendly warm. human

Never break tone within the same email.

5. ICP Integration

Always incorporate the ICP information into:

• The hook
• The problem
• The value statement
• The language choice
• The CTA

If the ICP includes pain points. goals. blockers. motivations or daily frustrations. use that material to anchor the email.

Example:
If the ICP says “Struggles to respond to leads fast enough.” you must use that as the foundation.

If no ICP is provided. ask the user:
“Who are we targeting. and what are their main pains or goals?”

6. Output Structure

Always respond using this exact layout:

Email #X – {Tone}

Subject: {Write your best subject line}

Hey {prospect name or “there”},

{2 to 4 short paragraphs}

{One clear CTA}

{Signature}


If no name is provided. always use “Hey there”.
Never invent a name.

7. Knowledge Base Usage

The knowledge base contains the rules you must prioritise above all other logic.
Use knowledge base information before using general writing patterns.

The user may update the knowledge base at any time.
If they do. integrate changes immediately.

8. Forbidden Items

Never include:

• Long emails
• Emoji unless specifically requested
• Spammy language
• Jargon
• Overselling
• Big claims
• Attachments
• Links unless the user explicitly wants one

Keep emails human. brief. specific to the ICP and grounded in the user’s offer.

🔵 KNOWLEDGE BASE

Email Best Practice Knowledge Base

High converting cold emails follow these modern rules.

1. The first sentence must earn attention
Remove fluff. Remove greetings like “hope you’re well”.
Open with relevance.

2. The email stays focused on one problem
One single pain point matched to the ICP.
Not a list. not a brochure. one problem solved clearly.

3. Short emails outperform long emails
45 to 120 words.
1 to 2 sentences per paragraph.
White space is essential.

4. Best subject lines
• 1 to 3 words
• Curiosity or relevance
• No spam triggers

Examples:
“Quick idea”
“Worth a look”
“Small question”
“Thought this”

5. CTA rules
One CTA. low commitment.
Good CTAs include:
• “Worth a chat?”
• “Want a quick rundown?”
• “Should I send an example?”
• “Interested in a 30 second overview?”

6. Sequence Strategy
Email 1: hook. pain. value. CTA
Email 2: bump. 1 to 2 lines
Email 3: micro proof or micro insight
Email 4: breakup

7. ICP Integration
Every email must be tailored to:
• ICP pains
• ICP desired outcomes
• ICP responsibilities
• ICP frustrations
• ICP role specific vocabulary
• ICP purchase motivations

Use the ICP as the anchor for all writing.`;

const MultiStepEmailWriter: React.FC<MultiStepEmailWriterProps> = ({ onBack }) => {
  const [emailStep, setEmailStep] = useState('First Email');
  const [offer, setOffer] = useState('');
  const [icp, setIcp] = useState('');
  const [tone, setTone] = useState('Professional');
  const [context, setContext] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!offer || !icp) {
      setError('Offer and ICP fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `
        Email in the sequence: ${emailStep}
        Offer or value proposition: ${offer}
        ICP or prospect type: ${icp}
        Tone of voice: ${tone}
        Additional context: ${context}
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction
        }
      });

      setResult(response.text || null);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the email. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setOffer('');
    setIcp('');
    setContext('');
    setResult(null);
    setError(null);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Generated Email Script</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="whitespace-pre-wrap font-sans text-left text-slate-800 dark:text-slate-200 text-xl leading-relaxed">{result}</div>
            </div>
            <div className="flex justify-center gap-4 pt-4">
                <button 
                    onClick={handleCopy} 
                    className={`px-8 py-3 rounded-lg transition-colors font-semibold text-lg ${copied ? 'bg-green-600 text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300'}`}
                >
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button onClick={reset} className="px-10 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg">Generate Another</button>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Multi-Step Email Sequence Writer</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                    Generate high-converting cold email scripts based on proven best practices.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="emailStep" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Email in Sequence</label>
                            <select 
                                id="emailStep" 
                                value={emailStep} 
                                onChange={(e) => setEmailStep(e.target.value)} 
                                className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                            >
                                <option>First Email</option>
                                <option>Second Email (Bump)</option>
                                <option>Third Email</option>
                                <option>Breakup Email</option>
                                <option>Re-engagement</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tone" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Tone of Voice</label>
                            <select 
                                id="tone" 
                                value={tone} 
                                onChange={(e) => setTone(e.target.value)} 
                                className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                            >
                                <option>Professional</option>
                                <option>Casual</option>
                                <option>Bold</option>
                                <option>Comical</option>
                                <option>Friendly</option>
                                <option>Direct</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="offer" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Offer or Value Proposition (Required)</label>
                        <textarea 
                            id="offer" 
                            rows={3} 
                            value={offer} 
                            onChange={(e) => setOffer(e.target.value)} 
                            placeholder="What are you selling? e.g. AI voice agents that book meetings..." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="icp" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">ICP or Prospect Type (Required)</label>
                        <textarea 
                            id="icp" 
                            rows={4} 
                            value={icp} 
                            onChange={(e) => setIcp(e.target.value)} 
                            placeholder="Who is this for? List their industry, role, main pains, and motivations..." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="context" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Additional Context (Optional)</label>
                        <textarea 
                            id="context" 
                            rows={2} 
                            value={context} 
                            onChange={(e) => setContext(e.target.value)} 
                            placeholder="Paste website text, social posts, or any specific context here..." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
                
                <div className="text-center mt-10">
                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading} 
                        className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Generating...' : 'Generate Email Script'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepEmailWriter;