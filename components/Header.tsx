import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-slate-200/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onLogoClick}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
              <path d="M16 4C10.48 4 6 8.48 6 14C6 21.24 16 28 16 28C16 28 26 21.24 26 14C26 8.48 21.52 4 16 4Z" fill="currentColor" fillOpacity="0.2"/>
              <path d="M16 18C18.2091 18 20 16.2091 20 14C20 11.7909 18.2091 10 16 10C13.7909 10 12 11.7909 12 14C12 16.2091 13.7909 18 16 18Z" fill="currentColor"/>
              <path d="M16 4C10.48 4 6 8.48 6 14C6 21.24 16 28 16 28C16 28 26 21.24 26 14C26 8.48 21.52 4 16 4ZM16 18C13.7909 18 12 16.2091 12 14C12 11.7909 13.7909 10 16 10C18.2091 10 20 11.7909 20 14C20 16.2091 18.2091 18 16 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">RideLink</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Offer a Ride</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">My Rides</a>
            <button className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
              Log In
            </button>
          </nav>
          <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;