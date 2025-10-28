import React, { useState, useCallback } from 'react';
import { Ride, User } from './types';
import { mockRides as initialRides, mockUsers } from './data/mockData';
import LandingPage from './components/LandingPage';
import SearchResults from './components/SearchResults';
import RideDetails from './components/RideDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import OfferRide from './components/OfferRide';
import MyRides from './components/MyRides';

type Page = 'landing' | 'results' | 'details' | 'offer' | 'myRides';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [searchCriteria, setSearchCriteria] = useState({ from: '', to: '' });
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [bookedRideIds, setBookedRideIds] = useState<string[]>([]);

  const handleSearch = useCallback((from: string, to: string) => {
    setSearchCriteria({ from, to });
    const results = rides.filter(
      ride => ride.from.toLowerCase() === from.toLowerCase() && ride.to.toLowerCase() === to.toLowerCase()
    );
    setSearchResults(results);
    setCurrentPage('results');
  }, [rides]);

  const handleSelectRide = useCallback((ride: Ride) => {
    setSelectedRide(ride);
    setCurrentPage('details');
  }, []);

  const handleBackToResults = useCallback(() => {
    setSelectedRide(null);
    setCurrentPage('results');
  }, []);
  
  const handleNavigate = (page: Page) => {
    setSelectedRide(null);
    if (page === 'landing') {
        setSearchResults([]);
    }
    setCurrentPage(page);
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBookedRideIds([]); // Clear bookings on logout
    handleNavigate('landing');
  };

  const handleBookRide = useCallback((rideId: string) => {
    setBookedRideIds(prev => [...prev, rideId]);
  }, []);
  
  const handleAddRide = (newRide: Ride) => {
    setRides(prev => [newRide, ...prev]);
    handleNavigate('myRides');
  };

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
              currentUser={currentUser}
              isBooked={bookedRideIds.includes(selectedRide.id)}
              onBook={handleBookRide} 
            />
          );
        }
        handleBackToResults();
        return null;
      case 'offer':
        if (currentUser) {
            return <OfferRide currentUser={currentUser} onAddRide={handleAddRide} />;
        }
        // Redirect to landing if not logged in
        handleNavigate('landing');
        return null;
      case 'myRides':
        if (currentUser) {
            return (
                <MyRides 
                    currentUser={currentUser} 
                    allRides={rides} 
                    bookedRideIds={bookedRideIds}
                    onSelectRide={handleSelectRide}
                />
            );
        }
        // Redirect to landing if not logged in
        handleNavigate('landing');
        return null;
      case 'landing':
      default:
        return <LandingPage onSearch={handleSearch} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header 
        currentUser={currentUser}
        onLogoClick={() => handleNavigate('landing')}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        onNavigate={handleNavigate}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderPage()}
      </main>
      <Footer />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
        users={mockUsers}
      />
    </div>
  );
};

export default App;