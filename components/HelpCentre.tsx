import React from 'react';
import { 
    SearchIcon,
    BookOpenIcon,
    TicketIcon, 
    CarIcon, 
    CreditCardIcon, 
    ShieldCheckIcon, 
    UserCircleIcon,
    ArrowLeftIcon
} from './icons/Icons';

interface HelpCentreProps {
    onBack: () => void;
}

const HelpCentre: React.FC<HelpCentreProps> = ({ onBack }) => {

    const categories = [
        { name: 'Getting Started', icon: <BookOpenIcon className="w-8 h-8" /> },
        { name: 'Booking a Ride', icon: <TicketIcon className="w-8 h-8" /> },
        { name: 'Offering a Ride', icon: <CarIcon className="w-8 h-8" /> },
        { name: 'Payments & Pricing', icon: <CreditCardIcon className="w-8 h-8" /> },
        { name: 'Trust & Safety', icon: <ShieldCheckIcon className="w-8 h-8" /> },
        { name: 'Account & Profile', icon: <UserCircleIcon className="w-8 h-8" /> },
    ];

    const popularArticles = [
        "How do I book a carpool ride?",
        "How do I publish a carpool ride?",
        "How do I cancel my carpool ride?",
        "What are the benefits of travelling by carpool?",
        "How do I verify my account?",
        "Understanding the Trust Score",
    ];

    return (
        <div className="max-w-5xl mx-auto">
             <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="w-5 h-5"/>
                Back to Home
            </button>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100">How can we help?</h1>
                <div className="mt-6 max-w-2xl mx-auto relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="search"
                        placeholder="Search for articles, e.g., 'how to cancel'"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                {categories.map(category => (
                    <div key={category.name} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-600 transition-all transform hover:-translate-y-1 cursor-pointer">
                        <div className="text-indigo-600 dark:text-indigo-400 mb-3 inline-block">{category.icon}</div>
                        <h2 className="font-bold text-lg text-gray-800 dark:text-slate-100">{category.name}</h2>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">Popular Articles</h2>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {popularArticles.map(article => (
                            <li key={article}>
                                <a href="#" className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                                    {article}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HelpCentre;
