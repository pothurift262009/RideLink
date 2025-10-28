import React, { useState } from 'react';
import { User, Gender, VerificationType } from '../types';
import { ShieldCheckIcon, LinkedInIcon } from './icons/Icons';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (newUser: Omit<User, 'id' | 'avatarUrl' | 'trustScore' | 'reviews'>) => void;
  onLoginClick: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSignUp, onLoginClick }) => {
  const [step, setStep] = useState(1);
  // Step 1 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.Female);
  const [verificationType, setVerificationType] = useState<VerificationType>(VerificationType.Aadhaar);
  
  // Step 2 State
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationSubStep, setVerificationSubStep] = useState<'initial' | 'otp' | 'loading' | 'success'>('initial');
  const [isVerified, setIsVerified] = useState(false);

  const resetVerificationState = () => {
    setAadhaarNumber('');
    setOtp('');
    setVerificationSubStep('initial');
    setIsVerified(false);
  };

  const handleCloseAndReset = () => {
    setStep(1);
    setName('');
    setEmail('');
    setPassword('');
    setGender(Gender.Female);
    setVerificationType(VerificationType.Aadhaar);
    resetVerificationState();
    onClose();
  };

  const handleVerificationTypeChange = (type: VerificationType) => {
    setVerificationType(type);
    resetVerificationState();
  };

  const handleGoToVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleGoBackToDetails = () => {
    setStep(1);
    resetVerificationState();
  };

  const handleSendOtp = async () => {
    setVerificationSubStep('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setVerificationSubStep('otp');
  };
  
  const handleVerifyOtp = async () => {
    setVerificationSubStep('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerified(true);
    setVerificationSubStep('success');
  };

  const handleConnectLinkedIn = async () => {
    setVerificationSubStep('loading');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerified(true);
    setVerificationSubStep('success');
  };
  
  const handleCreateAccount = () => {
    const newUser = {
        name,
        email,
        password,
        gender,
        verificationType,
        isVerified,
    };
    onSignUp(newUser);
    handleCloseAndReset();
  };

  if (!isOpen) return null;

  const renderAadhaarFlow = () => {
    switch (verificationSubStep) {
        case 'initial':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700">Aadhaar Verification</h3>
                    <p className="text-sm text-slate-500">Enter your 12-digit Aadhaar number. We'll send an OTP to your registered mobile number.</p>
                    <FormInput 
                        id="aadhaar" 
                        label="Aadhaar Number" 
                        value={aadhaarNumber} 
                        onChange={setAadhaarNumber} 
                        maxLength={12}
                        placeholder="XXXX XXXX XXXX"
                        required 
                    />
                    <button 
                        onClick={handleSendOtp} 
                        disabled={aadhaarNumber.length !== 12}
                        className="w-full flex justify-center items-center gap-2 bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all disabled:bg-slate-400"
                    >
                        Send OTP
                    </button>
                </div>
            );
        case 'loading':
             return (
                <div className="text-center py-10">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-600">Processing...</p>
                </div>
             );
        case 'otp':
            return (
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700">Enter OTP</h3>
                    <p className="text-sm text-slate-500">An OTP has been sent to your Aadhaar-registered mobile number.</p>
                    <FormInput 
                        id="otp" 
                        label="One-Time Password" 
                        value={otp} 
                        onChange={setOtp} 
                        maxLength={6}
                        placeholder="XXXXXX"
                        required 
                    />
                    <button 
                        onClick={handleVerifyOtp} 
                        disabled={otp.length !== 6}
                        className="w-full flex justify-center items-center gap-2 bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all disabled:bg-slate-400"
                    >
                        Verify OTP
                    </button>
                </div>
            );
        case 'success':
            return (
                <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
                    <p className="font-bold flex items-center justify-center gap-2"><ShieldCheckIcon className="w-5 h-5"/> Aadhaar Verified Successfully!</p>
                </div>
            );
    }
  };
  
  const renderLinkedInFlow = () => {
      switch (verificationSubStep) {
          case 'initial':
              return (
                  <div className="space-y-4 text-center">
                      <h3 className="text-lg font-semibold text-slate-700">LinkedIn Verification</h3>
                      <p className="text-sm text-slate-500">Connect your LinkedIn account to verify your professional identity.</p>
                      <button 
                          onClick={handleConnectLinkedIn} 
                          className="w-full flex justify-center items-center gap-3 bg-[#0077B5] text-white font-bold py-3 rounded-lg hover:bg-[#006097] transition-all"
                      >
                          <LinkedInIcon className="w-5 h-5" />
                          Connect with LinkedIn
                      </button>
                  </div>
              );
          case 'loading':
              return (
                  <div className="text-center py-10">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                      <p className="mt-4 text-slate-600">Redirecting to LinkedIn...</p>
                  </div>
              );
          case 'success':
              return (
                  <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
                      <p className="font-bold flex items-center justify-center gap-2"><LinkedInIcon className="w-5 h-5"/> LinkedIn Connected Successfully!</p>
                  </div>
              );
      }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4"
      onClick={handleCloseAndReset}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Create Your Account</h2>
          <button onClick={handleCloseAndReset} className="text-slate-500 hover:text-slate-800 text-3xl">&times;</button>
        </div>

        {step === 1 && (
            <form onSubmit={handleGoToVerification} className="space-y-4">
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
                    <select value={verificationType} onChange={(e) => handleVerificationTypeChange(e.target.value as VerificationType)} className="w-full py-2 px-3 border border-gray-300 rounded-lg">
                        <option value={VerificationType.Aadhaar}>Aadhaar</option>
                        <option value={VerificationType.LinkedIn}>LinkedIn</option>
                    </select>
                </div>
                
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all">
                    Next: Verify Identity
                </button>
            </form>
        )}

        {step === 2 && (
             <div className="space-y-4">
                <button onClick={handleGoBackToDetails} className="text-sm text-indigo-600 hover:underline">← Back to details</button>
                
                {verificationType === VerificationType.Aadhaar && renderAadhaarFlow()}
                {verificationType === VerificationType.LinkedIn && renderLinkedInFlow()}

                <button 
                    onClick={handleCreateAccount} 
                    disabled={!isVerified}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-300 mt-4"
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