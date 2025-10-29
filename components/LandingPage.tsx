import React, { useState } from 'react';
import { 
    LeafIcon, ShieldCheckIcon, StarIcon, TicketIcon, 
    CarIcon, SparklesIcon, ChatBubbleIcon, FemaleUserIcon, 
    CurrencyRupeeIcon, ClockIcon, UsersIcon, MagicWandIcon 
} from './icons/Icons';
import AITripPlannerModal from './AITripPlannerModal';
import { AITripPlan } from '../types';

interface LandingPageProps {
  onSearch: (from: string, to: string, date: string, passengers: string) => void;
  onNavigateToHelp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch, onNavigateToHelp }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState('1');
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      onSearch(from, to, date, passengers);
    }
  };

  const handlePopularRouteClick = (routeFrom: string, routeTo: string) => {
    setFrom(routeFrom);
    setTo(routeTo);
    // Use a default date for popular route searches, as the planner might suggest a better one
    const searchDate = new Date().toISOString().split('T')[0];
    onSearch(routeFrom, routeTo, searchDate, passengers);
  };
  
  const handlePlanGenerated = (plan: AITripPlan, planFrom: string, planTo: string) => {
      setFrom(planFrom);
      setTo(planTo);
      setIsPlannerOpen(false);
      // Trigger search with the new from/to values from the planner
      const searchDate = new Date().toISOString().split('T')[0];
      onSearch(planFrom, planTo, searchDate, passengers);
  };

  const popularRoutes = [
    { from: 'Chennai', to: 'Bangalore', price: 850, imageUrl: 'https://picsum.photos/seed/chennai/400/300' },
    { from: 'Mumbai', to: 'Pune', price: 450, imageUrl: 'https://picsum.photos/seed/mumbai/400/300' },
    { from: 'Delhi', to: 'Jaipur', price: 600, imageUrl: 'https://picsum.photos/seed/delhi/400/300' },
    { from: 'Hyderabad', to: 'Vijayawada', price: 700, imageUrl: 'https://picsum.photos/seed/hyderabad/400/300' },
  ];

  const kpis = [
    {
      icon: <TicketIcon className="w-8 h-8 text-indigo-500" />,
      value: "50,000+",
      label: "Journeys Shared"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-green-500" />,
      value: "10,000+",
      label: "Verified Members"
    },
    {
      icon: <LeafIcon className="w-8 h-8 text-emerald-500" />,
      value: "1.2k tonnes",
      label: "CO2 Saved Together"
    },
    {
      icon: <StarIcon className="w-8 h-8 text-amber-500" />,
      value: "4.8/5",
      label: "Average Trip Rating"
    },
  ];

  const features = [
    {
      icon: <CarIcon className="w-8 h-8 text-indigo-500" />,
      title: "Drive & Earn",
      description: "Easily list your ride, set your price per seat, and share costs on your next intercity trip.",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-green-500" />,
      title: "Verified Community",
      description: "Travel with peace of mind. All members are verified using Aadhaar or LinkedIn for enhanced safety.",
    },
    {
      icon: <SparklesIcon className="w-8 h-8 text-amber-500" />,
      title: "AI-Powered Trust",
      description: "Our AI analyzes reviews and ride history to generate a dynamic trust score, helping you choose reliable members.",
    },
    {
      icon: <FemaleUserIcon className="w-8 h-8 text-pink-500" />,
      title: "Safety First Features",
      description: "Use the 'Women-Only' filter to see and book rides exclusively with other women for a more comfortable journey.",
    },
    {
      icon: <TicketIcon className="w-8 h-8 text-blue-500" />,
      title: "Your Ride Dashboard",
      description: "Manage all your offered rides and upcoming bookings in one simple, organized 'My Rides' section.",
    },
    {
      icon: <ChatBubbleIcon className="w-8 h-8 text-cyan-500" />,
      title: "Seamless Communication",
      description: "Coordinate pickup details and stay in touch with your driver or passengers using our secure in-app chat.",
    },
  ];

  const personas = [
    {
      name: 'Rohan Kumar',
      title: 'The Frugal Commuter',
      avatarUrl: 'https://picsum.photos/seed/rohan/200/200',
      scenario: '"I travel from Chennai to Bangalore twice a month. Last-minute bus tickets were burning a hole in my pocket."',
      benefits: [
        { icon: <CurrencyRupeeIcon className="w-5 h-5"/>, label: 'Annual Savings', value: '₹12,000' },
        { icon: <ClockIcon className="w-5 h-5"/>, label: 'Time Saved Monthly', value: '4 Hours' },
      ]
    },
    {
      name: 'Ananya Sharma',
      title: 'The Safety-Conscious Traveller',
      avatarUrl: 'https://picsum.photos/seed/ananya/200/200',
      scenario: '"As a student travelling alone, safety is my biggest concern. I needed a platform I could trust completely."',
      benefits: [
        { icon: <ShieldCheckIcon className="w-5 h-5"/>, label: 'Risk Reduction', value: '>90%' },
        { icon: <FemaleUserIcon className="w-5 h-5"/>, label: 'Peace of Mind', value: '100%' },
      ]
    },
    {
      name: 'Vikram Singh',
      title: 'The Eco-Conscious Driver',
      avatarUrl: 'https://picsum.photos/seed/vikram/200/200',
      scenario: '"I drive from Delhi to Jaipur for work every week. The empty seats felt like such a waste of fuel and money."',
      benefits: [
        { icon: <CurrencyRupeeIcon className="w-5 h-5"/>, label: 'Cost Recovery', value: '75%' },
        { icon: <LeafIcon className="w-5 h-5"/>, label: 'CO₂ Saved Annually', value: '5 Tonnes' },
      ]
    },
    {
      name: 'Sneha Reddy',
      title: 'The Last-Minute Planner',
      avatarUrl: 'https://picsum.photos/seed/sneha/200/200',
      scenario: '"My job requires unplanned travel. Finding a last-minute train is impossible and flights are too expensive."',
      benefits: [
        { icon: <TicketIcon className="w-5 h-5"/>, label: 'Ride Availability', value: '95%' },
        { icon: <CurrencyRupeeIcon className="w-5 h-5"/>, label: 'Savings vs Flights', value: '₹5,000 / trip' },
      ]
    },
  ];

  const faqs = [
    {
      question: "How do I book a carpool ride?",
      answer: "You can book a carpool ride on our mobile app or website. Simply search for your destination, choose the date you want to travel and pick the carpool that suits you best! Some rides can be booked instantly, while others require manual approval from the driver. Either way, booking a carpool ride is fast, simple and easy."
    },
    {
      question: "How do I publish a carpool ride?",
      answer: "Offering a carpool ride on RideLink is easy. To publish your ride, use the 'Offer a Ride' feature. Indicate your departure and arrival points, the date and time, how many passengers you can take, and the price per seat. Then tap 'Publish ride' and you’re done!"
    },
    {
      question: "How do I cancel my carpool ride?",
      answer: "If you have a change of plans, you can always cancel your carpool ride from the 'My Rides' section of our app. The sooner you cancel, the better. If you cancel more than 24 hours before departure, you'll receive a full refund, excluding the service fee."
    },
    {
      question: "What are the benefits of travelling by carpool?",
      answer: "Travelling by carpool is usually more affordable and eco-friendly. As sharing a car means there will be fewer cars on the road, it reduces emissions. Taking a carpool ride is also a safe way to travel thanks to our verified community of users."
    },
    {
      question: "How much does a carpool ride cost?",
      answer: "The costs of a carpool ride can vary greatly and depend on factors like distance and time of departure. It is up to the driver to decide how much to charge per seat, so it's hard to put an exact price tag on a ride. Start searching for your next carpool ride to see prices."
    },
    {
      question: "How do I start carpooling?",
      answer: "Carpooling with RideLink is super easy, and free! Simply sign up for an account and get verified. Once you have a RideLink account, you can start booking or publishing rides directly on our app or website."
    },
  ];

  return (
    <>
    <div className="flex flex-col items-center justify-center -mt-8 md:-mt-12">
      <div className="w-full bg-gradient-to-tr from-violet-100 via-pink-50 to-blue-100 dark:from-violet-900/70 dark:via-pink-900/30 dark:to-blue-900/70 rounded-2xl shadow-lg relative overflow-hidden">
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 dark:opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 dark:opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 dark:opacity-50 animate-blob animation-delay-4000"></div>
        
        {/* Highway Visuals */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-0 overflow-hidden pointer-events-none">
            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-700/50 dark:bg-slate-800/70 [clip-path:polygon(0_15%,100%_0,100%_100%,0%_100%)]"></div>
            {/* Lane Markings */}
            <div className="absolute bottom-10 left-0 w-full h-1 border-t-4 border-dashed border-slate-500/30 dark:border-slate-600/50"></div>
            
            {/* Car 1 */}
            <div className="absolute bottom-[4.5rem] w-full animate-drive-fast">
                <div className="w-24 h-10 bg-indigo-500 rounded-t-lg rounded-b-md shadow-lg relative left-[15%] transform -skew-x-12">
                    <div className="absolute top-2 left-2 w-6 h-5 bg-cyan-300/50 rounded-sm skew-x-12"></div>
                    <div className="absolute top-2 right-2 w-10 h-5 bg-cyan-300/50 rounded-sm skew-x-12"></div>
                </div>
            </div>
            {/* Car 2 */}
            <div className="absolute bottom-8 w-full animate-drive-slow">
                <div className="w-20 h-8 bg-rose-500 rounded-t-lg rounded-b-md shadow-lg relative left-[55%] transform -skew-x-12">
                    <div className="absolute top-1 left-2 w-5 h-4 bg-cyan-300/50 rounded-sm skew-x-12"></div>
                    <div className="absolute top-1 right-2 w-8 h-4 bg-cyan-300/50 rounded-sm skew-x-12"></div>
                </div>
            </div>
        </div>

        <div className="w-full h-full p-8 md:p-20 flex flex-col items-center justify-center text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-4 tracking-tighter">
              Your Vibe, Your Ride.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-8">
              Skip the surge pricing & travel with verified peeps. From the mountains to the metros, your ride across India is sorted. 🤙
            </p>
        </div>
      </div>

      <div className="w-full max-w-5xl -mt-16 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl z-20 border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
          <div className="md:col-span-1 relative flex items-center">
             <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              id="from"
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Leaving from..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
           <div className="md:col-span-1 relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Going to..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="md:col-span-1 relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="md:col-span-1 relative flex items-center">
            <UsersIcon className="h-5 w-5 absolute left-3 text-gray-400 pointer-events-none" />
            <select
              id="passengers"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
            >
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-slate-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <button
            type="submit"
            className="md:col-span-1 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105"
          >
            Find My Ride
          </button>
        </form>
      </div>

      {/* KPI Section */}
      <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {kpis.map((kpi, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="mb-2">{kpi.icon}</div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{kpi.value}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.label}</p>
                </div>
            ))}
        </div>
      </div>
      
      {/* AI Trip Planner Section */}
      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-24 px-4 text-center bg-indigo-50 dark:bg-slate-800/50 border border-indigo-200 dark:border-slate-700 rounded-2xl p-8 md:p-12">
          <div className="max-w-xl mx-auto">
              <MagicWandIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Plan Your Perfect Trip with AI</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Not sure when to travel? Let our AI analyze historical data to find the best time, price, and driver for your route.
              </p>
              <button
                onClick={() => setIsPlannerOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105 text-lg"
              >
                  Launch Planner
              </button>
          </div>
      </div>


      {/* Personas Section */}
      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-24 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Built for Every Indian Traveller</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
          From students to professionals, RideLink makes intercity travel safer, cheaper, and more connected.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {personas.map((persona) => (
            <div key={persona.name} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition-all transform hover:scale-105 hover:shadow-2xl">
              <img src={persona.avatarUrl} alt={persona.name} className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-600 shadow-md -mt-12 mb-2" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{persona.name}</h3>
              <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mb-4">{persona.title}</p>
              
              <blockquote className="text-slate-500 dark:text-slate-400 italic border-l-4 border-slate-200 dark:border-slate-600 pl-4 py-2 text-sm text-left">
                {persona.scenario}
              </blockquote>

              <div className="w-full mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-600 dark:text-slate-300 text-left mb-3">Key Benefits for {persona.name.split(' ')[0]}:</h4>
                <ul className="space-y-3">
                  {persona.benefits.map(benefit => (
                    <li key={benefit.label} className="flex items-center gap-3 text-left bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                      <div className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-900/50">
                        {benefit.icon}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{benefit.value}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{benefit.label}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-24 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Explore Popular Routes</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
          Your next adventure is just a click away. Join thousands of travellers on these top routes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map((route) => (
            <div 
              key={`${route.from}-${route.to}`}
              onClick={() => handlePopularRouteClick(route.from, route.to)}
              className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <img src={route.imageUrl} alt={`${route.from} to ${route.to}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-bold">{route.from} → {route.to}</h3>
                <p className="text-sm font-medium opacity-90">From ₹{route.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-24 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Trusted Travel Companion</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
          Once you're logged in, you unlock a suite of features designed for a safe, affordable, and seamless carpooling experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-400 dark:hover:border-indigo-600 transition-all transform hover:-translate-y-1">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-24 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12">
          Carpool Help Centre
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
            <button
              onClick={onNavigateToHelp}
              className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Read our Help Centre
            </button>
        </div>
      </div>
    </div>
    <AITripPlannerModal
      isOpen={isPlannerOpen}
      onClose={() => setIsPlannerOpen(false)}
      onPlanGenerated={handlePlanGenerated}
    />
    </>
  );
};

export default LandingPage;