export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum VerificationType {
  Aadhaar = 'Aadhaar',
  LinkedIn = 'LinkedIn',
}

export enum CarType {
    Sedan = 'Sedan',
    SUV = 'SUV',
    Hatchback = 'Hatchback',
}

export enum Amenity {
    AC = 'AC',
    MusicSystem = 'Music System',
    PetFriendly = 'Pet Friendly',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Made optional for existing mock data
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
  departureDate: string;
  departureTime: string;
  estimatedArrivalTime: string;
  pricePerSeat: number;
  availableSeats: number;
  car: {
    make: string;
    model: string;
    color: string;
    plateNumber: string; // Last 4 digits for privacy
    type: CarType;
  };
  amenities: Amenity[];
}

export interface Rating {
  id: string;
  rideId: string;
  raterId: string;
  rating: number; // 1-5
  comment: string;
}

export interface Message {
  id:string;
  senderId: string; // Can be any user's ID
  text: string;
  timestamp: string;
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'ai';
    text: string;
}

export interface Conversation {
  rideId: string;
  messages: Message[];
}

export interface Coordinates {
  x: number;
  y: number;
}

export type Sentiment = 'Positive' | 'Negative' | 'Mixed' | 'Neutral';

export interface AISummary {
  summary: string;
  sentiment: Sentiment;
}

export interface AITripPlan {
  bestTimeToTravel: string;
  estimatedCost: string;
  routeInsights: string;
  driverInsights: string;
}

export interface AITripSuggestion {
  from: string;
  to: string;
  reason: string;
}
