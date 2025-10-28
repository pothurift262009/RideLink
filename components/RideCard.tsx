import React from 'react';
import { Ride, User } from '../types';
import { ShieldCheckIcon, StarIcon, CurrencyRupeeIcon, UsersIcon, CarIcon, RouteLineIcon } from './icons/Icons';

interface RideCardProps {
  ride: Ride;
  onSelectRide: (ride: Ride) => void;
  users: User[];
  isHighlighted?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onSelectRide, users, isHighlighted = false }) => {
  const driver = users.find(u => u.id === ride.driverId);

  if (!driver) return null;

  return (
    <div 
      onClick={() => onSelectRide(ride)}
      className={`rounded-xl shadow-lg overflow-hidden flex transition-all duration-300 cursor-pointer transform hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] ${
        isHighlighted
          ? 'bg-indigo-50 dark:bg-slate-700 border-2 border-indigo-500 dark:border-indigo-400'
          : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
      }`}
    >
      {/* Driver Info Panel */}
      <div className="w-1/3 lg:w-1/4 p-4 flex flex-col items-center justify-center bg-slate-50/70 dark:bg-slate-900/50 text-center border-r border-slate-200 dark:border-slate-700">
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
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <CarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400"/>
              <span>{ride.car.make} {ride.car.model}</span>
            </div>
             <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                <UsersIcon className="w-5 h-5"/>
                <span>{ride.availableSeats} seats left</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-center text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            <CurrencyRupeeIcon className="w-7 h-7 -mr-1" />
            <span>{ride.pricePerSeat}</span>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1 mt-2">/ seat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCard;