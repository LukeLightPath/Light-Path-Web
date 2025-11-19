
import React, { useState, KeyboardEvent } from 'react';
import { CPLInputs, CPLResults, currencies, CurrencyCode } from '../types';
import { BackIcon, CheckCircleIcon, DangerIcon } from './icons';

interface CostPerLeadCalculatorProps {
  onBack: () => void;
}

const initialInputs: CPLInputs = {
  currency: 'USD',
  averageRevenue: 0,
  grossMarginPercent: 0,
  conversionRatePercent: 0,
  targetProfitMarginPercent: 0,
  expectedCostPerLead: 0,
};

const questions = [
  { key: 'currency', label: 'Please select your currency', isOptional: false },
  { key: 'averageRevenue', label: 'What is the average revenue per new customer?', isOptional: false },
  { key: 'grossMarginPercent', label: 'What is the client gross profit margin (%)?', isOptional: false },
  { key: 'conversionRatePercent', label: 'What is the client lead to sale conversion rate (%)?', isOptional: false },
  { key: 'targetProfitMarginPercent', label: 'What profit margin does the client want to keep from each sale? (%)', isOptional: true },
  { key: 'expectedCostPerLead', label: 'What is your (the agency) expected actual cost per lead?', isOptional: false },
];

const CostPerLeadCalculator: React.FC<CostPerLeadCalculatorProps> = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<CPLInputs>(initialInputs);
  const [currentValue, setCurrentValue] = useState<string>('USD');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CPLResults | null>(null);

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
        // Skip
    } else if (isNaN(numValue) || numValue < 0) {
      setError('Please use numbers only.');
      return;
    }

    const newInputs = { ...inputs, [currentQuestion.key]: currentValue === '' && currentQuestion.isOptional ? inputs[currentQuestion.key as keyof CPLInputs] : numValue };
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

  const calculateResults = (finalInputs: CPLInputs) => {
    const { 
        averageRevenue, 
        grossMarginPercent, 
        conversionRatePercent, 
        targetProfitMarginPercent, 
        expectedCostPerLead 
    } = finalInputs;
    
    const grossMarginDecimal = grossMarginPercent / 100;
    const closeRateDecimal = conversionRatePercent / 100;
    // Handle optional or 0 target margin
    const clientTargetProfitMarginDecimal = (targetProfitMarginPercent || 0) / 100;

    const profitPerSale = averageRevenue * grossMarginDecimal;
    const profitPerLead = profitPerSale * closeRateDecimal;
    const maxCplTarget = profitPerLead * (1 - clientTargetProfitMarginDecimal);
    const isViable = expectedCostPerLead <= maxCplTarget;

    const safePrice = Math.min(expectedCostPerLead * 1.2, maxCplTarget);
    const safeAgencyProfit = safePrice - expectedCostPerLead;
    const safeClientProfit = profitPerLead - safePrice;

    const balancedPrice = Math.min(expectedCostPerLead * 1.5, maxCplTarget);
    const balancedAgencyProfit = balancedPrice - expectedCostPerLead;
    const balancedClientProfit = profitPerLead - balancedPrice;

    const aggressivePrice = maxCplTarget;
    const aggressiveAgencyProfit = aggressivePrice - expectedCostPerLead;
    const aggressiveClientProfit = profitPerLead - aggressivePrice;

    setResults({
        profitPerSale,
        profitPerLead,
        maxCplTarget,
        expectedCostPerLead,
        isViable,
        safePrice,
        safeAgencyProfit,
        safeClientProfit,
        balancedPrice,
        balancedAgencyProfit,
        balancedClientProfit,
        aggressivePrice,
        aggressiveAgencyProfit,
        aggressiveClientProfit
    });
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: inputs.currency }).format(value);
  const formatPercent = (value: number) => `${value}%`;

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
              <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white font-heading">Agency Pricing Strategy</h3>
              
              {/* 1. Summary */}
              <div className={`p-8 rounded-2xl border ${results.isViable ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'}`}>
                  <div className="flex items-start gap-5">
                      {results.isViable ? <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" /> : <DangerIcon className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />}
                      <div>
                          <h4 className={`text-xl font-bold font-heading ${results.isViable ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                              {results.isViable ? "The Economics Work" : "The Model is Not Viable"}
                          </h4>
                          <p className={`mt-2 text-base ${results.isViable ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                              {results.isViable 
                                ? `The client can afford up to ${formatCurrency(results.maxCplTarget)} per lead ${inputs.targetProfitMarginPercent > 0 ? 'while keeping their target profit margin' : 'to break even'}. Your expected cost of ${formatCurrency(results.expectedCostPerLead)} fits within this budget.`
                                : `The client can only afford ${formatCurrency(results.maxCplTarget)} per lead ${inputs.targetProfitMarginPercent > 0 ? 'to maintain their margins' : 'to break even'}, but your expected cost is ${formatCurrency(results.expectedCostPerLead)}.`
                              }
                          </p>
                      </div>
                  </div>
              </div>

              {/* 2. Client Economics Snapshot */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white font-heading mb-6 border-b border-slate-100 dark:border-white/10 pb-4">Client Economics Snapshot</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Avg Revenue</p>
                          <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(inputs.averageRevenue)}</p>
                      </div>
                      <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Profit Per Sale</p>
                          <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(results.profitPerSale)}</p>
                          <p className="text-xs text-slate-500 mt-1">({inputs.grossMarginPercent}% margin)</p>
                      </div>
                      <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Close Rate</p>
                          <p className="text-xl font-bold text-slate-900 dark:text-white">{formatPercent(inputs.conversionRatePercent)}</p>
                      </div>
                       <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Profit Per Lead</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-cyan-400">{formatCurrency(results.profitPerLead)}</p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 3. Maximum Cost Per Lead */}
                  <div className="bg-white dark:bg-charcoal/80 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white font-heading mb-4">Max Cost Per Lead (Client)</h4>
                      <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-500 dark:text-slate-400">Break Even Max CPL</span>
                              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(results.profitPerLead)}</span>
                          </div>
                           {inputs.targetProfitMarginPercent > 0 && (
                               <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-500 dark:text-slate-400">Max CPL with Target Profit ({inputs.targetProfitMarginPercent}%)</span>
                                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">{formatCurrency(results.maxCplTarget)}</span>
                               </div>
                           )}
                      </div>
                  </div>

                  {/* 4. Agency Assumptions */}
                  <div className="bg-white dark:bg-charcoal/80 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white font-heading mb-4">Agency Assumptions</h4>
                      <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-500 dark:text-slate-400">Expected Cost Per Lead</span>
                              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(results.expectedCostPerLead)}</span>
                          </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-500 dark:text-slate-400">Room for markup</span>
                              <span className={`font-bold ${results.isViable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {formatCurrency(results.maxCplTarget - results.expectedCostPerLead)}
                              </span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 5. Recommended Lead Pricing Breakdown */}
              {results.isViable && (
                  <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                      <div className="p-5 border-b border-slate-200 dark:border-white/10">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white font-heading">Recommended Lead Pricing Breakdown</h4>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                                  <tr>
                                      <th className="p-4">Strategy</th>
                                      <th className="p-4">Sell Price Per Lead</th>
                                      <th className="p-4 text-green-600 dark:text-green-400">Agency Profit</th>
                                      <th className="p-4 text-blue-600 dark:text-blue-400">Client Profit</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                  <tr>
                                      <td className="p-4 font-bold text-slate-900 dark:text-white">Safe <span className="font-normal text-slate-500 block text-xs mt-1">Low markup</span></td>
                                      <td className="p-4 text-base font-bold text-slate-900 dark:text-white">{formatCurrency(results.safePrice)}</td>
                                      <td className="p-4 font-medium text-green-600 dark:text-green-400">{formatCurrency(results.safeAgencyProfit)}</td>
                                      <td className="p-4 font-medium text-blue-600 dark:text-blue-300">{formatCurrency(results.safeClientProfit)}</td>
                                  </tr>
                                  <tr>
                                      <td className="p-4 font-bold text-slate-900 dark:text-white">Balanced <span className="font-normal text-slate-500 block text-xs mt-1">Healthy margin</span></td>
                                      <td className="p-4 text-base font-bold text-slate-900 dark:text-white">{formatCurrency(results.balancedPrice)}</td>
                                      <td className="p-4 font-medium text-green-600 dark:text-green-400">{formatCurrency(results.balancedAgencyProfit)}</td>
                                      <td className="p-4 font-medium text-blue-600 dark:text-blue-300">{formatCurrency(results.balancedClientProfit)}</td>
                                  </tr>
                                  <tr>
                                      <td className="p-4 font-bold text-slate-900 dark:text-white">Aggressive <span className="font-normal text-slate-500 block text-xs mt-1">Max price</span></td>
                                      <td className="p-4 text-base font-bold text-slate-900 dark:text-white">{formatCurrency(results.aggressivePrice)}</td>
                                      <td className="p-4 font-medium text-green-600 dark:text-green-400">{formatCurrency(results.aggressiveAgencyProfit)}</td>
                                      <td className="p-4 font-medium text-blue-600 dark:text-blue-300">{formatCurrency(results.aggressiveClientProfit)}</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* 6. Guidance and Notes */}
              <div className="bg-blue-50 dark:bg-blue-500/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                  <h4 className="font-bold text-blue-700 dark:text-blue-300 font-heading mb-3">Guidance and Notes</h4>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {results.isViable ? (
                          <>
                              <li><strong>Recommendation:</strong> Start with the <strong>Balanced</strong> price of {formatCurrency(results.balancedPrice)}.</li>
                              <li><strong>Room to move:</strong> You have {formatCurrency(results.maxCplTarget - results.expectedCostPerLead)} of total margin to play with.</li>
                              <li><strong>Leverage:</strong> If you improve the client's conversion rate, their max affordable CPL jumps significantly.</li>
                          </>
                      ) : (
                          <>
                              <li><strong>Critical Issue:</strong> Your expected cost ({formatCurrency(results.expectedCostPerLead)}) is higher than the client's maximum budget.</li>
                              <li><strong>Option 1:</strong> Get your CPL down to at least {formatCurrency(results.maxCplTarget * 0.8)}.</li>
                              <li><strong>Option 2:</strong> Increase average revenue per sale.</li>
                          </>
                      )}
                  </ul>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                  <button onClick={reset} className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-primary-500/20">New Calculation</button>
                  <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl transition-all font-bold backdrop-blur-md">Back to Tools</button>
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
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white font-heading">Lead Pricing Tool</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">Calculate the max CPL your client can afford and your ideal price per lead.</p>
            </div>
            
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                <label htmlFor="calculator-input" className="block text-slate-800 dark:text-white mb-8 text-2xl font-heading font-bold">
                    {currentQuestion.label}
                </label>
                
                {step === 0 ? (
                  <select
                    id="calculator-input"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full max-w-xs mx-auto text-center p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-500/50 outline-none text-xl transition-all appearance-none"
                    autoFocus
                  >
                    {Object.entries(currencies).map(([code, name]) => (
                      <option key={code} value={code} className="bg-white dark:bg-slate-800">{name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                      id="calculator-input"
                      type="number"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={currentQuestion.isOptional ? 'Press Enter to skip' : 'Enter value...'}
                      className="w-full max-w-xs mx-auto text-center p-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-500/50 outline-none text-xl placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                      autoFocus
                  />
                )}
                {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4 font-bold bg-red-50 dark:bg-red-500/10 py-1 px-4 rounded-full inline-block border border-red-200 dark:border-red-500/20">{error}</p>}
                
                <div className="mt-10">
                    <button onClick={handleNext} className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xl font-bold rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-200">
                        {step === questions.length - 1 ? 'Calculate Pricing' : 'Next'}
                    </button>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                    {questions.map((_, index) => (
                        <div 
                            key={index} 
                            className={`h-1.5 rounded-full transition-all duration-500 ${index === step ? 'w-10 bg-blue-500 dark:bg-cyan-500' : index < step ? 'w-3 bg-blue-600' : 'w-3 bg-slate-300 dark:bg-slate-700'}`} 
                        />
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CostPerLeadCalculator;