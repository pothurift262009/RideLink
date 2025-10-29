import React, { useState, useMemo, useEffect } from 'react';
import { Ride, User, Gender } from '../types';
import RideCard from './RideCard';
import MapComponent from './MapComponent';
import { cityCoordinates } from '../data/mockData';
import { CurrencyRupeeIcon, SortAscDescIcon } from './icons/Icons';

interface SearchResultsProps {
  rides: Ride[];
  onSelectRide: (ride: Ride) => void;
  searchCriteria: { from: string; to: string; date: string; passengers: string; };
  users: User[];
  onViewProfile: (user: User) => void;
}

const timeSlots = [
    { id: 'early', label: 'Before 6 AM' },
    { id: 'morning', label: '6 AM - 12 PM' },
    { id: 'afternoon', label: '12 PM - 6 PM' },
    { id: 'evening', label: 'After 6 PM' },
];

const parseTime = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(' ');
    let [hours] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours;
};


const SearchResults: React.FC<SearchResultsProps> = ({ rides, onSelectRide, searchCriteria, users, onViewProfile }) => {
  const [womenOnly, setWomenOnly] = useState(false);
  const [highlightedRideId, setHighlightedRideId] = useState<string | null>(null);

  const maxPrice = useMemo(() => {
    if (rides.length === 0) return 1500;
    const max = Math.max(...rides.map(r => r.pricePerSeat));
    return Math.ceil(max / 100) * 100; // Round up to nearest 100
  }, [rides]);

  const [priceRange, setPriceRange] = useState<number>(maxPrice);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('trust-desc');

  useEffect(() => {
    setPriceRange(maxPrice);
  }, [maxPrice]);


  const handleTimeChange = (slotId: string) => {
    setSelectedTimes(prev => 
        prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
    );
  };

  const filteredAndSortedRides = useMemo(() => {
    let tempRides = rides
      .filter(ride => ride.pricePerSeat <= priceRange)
      .filter(ride => {
        if (womenOnly) {
          const driver = users.find(u => u.id === ride.driverId);
          return driver?.gender === Gender.Female;
        }
        return true;
      })
      .filter(ride => {
        if (selectedTimes.length === 0) return true;
        const hour = parseTime(ride.departureTime);
        return selectedTimes.some(slot => {
            if (slot === 'early') return hour < 6;
            if (slot === 'morning') return hour >= 6 && hour < 12;
            if (slot === 'afternoon') return hour >= 12 && hour < 18;
            if (slot === 'evening') return hour >= 18;
            return false;
        });
      });

    // Sorting
    tempRides.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.pricePerSeat - b.pricePerSeat;
            case 'price-desc':
                return b.pricePerSeat - a.pricePerSeat;
            case 'time-asc':
                return parseTime(a.departureTime) - parseTime(b.departureTime);
            case 'trust-desc':
            default:
                const driverA = users.find(u => u.id === a.driverId);
                const driverB = users.find(u => u.id === b.driverId);
                return (driverB?.trustScore || 0) - (driverA?.trustScore || 0);
        }
    });

    return tempRides;
  }, [rides, womenOnly, users, priceRange, selectedTimes, sortBy]);

  const rideCountText = `${filteredAndSortedRides.length} ride${filteredAndSortedRides.length !== 1 ? 's' : ''} found`;

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Column: Filters and Results */}
      <div className="w-full xl:w-1/2">
        <aside className="mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 -mb-2">Filters</h3>
            
            {/* Women Only Filter */}
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

            {/* Price Filter */}
            <div>
                <label htmlFor="price-range" className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">Price Range</label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        id="price-range"
                        min={0}
                        max={maxPrice}
                        step={50}
                        value={priceRange}
                        onChange={e => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 px-3 py-1 rounded-md text-sm whitespace-nowrap">
                        ≤ ₹{priceRange}
                    </span>
                </div>
            </div>

            {/* Time Filter */}
            <div>
                 <label className="block font-semibold text-gray-700 dark:text-slate-200 mb-2">Departure Time</label>
                 <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map(slot => (
                        <button
                            key={slot.id}
                            onClick={() => handleTimeChange(slot.id)}
                            className={`px-3 py-2 text-sm font-medium rounded-md text-left transition-colors border ${
                                selectedTimes.includes(slot.id)
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                            }`}
                        >
                            {slot.label}
                        </button>
                    ))}
                 </div>
            </div>
          </div>
        </aside>

        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                {searchCriteria.from} → {searchCriteria.to}
                </h2>
                <p className="text-gray-600 dark:text-slate-400">{rideCountText} for {searchCriteria.passengers} passenger{parseInt(searchCriteria.passengers, 10) > 1 ? 's' : ''}</p>
            </div>
            {/* Sort Dropdown */}
            <div className="relative">
                <SortAscDescIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                    <option value="trust-desc">Sort by: Trust Score</option>
                    <option value="price-asc">Sort by: Price (Low-High)</option>
                    <option value="price-desc">Sort by: Price (High-Low)</option>
                    <option value="time-asc">Sort by: Departure (Earliest)</option>
                </select>
            </div>
        </div>

        {filteredAndSortedRides.length > 0 ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {filteredAndSortedRides.map(ride => (
              <div 
                key={ride.id}
                onMouseEnter={() => setHighlightedRideId(ride.id)}
                onMouseLeave={() => setHighlightedRideId(null)}
              >
                <RideCard 
                  ride={ride} 
                  onSelectRide={onSelectRide} 
                  users={users} 
                  isHighlighted={ride.id === highlightedRideId}
                  onViewProfile={onViewProfile}
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
            {cityCoordinates[searchCriteria.from] && cityCoordinates[searchCriteria.to] && (
              <MapComponent
                startCoords={cityCoordinates[searchCriteria.from]}
                endCoords={cityCoordinates[searchCriteria.to]}
                rides={filteredAndSortedRides}
                highlightedRideId={highlightedRideId}
                onHighlightRide={setHighlightedRideId}
              />
            )}
         </div>
      </div>
    </div>
  );
};

export default SearchResults;