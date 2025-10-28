import React from 'react';
import { Ride, User } from '../types';
import { ShieldCheckIcon, StarIcon, CurrencyRupeeIcon, UsersIcon, CarIcon } from './icons/Icons';

interface RideCardProps {
  ride: Ride;
  onSelectRide: (ride: Ride) => void;
  users: User[];
}

const RideCard: React.FC<RideCardProps> = ({ ride, onSelectRide, users }) => {
  const driver = users.find(u => u.id === ride.driverId);

  if (!driver) return null;

  return (
    <div 
      onClick={() => onSelectRide(ride)}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200/80 hover:border-indigo-400 overflow-hidden flex transform hover:-translate-y-1"
    >
      {/* Driver Info Panel */}
      <div className="w-1/3 lg:w-1/4 p-4 flex flex-col items-center justify-center bg-slate-50/70 text-center border-r border-slate-200">
        <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-white shadow-md mb-2" />
        <h4 className="font-bold text-lg text-slate-800 leading-tight">{driver.name}</h4>
        <div className="flex items-center gap-1 text-amber-500 mt-1">
            <StarIcon className="w-5 h-5"/>
            <span className="font-bold text-base text-slate-700">{driver.trustScore.toFixed(1)}</span>
        </div>
         {driver.isVerified && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mt-2 bg-green-100/70 px-2 py-1 rounded-full">
              <ShieldCheckIcon className="w-4 h-4"/>
              <span>Verified</span>
            </div>
        )}
      </div>

      {/* Ride & Price Info */}
      <div className="w-2/3 lg:w-3/4 p-5 flex flex-col">
        {/* Route */}
        <div className="flex items-center w-full">
          <div className="text-right">
            <p className="font-bold text-lg text-slate-800">{ride.departureTime}</p>
            <p className="text-sm text-slate-500">{ride.from}</p>
          </div>
          <div className="flex-grow px-2 lg:px-4">
              <div className="w-full h-px bg-slate-200 relative">
                  <div className="w-2.5 h-2.5 bg-white border-2 border-slate-400 rounded-full absolute top-1/2 left-0 -translate-y-1/2"></div>
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full absolute top-1/2 right-0 -translate-y-1/2"></div>
              </div>
          </div>
          <div>
            <p className="font-bold text-lg text-slate-800">{ride.estimatedArrivalTime}</p>
            <p className="text-sm text-slate-500">{ride.to}</p>
          </div>
        </div>
        
        {/* Vehicle & Seats */}
        <div className="mt-auto pt-4 flex justify-between items-end">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <CarIcon className="w-5 h-5 text-slate-500"/>
              <span>{ride.car.make} {ride.car.model}</span>
            </div>
             <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                <UsersIcon className="w-5 h-5"/>
                <span>{ride.availableSeats} seats left</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-center text-3xl font-extrabold text-slate-800">
            <CurrencyRupeeIcon className="w-7 h-7 -mr-1" />
            <span>{ride.pricePerSeat}</span>
            <p className="text-sm text-slate-500 font-medium ml-1 mt-2">/ seat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCard;