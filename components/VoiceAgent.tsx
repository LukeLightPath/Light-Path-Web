
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the LightPath Voice Assistant.
Your goal is to help agency owners understand how Voice AI and our performance tools can grow their business.

**CORE IDENTITY:**
- Tone: Professional, warm, conversational.
- Role: Expert in agency operations and speed-to-lead.
- Style: Concise (1-2 sentences max).

**WHAT WE DO:**
LightPath AI partners with agencies to deploy AI voice agents that call new leads in 60 seconds, qualify them, and book appointments.

**TOOLS:**
Explain these if asked: Lead Pricing Tool, LVR Calculator, Performance Analyst, Cold Outreach Personaliser, Post Punchline Maker, Persona Writer, ICP Builder, Pain Point Identifier, Email Writer.

**BEHAVIOUR:**
- Answer verbally.
- Keep text output hidden/minimal in the UI context, so focus on the voice.
- If asked about pricing/integrations, guide to a strategy call.

**FORMAT:**
Plain text only.`;

const VoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');

  // Refs
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        
        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          handleUserQuery(text);
        };
      }
    }
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    // Try to find a good voice, fallback to first available
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleUserQuery = async (query: string) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const aiResponse = response.text || "I'm sorry, I didn't get that.";
      
      speak(aiResponse);
    } catch (error) {
      console.error("AI Error:", error);
      speak("I'm having trouble connecting right now. Please try again.");
    } finally {
      setIsProcessing(false);
      setShowTextInput(false);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) {
        synthRef.current?.cancel();
        setIsSpeaking(false);
        return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserQuery(textInput);
      setTextInput('');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-16">
      {/* Minimalist Glass Container */}
      <div className="relative flex flex-col items-center justify-center min-h-[200px]">
        
        {/* --- STATE: SPEAKING (Waveform Visualizer) --- */}
        {isSpeaking ? (
             <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20 w-full flex flex-col items-center animate-fade-in">
                 {/* Animated Waveform */}
                 <div className="flex items-center justify-center gap-1.5 h-16 mb-6">
                    {[...Array(8)].map((_, i) => (
                        <div 
                            key={i}
                            className="w-2 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                            style={{
                                height: '30%',
                                animation: `wave 0.8s ease-in-out infinite`,
                                animationDelay: `${i * 0.1}s` 
                            }}
                        ></div>
                    ))}
                 </div>
                 <button 
                    onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); }}
                    className="text-xs font-bold tracking-widest text-slate-400 hover:text-white transition-colors uppercase"
                 >
                    Stop Speaking
                 </button>
             </div>
        ) : (
        
        /* --- STATE: IDLE / LISTENING --- */
            <div className="flex flex-col items-center">
                {/* Main Pulsing Button */}
                <button 
                    onClick={toggleListening}
                    className={`relative group flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-md border transition-all duration-500 ${
                        isListening 
                            ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]' 
                            : isProcessing
                                ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 animate-pulse'
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]'
                    }`}
                >
                    {isListening ? (
                        <div className="flex gap-1">
                             <span className="w-1 h-3 bg-red-500 rounded-full animate-[bounce_1s_infinite]"></span>
                             <span className="w-1 h-5 bg-red-500 rounded-full animate-[bounce_1.2s_infinite]"></span>
                             <span className="w-1 h-3 bg-red-500 rounded-full animate-[bounce_1s_infinite]"></span>
                        </div>
                    ) : isProcessing ? (
                         <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </button>
                
                <p className="mt-6 text-lg font-medium text-slate-300 tracking-wide">
                    {isListening ? "Listening..." : isProcessing ? "Thinking..." : "Ask LightPath AI"}
                </p>

                {!isListening && !isProcessing && (
                    <button 
                        onClick={() => setShowTextInput(!showTextInput)}
                        className="mt-3 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                        {showTextInput ? "Cancel" : "Type instead"}
                    </button>
                )}
            </div>
        )}

        {/* Text Input (Slide Up) */}
        {showTextInput && !isSpeaking && (
            <form onSubmit={handleTextSubmit} className="mt-6 w-full max-w-md animate-fade-in-up">
                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                    <input 
                        type="text" 
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Ask about lead qualification..."
                        className="flex-1 bg-transparent border-none px-4 py-2 text-sm text-white focus:ring-0 placeholder-slate-500"
                        autoFocus
                    />
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm transition-colors"
                    >
                        →
                    </button>
                </div>
            </form>
        )}
        
        <style>{`
            @keyframes wave {
                0%, 100% { height: 30%; opacity: 0.5; }
                50% { height: 100%; opacity: 1; }
            }
        `}</style>
      </div>
    </div>
  );
};

export default VoiceAgent;
