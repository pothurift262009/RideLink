import React, { useState } from 'react';
import { Ride, User } from '../types';
import { CreditCardIcon, CurrencyRupeeIcon, CheckCircleIcon, TicketIcon } from './icons/Icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  driver: User;
  onConfirmPayment: (rideId: string) => void;
  onGoToMyRides: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, ride, driver, onConfirmPayment, onGoToMyRides }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call to payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000));
    onConfirmPayment(ride.id);
    setIsProcessing(false);
    setIsPaid(true);
  };

  const handleClose = () => {
    onClose();
    // Delay state reset to allow for closing animation
    setTimeout(() => {
      setIsPaid(false);
      setIsProcessing(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all p-8"
        onClick={e => e.stopPropagation()}
      >
        {!isPaid && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Confirm and Pay</h2>
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-800 text-3xl">&times;</button>
          </div>
        )}

        {isPaid ? (
            <div className="text-center py-6">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
                <h3 className="text-3xl font-bold text-green-600 mt-4">Ride Booked!</h3>
                <p className="text-slate-600 mt-2 mb-6">Your trip from {ride.from} to {ride.to} is confirmed.</p>
                
                <div className="bg-slate-100 rounded-lg p-4 text-left mb-8 border border-slate-200">
                    <p className="font-semibold text-slate-800">Driver: <span className="font-normal">{driver.name}</span></p>
                    <p className="font-semibold text-slate-800">Date: <span className="font-normal">{new Date(ride.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onGoToMyRides}
                        className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all"
                    >
                        <TicketIcon className="w-5 h-5" />
                        View My Rides
                    </button>
                    <button
                        onClick={handleClose}
                        className="w-full text-slate-600 font-semibold py-2 rounded-lg hover:bg-slate-100 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        ) : (
            <>
                {/* Ride Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                    <p className="font-bold text-lg text-slate-800">{ride.from} → {ride.to}</p>
                    <p className="text-sm text-slate-500">with {driver.name}</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                        <p className="font-semibold text-slate-600">Total Price</p>
                        <p className="flex items-center text-xl font-bold text-indigo-600">
                            <CurrencyRupeeIcon className="w-5 h-5" />
                            {ride.pricePerSeat}
                        </p>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                            <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="cardNumber"
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                                defaultValue="4242 4242 4242 4242"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                            <input id="expiry" type="text" placeholder="MM / YY" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required defaultValue="12 / 28"/>
                        </div>
                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input id="cvc" type="text" placeholder="123" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required defaultValue="123"/>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-400"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : `Pay ₹${ride.pricePerSeat}`}
                    </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;