
import React, { useState, useEffect } from 'react';
import { CplIcon, LvrIcon, CheckCircleIcon, LightPathLogo } from './icons';
import VoiceAgent from './VoiceAgent';

type Page = 'home' | 'services' | 'integrations' | 'contact';

interface WebsiteProps {
  onLoginClick: () => void;
}

const Navbar = ({ currentPage, onNavigate, onLoginClick }: { currentPage: Page, onNavigate: (page: Page) => void, onLoginClick: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-lg border-b border-white/10">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => onNavigate('home')}
      >
        <LightPathLogo className="w-12 h-12" />
        <span className="text-xl font-bold font-heading text-white tracking-tight">LightPath AI</span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4">
        {['Home', 'Services', 'Integrations', 'Contact'].map((item) => {
           const pageKey = item.toLowerCase() as Page;
           const isActive = currentPage === pageKey;
           return (
            <button
                key={item}
                onClick={() => onNavigate(pageKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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
            className="hidden md:block px-5 py-2 text-sm font-bold text-slate-300 border border-white/10 rounded-lg hover:border-cyan-500/50 hover:text-white hover:bg-white/5 transition-all"
        >
            Log In
        </button>
        <button 
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
        >
            Book a Strategy Call
        </button>
      </div>
    </div>
  </nav>
);

const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <footer className="bg-charcoal border-t border-white/5 py-16">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <LightPathLogo className="w-10 h-10" />
                        <span className="text-lg font-bold font-heading text-white">LightPath AI</span>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                        AI powered tools and voice agents that make agency selling easier, improve outreach, and unlock faster revenue growth.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">Home</button></li>
                            <li><button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">Services</button></li>
                            <li><button onClick={() => onNavigate('integrations')} className="hover:text-cyan-400 transition-colors">Integrations</button></li>
                            <li><button onClick={() => onNavigate('contact')} className="hover:text-cyan-400 transition-colors">Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-slate-500">
                &copy; {new Date().getFullYear()} LightPath AI. All rights reserved.
            </div>
        </div>
    </footer>
);

// --- PAGE SECTIONS ---

const Hero = ({ onNavigate, onLoginClick }: { onNavigate: (page: Page) => void, onLoginClick: () => void }) => (
    <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50 animate-blob"></div>
        <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                AI POWERED GROWTH
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-heading text-white tracking-tight mb-8 leading-tight">
                Voice AI that turns slow <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">follow up into profit</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                LightPath AI partners with agencies to deploy lead qualifying voice agents that call new leads in seconds, qualify them through natural conversation and book appointments into calendars.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                    onClick={() => onNavigate('contact')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-lg font-bold rounded-full shadow-xl shadow-blue-500/25 transition-all transform hover:scale-105"
                >
                    Book a Strategy Call
                </button>
                <button onClick={onLoginClick} className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-lg font-bold rounded-full transition-all">
                    Growth Tools
                </button>
            </div>
            <p className="mt-6 text-sm text-slate-500">Built specifically for lead generation and performance agencies.</p>
            
            {/* Voice Agent */}
            <div className="mt-10 relative z-10">
                 <VoiceAgent />
            </div>
        </div>
    </section>
);

const ProblemSection = () => (
    <section className="py-24 bg-charcoal relative">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
                    Most agencies don't have a lead problem.<br/>
                    <span className="text-slate-400">They're clients have a response problem.</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Slow lead response", desc: "Leads wait hours for a call. By then half have gone cold or chosen a competitor." },
                    { title: "Overloaded sales teams", desc: "Clients cannot call every lead. You get blamed for ‘lead quality’ instead." },
                    { title: "Churn and lost retainers", desc: "Campaigns look like they underperform. Retainers get questioned. Upsells stall." }
                ].map((card, i) => (
                    <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                             <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const SolutionSection = () => (
    <section className="py-24 bg-obsidian relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <h2 className="text-4xl md:text-5xl font-black font-heading text-white mb-6">
                        Convert more leads with instant follow-up.
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        Most businesses don’t lose leads because they’re unqualified. They lose them because no one responds quickly enough. Prospects wait. They lose interest. They choose a competitor.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Call every lead in under 60 seconds",
                            "Stop lead wastage by qualifying with your exact script and criteria",
                            "Book appointments directly into calendars and CRMs",
                            "Access full call recordings and transcripts for total visibility"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                <CheckCircleIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-1/2 relative">
                     <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
                     <div className="relative bg-charcoal border border-white/10 rounded-2xl p-8 shadow-2xl">
                        {/* Faux Interface */}
                        <div className="flex items-center justify-center mb-8 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-xs font-mono text-slate-500 ml-auto">AGENT_LIVE_STATUS</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs text-white">AI</div>
                                <div className="bg-white/10 p-3 rounded-r-xl rounded-bl-xl text-sm text-slate-200">
                                    Hi James, this is Sarah from Maple Mortgages. I saw you just applied for a mortgage a moment ago.
                                </div>
                            </div>
                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center text-xs text-white">Lead</div>
                                <div className="bg-blue-600/20 p-3 rounded-l-xl rounded-br-xl text-sm text-blue-100 border border-blue-500/20">
                                    Oh wow, that was quick. Yeah, I’m just trying to see what I’d be eligible for.
                                </div>
                            </div>
                             <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs text-white">AI</div>
                                <div className="bg-white/10 p-3 rounded-r-xl rounded-bl-xl text-sm text-slate-200">
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
    <section className="py-24 bg-charcoal border-y border-white/5">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { step: "01", title: "Plug in your clients", desc: "Connect forms, landing pages and ad platforms so new leads are passed instantly." },
                    { step: "02", title: "Configure the agent", desc: "We customise the script, tone and qualifying questions for each client." },
                    { step: "03", title: "Launch and optimise", desc: "Track response times, contact rate and booked meetings in one dashboard." }
                ].map((item, i) => (
                    <div key={i} className="relative">
                        <span className="text-8xl font-black text-white/5 absolute -top-10 -left-4 select-none">{item.step}</span>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ToolsSection = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <section className="py-24 bg-obsidian">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-16">AI tools suite built for our agency partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all text-left">
                    <CplIcon className="w-10 h-10 text-cyan-400 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3">Lead Pricing Tool</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Calculate the maximum CPL your client can afford and your ideal price per lead.</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all text-left">
                    <LvrIcon className="w-10 h-10 text-cyan-400 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3">Advanced LVR</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Forecast monthly leads and revenue so you can quantify campaign impact.</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/5 rounded-2xl text-left border-dashed flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-slate-500 mb-3">More Tools Available</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Access our full suite of 10+ agency growth tools by booking a call or logging in.</p>
                </div>
            </div>
            <button 
                onClick={onLoginClick}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors"
            >
                Access Growth Tools
            </button>
        </div>
    </section>
);

const OutcomesSection = () => (
    <section className="py-24 bg-charcoal border-t border-white/5">
        <div className="container mx-auto px-6">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">What agencies get with LightPath AI</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                    "Faster response times without extra headcount",
                    "Clients who stay longer and spend more",
                    "Proof that lead quality is not the problem",
                    "New retainers and upsells based on performance"
                ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-obsidian border border-white/10 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-lg text-white font-medium">{benefit}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FinalCTA = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <section className="py-32 bg-gradient-to-b from-charcoal to-obsidian border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-black font-heading text-white mb-8 tracking-tight">
                Ready to fix your clients' slow follow up?
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <button 
                    onClick={() => onNavigate('contact')}
                    className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xl font-bold rounded-full shadow-2xl shadow-blue-500/20 transition-all transform hover:scale-105"
                >
                    Book a Strategy Call
                </button>
            </div>
        </div>
    </section>
);

// --- SUB-PAGES ---

const ServicesPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <div className="pt-32 pb-20 animate-fade-in">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-4xl md:text-6xl font-black font-heading text-white mb-6">Services for performance agencies</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    LightPath AI is a partner, not just a vendor. We help you build the infrastructure to close more deals for your clients.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {[
                    {
                        title: "Voice Lead Qualification",
                        desc: "AI voice agents that stop leads slipping through the cracks. They call every new lead instantly, ask the key qualifying questions your clients never get to, and turn more inquiries into booked meetings.",
                        bullets: ["Custom scripts & personas", "Call recordings & transcripts", "Multi-language options", "Real-time reporting"]
                    },
                    {
                        title: "Speed to Lead Engine",
                        desc: "Setup that ensures every lead from forms, ads and CRM triggers is called before your competitors. No delays, no missed opportunities, no wasted ad spend.",
                        bullets: ["Integrations with major CRMs", "Alerts when response time slips", "Real-time performance monitoring", "Fail-safe retry logic"]
                    },
                    {
                        title: "Revenue & Pricing Tools",
                        desc: "Tools such as the Lead Pricing Tool and Advanced Lead Velocity Rate calculator to help agencies price campaigns and prove ROI.",
                        bullets: ["CPL modelling & forecasting", "Forecast dashboards", "Client ready reports", "Agency profit analysis"]
                    },
                    {
                        title: "Strategy & Onboarding",
                        desc: "Done with you setup. script design. onboarding workshops for clients. optimisation calls.",
                        bullets: ["Discovery workshop", "Script design & optimization", "Monthly performance reviews", "Conversion rate consulting"]
                    }
                ].map((service, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-8 p-10 bg-charcoal border border-white/10 rounded-3xl hover:border-cyan-500/30 transition-all">
                        <div className="md:w-1/3">
                            <h3 className="text-2xl font-bold text-white mb-4 text-cyan-400">{service.title}</h3>
                        </div>
                        <div className="md:w-2/3">
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed">{service.desc}</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {service.bullets.map((bullet, b) => (
                                    <li key={b} className="flex items-center gap-2 text-slate-400 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-24 text-center">
                <h3 className="text-2xl font-bold text-white mb-8">Who we work with</h3>
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {["Lead Generation Agencies", "Performance Marketing Teams", "Appointment Setting Agencies"].map((tag, i) => (
                        <span key={i} className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-slate-300 font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
                <button 
                    onClick={() => onNavigate('contact')}
                    className="px-8 py-4 bg-white text-obsidian font-bold rounded-full hover:bg-slate-200 transition-colors"
                >
                    Schedule a Services Overview Call
                </button>
            </div>
        </div>
    </div>
);

const IntegrationsPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <div className="pt-32 pb-20 animate-fade-in">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-4xl md:text-6xl font-black font-heading text-white mb-6">Integrations that fit your workflow</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    LightPath AI connects to the tools agencies already use so you do not have to rebuild your tech stack.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="p-8 bg-charcoal border border-white/10 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">CRMs</h3>
                    <ul className="space-y-3 text-slate-400">
                        <li>HubSpot</li>
                        <li>Pipedrive</li>
                        <li>GoHighLevel</li>
                        <li>Salesforce</li>
                        <li>Zoho CRM</li>
                    </ul>
                </div>
                <div className="p-8 bg-charcoal border border-white/10 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Lead Sources</h3>
                    <ul className="space-y-3 text-slate-400">
                        <li>Facebook Lead Ads</li>
                        <li>Google Ads Forms</li>
                        <li>Website Forms</li>
                        <li>Webhooks</li>
                        <li>Instantly / Smartlead</li>
                    </ul>
                </div>
                <div className="p-8 bg-charcoal border border-white/10 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Communication</h3>
                    <ul className="space-y-3 text-slate-400">
                        <li>Twilio</li>
                        <li>Slack / Teams</li>
                        <li>Email (SMTP/Gmail)</li>
                        <li>SMS</li>
                        <li>WhatsApp API</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 mb-16">
                 <h3 className="text-2xl font-bold text-white mb-8 text-center">Workflow Examples</h3>
                 <div className="space-y-8">
                     <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-slate-300">
                         <span className="px-4 py-2 bg-obsidian rounded-lg border border-white/10">Lead from FB Ad</span>
                         <span className="text-cyan-500">→</span>
                         <span className="px-4 py-2 bg-obsidian rounded-lg border border-white/10">Voice Agent calls in 30s</span>
                         <span className="text-cyan-500">→</span>
                         <span className="px-4 py-2 bg-obsidian rounded-lg border border-white/10">Meeting booked in HubSpot</span>
                     </div>
                     <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-slate-300">
                         <span className="px-4 py-2 bg-obsidian rounded-lg border border-white/10">Website Submission</span>
                         <span className="text-cyan-500">→</span>
                         <span className="px-4 py-2 bg-obsidian rounded-lg border border-white/10">Klaviyo List Update + Call</span>
                         <span className="text-cyan-500">→</span>
                         <span className="px-4 py-2 bg-obsidian rounded-lg border border-white/10">Sales team notified</span>
                     </div>
                 </div>
            </div>

             <div className="text-center p-10 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-3xl border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">Need something custom?</h3>
                <p className="text-slate-400 mb-8">We build custom integrations via API, Make, or Zapier to fit complex agency requirements.</p>
                <button 
                    onClick={() => onNavigate('contact')}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-colors"
                >
                    Talk to us about your stack
                </button>
            </div>
        </div>
    </div>
);

const ContactPage = () => (
    <div className="pt-32 pb-20 animate-fade-in">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-6">Let’s talk about your clients lead response</h1>
                <p className="text-xl text-slate-400">
                    Share a few details about your agency and we will reply within one business day.
                </p>
            </div>

            <div className="bg-charcoal border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">First Name</label>
                            <input type="text" className="w-full p-3 bg-obsidian border border-white/10 rounded-lg text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Jane" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Last Name</label>
                            <input type="text" className="w-full p-3 bg-obsidian border border-white/10 rounded-lg text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Doe" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                            <input type="email" className="w-full p-3 bg-obsidian border border-white/10 rounded-lg text-white focus:border-cyan-500 outline-none transition-colors" placeholder="jane@agency.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Agency Name</label>
                            <input type="text" className="w-full p-3 bg-obsidian border border-white/10 rounded-lg text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Growth Partners" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2">How can we help?</label>
                        <textarea rows={4} className="w-full p-3 bg-obsidian border border-white/10 rounded-lg text-white focus:border-cyan-500 outline-none transition-colors" placeholder="I'm interested in the voice agent for my real estate clients..."></textarea>
                    </div>

                    <button className="w-full py-4 bg-white text-obsidian font-bold rounded-lg hover:bg-slate-200 transition-colors">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
);

const Website: React.FC<WebsiteProps> = ({ onLoginClick }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-obsidian text-slate-200 font-sans selection:bg-cyan-500/30">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} onLoginClick={onLoginClick} />
      
      {currentPage === 'home' && (
        <main className="animate-fade-in">
          <Hero onNavigate={setCurrentPage} onLoginClick={onLoginClick} />
          <ProblemSection />
          <SolutionSection />
          <HowItWorks />
          <ToolsSection onLoginClick={onLoginClick} />
          <OutcomesSection />
          <FinalCTA onNavigate={setCurrentPage} />
        </main>
      )}

      {currentPage === 'services' && (
        <main>
            <ServicesPage onNavigate={setCurrentPage} />
            <FinalCTA onNavigate={setCurrentPage} />
        </main>
      )}

      {currentPage === 'integrations' && (
        <main>
            <IntegrationsPage onNavigate={setCurrentPage} />
            <FinalCTA onNavigate={setCurrentPage} />
        </main>
      )}

      {currentPage === 'contact' && (
        <main>
            <ContactPage />
        </main>
      )}

      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default Website;
