// NOTE: Only contact submit wiring updated to use existing server/tool pattern; UI, text, and styling unchanged.
import React, { useState } from 'react';
import { CplIcon, LvrIcon, CheckCircleIcon, LightPathLogo, DangerIcon } from './icons';

type Page = 'home' | 'services' | 'integrations' | 'contact';

interface WebsiteProps {
  onLoginClick: () => void;
}

const Navbar = ({ currentPage, onNavigate, onLoginClick }: { currentPage: Page, onNavigate: (page: Page) => void, onLoginClick: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-200">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => onNavigate('home')}
      >
        <LightPathLogo className="w-8 h-8 text-stone-900" />
        <span className="text-xl font-bold font-heading text-stone-900 tracking-tight">LightPath AI</span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {['Home', 'Services', 'Integrations', 'Contact'].map((item) => {
           const pageKey = item.toLowerCase() as Page;
           const isActive = currentPage === pageKey;
           return (
            <button
                key={item}
                onClick={() => onNavigate(pageKey)}
                className={`text-sm font-medium transition-colors duration-200 ${
                    isActive 
                    ? 'text-stone-900 border-b-2 border-stone-900 pb-0.5' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
            >
                {item}
            </button>
           );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button 
            onClick={onLoginClick}
            className="hidden md:block px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
            Log In
        </button>
        <button 
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-md shadow-subtle transition-all"
        >
            Book a Strategy Call
        </button>
      </div>
    </div>
  </nav>
);

const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <footer className="bg-stone-50 border-t border-stone-200 py-16">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <LightPathLogo className="w-8 h-8 text-stone-800" />
                        <span className="text-lg font-bold font-heading text-stone-900">LightPath AI</span>
                    </div>
                    <p className="text-stone-500 text-sm max-w-xs leading-relaxed">
                        AI powered tools and voice agents that make agency selling easier, improve outreach, and unlock faster revenue growth.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <h4 className="text-stone-900 font-semibold mb-4 text-sm">Company</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li><button onClick={() => onNavigate('home')} className="hover:text-stone-900 transition-colors">Home</button></li>
                            <li><button onClick={() => onNavigate('services')} className="hover:text-stone-900 transition-colors">Services</button></li>
                            <li><button onClick={() => onNavigate('integrations')} className="hover:text-stone-900 transition-colors">Integrations</button></li>
                            <li><button onClick={() => onNavigate('contact')} className="hover:text-stone-900 transition-colors">Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-stone-900 font-semibold mb-4 text-sm">Legal</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-stone-900 transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-stone-200 text-center md:text-left text-xs text-stone-400">
                &copy; {new Date().getFullYear()} LightPath AI. All rights reserved.
            </div>
        </div>
    </footer>
);

// --- PAGE SECTIONS ---

const Hero = ({ onNavigate, onLoginClick }: { onNavigate: (page: Page) => void, onLoginClick: () => void }) => (
    <section className="relative pt-40 pb-24 bg-[#fdfcfc]">
        <div className="container mx-auto px-6 text-center">
            <div className="inline-block px-3 py-1 mb-8 border border-stone-200 rounded-full bg-white">
                <span className="text-xs font-semibold tracking-wider text-stone-600 uppercase">
                    AI Powered Growth
                </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-stone-900 tracking-tight mb-8 leading-[1.1]">
                Voice AI that turns slow <br/>
                <span className="text-stone-500">follow up into profit</span>
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                LightPath AI partners with agencies to deploy lead qualifying voice agents that call new leads in seconds, qualify them through natural conversation and book appointments into calendars.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                    onClick={() => onNavigate('contact')}
                    className="px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white text-lg font-medium rounded-md shadow-sm transition-all"
                >
                    Book a Strategy Call
                </button>
                <button onClick={onLoginClick} className="px-8 py-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-900 text-lg font-medium rounded-md transition-all">
                    Growth Tools
                </button>
            </div>
            <p className="mt-6 text-sm text-stone-400">Built specifically for lead generation and performance agencies.</p>
        </div>
    </section>
);

const ProblemSection = () => (
    <section className="py-24 bg-white border-t border-stone-100">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900 mb-4">
                    Most agencies don't have a lead problem.<br/>
                    <span className="text-stone-400">They're clients have a response problem.</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Slow lead response", desc: "Leads wait hours for a call. By then half have gone cold or chosen a competitor." },
                    { title: "Overloaded sales teams", desc: "Clients cannot call every lead. You get blamed for ‘lead quality’ instead." },
                    { title: "Churn and lost retainers", desc: "Campaigns look like they underperform. Retainers get questioned. Upsells stall." }
                ].map((card, i) => (
                    <div key={i} className="p-8 bg-stone-50 border border-stone-200 rounded-lg">
                        <div className="w-10 h-10 rounded-md bg-white border border-stone-200 flex items-center justify-center mb-6 shadow-sm">
                             <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mb-3">{card.title}</h3>
                        <p className="text-stone-600 leading-relaxed text-base">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const SolutionSection = () => (
    <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <h2 className="text-4xl font-bold font-heading text-stone-900 mb-6">
                        Convert more leads with instant follow-up.
                    </h2>
                    <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                        Most businesses don’t lose leads because they’re unqualified. They lose them because no one responds quickly enough. Prospects wait. They lose interest. They choose a competitor.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Call every lead in under 60 seconds",
                            "Stop lead wastage by qualifying with your exact script and criteria",
                            "Book appointments directly into calendars and CRMs",
                            "Access full call recordings and transcripts for total visibility"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-stone-700">
                                <CheckCircleIcon className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-1/2">
                     <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-card">
                        {/* Faux Interface */}
                        <div className="flex items-center justify-center mb-8 border-b border-stone-100 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                            </div>
                            <span className="text-xs font-mono text-stone-400 ml-auto">AGENT_LIVE_STATUS</span>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-stone-700">AI</div>
                                <div className="bg-stone-50 p-4 rounded-r-lg rounded-bl-lg text-sm text-stone-700 border border-stone-100">
                                    Hi James, this is Sarah from Maple Mortgages. I saw you just applied for a mortgage a moment ago.
                                </div>
                            </div>
                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-stone-900 flex-shrink-0 flex items-center justify-center text-xs text-white">L</div>
                                <div className="bg-stone-900 p-4 rounded-l-lg rounded-br-lg text-sm text-white">
                                    Oh wow, that was quick. Yeah, I’m just trying to see what I’d be eligible for.
                                </div>
                            </div>
                             <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-stone-700">AI</div>
                                <div className="bg-stone-50 p-4 rounded-r-lg rounded-bl-lg text-sm text-stone-700 border border-stone-100">
                                    Perfect. I can help with that. To get you matched with the right advisor, can I quickly confirm whether you're looking to buy a new property or remortgage your current one?
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="py-24 bg-white border-t border-stone-100">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { step: "01", title: "Plug in your clients", desc: "Connect forms, landing pages and ad platforms so new leads are passed instantly." },
                    { step: "02", title: "Configure the agent", desc: "We customise the script, tone and qualifying questions for each client." },
                    { step: "03", title: "Launch and optimise", desc: "Track response times, contact rate and booked meetings in one dashboard." }
                ].map((item, i) => (
                    <div key={i} className="relative group">
                        <span className="text-6xl font-bold text-stone-100 absolute -top-8 -left-2 select-none group-hover:text-stone-200 transition-colors">{item.step}</span>
                        <div className="relative z-10 pt-4">
                            <h3 className="text-lg font-bold text-stone-900 mb-3">{item.title}</h3>
                            <p className="text-stone-600 leading-relaxed text-base">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ToolsSection = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900 mb-16">AI tools suite built for our agency partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-8 bg-white border border-stone-200 rounded-lg text-left shadow-subtle hover:shadow-md transition-shadow">
                    <CplIcon className="w-8 h-8 text-stone-800 mb-6" />
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Lead Pricing Tool</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">Calculate the maximum CPL your client can afford and your ideal price per lead.</p>
                </div>
                <div className="p-8 bg-white border border-stone-200 rounded-lg text-left shadow-subtle hover:shadow-md transition-shadow">
                    <LvrIcon className="w-8 h-8 text-stone-800 mb-6" />
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Advanced LVR</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">Forecast monthly leads and revenue so you can quantify campaign impact.</p>
                </div>
                <div className="p-8 bg-stone-100/50 border border-stone-200 border-dashed rounded-lg text-left flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-stone-500 mb-2">More Tools Available</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">Access our full suite of 10+ agency growth tools by booking a call or logging in.</p>
                </div>
            </div>
            <button 
                onClick={onLoginClick}
                className="px-8 py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-900 font-medium rounded-md transition-colors"
            >
                Access Growth Tools
            </button>
        </div>
    </section>
);

const OutcomesSection = () => (
    <section className="py-24 bg-white border-t border-stone-100">
        <div className="container mx-auto px-6">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900">What agencies get with LightPath AI</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                    "Faster response times without extra headcount",
                    "Clients who stay longer and spend more",
                    "Proof that lead quality is not the problem",
                    "New retainers and upsells based on performance"
                ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-stone-50 border border-stone-200 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center flex-shrink-0">
                            <CheckCircleIcon className="w-4 h-4 text-stone-900" />
                        </div>
                        <span className="text-lg text-stone-700 font-medium">{benefit}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ContactSection = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        agencyName: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('/api/klaviyo-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Ensure response is actually JSON before parsing to avoid "unexpected token" errors
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON response received:", text);
                throw new Error("Server returned an unexpected response format. Please try again.");
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Submission failed.');
            }

            setStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', agencyName: '', message: '' });

        } catch (error: any) {
            console.error('Contact form error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
             <section className="py-24 bg-white border-t border-stone-100">
                <div className="container mx-auto px-6 max-w-2xl text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold font-heading text-stone-900 mb-4">Message Sent!</h2>
                    <p className="text-stone-600 mb-8">Thanks for reaching out. We'll be in touch shortly.</p>
                    <button onClick={() => setStatus('idle')} className="text-stone-900 font-medium hover:underline">Send another message</button>
                </div>
            </section>
        )
    }

    return (
        <section className="py-24 bg-white border-t border-stone-100">
            <div className="container mx-auto px-6 max-w-4xl">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900 mb-4">
                        Ready to automate your lead response?
                    </h2>
                    <p className="text-lg text-stone-600">
                        Book a strategy call or send us a message to get started.
                    </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg shadow-card p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-stone-700 mb-2">First Name</label>
                                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-md focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all" />
                            </div>
                             <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold text-stone-700 mb-2">Last Name</label>
                                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-md focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">Email Address</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-md focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all" />
                            </div>
                             <div>
                                <label htmlFor="agencyName" className="block text-sm font-semibold text-stone-700 mb-2">Agency Name</label>
                                <input type="text" id="agencyName" value={formData.agencyName} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-md focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                             <label htmlFor="message" className="block text-sm font-semibold text-stone-700 mb-2">How can we help?</label>
                             <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-md focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"></textarea>
                        </div>

                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2">
                                <DangerIcon className="w-5 h-5 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="text-center pt-4">
                            <button type="submit" disabled={status === 'submitting'} className="px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-md shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]">
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

const Website: React.FC<WebsiteProps> = ({ onLoginClick }) => {
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-[#fdfcfc]">
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} onLoginClick={onLoginClick} />
            
            {currentPage === 'home' && (
                <>
                    <Hero onNavigate={handleNavigate} onLoginClick={onLoginClick} />
                    <ProblemSection />
                    <SolutionSection />
                    <HowItWorks />
                    <ToolsSection onLoginClick={onLoginClick} />
                    <OutcomesSection />
                    <ContactSection /> 
                </>
            )}

            {currentPage === 'services' && (
                <div className="pt-20">
                     <SolutionSection />
                     <HowItWorks />
                     <OutcomesSection />
                     <ContactSection />
                </div>
            )}

            {currentPage === 'integrations' && (
                <div className="pt-20">
                    <section className="py-24">
                        <div className="container mx-auto px-6 text-center">
                            <h1 className="text-4xl font-bold text-stone-900 mb-6">Integrations</h1>
                            <p className="text-stone-600 max-w-2xl mx-auto">We connect with your existing stack. GoHighLevel, HubSpot, Salesforce, and more.</p>
                            <div className="mt-12 p-12 bg-stone-50 border border-stone-200 border-dashed rounded-lg">
                                <p className="text-stone-500">Integration catalog coming soon.</p>
                            </div>
                        </div>
                    </section>
                     <ContactSection />
                </div>
            )}

            {currentPage === 'contact' && (
                <div className="pt-20">
                    <ContactSection />
                </div>
            )}

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default Website;