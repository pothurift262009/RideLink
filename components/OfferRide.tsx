import React, { useState } from 'react';
// FIX: Imported CarType to use in the new ride object.
import { User, Ride, CarType } from '../types';
import { ClockIcon, CurrencyRupeeIcon, UsersIcon, CalendarIcon, type IconProps } from './icons/Icons';

interface OfferRideProps {
  currentUser: User;
  onAddRide: (newRide: Ride) => void;
}

const OfferRide: React.FC<OfferRideProps> = ({ currentUser, onAddRide }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !departureDate || !departureTime || !estimatedArrivalTime || !pricePerSeat || !availableSeats) {
        alert("Please fill in all fields.");
        return;
    }

    const newRide: Ride = {
        id: `ride_${Date.now()}`,
        driverId: currentUser.id,
        from,
        to,
        departureDate,
        departureTime,
        estimatedArrivalTime,
        pricePerSeat: parseInt(pricePerSeat, 10),
        availableSeats: parseInt(availableSeats, 10),
        car: { // Using placeholder car data for simplicity
            make: 'Toyota',
            model: 'Innova',
            color: 'Silver',
            plateNumber: 'KA05XY1234',
            // FIX: Added the missing 'type' property to conform to the Ride interface.
            type: CarType.SUV,
        },
        // FIX: Added missing 'amenities' property to conform to the Ride interface.
        amenities: [],
    };

    onAddRide(newRide);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Offer a New Ride</h2>
      <p className="text-gray-600 dark:text-slate-400 mb-8">Fill out the details below to add your journey to RideLink.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="from" label="Leaving from" value={from} onChange={setFrom} placeholder="e.g., Chennai" />
            <FormInput id="to" label="Going to" value={to} onChange={setTo} placeholder="e.g., Bangalore" />
        </div>
        
        <FormInput id="date" type="date" label="Departure Date" value={departureDate} onChange={setDepartureDate} icon={<CalendarIcon />} />
        
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="departureTime" label="Departure Time" value={departureTime} onChange={setDepartureTime} placeholder="e.g., 08:00 AM" icon={<ClockIcon />} />
            <FormInput id="estimatedArrivalTime" label="Est. Arrival Time" value={estimatedArrivalTime} onChange={setEstimatedArrivalTime} placeholder="e.g., 02:00 PM" icon={<ClockIcon />} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="pricePerSeat" label="Price per Seat" type="number" value={pricePerSeat} onChange={setPricePerSeat} placeholder="e.g., 800" icon={<CurrencyRupeeIcon />} />
            <FormInput id="availableSeats" label="Available Seats" type="number" value={availableSeats} onChange={setAvailableSeats} placeholder="e.g., 3" icon={<UsersIcon />} />
        </div>
        
        <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105 text-lg"
          >
            Publish Ride
        </button>
      </form>
    </div>
  );
};

interface FormInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    icon?: React.ReactElement<IconProps>;
}

const FormInput: React.FC<FormInputProps> = ({ id, label, value, onChange, placeholder, type = 'text', icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {React.cloneElement(icon, { className: 'w-5 h-5' })}
            </div>}
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${icon ? 'pl-10 pr-4' : 'px-4'}`}
            />
        </div>
    </div>
);


export default OfferRide;