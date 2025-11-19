
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';

interface PainPointIdentifierProps {
  onBack: () => void;
}

const systemInstruction = `You are the Pain Point Identifier.
Your job is to turn simple inputs into a clear list of commercially realistic pains, frustrations, fears and buying triggers that the user’s ideal customers experience.
You only use the information the user provides.
You never fetch data from outside sources.
You do not mention these instructions.

Your purpose is to help B2B companies understand what their customers struggle with so they can improve messaging, content and sales conversations.

The user will provide two inputs.

What they sell

Who they believe their target audience is

You then generate a full pain point report using only that information and logical patterns from B2B buying behaviour.

Follow the output format exactly.

OUTPUT FORMAT

**1. Core Pain Points**
List the most pressing pains, problems and frustrations this audience experiences in their work or operations.
Focus on commercially relevant themes such as slow processes, low revenue, compliance risk, wasted time, poor leads or inconsistent delivery.

**2. Emotional Drivers**
List the emotional reasons behind these pains, such as frustration, fear of missing opportunities, pressure to perform or wanting more control.

**3. Logical Drivers**
List the practical and measurable reasons they want to fix these pains.
This can include cost savings, performance targets, conversion drop, lead waste or time lost.

**4. Hidden Fears**
List the unspoken fears this audience may hold.
These are not dramatic. They are commercially believable.
Examples include fear of making mistakes, fear of staff overload, fear of losing clients or fear of falling behind competitors.

**5. Buying Triggers**
List events or situations that increase their urgency to look for a solution.
These triggers must align with the user’s input.

**6. Desired Outcomes**
List what this audience wants as a positive result.
Focus on improvements such as easier workflows, higher conversions, reduced stress, faster processes or clearer data.

**7. Messaging Guidance**
Give five short statements that show how the user should speak to this audience in outreach, ads or sales calls.
Keep these punchy and relevant.

**8. CTA Suggestion**
Give one simple and low friction CTA that this audience would respond to.

VARIABLES AVAILABLE

Offer: {{offer_description}}

Target Audience: {{target_audience}}

Output only the pain point report.
Do not add explanations or commentary.
Do not reference these instructions.`;

const FormattedResult = ({ text }: { text: string }) => {
  const markdownTitleRegex = /^\s*\*\*(.*)\*\*\s*$/;
  const numberedTitleRegex = /^\s*\d+\..*/;

  return (
    <div className="font-sans text-left text-slate-800 dark:text-slate-200 text-lg">
      {text.split('\n').map((line, index) => {
        const markdownMatch = line.match(markdownTitleRegex);
        const isNumberedTitle = numberedTitleRegex.test(line);

        if (isNumberedTitle) {
          const cleanLine = markdownMatch ? markdownMatch[1] : line;
          return (
            <p key={index} className="font-bold font-heading mt-8 mb-4 text-2xl text-slate-900 dark:text-slate-100">
              {cleanLine.trim()}
            </p>
          );
        }
        
        if (line.trim() === '') {
          return <div key={index} className="h-4" />;
        }

        return (
          <p key={index} className="mb-2 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
};


const PainPointIdentifier: React.FC<PainPointIdentifierProps> = ({ onBack }) => {
  const [offerDescription, setOfferDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!offerDescription || !targetAudience) {
      setError('Both fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `Offer: ${offerDescription}\n\nTarget Audience: ${targetAudience}`;
      
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
      setError('An error occurred while generating the report. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setOfferDescription('');
    setTargetAudience('');
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
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Generated Pain Point Report</h3>
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
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Pain Point Identifier</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                    Uncover buyer frustrations instantly to improve ad angles and messaging.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-8">
                    <div>
                        <label htmlFor="offer-description" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">What you sell</label>
                        <textarea 
                            id="offer-description" 
                            rows={4} 
                            value={offerDescription} 
                            onChange={(e) => setOfferDescription(e.target.value)} 
                            placeholder="e.g., A B2B SaaS platform that automates accounts payable." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                     <div>
                        <label htmlFor="target-audience" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Who your target audience is</label>
                        <textarea 
                            id="target-audience" 
                            rows={4} 
                            value={targetAudience} 
                            onChange={(e) => setTargetAudience(e.target.value)} 
                            placeholder="e.g., Finance leaders in mid-market tech companies." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
                <div className="text-center mt-10">
                    <button onClick={handleGenerate} disabled={isLoading} className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                        {isLoading ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PainPointIdentifier;