import React, { useState } from 'react';
import { Ride, User } from '../types';
import { StarIcon } from './icons/Icons';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  driver: User;
  currentUser: User;
  onSubmit: (ride: Ride, rating: number, comment: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, ride, driver, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    onSubmit(ride, rating, comment);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Rate your ride</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl">&times;</button>
        </div>
        
        <p className="text-slate-600 mb-2">How was your trip with <span className="font-semibold">{driver.name}</span>?</p>
        <p className="text-sm text-slate-500 mb-6">{ride.from} → {ride.to}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            className={`w-10 h-10 cursor-pointer transition-colors ${
                                (hoverRating || rating) >= star ? 'text-amber-400' : 'text-slate-300'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>
            </div>

            <div>
                 <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Add a comment (optional)</label>
                 <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={`How was the driving? Was the driver punctual?`}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                 />
            </div>
            
             <button
                type="submit"
                disabled={rating === 0}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-300"
            >
                Submit Review
            </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;