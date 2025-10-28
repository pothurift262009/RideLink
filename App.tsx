import React, { useState, useCallback } from 'react';
import { Ride, User, Rating } from './types';
import { mockRides as initialRides, mockUsers as initialUsers } from './data/mockData';
import LandingPage from './components/LandingPage';
import SearchResults from './components/SearchResults';
import RideDetails from './components/RideDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import OfferRide from './components/OfferRide';
import MyRides from './components/MyRides';
import SignUpModal from './components/SignUpModal';
import PaymentModal from './components/PaymentModal';
import RatingModal from './components/RatingModal';
import CancelModal from './components/CancelModal';
import UserProfile from './components/UserProfile';
import { calculateTrustScore } from './services/trustScoreService';

type Page = 'landing' | 'results' | 'details' | 'offer' | 'myRides' | 'profile';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [searchCriteria, setSearchCriteria] = useState({ from: '', to: '' });
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);
  const [bookedRideIds, setBookedRideIds] = useState<string[]>([]);

  // Modal States
  const [isPaymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [isRatingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [rideToProcess, setRideToProcess] = useState<Ride | null>(null); // For payment, rating, or cancellation

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

  const handleSignUp = (newUser: Omit<User, 'id' | 'avatarUrl' | 'trustScore' | 'reviews'>) => {
    const user: User = {
        ...newUser,
        id: `user_${Date.now()}`,
        avatarUrl: `https://picsum.photos/seed/${newUser.name.split(' ')[0]}/200/200`,
        trustScore: 3.0, // Start with a neutral score
        reviews: []
    };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setSignUpModalOpen(false);
  }

  const handleInitiateBooking = useCallback((ride: Ride) => {
    setRideToProcess(ride);
    setPaymentModalOpen(true);
  }, []);
  
  const handleConfirmPayment = useCallback((rideId: string) => {
    setBookedRideIds(prev => [...prev, rideId]);
    // The modal now handles its own closure via user action
  }, []);

  const handleGoToMyRides = () => {
    setPaymentModalOpen(false);
    setRideToProcess(null);
    handleNavigate('myRides');
  };

  const handleInitiateCancel = useCallback((ride: Ride) => {
    setRideToProcess(ride);
    setCancelModalOpen(true);
  }, []);

  const handleConfirmCancel = useCallback((rideId: string) => {
    setBookedRideIds(prev => prev.filter(id => id !== rideId));
    setCancelModalOpen(false);
    setRideToProcess(null);
  }, []);
  
  const handleAddRide = (newRide: Ride) => {
    setRides(prev => [newRide, ...prev]);
    handleNavigate('myRides');
  };

  const handleAddReview = (ride: Ride, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Rating = {
      id: `review_${Date.now()}`,
      rideId: ride.id,
      raterId: currentUser.id,
      rating,
      comment,
    };

    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === ride.driverId) {
        const updatedReviews = [...user.reviews, newReview];
        const newTrustScore = calculateTrustScore(updatedReviews);
        return {
          ...user,
          reviews: updatedReviews,
          trustScore: newTrustScore,
        };
      }
      return user;
    }));

    setRatingModalOpen(false);
    setRideToProcess(null);
  };

  const openRatingModal = (ride: Ride) => {
    setRideToProcess(ride);
    setRatingModalOpen(true);
  }
  
  const openLoginModal = () => {
    setSignUpModalOpen(false);
    setLoginModalOpen(true);
  };
  
  const openSignUpModal = () => {
    setLoginModalOpen(false);
    setSignUpModalOpen(true);
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'results':
        return (
          <SearchResults
            rides={searchResults}
            onSelectRide={handleSelectRide}
            searchCriteria={searchCriteria}
            users={users}
          />
        );
      case 'details':
        const driver = users.find(u => u.id === selectedRide?.driverId);
        if (selectedRide && driver) {
          return (
            <RideDetails 
              ride={selectedRide} 
              driver={driver} 
              onBack={handleBackToResults}
              currentUser={currentUser}
              isBooked={bookedRideIds.includes(selectedRide.id)}
              onBook={handleInitiateBooking} 
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
                    users={users}
                    onRateRide={openRatingModal}
                    onCancelRide={handleInitiateCancel}
                />
            );
        }
        // Redirect to landing if not logged in
        handleNavigate('landing');
        return null;
      case 'profile':
        if (currentUser) {
          return <UserProfile user={currentUser} allUsers={users} />;
        }
        handleNavigate('landing');
        return null;
      case 'landing':
      default:
        return <LandingPage onSearch={handleSearch} />;
    }
  };

  const rideToProcessDriver = users.find(u => u.id === rideToProcess?.driverId);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen flex flex-col transition-colors duration-300">
      <Header 
        currentUser={currentUser}
        onLogoClick={() => handleNavigate('landing')}
        onLoginClick={openLoginModal}
        onSignUpClick={openSignUpModal}
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
        users={users}
        onSignUpClick={openSignUpModal}
      />
       <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSignUp={handleSignUp}
        onLoginClick={openLoginModal}
      />
      {rideToProcess && rideToProcessDriver && (
        <>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => { setPaymentModalOpen(false); setRideToProcess(null); }}
            ride={rideToProcess}
            driver={rideToProcessDriver}
            onConfirmPayment={handleConfirmPayment}
            onGoToMyRides={handleGoToMyRides}
          />
          <CancelModal
            isOpen={isCancelModalOpen}
            onClose={() => { setCancelModalOpen(false); setRideToProcess(null); }}
            ride={rideToProcess}
            driver={rideToProcessDriver}
            onConfirmCancel={handleConfirmCancel}
          />
        </>
      )}
      {rideToProcess && rideToProcessDriver && currentUser && (
         <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => { setRatingModalOpen(false); setRideToProcess(null); }}
          ride={rideToProcess}
          driver={rideToProcessDriver}
          currentUser={currentUser}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
};

export default App;
