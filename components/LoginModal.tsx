import React from 'react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  users: User[];
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, users }) => {
  if (!isOpen) return null;

  const handleLogin = (user: User) => {
    onLogin(user);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Select a Profile to Log In</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl">&times;</button>
        </div>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => handleLogin(user)}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
              <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-lg text-slate-700">{user.name}</p>
                <p className="text-sm text-slate-500">{user.isVerified ? 'Verified Driver' : 'Passenger'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;