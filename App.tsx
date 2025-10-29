import React, { useState, useCallback, useEffect } from 'react';
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
import SupportChat from './components/SupportChat';
import HelpCentre from './components/HelpCentre';
import TermsAndConditions from './components/TermsAndConditions';
import { calculateTrustScore } from './services/trustScoreService';
import { SupportIcon } from './components/icons/Icons';
import BookingConfirmationModal from './components/BookingConfirmationModal';

type Page = 'landing' | 'results' | 'details' | 'offer' | 'myRides' | 'profile' | 'help' | 'terms';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [searchCriteria, setSearchCriteria] = useState({ from: '', to: '', date: '', passengers: '1' });
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);
  const [bookedRideIds, setBookedRideIds] = useState<string[]>([]);
  const [profileToView, setProfileToView] = useState<User | null>(null);

  // Modal States
  const [isBookingConfirmationOpen, setBookingConfirmationOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [isRatingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [rideToProcess, setRideToProcess] = useState<Ride | null>(null); // For payment, rating, or cancellation
  const [isSupportChatOpen, setSupportChatOpen] = useState<boolean>(false);

  const handleSearch = useCallback((from: string, to: string, date: string, passengers: string) => {
    setSearchCriteria({ from, to, date, passengers });
    const numPassengers = parseInt(passengers, 10);
    const results = rides.filter(
      ride => 
        ride.from.toLowerCase() === from.toLowerCase() && 
        ride.to.toLowerCase() === to.toLowerCase() &&
        ride.departureDate === date &&
        ride.availableSeats >= numPassengers
    );
    setSearchResults(results);
    setCurrentPage('results');
  }, [rides]);

  const handleSelectRide = useCallback((ride: Ride) => {
    setSelectedRide(ride);
    setCurrentPage('details');
  }, []);
  
  const handleViewProfile = (userToView: User) => {
    setProfileToView(userToView);
    setCurrentPage('profile');
  };

  const handleBackToResults = useCallback(() => {
    setSelectedRide(null);
    setCurrentPage('results');
  }, []);
  
  const handleNavigate = useCallback((page: Page) => {
    setSelectedRide(null);
    if (page !== 'profile') {
      setProfileToView(null);
    }
    if (page === 'landing') {
        setSearchResults([]);
    }
    setCurrentPage(page);
  }, []);

  // Effect to handle redirects safely after rendering
  useEffect(() => {
    const protectedPages: Page[] = ['offer', 'myRides'];
    if (protectedPages.includes(currentPage) && !currentUser) {
      handleNavigate('landing');
    }
    // "profile" page is special, it can be viewed if logged in, regardless of whose profile it is.
    if (currentPage === 'profile' && !currentUser) {
       handleNavigate('landing');
    }

    if (currentPage === 'details') {
      const driverExists = users.some(u => u.id === selectedRide?.driverId);
      if (!selectedRide || !driverExists) {
        handleBackToResults();
      }
    }
  }, [currentPage, currentUser, selectedRide, users, handleNavigate, handleBackToResults]);


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
    setBookingConfirmationOpen(true);
  }, []);

  const handleConfirmBooking = () => {
    setBookingConfirmationOpen(false);
    setPaymentModalOpen(true);
  };
  
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
            onViewProfile={handleViewProfile}
          />
        );
      case 'details': {
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
              onViewProfile={handleViewProfile}
            />
          );
        }
        return null; // Render nothing while useEffect redirects
      }
      case 'offer':
        return currentUser ? <OfferRide currentUser={currentUser} onAddRide={handleAddRide} /> : null;
      case 'myRides':
        return currentUser ? (
            <MyRides 
                currentUser={currentUser} 
                allRides={rides} 
                bookedRideIds={bookedRideIds}
                onSelectRide={handleSelectRide}
                users={users}
                onRateRide={openRatingModal}
                onCancelRide={handleInitiateCancel}
                onViewProfile={handleViewProfile}
            />
        ) : null;
      case 'profile': {
          const userToDisplay = profileToView || currentUser;
          if (!currentUser || !userToDisplay) return null;
          return <UserProfile user={userToDisplay} currentUser={currentUser} allUsers={users} onViewProfile={handleViewProfile} />;
      }
      case 'help':
        return <HelpCentre onBack={() => handleNavigate('landing')} />;
      case 'terms':
        return <TermsAndConditions onBack={() => handleNavigate('landing')} />;
      case 'landing':
      default:
        return <LandingPage onSearch={handleSearch} onNavigateToHelp={() => handleNavigate('help')} />;
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
      <Footer onNavigate={handleNavigate} />
      
      {/* Modals */}
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
          <BookingConfirmationModal
            isOpen={isBookingConfirmationOpen}
            onClose={() => { setBookingConfirmationOpen(false); setRideToProcess(null); }}
            ride={rideToProcess}
            driver={rideToProcessDriver}
            onConfirm={handleConfirmBooking}
          />
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

      {/* Support Chat */}
      <button 
        onClick={() => setSupportChatOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 z-50"
        aria-label="Open support chat"
      >
        <SupportIcon className="w-6 h-6" />
      </button>

      <SupportChat 
        isOpen={isSupportChatOpen}
        onClose={() => setSupportChatOpen(false)}
      />
    </div>
  );
};

export default App;