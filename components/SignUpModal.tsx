import React, { useState } from 'react';
import { User, Gender, VerificationType } from '../types';
import { ShieldCheckIcon } from './icons/Icons';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (newUser: Omit<User, 'id' | 'avatarUrl' | 'trustScore' | 'reviews'>) => void;
  onLoginClick: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSignUp, onLoginClick }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.Female);
  const [verificationType, setVerificationType] = useState<VerificationType>(VerificationType.Aadhaar);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationType === VerificationType.Aadhaar) {
        setStep(2);
    } else {
        handleSubmit(); // For LinkedIn, directly submit
    }
  };

  const handleAadhaarVerification = async () => {
    setIsVerifying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
    setIsVerified(true);
  };
  
  const handleSubmit = () => {
    const newUser = {
        name,
        email,
        password,
        gender,
        verificationType,
        isVerified,
    };
    onSignUp(newUser);
  };

  if (!isOpen) return null;

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
          <h2 className="text-2xl font-bold text-slate-800">Create Your Account</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl">&times;</button>
        </div>

        {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
                <FormInput id="name" label="Full Name" value={name} onChange={setName} required />
                <FormInput id="email" label="Email Address" type="email" value={email} onChange={setEmail} required />
                <FormInput id="password" label="Password" type="password" value={password} onChange={setPassword} required />
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="w-full py-2 px-3 border border-gray-300 rounded-lg">
                        <option value={Gender.Female}>Female</option>
                        <option value={Gender.Male}>Male</option>
                        <option value={Gender.Other}>Other</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Method</label>
                    <select value={verificationType} onChange={(e) => setVerificationType(e.target.value as VerificationType)} className="w-full py-2 px-3 border border-gray-300 rounded-lg">
                        <option value={VerificationType.Aadhaar}>Aadhaar</option>
                        <option value={VerificationType.LinkedIn}>LinkedIn (Coming Soon)</option>
                    </select>
                </div>
                
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all">
                    Next
                </button>
            </form>
        )}

        {step === 2 && verificationType === VerificationType.Aadhaar && (
             <div className="space-y-4">
                <button onClick={() => setStep(1)} className="text-sm text-indigo-600 hover:underline">← Back to details</button>
                <h3 className="text-lg font-semibold text-slate-700">Aadhaar Verification</h3>
                <p className="text-sm text-slate-500">Please enter your 12-digit Aadhaar number to verify your identity. This is a crucial step for safety.</p>
                <FormInput 
                    id="aadhaar" 
                    label="Aadhaar Number" 
                    value={aadhaarNumber} 
                    onChange={setAadhaarNumber} 
                    maxLength={12}
                    placeholder="XXXX XXXX XXXX"
                    required 
                />

                {!isVerified && (
                     <button 
                        onClick={handleAadhaarVerification} 
                        disabled={isVerifying || aadhaarNumber.length !== 12}
                        className="w-full flex justify-center items-center gap-2 bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all disabled:bg-slate-400"
                    >
                        {isVerifying ? (
                            <>
                                <div className="w-5 h-5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin"></div>
                                Verifying...
                            </>
                        ) : 'Verify Aadhaar'}
                    </button>
                )}
               
                {isVerified && (
                    <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
                        <p className="font-bold flex items-center justify-center gap-2"><ShieldCheckIcon className="w-5 h-5"/> Aadhaar Verified Successfully!</p>
                    </div>
                )}

                <button 
                    onClick={handleSubmit} 
                    disabled={!isVerified}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-300"
                >
                    Create Account
                </button>
             </div>
        )}

        <div className="mt-6 text-center">
            <p className="text-slate-600">
                Already have an account?{' '}
                <button onClick={onLoginClick} className="font-semibold text-indigo-600 hover:underline">
                    Log In
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

const FormInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    maxLength?: number;
    placeholder?: string;
}> = ({ id, label, value, onChange, type = 'text', required = false, maxLength, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
    </div>
);

export default SignUpModal;