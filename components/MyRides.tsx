import React from 'react';
import { User, Ride } from '../types';
import RideCard from './RideCard';

interface MyRidesProps {
  currentUser: User;
  allRides: Ride[];
  bookedRideIds: string[];
  onSelectRide: (ride: Ride) => void;
}

const MyRides: React.FC<MyRidesProps> = ({ currentUser, allRides, bookedRideIds, onSelectRide }) => {
  const ridesOffered = allRides.filter(ride => ride.driverId === currentUser.id);
  const ridesBooked = allRides.filter(ride => bookedRideIds.includes(ride.id));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Rides</h1>

      {/* Rides Offered by User */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 mb-6">Rides You're Offering</h2>
        {ridesOffered.length > 0 ? (
          <div className="space-y-6">
            {ridesOffered.map(ride => (
              <RideCard key={ride.id} ride={ride} onSelectRide={onSelectRide} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-gray-700">You haven't offered any rides yet.</h3>
            <p className="text-gray-500 mt-2">Click on "Offer a Ride" in the header to get started!</p>
          </div>
        )}
      </section>

      {/* Rides Booked by User */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 mb-6">Rides You've Booked</h2>
        {ridesBooked.length > 0 ? (
          <div className="space-y-6">
            {ridesBooked.map(ride => (
              <RideCard key={ride.id} ride={ride} onSelectRide={onSelectRide} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-gray-700">You have no upcoming booked rides.</h3>
            <p className="text-gray-500 mt-2">Search for a ride to book your next trip.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyRides;