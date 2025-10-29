import React from 'react';
import { Ride, User } from '../types';
// FIX: Import 'IconProps' to correctly type the icon element.
import { RouteIcon, CurrencyRupeeIcon, UserCircleIcon, CheckCircleIcon, CalendarIcon, ClockIcon, type IconProps } from './icons/Icons';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  driver: User;
  onConfirm: () => void;
}

// FIX: Specify the type of the icon prop as React.ReactElement<IconProps> to allow passing props like 'className'.
const DetailRow: React.FC<{ icon: React.ReactElement<IconProps>, label: string, value: string, isHighlighted?: boolean }> = ({ icon, label, value, isHighlighted }) => (
    <div className="flex items-center gap-4">
        {React.cloneElement(icon, { className: 'w-6 h-6 text-slate-500 flex-shrink-0' })}
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className={`font-semibold ${isHighlighted ? 'text-lg text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-100'}`}>{value}</p>
        </div>
    </div>
);


const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ isOpen, onClose, ride, driver, onConfirm }) => {
  if (!isOpen) return null;

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
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <CheckCircleIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="mt-5 text-lg leading-6 font-bold text-gray-900 dark:text-slate-100">
                Confirm Your Booking
            </h3>
            <div className="mt-4 mb-6 text-sm text-gray-600 dark:text-slate-300">
                <p>Please review the details of your ride before proceeding to payment.</p>
            </div>

            <div className="space-y-4 text-left bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <DetailRow icon={<RouteIcon />} label="Route" value={`${ride.from} → ${ride.to}`} />
                <DetailRow icon={<UserCircleIcon />} label="Driver" value={driver.name} />
                <DetailRow icon={<CalendarIcon />} label="Date" value={new Date(ride.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <DetailRow icon={<ClockIcon />} label="Departure Time" value={ride.departureTime} />
                <div className="border-t border-slate-200 dark:border-slate-600 my-2"></div>
                <DetailRow icon={<CurrencyRupeeIcon />} label="Total Price" value={`₹${ride.pricePerSeat}`} isHighlighted={true} />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                <button
                    type="button"
                    onClick={onConfirm}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                >
                    Confirm & Proceed
                </button>
                 <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;