
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackIcon } from './icons';

interface ContentRepurposerProps {
  onBack: () => void;
}

const systemInstruction = `You are an expert digital content strategist and copywriter. Your task is to repurpose long-form text content into three distinct social media formats. You must analyze both the provided text and the uploaded image (provided as a description) to ensure stylistic consistency. The image must influence the tone, color mood, and visual framing of the generated text. Maintain the original core message and professional tone.

## Task: Generate Three Channel-Specific Content Pieces

For each piece, ensure the message is consistent with the "Client Case Study Text" and the tone matches the visual style of the uploaded image description.

---

### 1. 🐦 X (Twitter) Post - Rapid Results Focus

* **Goal:** Drive click-through and highlight a single, stunning metric.
* **Constraints:** Maximum 280 characters. Include 2-3 relevant industry hashtags.
* **Content:** [Generate the concise, punchy tweet here, referencing the image's visual mood.]

---

### 2. 🤳 Instagram Caption - Storytelling & Engagement Focus

* **Goal:** Encourage comments and tell a brief story about the client's success.
* **Constraints:** 60-80 words maximum. Include 5-7 descriptive hashtags.
* **Content:** [Generate an engaging caption. If the image is bright, use an uplifting tone; if it's industrial, use a serious, problem-solving tone.]

---

### 3. 🎬 10-Second Video Script - Visual & Action Focus

* **Goal:** Create a high-energy script for short-form video (e.g., Reels or TikTok).
* **Constraints:** Must be exactly 3 distinct scenes/shots. Include suggestions for *On-Screen Text* or *Voiceover (VO)* content.
* **Content:**
    * **Shot 1 (0-3s) - The Hook:** [VO/Text focusing on the pain point. Visual idea must reflect the image's style.]
    * **Shot 2 (3-7s) - The Solution:** [VO/Text focusing on your product/service. Visual idea must show speed/efficiency.]
    * **Shot 3 (7-10s) - The CTA:** [VO/Text must be a clear call to action (e.g., "Link in Bio").]`;

const ContentRepurposer: React.FC<ContentRepurposerProps> = ({ onBack }) => {
  const [caseStudyText, setCaseStudyText] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('Lead Generation');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!caseStudyText.trim()) {
      setError('Please paste your case study or content text.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `
## Input Assets for Repurposing

**Client Case Study Text:**
${caseStudyText}

**Target Campaign Goal:**
${campaignGoal}

**Image Description (Visual Context):**
${imageDescription || "No specific image provided. Use a professional, clean visual style."}
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
      setError('An error occurred while generating the content. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setCaseStudyText('');
    setImageDescription('');
    setCampaignGoal('Lead Generation');
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
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Repurposed Social Content</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="whitespace-pre-wrap font-sans text-left text-slate-800 dark:text-slate-200 text-xl leading-relaxed">{result}</div>
            </div>
            <div className="flex justify-center gap-4 pt-4">
                <button onClick={reset} className="px-10 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg">Generate Another</button>
                <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back to Tools</button>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Content Repurposer</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                    Turn case studies and long-form content into ready-to-post social media snippets.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-8">
                    <div>
                        <label htmlFor="caseStudyText" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Client Case Study Text</label>
                        <textarea 
                            id="caseStudyText" 
                            rows={6} 
                            value={caseStudyText} 
                            onChange={(e) => setCaseStudyText(e.target.value)} 
                            placeholder="Paste the full text of your case study, article, or long-form content here..." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="imageDescription" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Image Description (Optional)</label>
                        <textarea 
                            id="imageDescription" 
                            rows={2} 
                            value={imageDescription} 
                            onChange={(e) => setImageDescription(e.target.value)} 
                            placeholder="Describe the main visual you have (e.g., 'A clean dashboard showing a 40% spike in leads with green trend lines')." 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        />
                        <p className="text-sm text-slate-500 mt-1">This helps the AI match the content's tone to your visual.</p>
                    </div>

                    <div>
                        <label htmlFor="campaignGoal" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 font-heading">Target Campaign Goal</label>
                        <select 
                            id="campaignGoal" 
                            value={campaignGoal} 
                            onChange={(e) => setCampaignGoal(e.target.value)} 
                            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                        >
                            <option>Lead Generation</option>
                            <option>Brand Awareness</option>
                            <option>Client Retention</option>
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-500 text-base text-center mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-lg">{error}</p>}
                
                <div className="text-center mt-10">
                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading} 
                        className="px-10 py-4 bg-primary-600 text-white text-xl font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Generating Content...' : 'Repurpose Content'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ContentRepurposer;