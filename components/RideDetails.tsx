import React, { useState, useEffect } from 'react';
import { Ride, User, AISummary, Sentiment, Amenity } from '../types';
import { summarizeReviews } from '../services/geminiService';
import { ArrowLeftIcon, ShieldCheckIcon, StarIcon, CurrencyRupeeIcon, ClockIcon, UsersIcon, CarIcon, ChatBubbleIcon, SparklesIcon, SosIcon, CheckCircleIcon, SnowflakeIcon, MusicNoteIcon, PawPrintIcon, type IconProps } from './icons/Icons';
import ChatModal from './ChatModal';
import MapComponent from './MapComponent';
import { cityCoordinates } from '../data/mockData';

interface RideDetailsProps {
  ride: Ride;
  driver: User;
  onBack: () => void;
  currentUser: User | null;
  isBooked: boolean;
  onBook: (ride: Ride) => void;
  onViewProfile: (user: User) => void;
}

const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
    const sentimentStyles = {
        Positive: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
        Negative: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        Mixed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
        Neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${sentimentStyles[sentiment]}`}>
            Overall Sentiment: {sentiment}
        </span>
    );
};

const AmenityIcon: React.FC<{ amenity: Amenity }> = ({ amenity }) => {
    switch(amenity) {
        case Amenity.AC: return <SnowflakeIcon className="w-5 h-5 text-blue-500" />;
        case Amenity.MusicSystem: return <MusicNoteIcon className="w-5 h-5 text-purple-500" />;
        case Amenity.PetFriendly: return <PawPrintIcon className="w-5 h-5 text-amber-600" />;
        default: return null;
    }
}

const RideDetails: React.FC<RideDetailsProps> = ({ ride, driver, onBack, currentUser, isBooked, onBook, onViewProfile }) => {
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [driverPosition, setDriverPosition] = useState<number>(10); // Start 10% into the ride
  
  const isDriver = currentUser?.id === driver.id;
  const canBook = currentUser && !isBooked && !isDriver;
  const canMessage = currentUser && isBooked && !isDriver;

  // Effect for fetching AI summary
  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoadingSummary(true);
      const summary = await summarizeReviews(driver.reviews);
      setAiSummary(summary);
      setIsLoadingSummary(false);
    };
    fetchSummary();
  }, [driver.reviews]);
  
  // Effect for simulating driver movement
  useEffect(() => {
    const movementInterval = setInterval(() => {
      setDriverPosition(prev => (prev >= 90 ? 10 : prev + Math.random() * 5));
    }, 2000);

    return () => clearInterval(movementInterval);
  }, []);

  const handleBook = () => {
    if (canBook) {
      onBook(ride);
    }
  }

  const startCoords = cityCoordinates[ride.from];
  const endCoords = cityCoordinates[ride.to];

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-6 hover:underline">
          <ArrowLeftIcon className="w-5 h-5"/>
          Back to Results
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          
           {/* Live Tracking Map */}
          {startCoords && endCoords && (
             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-3 ml-2">Live Route Tracking</h3>
                <MapComponent
                    startCoords={startCoords}
                    endCoords={endCoords}
                    startCity={ride.from}
                    endCity={ride.to}
                    driverPosition={driverPosition}
                    highlightedRideId={ride.id}
                    rides={[ride]}
                    onCityClick={() => {}}
                />
             </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{ride.from} to {ride.to}</h2>
                <p className="text-gray-500 dark:text-slate-400">with {driver.name}</p>
              </div>
              <div className="flex items-center gap-2 text-3xl font-extrabold text-gray-800 dark:text-slate-100 bg-indigo-50 dark:bg-slate-700/50 px-4 py-2 rounded-lg">
                  <CurrencyRupeeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  <span>{ride.pricePerSeat}</span>
                  <span className="text-base font-medium text-gray-600 dark:text-slate-300">/ seat</span>
              </div>
            </div>

            {/* Ride Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-gray-200 dark:border-slate-700 py-6 mb-8">
              <InfoItem icon={<ClockIcon />} label="Departs" value={ride.departureTime} />
              <InfoItem icon={<ClockIcon />} label="Arrives" value={ride.estimatedArrivalTime} />
              <InfoItem icon={<UsersIcon />} label="Seats Left" value={`${ride.availableSeats}`} />
              <InfoItem icon={<CarIcon />} label="Vehicle" value={`${ride.car.make} ${ride.car.model} (${ride.car.type})`} />
            </div>

            {/* Driver Profile */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div
                onClick={() => onViewProfile(driver)}
                title={`View ${driver.name}'s Profile`}
                className="md:w-1/3 flex flex-col items-center text-center cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
              >
                <img src={driver.avatarUrl} alt={driver.name} className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-slate-600 mb-4" />
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">{driver.name}</h3>
                  {driver.isVerified && (
                      <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-500/20 px-2.5 py-1 rounded-full">
                        <ShieldCheckIcon className="w-4 h-4"/>
                        <span>{driver.verificationType} Verified</span>
                      </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 mt-1">
                      <StarIcon className="w-5 h-5"/>
                      <span className="font-bold text-base">{driver.trustScore.toFixed(1)} Trust Score</span>
                  </div>
              </div>
              
              <div className="md:w-2/3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 
                      className="flex items-center gap-2 text-lg font-bold text-indigo-600 dark:text-indigo-400"
                      title="This summary is generated by AI to give you a quick overview of the driver's reputation."
                    >
                        <SparklesIcon className="w-6 h-6" />
                        <span>AI Trust Insights</span>
                    </h4>
                    {aiSummary && !isLoadingSummary && <SentimentBadge sentiment={aiSummary.sentiment} />}
                  </div>
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-0.5 rounded-lg">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md min-h-[120px] relative">
                          {isLoadingSummary ? (
                              <div className="space-y-3">
                                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full"></div>
                                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6"></div>
                                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
                              </div>
                          ) : (
                              <>
                                <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{aiSummary?.summary}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 absolute bottom-2 right-3">
                                  *This is an AI-generated summary.
                                </p>
                              </>
                          )}
                      </div>
                  </div>
              </div>
            </div>

            {/* Amenities Section */}
            {ride.amenities.length > 0 && (
                <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-4">
                        {ride.amenities.map(amenity => (
                            <div key={amenity} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                                <AmenityIcon amenity={amenity} />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{amenity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cancellation Policy */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 mb-4 px-2">
              <p>Free cancellation up to 24 hours before departure. A small fee may apply for late cancellations.</p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleBook}
                  disabled={!canBook}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all text-lg ${
                    isBooked
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 cursor-not-allowed'
                      : isDriver
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                      : !currentUser
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isBooked ? <><CheckCircleIcon className="w-6 h-6"/> Ride Booked</> : isDriver ? 'This is Your Ride' : !currentUser ? 'Log in to Book' : 'Book Now'}
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  disabled={!canMessage}
                  className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 font-bold py-3 px-6 rounded-lg transition-all text-lg disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:text-gray-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  <ChatBubbleIcon className="w-6 h-6"/>
                  Message Driver
                </button>
                <button className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold py-3 px-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-all">
                  <SosIcon className="w-6 h-6"/>
                  <span className="hidden md:inline">SOS</span>
                </button>
            </div>
          </div>
        </div>
      </div>
      {isChatOpen && currentUser && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          recipient={driver}
          currentUser={currentUser}
          rideId={ride.id}
          ride={ride}
        />
      )}
    </>
  );
};

const InfoItem: React.FC<{icon: React.ReactElement<IconProps>, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
            {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
            <p className="font-bold text-gray-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);


export default RideDetails;