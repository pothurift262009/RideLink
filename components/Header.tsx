import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogoClick: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onLogoutClick: () => void;
  onNavigate: (page: 'landing' | 'results' | 'details' | 'offer' | 'myRides' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogoClick, onLoginClick, onSignUpClick, onLogoutClick, onNavigate }) => {
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
          <nav className="hidden md:flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-6">
                <a onClick={() => onNavigate('offer')} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer">Offer a Ride</a>
                <a onClick={() => onNavigate('myRides')} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer">My Rides</a>
                <a onClick={() => onNavigate('profile')} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer">My Profile</a>
                <div className="flex items-center gap-4 pl-2 border-l border-slate-200">
                   <div 
                      onClick={() => onNavigate('profile')}
                      className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                   >
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full border-2 border-indigo-200" />
                      <span className="font-semibold text-gray-700">{currentUser.name}</span>
                   </div>
                   <button 
                      onClick={onLogoutClick}
                      className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-all text-sm"
                    >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onSignUpClick}
                  className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-all text-sm"
                >
                  Sign Up
                </button>
                <button 
                  onClick={onLoginClick}
                  className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Log In
                </button>
              </div>
            )}
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