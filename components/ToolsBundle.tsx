import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { CalculatorType } from '../types';
import WelcomeScreen from './WelcomeScreen';
import CostPerLeadCalculator from './CostPerLeadCalculator';
import LvrCalculator from './LvrCalculator';
import ColdOutreachPersonaliser from './ColdOutreachPersonaliser';
import IcpBuilder from './IcpBuilder';
import PainPointIdentifier from './PainPointIdentifier';
import PerformanceAnalyst from './PerformanceAnalyst';
import PostPunchlineMaker from './LinkedInCommentGenerator';
import PersonaPostWriter from './PersonaPostWriter';
import MultiStepEmailWriter from './MultiStepEmailWriter';
import { useAuth } from '../AuthContext';
import { sendUserToKlaviyo } from '../klaviyo';

interface ToolsBundleProps {
  user: User;
  onLogout: () => void;
}

// Header component
const Header = ({ onTutorialClick, onLogout }: { onTutorialClick: () => void, onLogout: () => void }) => (
  <header className="py-12 md:py-20 text-center relative z-10">
      <div className="absolute top-0 right-0 flex items-center gap-3 p-4">
          <p className="hidden md:block text-xs font-mono text-stone-400 truncate pr-2">
             USER_ID :: <span className="text-stone-600">{useAuth().user?.email}</span>
          </p>
          <button 
            onClick={onLogout}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 rounded-md transition-all shadow-sm"
          >
            Log Out
          </button>
      </div>

      <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200">
          <span className="text-stone-600 text-xs font-semibold uppercase tracking-widest">AI Growth Engine</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold font-heading text-stone-900 tracking-tight">
          LightPath AI
      </h1>
      <p className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
          AI powered tools that make agency selling easier, improve outreach, strengthen follow up and unlock faster revenue growth.
      </p>
      
      <div className="mt-10">
        <button 
            onClick={onTutorialClick}
            className="px-6 py-3 bg-white border border-stone-200 text-stone-700 font-medium rounded-md hover:bg-stone-50 transition-all duration-200 shadow-sm flex items-center gap-2 mx-auto"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-stone-500">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
            Tool Tutorials
        </button>
      </div>
  </header>
);

const Footer = ({ onDeleteAccount }: { onDeleteAccount: () => void }) => (
    <footer className="text-center mt-20 relative z-10 pb-12">
        <div className="max-w-4xl mx-auto bg-white border border-stone-200 rounded-lg shadow-card p-10">
            <div className="max-w-3xl mx-auto">
                <p className="text-lg text-stone-600 leading-relaxed">
                    We partner with advertising and marketing agencies to guarantee every lead of their clients are called inside 60 seconds. Faster response = higher conversions = clients who stay longer and spend more. Want to see how it works?
                </p>
                <div className="mt-8 flex justify-center items-center gap-8 text-lg">
                    <a 
                        href="https://www.lightpath.agency/contact" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-stone-900 hover:text-stone-600 hover:underline transition-colors"
                    >
                        Contact Us
                    </a>
                    <a 
                        href="mailto:luke@lightpath.agency"
                        className="font-medium text-stone-900 hover:text-stone-600 hover:underline transition-colors"
                    >
                        luke@lightpath.agency
                    </a>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100">
                    <div>
                        <button
                            onClick={onDeleteAccount}
                            className="px-4 py-2 text-xs uppercase tracking-wider font-bold bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                            Delete my account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );

const ToolsBundle: React.FC<ToolsBundleProps> = ({ user, onLogout }) => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType | null>(null);
  const { deleteAccount } = useAuth();

  useEffect(() => {
    if (user && user.email) {
        sendUserToKlaviyo(user.email, user.displayName?.split(' ')[0]);
    }
  }, [user]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This will remove your access to LightPath Tools."
    );
    if (!confirmed) return;
  
    try {
      await deleteAccount();
      await onLogout();
      window.location.reload();
    } catch (error: any) {
      alert("There was a problem deleting your account. Please log out and log back in, then try again.");
      console.error(error);
    }
  };

  const handleTutorialClick = () => {
    setActiveCalculator(null);
    setTimeout(() => {
        const element = document.getElementById('tool-tutorials-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const renderContent = () => {
    switch (activeCalculator) {
      case CalculatorType.CPL:
        return <CostPerLeadCalculator onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.LVR:
        return <LvrCalculator onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.OUTREACH:
        return <ColdOutreachPersonaliser onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.ICP:
        return <IcpBuilder onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.PAIN_POINT:
        return <PainPointIdentifier onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.PERFORMANCE_ANALYST:
        return <PerformanceAnalyst onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.POST_PUNCHLINE_MAKER:
        return <PostPunchlineMaker onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.PERSONA_POST_WRITER:
        return <PersonaPostWriter onBack={() => setActiveCalculator(null)} />;
      case CalculatorType.MULTI_STEP_EMAIL:
        return <MultiStepEmailWriter onBack={() => setActiveCalculator(null)} />;
      default:
        return <WelcomeScreen onSelect={setActiveCalculator} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfc] text-stone-900 relative selection:bg-stone-200">
      <div className="container mx-auto px-4 relative z-10">
        <Header onTutorialClick={handleTutorialClick} onLogout={onLogout} />
        
        <main className="animate-fade-in">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>
        
        <Footer onDeleteAccount={handleDeleteAccount} />
      </div>
    </div>
  );
};

export default ToolsBundle;