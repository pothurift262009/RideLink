import React from 'react';
import { Ride, User, Amenity } from '../types';
import { ShieldCheckIcon, StarIcon, CurrencyRupeeIcon, UsersIcon, CarIcon, RouteLineIcon, CheckCircleIcon, SnowflakeIcon, MusicNoteIcon, PawPrintIcon, TrackingIcon } from './icons/Icons';

interface RideCardProps {
  ride: Ride;
  onSelectRide: (ride: Ride) => void;
  users: User[];
  isHighlighted?: boolean;
  onViewProfile: (user: User) => void;
  status?: 'booked' | 'driving';
  onTrackRide: (ride: Ride) => void;
  isTracking?: boolean;
}

const AmenityIcon: React.FC<{ amenity: Amenity }> = ({ amenity }) => {
    switch(amenity) {
        // FIX: Wrapped icons in a span and moved the title prop to it to resolve prop type errors.
        case Amenity.AC: return <span title="AC Available"><SnowflakeIcon className="w-5 h-5 text-blue-500" /></span>;
        case Amenity.MusicSystem: return <span title="Music System"><MusicNoteIcon className="w-5 h-5 text-purple-500" /></span>;
        case Amenity.PetFriendly: return <span title="Pet Friendly"><PawPrintIcon className="w-5 h-5 text-amber-600" /></span>;
        default: return null;
    }
}


const RideCard: React.FC<RideCardProps> = ({ ride, onSelectRide, users, isHighlighted = false, onViewProfile, status, onTrackRide, isTracking = false }) => {
  const driver = users.find(u => u.id === ride.driverId);

  if (!driver) return null;

  return (
    <div 
      onClick={() => onSelectRide(ride)}
      className={`relative rounded-xl shadow-lg overflow-hidden flex transition-all duration-300 cursor-pointer transform hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] ${
        isHighlighted
          ? 'bg-indigo-50 dark:bg-slate-700 border-2 border-indigo-500 dark:border-indigo-400'
          : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
      }`}
    >
      {/* Status Badge */}
      {status === 'booked' && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full z-10">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Booked</span>
        </div>
      )}
      {status === 'driving' && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full z-10">
            <CarIcon className="w-4 h-4" />
            <span>You're Driving</span>
        </div>
      )}

      {/* Driver Info Panel */}
      <div
        onClick={(e) => { e.stopPropagation(); onViewProfile(driver); }}
        className="w-1/3 lg:w-1/4 p-4 flex flex-col items-center justify-center bg-slate-50/70 dark:bg-slate-900/50 text-center border-r border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/80"
      >
        <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-white dark:border-slate-600 shadow-md mb-2" />
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">{driver.name}</h4>
          {driver.isVerified && (
              // FIX: Wrapped the icon in a span to apply the title attribute, resolving the prop type error.
              <span title="Verified User">
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-amber-500 mt-1">
            <StarIcon className="w-5 h-5"/>
            <span className="font-bold text-base text-slate-700 dark:text-slate-300">{driver.trustScore.toFixed(1)}</span>
        </div>
      </div>

      {/* Ride & Price Info */}
      <div className="w-2/3 lg:w-3/4 p-5 flex flex-col">
        {/* Route */}
        <div className="flex items-center w-full">
          <div className="text-right">
            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{ride.departureTime}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{ride.from}</p>
          </div>
          <div className="flex-grow px-2 lg:px-4 flex items-center">
              <RouteLineIcon className="w-full h-3" />
          </div>
          <div>
            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{ride.estimatedArrivalTime}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{ride.to}</p>
          </div>
        </div>
        
        {/* Vehicle & Seats */}
        <div className="mt-auto pt-4 flex justify-between items-end">
           <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400"/>
                <span>{ride.car.make} {ride.car.model} ({ride.car.type})</span>
              </div>
               <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <UsersIcon className="w-5 h-5"/>
                  <span>{ride.availableSeats} seats left</span>
              </div>
            </div>
            
            {ride.amenities.length > 0 && (
                <div className="flex items-center gap-3">
                    {ride.amenities.map(amenity => <AmenityIcon key={amenity} amenity={amenity} />)}
                </div>
            )}
          </div>
          
          <div className="flex items-end gap-2">
            <button
                onClick={(e) => { e.stopPropagation(); onTrackRide(ride); }}
                title="Track on Map"
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    isTracking
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
                <TrackingIcon className="w-4 h-4"/>
                <span>{isTracking ? 'Tracking' : 'Track'}</span>
            </button>
            {/* Price */}
            <div className="flex items-center text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                <CurrencyRupeeIcon className="w-7 h-7 -mr-1" />
                <span>{ride.pricePerSeat}</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1 mt-2">/ seat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCard;