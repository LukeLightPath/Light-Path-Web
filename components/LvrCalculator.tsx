
import React, { useState, KeyboardEvent } from 'react';
import { LVRInputs, LVRResults, currencies, CurrencyCode } from '../types';
import { BackIcon, CheckCircleIcon, DangerIcon } from './icons';

interface LvrCalculatorProps {
  onBack: () => void;
}

const initialInputs: LVRInputs = {
  currency: 'USD',
  lastMonthLeads: 0,
  thisMonthLeads: 0,
  dayOfMonth: new Date().getDate(),
  totalDaysInMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
  conversionRatePercent: 0,
  ltv: 0,
  monthlyLeadGoal: null,
};

const questions = [
  { key: 'currency', label: 'Please select your currency', isOptional: false },
  { key: 'lastMonthLeads', label: "How many leads did you get last month?", isOptional: false },
  { key: 'thisMonthLeads', label: "How many leads have you gotten so far this month?", isOptional: false },
  { key: 'dayOfMonth', label: `What day of the month is it? (Default is ${initialInputs.dayOfMonth})`, isOptional: true },
  { key: 'totalDaysInMonth', label: `How many days are in this month? (Default is ${initialInputs.totalDaysInMonth})`, isOptional: true },
  { key: 'conversionRatePercent', label: "What's your lead-to-sale conversion rate (%)?", isOptional: false },
  { key: 'ltv', label: "What's your average lifetime value (LTV) per customer?", isOptional: false },
  { key: 'monthlyLeadGoal', label: "What's your monthly lead goal? (Optional)", isOptional: true },
];


const LvrCalculator: React.FC<LvrCalculatorProps> = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<LVRInputs>(initialInputs);
  const [currentValue, setCurrentValue] = useState<string>('USD');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<LVRResults | null>(null);

  const currentQuestion = questions[step];

  const handleNext = () => {
    if (step === 0) {
        const newInputs = { ...inputs, currency: currentValue as CurrencyCode };
        setInputs(newInputs);
        setStep(step + 1);
        setCurrentValue('');
        setError(null);
        return;
    }

    const numValue = parseFloat(currentValue);
    if (currentValue === '' && currentQuestion.isOptional) {
        // Use default
    } else if (isNaN(numValue) || numValue < 0) {
      setError('Please use numbers only.');
      return;
    }

    const newInputs = { ...inputs, [currentQuestion.key]: numValue || inputs[currentQuestion.key as keyof LVRInputs] };
    setInputs(newInputs);

    if (step < questions.length - 1) {
      setStep(step + 1);
      setCurrentValue('');
      setError(null);
    } else {
      calculateResults(newInputs);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  const calculateResults = (finalInputs: LVRInputs) => {
    const { lastMonthLeads, thisMonthLeads, dayOfMonth, totalDaysInMonth, conversionRatePercent, ltv, monthlyLeadGoal } = finalInputs;

    if (lastMonthLeads === 0 || dayOfMonth === 0) {
        setError("Last month's leads and day of month cannot be zero.");
        setResults(null);
        return;
    }

    const CR = conversionRatePercent / 100;
    const lvrPercent = ((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100;
    const dailyRate = thisMonthLeads / dayOfMonth;
    const projectedLeads = dailyRate * totalDaysInMonth;
    const projectedLVRPercent = ((projectedLeads - lastMonthLeads) / lastMonthLeads) * 100;

    const lastMonthCustomers = lastMonthLeads * CR;
    const thisMonthCustomers = thisMonthLeads * CR;
    const projectedCustomers = projectedLeads * CR;

    const lastMonthRevenue = lastMonthCustomers * ltv;
    const thisMonthRevenue = thisMonthCustomers * ltv;
    const projectedRevenue = projectedCustomers * ltv;

    let leadsGap = null;
    let dailyLeadsNeeded = null;
    if (monthlyLeadGoal) {
        leadsGap = monthlyLeadGoal - projectedLeads;
        if (leadsGap > 0) {
            const daysRemaining = totalDaysInMonth - dayOfMonth;
            if (daysRemaining > 0) {
              dailyLeadsNeeded = (monthlyLeadGoal - thisMonthLeads) / daysRemaining;
            }
        }
    }
    
    setResults({
        lvrPercent, projectedLeads, projectedLVRPercent, lastMonthCustomers, thisMonthCustomers, projectedCustomers,
        lastMonthRevenue, thisMonthRevenue, projectedRevenue, leadsGap, dailyLeadsNeeded
    });
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: inputs.currency }).format(value);
  const formatNumber = (value: number, decimals = 0) => new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

  const reset = () => {
    setStep(0);
    setInputs(initialInputs);
    setCurrentValue('USD');
    setError(null);
    setResults(null);
  };
  
  const ResultDisplay = () => {
    if (!results) return null;
    return (
        <div className="animate-fade-in space-y-8">
            <h3 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 font-heading">Advanced LVR Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 font-heading mb-4">Lead Velocity Snapshot</h4>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-slate-600 dark:text-slate-400">Leads Last Month</span>
                            <span className="font-bold text-lg text-slate-900 dark:text-slate-100">{formatNumber(inputs.lastMonthLeads)}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-slate-600 dark:text-slate-400">Leads This Month (so far)</span>
                            <span className="font-bold text-lg text-slate-900 dark:text-slate-100">{formatNumber(inputs.thisMonthLeads)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Current LVR</span>
                            <span className={`font-bold text-lg ${results.lvrPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatNumber(results.lvrPercent, 1)}%</span>
                        </li>
                    </ul>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 font-heading mb-4">End-of-Month Forecast</h4>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-slate-600 dark:text-slate-400">Projected Leads</span>
                            <span className="font-bold text-lg text-slate-900 dark:text-slate-100">{formatNumber(results.projectedLeads)}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span className="text-slate-600 dark:text-slate-400">Projected LVR</span>
                            <span className={`font-bold text-lg ${results.projectedLVRPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatNumber(results.projectedLVRPercent, 1)}%</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Projected Revenue</span>
                            <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{formatCurrency(results.projectedRevenue)}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 font-heading">Conversion & Revenue Impact</h4>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400">Based on {formatNumber(inputs.conversionRatePercent)}% conversion</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{formatCurrency(results.lastMonthRevenue)}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Month Rev</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                         <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{formatCurrency(results.thisMonthRevenue)}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">This Month Rev</p>
                    </div>
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30">
                        <p className="text-2xl font-bold text-primary-700 dark:text-primary-400 mb-1">{formatCurrency(results.projectedRevenue)}</p>
                        <p className="text-sm text-primary-600 dark:text-primary-300 uppercase tracking-wide">Projected Rev</p>
                    </div>
                </div>
            </div>

            {inputs.monthlyLeadGoal && results.leadsGap !== null && (
                <div className={`p-6 rounded-xl flex items-start gap-4 border ${results.leadsGap <= 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                    {results.leadsGap <= 0 ? <CheckCircleIcon className="w-8 h-8 text-green-600 flex-shrink-0" /> : <DangerIcon className="w-8 h-8 text-red-600 flex-shrink-0" />}
                    <div>
                        <h4 className={`text-lg font-bold font-heading ${results.leadsGap <= 0 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>Progress vs. Target</h4>
                        <p className={`mt-1 ${results.leadsGap <= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {results.leadsGap <= 0 ? `You are on track to exceed your goal by ${formatNumber(Math.abs(results.leadsGap))} leads.` : `You are projected to miss your goal by ${formatNumber(results.leadsGap)} leads.`}
                            {results.dailyLeadsNeeded && ` You need to average ${formatNumber(results.dailyLeadsNeeded, 1)} leads per day for the rest of the month to catch up.`}
                        </p>
                    </div>
                </div>
            )}
             <div className="flex justify-center gap-4 pt-4">
                  <button onClick={reset} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg">Run New Calculation</button>
                  <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back to Tools</button>
              </div>
        </div>
    )
  }

  return (
     <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-lg transition-all mb-8 font-semibold border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-cyan-500 shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-cyan-500/20">
        <BackIcon className="w-5 h-5"/>
        <span>Back to tools</span>
      </button>

      {results ? <ResultDisplay /> : (
        <div className="space-y-8 text-center">
             <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading">Advanced LVR Calculator</h2>
                 <p className="mt-2 text-slate-500 dark:text-slate-400">Forecast monthly leads and revenue to quantify your campaign impact.</p>
             </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <label htmlFor="calculator-input" className="block text-slate-800 dark:text-slate-200 mb-6 text-xl font-heading font-semibold">{currentQuestion.label}</label>
                {step === 0 ? (
                  <select
                    id="calculator-input"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full max-w-xs mx-auto text-center p-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                    autoFocus
                  >
                    {Object.entries(currencies).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                      id="calculator-input"
                      type="number"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={currentQuestion.isOptional ? `Default: ${inputs[currentQuestion.key as keyof LVRInputs] || 'None'}` : 'Enter value...'}
                      className="w-full max-w-xs mx-auto text-center p-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg transition-all"
                      autoFocus
                  />
                )}
                {error && <p className="text-red-500 text-sm mt-3 font-medium bg-red-50 dark:bg-red-900/20 py-1 px-3 rounded-full inline-block">{error}</p>}
                
                 <div className="mt-8">
                    <button onClick={handleNext} className="px-8 py-3 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                        {step === questions.length - 1 ? 'Calculate Results' : 'Next'}
                    </button>
                </div>

                <div className="mt-6 flex justify-center gap-2">
                    {questions.map((_, index) => (
                        <div 
                            key={index} 
                            className={`h-2 rounded-full transition-all duration-300 ${index === step ? 'w-8 bg-primary-600' : index < step ? 'w-2 bg-primary-300' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} 
                        />
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LvrCalculator;