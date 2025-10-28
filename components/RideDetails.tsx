import React, { useState, useEffect } from 'react';
import { Ride, User } from '../types';
import { summarizeReviews } from '../services/geminiService';
// FIX: Import IconProps to correctly type the icon prop for the InfoItem component.
import { ArrowLeftIcon, ShieldCheckIcon, StarIcon, CurrencyRupeeIcon, ClockIcon, UsersIcon, CarIcon, ChatBubbleIcon, SparklesIcon, SosIcon, CheckCircleIcon, type IconProps } from './icons/Icons';
import ChatModal from './ChatModal';

interface RideDetailsProps {
  ride: Ride;
  driver: User;
  onBack: () => void;
  bookedRideId: string | null;
  onBook: (rideId: string) => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({ ride, driver, onBack, bookedRideId, onBook }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const isBooked = ride.id === bookedRideId;

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoadingSummary(true);
      const summary = await summarizeReviews(driver.reviews);
      setAiSummary(summary);
      setIsLoadingSummary(false);
    };
    fetchSummary();
  }, [driver.reviews]);
  
  const handleBook = () => {
    if (!isBooked) {
      onBook(ride.id);
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-semibold mb-6 hover:underline">
          <ArrowLeftIcon className="w-5 h-5"/>
          Back to Results
        </button>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{ride.from} to {ride.to}</h2>
                <p className="text-gray-500">with {driver.name}</p>
              </div>
              <div className="flex items-center gap-2 text-3xl font-extrabold text-gray-800 bg-indigo-50 px-4 py-2 rounded-lg">
                  <CurrencyRupeeIcon className="w-8 h-8 text-indigo-600" />
                  <span>{ride.pricePerSeat}</span>
                  <span className="text-base font-medium text-gray-600">/ seat</span>
              </div>
            </div>

            {/* Ride Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-gray-200 py-6 mb-8">
              <InfoItem icon={<ClockIcon />} label="Departs" value={ride.departureTime} />
              <InfoItem icon={<ClockIcon />} label="Arrives" value={ride.estimatedArrivalTime} />
              <InfoItem icon={<UsersIcon />} label="Seats Left" value={`${ride.availableSeats}`} />
              <InfoItem icon={<CarIcon />} label="Vehicle" value={`${ride.car.make} ${ride.car.model}`} />
            </div>

            {/* Driver Profile */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <img src={driver.avatarUrl} alt={driver.name} className="w-24 h-24 rounded-full border-4 border-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">{driver.name}</h3>
                {driver.isVerified && (
                    <div className="flex items-center gap-1 text-green-600 font-semibold mt-1">
                      <ShieldCheckIcon className="w-5 h-5"/>
                      <span>{driver.verificationType} Verified</span>
                    </div>
                )}
                <div className="flex items-center gap-1 text-amber-600 mt-1">
                      <StarIcon className="w-5 h-5"/>
                      <span className="font-bold text-base">{driver.trustScore.toFixed(1)} Trust Score</span>
                  </div>
              </div>
              
              <div className="md:w-2/3">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                      <SparklesIcon className="w-6 h-6 text-indigo-500" />
                      AI Trust Insights
                  </h4>
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-0.5 rounded-lg">
                      <div className="bg-slate-50 p-4 rounded-md min-h-[100px]">
                          {isLoadingSummary ? (
                              <div className="space-y-3">
                                  <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                                  <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
                                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                              </div>
                          ) : (
                              <p className="text-gray-700 leading-relaxed">{aiSummary}</p>
                          )}
                      </div>
                  </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleBook}
                  disabled={isBooked}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all text-lg ${
                    isBooked
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isBooked ? <><CheckCircleIcon className="w-6 h-6"/> Ride Booked</> : 'Book Now'}
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  disabled={!isBooked}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-all text-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChatBubbleIcon className="w-6 h-6"/>
                  Message Driver
                </button>
                <button className="flex items-center justify-center gap-2 bg-red-100 text-red-600 font-bold py-3 px-4 rounded-lg hover:bg-red-200 transition-all">
                  <SosIcon className="w-6 h-6"/>
                  <span className="hidden md:inline">SOS</span>
                </button>
            </div>
          </div>
        </div>
      </div>
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          driver={driver}
          rideId={ride.id}
        />
      )}
    </>
  );
};


// FIX: Changed icon prop type to the more specific React.ReactElement<IconProps>.
// This resolves the TypeScript error with React.cloneElement by providing better type information,
// ensuring that the `className` prop can be safely applied.
const InfoItem: React.FC<{icon: React.ReactElement<IconProps>, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="text-indigo-600 bg-indigo-100 p-2 rounded-full">
            {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


export default RideDetails;