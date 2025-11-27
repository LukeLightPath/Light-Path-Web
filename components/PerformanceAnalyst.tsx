
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';

interface PerformanceAnalystProps {
  onBack: () => void;
}

const systemInstruction = `You are an advertising performance analyst who benchmarks client results against realistic industry standards. You never use external live data. You base all comparisons on general industry benchmarks, historical averages, and best practice ranges that you already know. You always provide clear insights without overstating certainty.

Your job is to compare the user's marketing metrics against typical industry benchmarks for the industry they select. You must return a competitiveness score, a table of comparisons, a short insights section, and an action plan to improve performance.

Use simple language. Each section must be clear and easy to understand. Keep the tone professional and concise.

Your output must follow this structure:

Competitiveness Score Summary

Benchmark Comparison Table

Key Insights

Action Plan

Short Conclusion

Rules:

Never fabricate exact competitor numbers.

Only use typical averages and ranges for the industry chosen.

If the user inputs unrealistic numbers, politely flag them.

If an industry is unknown, choose the closest logical category.

All comparisons must be based on user inputs vs typical industry ranges.`;

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
    <div className="space-y-1 font-sans text-left text-slate-800 dark:text-slate-200 text-lg">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-3" />;

        // Headers (### or ##)
        if (trimmed.startsWith('#')) {
           const clean = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
           return <h3 key={index} className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mt-8 mb-4">{clean}</h3>
        }
        
        // Explicit Section Titles fallback (if AI doesn't use #)
        const isSectionTitle = ["Competitiveness Score Summary", "Benchmark Comparison Table", "Key Insights", "Action Plan", "Short Conclusion"].some(t => trimmed.includes(t));
        if (isSectionTitle && trimmed.length < 100) {
            return <h3 key={index} className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mt-8 mb-4">{trimmed.replace(/\*\*/g, '')}</h3>
        }

        // Tables (| Col | Col |)
        if (trimmed.startsWith('|')) {
            // Ignore separator rows (e.g. |---|---|)
            if (trimmed.match(/^\|?[-:\s|]+\|?$/)) return null;
            
            const cells = trimmed.split('|').filter(c => c.trim());
            // If the row contains "Metric" or looks like a header
            const isHeader = cells.some(c => c.includes('Metric') || c.includes('Status') || c.includes('Benchmark'));

            return (
                <div key={index} className={`grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-b ${isHeader ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-900 dark:text-slate-100 rounded-t-lg' : 'border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    {cells.map((cell, i) => (
                        <div key={i} className="px-2 text-sm md:text-base flex items-center">{parseBold(cell.trim())}</div>
                    ))}
                </div>
            )
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

        return <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">{parseBold(trimmed)}</p>
      })}
    </div>
  );
};


const PerformanceAnalyst: React.FC<PerformanceAnalystProps> = ({ onBack }) => {
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [adSpend, setAdSpend] = useState('');
  const [cpl, setCpl] = useState('');
  const [ctr, setCtr] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [landingPageConversionRate, setLandingPageConversionRate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!industry || !region || !adSpend || !cpl || !ctr || !conversionRate || !landingPageConversionRate) {
      setError('All fields except "Notes" are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `
        Industry: ${industry}
        Region or Country: ${region}
        Monthly Ad Spend: ${adSpend}
        Cost per Lead: ${cpl}
        Click Through Rate: ${ctr}%
        Conversion Rate: ${conversionRate}%
        Landing Page Conversion Rate: ${landingPageConversionRate}%
        Notes or assumptions: ${notes || 'None'}
      `;
      
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
      setError('An error occurred while generating the analysis. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setIndustry('');
    setRegion('');
    setAdSpend('');
    setCpl('');
    setCtr('');
    setConversionRate('');
    setLandingPageConversionRate('');
    setNotes('');
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
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Performance Analysis Report</h3>
            </div>
            <div className="bg-[#FFFFFF] dark:bg-slate-800 p-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 shadow-sm">
                <FormattedResult text={result} />
            </div>
            <div className="flex justify-center gap-4 pt-4">
                <button onClick={reset} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">Run New Analysis</button>
                <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back to Tools</button>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
             <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Advertising Performance Analyst</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                    Benchmark your ad results against industry standards to find improvement areas.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="industry" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Industry</label>
                            <input type="text" id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g., B2B SaaS" className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                        </div>
                        <div>
                            <label htmlFor="region" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Region/Country</label>
                            <input type="text" id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g., USA" className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="ad-spend" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Monthly Ad Spend ($)</label>
                            <input type="number" id="ad-spend" value={adSpend} onChange={(e) => setAdSpend(e.target.value)} placeholder="e.g., 10000" className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                        </div>
                        <div>
                            <label htmlFor="cpl" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Cost per Lead ($)</label>
                            <input type="number" id="cpl" value={cpl} onChange={(e) => setCpl(e.target.value)} placeholder="e.g., 50" className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label htmlFor="ctr" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Click Through Rate (%)</label>
                            <input type="number" id="ctr" value={ctr} onChange={(e) => setCtr(e.target.value)} placeholder="e.g., 2.5" className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                        </div>
                        <div>
                            <label htmlFor="conversion-rate" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Conversion Rate (%)</label>
                            <input type="number" id="conversion-rate" value={conversionRate} onChange={(e) => setConversionRate(e.target.value)} placeholder="e.g., 5" className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                        </div>
                        <div>
                            <label htmlFor="lp-conversion-rate" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Landing Page CVR (%)</label>
                            <input type="number" id="lp-conversion-rate" value={landingPageConversionRate} onChange={(e) => setLandingPageConversionRate(e.target.value)} placeholder="e.g., 15" className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Notes or assumptions (Optional)</label>
                        <textarea 
                            id="notes" 
                            rows={2} 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            placeholder="e.g., Campaign is focused on top-of-funnel awareness." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
                <div className="text-center mt-10">
                    <button onClick={handleGenerate} disabled={isLoading} className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                        {isLoading ? 'Generating...' : 'Generate Analysis'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceAnalyst;
