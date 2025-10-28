import React, { useState } from 'react';

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

  return (
    <div className="flex flex-col items-center justify-center -mt-8 md:-mt-12">
      <div className="w-full bg-gradient-to-br from-indigo-100 via-white to-blue-100 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="w-full h-full p-8 md:p-20 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
              AI-Powered Journeys. <br/> Unbeatable Trust.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
              Experience the future of intercity carpooling in India. Verified profiles, AI trust scores, and dedicated safety features for every ride.
            </p>
        </div>
      </div>

      <div className="w-full max-w-4xl -mt-16 bg-white p-6 md:p-8 rounded-2xl shadow-2xl z-10 border border-slate-100">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="md:col-span-1 relative flex items-center">
            <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              id="date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-700"
            />
          </div>
          <button
            type="submit"
            className="md:col-span-1 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;