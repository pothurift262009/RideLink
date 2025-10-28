import React, { useState, useMemo } from 'react';
import { Ride, User, Gender } from '../types';
import RideCard from './RideCard';
import MapComponent from './MapComponent';
import { cityCoordinates } from '../data/mockData';


interface SearchResultsProps {
  rides: Ride[];
  onSelectRide: (ride: Ride) => void;
  searchCriteria: { from: string; to: string };
  users: User[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ rides, onSelectRide, searchCriteria, users }) => {
  const [womenOnly, setWomenOnly] = useState(false);
  const [hoveredRideId, setHoveredRideId] = useState<string | null>(null);

  const filteredRides = useMemo(() => {
    if (!womenOnly) {
      return rides;
    }
    return rides.filter(ride => {
      const driver = users.find(u => u.id === ride.driverId);
      return driver?.gender === Gender.Female;
    });
  }, [rides, womenOnly, users]);

  const startCoords = cityCoordinates[searchCriteria.from];
  const endCoords = cityCoordinates[searchCriteria.to];

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Column: Filters and Results */}
      <div className="w-full xl:w-1/2">
        <aside className="mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">Filters</h3>
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
              <label htmlFor="women-only" className="font-semibold text-gray-700 dark:text-slate-200">
                Women Only Rides
              </label>
              <div
                onClick={() => setWomenOnly(!womenOnly)}
                className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-slate-600 rounded-full p-1 cursor-pointer transition-colors ${womenOnly ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-600'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${womenOnly ? 'translate-x-6' : ''}`} />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Only show rides offered by women drivers.</p>
          </div>
        </aside>

        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
              {searchCriteria.from} → {searchCriteria.to}
            </h2>
            <p className="text-gray-600 dark:text-slate-400">{filteredRides.length} rides found {womenOnly && '(women drivers only)'}</p>
        </div>

        {filteredRides.length > 0 ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {filteredRides.map(ride => (
              <div 
                key={ride.id}
                onMouseEnter={() => setHoveredRideId(ride.id)}
                onMouseLeave={() => setHoveredRideId(null)}
              >
                <RideCard 
                  ride={ride} 
                  onSelectRide={onSelectRide} 
                  users={users} 
                  isHighlighted={ride.id === hoveredRideId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-200">No rides found</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Try adjusting your filters or search for a different route.</p>
          </div>
        )}
      </div>

       {/* Right Column: Map */}
      <div className="w-full xl:w-1/2 xl:sticky xl:top-28 self-start">
         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
            {startCoords && endCoords && (
              <MapComponent
                startCoords={startCoords}
                endCoords={endCoords}
                rides={filteredRides}
                highlightedRideId={hoveredRideId}
              />
            )}
         </div>
      </div>
    </div>
  );
};

export default SearchResults;