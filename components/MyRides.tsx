import React from 'react';
import { User, Ride } from '../types';
import RideCard from './RideCard';
import { CheckCircleIcon, XCircleIcon } from './icons/Icons';

interface MyRidesProps {
  currentUser: User;
  allRides: Ride[];
  bookedRideIds: string[];
  onSelectRide: (ride: Ride) => void;
  users: User[];
  onRateRide: (ride: Ride) => void;
  onCancelRide: (ride: Ride) => void;
  onViewProfile: (user: User) => void;
}

const MyRides: React.FC<MyRidesProps> = ({ currentUser, allRides, bookedRideIds, onSelectRide, users, onRateRide, onCancelRide, onViewProfile }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare dates only, not time

  const userRides = allRides.filter(ride => 
    ride.driverId === currentUser.id || bookedRideIds.includes(ride.id)
  );

  const upcomingRides = userRides.filter(ride => new Date(ride.departureDate) >= now)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
    
  const pastRides = userRides.filter(ride => new Date(ride.departureDate) < now)
    .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-8">My Rides</h1>

      {/* Upcoming Rides */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 mb-6">Upcoming Rides</h2>
        {upcomingRides.length > 0 ? (
          <div className="space-y-6">
            {upcomingRides.map(ride => {
              const isBooked = bookedRideIds.includes(ride.id);
              const driver = users.find(u => u.id === ride.driverId);
              if (!driver) return null;

              const isPassenger = isBooked && ride.driverId !== currentUser.id;

              return (
                <div key={ride.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700">
                  <RideCard ride={ride} onSelectRide={onSelectRide} users={users} onViewProfile={onViewProfile} />
                  {isPassenger && (
                    <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 rounded-b-xl border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            You've booked a seat on this ride.
                        </p>
                        <button
                            onClick={() => onCancelRide(ride)}
                            className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 ring-1 ring-inset ring-red-200 dark:ring-red-500/30 hover:ring-red-300 dark:hover:ring-red-500/40 transition-all text-sm"
                        >
                            <XCircleIcon className="w-5 h-5" />
                            Cancel Booking
                        </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-200">You have no upcoming rides.</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Book a new trip or offer a ride to see it here.</p>
          </div>
        )}
      </section>

      {/* Trip History */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 mb-6">Trip History</h2>
        {pastRides.length > 0 ? (
          <div className="space-y-4">
            {pastRides.map(ride => {
              const driver = users.find(u => u.id === ride.driverId);
              if (!driver) return null;

              const isBookedByCurrentUser = bookedRideIds.includes(ride.id);
              const hasRated = driver.reviews.some(r => r.rideId === ride.id && r.raterId === currentUser.id);

              return (
                <div key={ride.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                       <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{ride.from} → {ride.to}</p>
                       <span className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-500/20 px-2.5 py-1 rounded-full">
                          <CheckCircleIcon className="w-4 h-4"/>
                          Completed
                       </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      On {new Date(ride.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {isBookedByCurrentUser ? ` with ${driver.name}` : ' (You were the driver)'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {isBookedByCurrentUser && (
                      !hasRated ? (
                        <button
                          onClick={() => onRateRide(ride)}
                          className="bg-amber-400 text-amber-900 font-bold px-6 py-2 rounded-lg hover:bg-amber-500 transition-all text-sm"
                        >
                          Rate Ride
                        </button>
                      ) : (
                        <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                          Feedback submitted
                        </p>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
           <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-200">No past rides yet.</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Your completed trips will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyRides;