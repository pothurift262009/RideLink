import React, { useState, useCallback } from 'react';
import { Ride, User } from './types';
import { mockRides, mockUsers } from './data/mockData';
import LandingPage from './components/LandingPage';
import SearchResults from './components/SearchResults';
import RideDetails from './components/RideDetails';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'results' | 'details'>('landing');
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [searchCriteria, setSearchCriteria] = useState({ from: '', to: '' });
  const [bookedRideId, setBookedRideId] = useState<string | null>(null);


  const handleSearch = useCallback((from: string, to: string) => {
    setSearchCriteria({ from, to });
    const results = mockRides.filter(
      ride => ride.from.toLowerCase() === from.toLowerCase() && ride.to.toLowerCase() === to.toLowerCase()
    );
    setSearchResults(results);
    setCurrentPage('results');
  }, []);

  const handleSelectRide = useCallback((ride: Ride) => {
    setSelectedRide(ride);
    setCurrentPage('details');
  }, []);

  const handleBackToResults = useCallback(() => {
    setSelectedRide(null);
    setCurrentPage('results');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setSelectedRide(null);
    setSearchResults([]);
    setBookedRideId(null); // Reset booking on returning to landing
    setCurrentPage('landing');
  }, []);

  const handleBookRide = useCallback((rideId: string) => {
    setBookedRideId(rideId);
    // In a real app, this would involve a payment flow and API call.
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'results':
        return (
          <SearchResults
            rides={searchResults}
            onSelectRide={handleSelectRide}
            searchCriteria={searchCriteria}
          />
        );
      case 'details':
        const driver = mockUsers.find(u => u.id === selectedRide?.driverId);
        if (selectedRide && driver) {
          return (
            <RideDetails 
              ride={selectedRide} 
              driver={driver} 
              onBack={handleBackToResults}
              bookedRideId={bookedRideId}
              onBook={handleBookRide} 
            />
          );
        }
        // Fallback if data is inconsistent
        handleBackToResults();
        return null;
      case 'landing':
      default:
        return <LandingPage onSearch={handleSearch} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header onLogoClick={handleBackToLanding} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;