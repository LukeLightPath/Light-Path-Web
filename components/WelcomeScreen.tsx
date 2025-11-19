
import React from 'react';
import { CalculatorType } from '../types';
import { CplIcon, LvrIcon, OutreachIcon, IcpIcon, PainPointIcon, PerformanceAnalystIcon, PostPunchlineMakerIcon, PersonaPostWriterIcon, EmailSequenceIcon } from './icons';

interface WelcomeScreenProps {
  onSelect: (type: CalculatorType) => void;
}

const tutorials = [
  {
    title: "Lead Pricing Tool",
    description: "Calculate the max CPL your client can afford and your ideal price per lead.",
    videoId: "VIDEO_ID_LEAD_PRICING"
  },
  {
    title: "Advanced Lead Velocity Rate",
    description: "Forecast monthly leads and revenue to quantify your campaign impact.",
    videoId: "VIDEO_ID_ALVR"
  },
  {
    title: "Performance Analyst",
    description: "Benchmark your ad results against industry standards to find improvement areas.",
    videoId: "VIDEO_ID_PERFORMANCE"
  },
  {
    title: "Cold Outreach Personaliser",
    description: "Generate personalised LinkedIn outreach messages to win more agency clients.",
    videoId: "VIDEO_ID_OUTREACH"
  },
  {
    title: "Post Punchline Maker",
    description: "Create funny, relevant comments for LinkedIn posts in seconds.",
    videoId: "VIDEO_ID_PUNCHLINE"
  },
  {
    title: "Persona Post Writer",
    description: "Generate a LinkedIn post in the voice of a specific author persona.",
    videoId: "VIDEO_ID_PERSONA_POST"
  },
  {
    title: "ICP Builder",
    description: "Turn raw notes into a clear, accurate Ideal Customer Profile in seconds.",
    videoId: "VIDEO_ID_ICP"
  },
  {
    title: "Pain Point Identifier",
    description: "Uncover buyer frustrations instantly to improve ad angles and messaging.",
    videoId: "VIDEO_ID_PAIN_POINTS"
  },
  {
    title: "Multi Step Email Writer",
    description: "Generate high converting cold email scripts for any step of your sequence.",
    videoId: "VIDEO_ID_EMAIL_WRITER"
  }
];

const ToolCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    fullWidth = false 
}: { 
    title: string; 
    description: string; 
    icon: any; 
    onClick: () => void; 
    fullWidth?: boolean; 
}) => (
    <button
        onClick={onClick}
        className={`group relative p-8 bg-white dark:bg-charcoal/50 backdrop-blur-md border border-slate-200 dark:border-white/5 hover:border-blue-400 dark:hover:border-cyan-500/30 rounded-2xl text-left transition-all duration-300 shadow-sm hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden ${fullWidth ? 'md:col-span-2' : ''}`}
    >
        {/* Gradient Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-cyan-500/5 dark:to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 group-hover:scale-110 group-hover:border-blue-400 dark:group-hover:border-cyan-500/30 transition-all duration-300">
                <Icon className="w-7 h-7 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading group-hover:text-blue-700 dark:group-hover:text-cyan-100 transition-colors">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-base leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{description}</p>
            
            <div className="mt-auto pt-6 flex items-center text-sm font-bold text-blue-600 dark:text-cyan-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                OPEN TOOL <span className="ml-2">→</span>
            </div>
        </div>
    </button>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelect }) => {
  return (
    <div className="animate-fade-in">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToolCard 
            title="Lead Pricing Tool"
            description="Calculate the max CPL your client can afford and your ideal price per lead."
            icon={CplIcon}
            onClick={() => onSelect(CalculatorType.CPL)}
        />
        <ToolCard 
            title="Advanced Lead Velocity Rate"
            description="Forecast monthly leads and revenue to quantify your campaign impact."
            icon={LvrIcon}
            onClick={() => onSelect(CalculatorType.LVR)}
        />
        <ToolCard 
            title="Performance Analyst"
            description="Benchmark your ad results against industry standards to find improvement areas."
            icon={PerformanceAnalystIcon}
            onClick={() => onSelect(CalculatorType.PERFORMANCE_ANALYST)}
            fullWidth
        />
        <ToolCard 
            title="Cold Outreach Personaliser"
            description="Generate personalised LinkedIn outreach messages to win more agency clients."
            icon={OutreachIcon}
            onClick={() => onSelect(CalculatorType.OUTREACH)}
        />
        <ToolCard 
            title="Post Punchline Maker"
            description="Generate funny, relevant comments for LinkedIn posts in seconds."
            icon={PostPunchlineMakerIcon}
            onClick={() => onSelect(CalculatorType.POST_PUNCHLINE_MAKER)}
        />
        <ToolCard 
            title="Persona Post Writer"
            description="Generate a LinkedIn post in the voice of a specific author persona."
            icon={PersonaPostWriterIcon}
            onClick={() => onSelect(CalculatorType.PERSONA_POST_WRITER)}
            fullWidth
        />
        <ToolCard 
            title="ICP Builder"
            description="Turn raw notes into a clear, accurate Ideal Customer Profile in seconds."
            icon={IcpIcon}
            onClick={() => onSelect(CalculatorType.ICP)}
        />
        <ToolCard 
            title="Pain Point Identifier"
            description="Uncover buyer frustrations instantly to improve ad angles and messaging."
            icon={PainPointIcon}
            onClick={() => onSelect(CalculatorType.PAIN_POINT)}
        />
        <ToolCard 
            title="Multi-Step Email Writer"
            description="Generate high-converting cold email scripts for any step of your sequence."
            icon={EmailSequenceIcon}
            onClick={() => onSelect(CalculatorType.MULTI_STEP_EMAIL)}
            fullWidth
        />
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* External Tools Links - Styled to match */}
             {[
                 { title: "Lead Wastage Calculator", url: "https://chatgpt.com/g/g-6918690a78608191a4e0b2dfc4896b5a-lead-wastage-calculator", desc: "Reveal how many leads your clients are losing from slow follow-ups." },
                 { title: "Sales Objection Coach", url: "https://chatgpt.com/g/g-691999e795648191a41e9d4a056cabf7-sales-objection-coach", desc: "Sharpen your sales skills with interactive objection practice." },
                 { title: "Cold Email Script Optimiser", url: "https://chatgpt.com/g/g-6919eb27303081919066b8ff66eaa09d-cold-email-script-optimiser-gpt", desc: "Paste your email and get a full breakdown of what’s working and what isn’t." },
                 { title: "Grand Slam Offer Creator", url: "https://chatgpt.com/g/g-691b2254cc5c819183aec6f01c291f36-grand-slam-offer-creator", desc: "Create irresistible, high value offers for your agency or clients." }
             ].map((link, i) => (
                <a 
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 p-5 rounded-xl transition-all duration-300 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white flex items-center gap-2 font-heading">
                            <span className="text-yellow-500 dark:text-yellow-400">👉</span> {link.title}
                        </span>
                        <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{link.desc}</p>
                </a>
             ))}
        </div>
      </div>

      {/* Tool Tutorials Section */}
      <div id="tool-tutorials-section" className="mt-20 pt-12 border-t border-slate-200 dark:border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            Tool Tutorials
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Watch short tutorials on each tool in the LightPath AI Agency Performance Suite so you can get value in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white dark:bg-charcoal border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-blue-300 dark:hover:border-white/20 transition-colors group shadow-sm">
              {/* Video Container */}
              <div className="w-full aspect-video bg-black relative">
                <iframe 
                  src={`https://www.youtube.com/embed/${tutorial.videoId}`}
                  title={`${tutorial.title} Tutorial`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {tutorial.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;