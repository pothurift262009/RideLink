import React, { useState, useMemo } from 'react';
import { Ride, User, Gender } from '../types';
import RideCard from './RideCard';

interface SearchResultsProps {
  rides: Ride[];
  onSelectRide: (ride: Ride) => void;
  searchCriteria: { from: string; to: string };
  users: User[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ rides, onSelectRide, searchCriteria, users }) => {
  const [womenOnly, setWomenOnly] = useState(false);

  const filteredRides = useMemo(() => {
    if (!womenOnly) {
      return rides;
    }
    return rides.filter(ride => {
      const driver = users.find(u => u.id === ride.driverId);
      return driver?.gender === Gender.Female;
    });
  }, [rides, womenOnly, users]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-1/4">
        <div className="bg-white p-6 rounded-xl shadow-md sticky top-28 border border-slate-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>
          <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
            <label htmlFor="women-only" className="font-semibold text-gray-700">
              Women Only Rides
            </label>
            <div
              onClick={() => setWomenOnly(!womenOnly)}
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${womenOnly ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${womenOnly ? 'translate-x-6' : ''}`} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Only show rides offered by women drivers.</p>
        </div>
      </aside>

      <div className="lg:w-3/4">
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchCriteria.from} → {searchCriteria.to}
            </h2>
            <p className="text-gray-600">{filteredRides.length} rides found {womenOnly && '(women drivers only)'}</p>
        </div>

        {filteredRides.length > 0 ? (
          <div className="space-y-6">
            {filteredRides.map(ride => (
              <RideCard key={ride.id} ride={ride} onSelectRide={onSelectRide} users={users} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-gray-700">No rides found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different route.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;