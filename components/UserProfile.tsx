import React, { useState, useEffect } from 'react';
import { User, Gender } from '../types';
import { summarizeReviews } from '../services/geminiService';
import { ShieldCheckIcon, StarIcon, SparklesIcon, UserCircleIcon, type IconProps } from './icons/Icons';

interface UserProfileProps {
  user: User;
  allUsers: User[];
}

const UserProfile: React.FC<UserProfileProps> = ({ user, allUsers }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoadingSummary(true);
      const summary = await summarizeReviews(user.reviews);
      setAiSummary(summary);
      setIsLoadingSummary(false);
    };
    fetchSummary();
  }, [user.reviews]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <UserCircleIcon className="w-10 h-10 text-indigo-600" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100">My Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: User Info Card */}
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 sticky top-28">
            <div className="flex flex-col items-center text-center">
              <img src={user.avatarUrl} alt={user.name} className="w-28 h-28 rounded-full border-4 border-indigo-200 shadow-md mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{user.name}</h2>
              <p className="text-gray-500 dark:text-slate-400">{user.email}</p>
              
              {user.isVerified && (
                <div className="flex items-center gap-1.5 text-sm text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-500/20 px-3 py-1 rounded-full mt-3">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>{user.verificationType} Verified</span>
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 mt-6 pt-4 space-y-3 text-sm">
                <InfoRow label="Gender" value={user.gender} />
                <InfoRow label="Joined" value="October 2025" />
            </div>
          </div>
        </aside>

        {/* Right Column: Trust Score & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trust & Verification */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">
              Trust & Verification
            </h3>
            <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Trust Score */}
                <div className="flex-shrink-0 w-full md:w-40 text-center bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-4">
                    <p className="text-5xl font-extrabold text-amber-600 dark:text-amber-400">{user.trustScore.toFixed(1)}</p>
                    <p className="font-bold text-amber-800 dark:text-amber-300">Trust Score</p>
                    <div className="flex items-center justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(user.trustScore) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      ))}
                    </div>
                </div>
                {/* AI Insights */}
                <div className="flex-1">
                     <h4 className="flex items-center gap-2 text-md font-bold text-gray-800 dark:text-slate-200 mb-2">
                      <SparklesIcon className="w-5 h-5 text-indigo-500" />
                      AI Trust Insights
                    </h4>
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md min-h-[100px] border border-slate-200 dark:border-slate-700">
                        {isLoadingSummary ? (
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
                        </div>
                        ) : (
                        <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                        )}
                    </div>
                </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">
              Reviews Received ({user.reviews.length})
            </h3>
            {user.reviews.length > 0 ? (
              <div className="space-y-6">
                {user.reviews.map(review => {
                  const rater = allUsers.find(u => u.id === review.raterId);
                  return (
                    <div key={review.id} className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-700 pb-6 last:border-b-0 last:pb-0">
                      <img src={rater?.avatarUrl} alt={rater?.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-slate-800 dark:text-slate-100">{rater?.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">You have not received any reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
);


export default UserProfile;