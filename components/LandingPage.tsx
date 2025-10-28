import React, { useState } from 'react';
import { LeafIcon, ShieldCheckIcon, StarIcon, TicketIcon } from './icons/Icons';

interface LandingPageProps {
  onSearch: (from: string, to: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('Chennai');
  const [to, setTo] = useState('Bangalore');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      onSearch(from, to);
    }
  };

  const kpis = [
    {
      icon: <TicketIcon className="w-8 h-8 text-indigo-500" />,
      value: "50,000+",
      label: "Journeys Shared"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-green-500" />,
      value: "10,000+",
      label: "Verified Members"
    },
    {
      icon: <LeafIcon className="w-8 h-8 text-emerald-500" />,
      value: "1.2k tonnes",
      label: "CO2 Saved Together"
    },
    {
      icon: <StarIcon className="w-8 h-8 text-amber-500" />,
      value: "4.8/5",
      label: "Average Trip Rating"
    },
  ];


  return (
    <div className="flex flex-col items-center justify-center -mt-8 md:-mt-12">
      <div className="w-full bg-gradient-to-tr from-violet-100 via-pink-50 to-blue-100 dark:from-violet-900/70 dark:via-pink-900/30 dark:to-blue-900/70 rounded-2xl shadow-lg relative overflow-hidden">
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 dark:opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 dark:opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 dark:opacity-50 animate-blob animation-delay-4000"></div>
        
        <div className="w-full h-full p-8 md:p-20 flex flex-col items-center justify-center text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-4 tracking-tighter">
              Your Vibe, Your Ride.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-8">
              Skip the surge pricing & travel with verified peeps. Chennai to Bangalore or anywhere in between—we got you. 🤙
            </p>
        </div>
      </div>

      <div className="w-full max-w-4xl -mt-16 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl z-20 border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <div className="md:col-span-1 relative flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              id="from"
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Leaving from..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
           <div className="md:col-span-1 relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Going to..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="md:col-span-1 relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              id="date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="md:col-span-1 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105"
          >
            Find My Ride
          </button>
        </form>
      </div>

      {/* KPI Section */}
      <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {kpis.map((kpi, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="mb-2">{kpi.icon}</div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{kpi.value}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.label}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
