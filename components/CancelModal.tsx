import React from 'react';
import { Ride, User } from '../types';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  driver: User;
  onConfirmCancel: (rideId: string) => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ isOpen, onClose, ride, driver, onConfirmCancel }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmCancel(ride.id);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="mt-5 text-lg leading-6 font-bold text-gray-900 dark:text-slate-100">
                Cancel your ride?
            </h3>
            <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                    Are you sure you want to cancel your ride from <span className="font-semibold text-slate-700 dark:text-slate-200">{ride.from}</span> to <span className="font-semibold text-slate-700 dark:text-slate-200">{ride.to}</span> with {driver.name}?
                </p>
            </div>
             <p className="text-xs text-slate-500 dark:text-slate-400">
                Cancellations within 24 hours may incur a small fee.
            </p>
            <div className="mt-6 flex justify-center gap-4">
                 <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                >
                    Keep Ride
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                >
                    Yes, Cancel
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;