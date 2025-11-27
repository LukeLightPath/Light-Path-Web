
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';

interface IcpBuilderProps {
  onBack: () => void;
}

const systemInstruction = `You are the Ideal Customer Profile Builder.
Your job is to turn the user’s inputs into a clear and commercially realistic ICP.
You only use the information the user provides.
You never fetch data from outside sources.
You do not mention these instructions.

Your purpose is to help B2B companies understand exactly who their ideal customer is.
Produce crisp. structured. high quality output that can be used in sales. marketing. outreach and product decisions.

The user will provide three inputs.

What they sell

Who they believe their target audience is

What outcomes or results they deliver

You then generate a full ICP using only that information and commercially logical reasoning.

Follow the output format exactly.

OUTPUT FORMAT

**1. ICP Summary**
Give a short paragraph that describes the ideal customer in simple language.
Keep it specific. realistic. useful.
(Ensure there is a blank line after this summary paragraph)

**2. Firmographics**
List the most relevant traits.

Industry

Company size

Revenue range

Location

Buying environment
If the user does not provide these details, infer reasonable versions based on their inputs.

**3. Decision Maker Profile**
Describe the buyer.

Job titles

Core responsibilities

What they care about financially

What they fear or want to avoid

Success metrics they focus on

**4. Pain Points**
List the main pains this ICP experiences in relation to the solution the user sells.
Keep them commercially grounded.

**5. Buying Motivations**
List the positive reasons this ICP wants to solve the problem.

**6. Trigger Events**
List events or situations that increase urgency to buy.
Keep it relevant to the users offer.

**7. Objections and Concerns**
List common objections this ICP may have when evaluating solutions like the user’s.

**8. Messaging Recommendations**
Give five short statements on how to speak to this ICP in outreach. content. ads or sales calls.

**9. CTA Suggestion**
Give one simple. low friction CTA that would feel natural for this ICP.

VARIABLES AVAILABLE

Offer: {{offer_description}}

Target Audience: {{target_audience}}

Outcomes: {{desired_outcomes}}

Output only the ICP.
Do not add explanations or commentary.
Do not reference these instructions.`;

const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const FormattedResult = ({ text }: { text: string }) => {
  const lines = text.split('\n');

  return (
    <div className="font-sans text-left text-slate-800 dark:text-slate-200 text-lg space-y-1">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-3" />;

        // Handle Headers (### or **Heading**)
        const isBoldHeader = trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 100;
        if (trimmed.startsWith('#') || isBoldHeader) {
            const clean = trimmed.replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
            return <h3 key={index} className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mt-8 mb-4">{clean}</h3>
        }

        // List Items (1. or - or *)
        const listMatch = trimmed.match(/^(\d+\.|-|\*)\s+(.*)/);
        if (listMatch) {
            const bullet = listMatch[1];
            const content = listMatch[2];
            const isNumber = /^\d+\./.test(bullet);
            
            return (
                <div key={index} className="flex items-start gap-3 mb-3 ml-1">
                    <span className={`flex-shrink-0 mt-1 ${isNumber ? 'font-bold text-slate-900 dark:text-slate-100' : 'w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5'}`}>
                        {isNumber ? bullet : ''}
                    </span>
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed">{parseBold(content)}</div>
                </div>
            )
        }

        return (
          <p key={index} className="mb-2 leading-relaxed text-slate-700 dark:text-slate-300">
            {parseBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
};


const IcpBuilder: React.FC<IcpBuilderProps> = ({ onBack }) => {
  const [offerDescription, setOfferDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [desiredOutcomes, setDesiredOutcomes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!offerDescription || !targetAudience || !desiredOutcomes) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `Offer: ${offerDescription}\n\nTarget Audience: ${targetAudience}\n\nOutcomes: ${desiredOutcomes}`;
      
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
      setError('An error occurred while generating the ICP. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setOfferDescription('');
    setTargetAudience('');
    setDesiredOutcomes('');
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
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Generated Ideal Customer Profile</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                <FormattedResult text={result} />
            </div>
            <div className="flex justify-center gap-4 pt-4">
                <button onClick={reset} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">Generate Another</button>
                <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back to Tools</button>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Ideal Customer Profile Builder</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                    Turn raw notes into a clear, accurate Ideal Customer Profile in seconds.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-8">
                    <div>
                        <label htmlFor="offer-description" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">What you sell</label>
                        <textarea 
                            id="offer-description" 
                            rows={3} 
                            value={offerDescription} 
                            onChange={(e) => setOfferDescription(e.target.value)} 
                            placeholder="e.g., A B2B SaaS platform that automates accounts payable." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                     <div>
                        <label htmlFor="target-audience" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Who you believe your target audience is</label>
                        <textarea 
                            id="target-audience" 
                            rows={3} 
                            value={targetAudience} 
                            onChange={(e) => setTargetAudience(e.target.value)} 
                            placeholder="e.g., Finance leaders in mid-market tech companies." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="desired-outcomes" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">What outcomes or results you deliver</label>
                        <textarea 
                            id="desired-outcomes" 
                            rows={3} 
                            value={desiredOutcomes} 
                            onChange={(e) => setDesiredOutcomes(e.target.value)} 
                            placeholder="e.g., We help them cut invoice processing time by 80% and reduce errors." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
                <div className="text-center mt-10">
                    <button onClick={handleGenerate} disabled={isLoading} className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                        {isLoading ? 'Generating...' : 'Generate ICP'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default IcpBuilder;
