
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum VerificationType {
  Aadhaar = 'Aadhaar',
  LinkedIn = 'LinkedIn',
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  gender: Gender;
  verificationType: VerificationType;
  isVerified: boolean;
  trustScore: number; // A score from 1 to 5
  reviews: Rating[];
}

export interface Ride {
  id: string;
  driverId: string;
  from: string;
  to: string;
  departureTime: string;
  estimatedArrivalTime: string;
  pricePerSeat: number;
  availableSeats: number;
  car: {
    make: string;
    model: string;
    color: string;
    plateNumber: string; // Last 4 digits for privacy
  };
}

export interface Rating {
  id: string;
  raterId: string;
  rating: number; // 1-5
  comment: string;
}

export interface Message {
  id: string;
  senderId: string; // 'currentUser' or a driver's userId
  text: string;
  timestamp: string;
}

export interface Conversation {
  rideId: string;
  messages: Message[];
}