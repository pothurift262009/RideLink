import React, { useState } from 'react';
import { AITripPlan } from '../types';
import { generateTripPlan } from '../services/geminiService';
import { mockRides, mockUsers } from '../data/mockData'; // Simulating access to historical data
import { MagicWandIcon, SparklesIcon, TicketIcon, ClockIcon, CurrencyRupeeIcon } from './icons/Icons';

interface AITripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: AITripPlan, from: string, to: string) => void;
}

type PlannerState = 'idle' | 'loading' | 'success' | 'error';

const AITripPlannerModal: React.FC<AITripPlannerModalProps> = ({ isOpen, onClose, onPlanGenerated }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [priority, setPriority] = useState('Lowest Cost');
  const [plannerState, setPlannerState] = useState<PlannerState>('idle');
  const [plan, setPlan] = useState<AITripPlan | null>(null);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) {
        alert("Please enter both 'Leaving from' and 'Going to' locations.");
        return;
    }
    setPlannerState('loading');
    try {
        const result = await generateTripPlan(from, to, priority, mockRides, mockUsers);
        setPlan(result);
        setPlannerState('success');
    } catch (error) {
        console.error("Trip planning failed:", error);
        setPlannerState('error');
    }
  };

  const handleCloseAndReset = () => {
    onClose();
    // Delay reset to allow animation to finish
    setTimeout(() => {
        setFrom('');
        setTo('');
        setPriority('Lowest Cost');
        setPlannerState('idle');
        setPlan(null);
    }, 300);
  };
  
  const handleFindRides = () => {
    if (plan) {
        onPlanGenerated(plan, from, to);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4"
      onClick={handleCloseAndReset}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
            <MagicWandIcon className="w-7 h-7 text-indigo-500" />
            AI Trip Planner
          </h2>
          <button onClick={handleCloseAndReset} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-3xl">&times;</button>
        </div>
        
        {plannerState === 'idle' && (
            <form onSubmit={handleGeneratePlan} className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300 mb-6">Tell us your destination and what's important for your trip. Our AI will suggest the best plan.</p>
                
                <FormInput id="from" label="Leaving from" value={from} onChange={setFrom} placeholder="e.g., Chennai" required/>
                <FormInput id="to" label="Going to" value={to} onChange={setTo} placeholder="e.g., Bangalore" required/>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">What's most important to you?</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Lowest Cost', 'Fastest Journey', 'Highest Rated Driver', 'Flexible Timing'].map(p => (
                             <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p)}
                                className={`px-3 py-2 text-sm font-semibold rounded-md text-center transition-colors border-2 ${
                                    priority === p
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Generate Plan
                </button>
            </form>
        )}

        {plannerState === 'loading' && (
             <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">Analyzing routes and prices...</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Our AI is finding the best options for you!</p>
            </div>
        )}

        {(plannerState === 'success' && plan) && (
            <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-center text-slate-700 dark:text-slate-200">Your AI-Powered Trip Suggestion</h3>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 space-y-3">
                    <SuggestionRow icon={<ClockIcon className="text-blue-500" />} label="Best Time to Travel" value={plan.bestTimeToTravel} />
                    <SuggestionRow icon={<CurrencyRupeeIcon className="text-green-500"/>} label="Estimated Cost" value={plan.estimatedCost} />
                    <SuggestionRow icon={<TicketIcon className="text-purple-500"/>} label="Route Insights" value={plan.routeInsights} />
                    <SuggestionRow icon={<SparklesIcon className="text-amber-500"/>} label="Driver Insights" value={plan.driverInsights} />
                </div>
                 <button
                    onClick={handleFindRides}
                    className="w-full mt-2 flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all"
                >
                    See Matching Rides
                </button>
            </div>
        )}

        {plannerState === 'error' && (
             <div className="text-center py-10">
                <p className="font-semibold text-red-600">Oops! Something went wrong.</p>
                <p className="text-slate-500 dark:text-slate-400 mt-2">We couldn't generate a plan right now. Please try again later.</p>
                <button onClick={handleCloseAndReset} className="mt-4 text-indigo-600 font-semibold">Close</button>
            </div>
        )}

      </div>
    </div>
  );
};

const FormInput: React.FC<{id: string, label: string, value: string, onChange: (v: string) => void, placeholder: string, required?: boolean}> = 
({ id, label, value, onChange, placeholder, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
        <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full py-2 px-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
    </div>
);

const SuggestionRow: React.FC<{icon: React.ReactElement, label: string, value: string}> = ({icon, label, value}) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{label}</p>
            <p className="text-slate-600 dark:text-slate-300 text-sm">{value}</p>
        </div>
    </div>
);

export default AITripPlannerModal;
