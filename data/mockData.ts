import { User, Ride, Gender, VerificationType, Rating, Conversation } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/priya/200/200',
    gender: Gender.Female,
    verificationType: VerificationType.Aadhaar,
    isVerified: true,
    trustScore: 4.8,
    reviews: [
      { id: 'r1', rideId: 'ride_x1', raterId: 'u3', rating: 5, comment: 'Priya is an excellent and safe driver. The car was clean and the journey was very smooth. Highly recommend!' },
      { id: 'r2', rideId: 'ride_x2', raterId: 'u4', rating: 5, comment: 'Very punctual and professional. Felt very safe throughout the trip from Chennai to Bangalore.' },
      { id: 'r3', rideId: 'ride_x3', raterId: 'u5', rating: 4, comment: 'Good driver, friendly conversation. A bit of a delay in starting but made up for it.' },
    ],
  },
  {
    id: 'user_2',
    name: 'Arjun Verma',
    email: 'arjun.verma@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/arjun/200/200',
    gender: Gender.Male,
    verificationType: VerificationType.LinkedIn,
    isVerified: true,
    trustScore: 4.5,
    reviews: [
      { id: 'r4', rideId: 'ride_x4', raterId: 'u6', rating: 5, comment: 'Arjun is a great co-passenger to have. On time and respectful.' },
      { id: 'r5', rideId: 'ride_x5', raterId: 'u7', rating: 4, comment: 'The drive was great, but the music was a bit too loud for my taste. Otherwise, a solid 4 stars.' },
    ],
  },
  {
    id: 'user_3',
    name: 'Anjali Menon',
    email: 'anjali.menon@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/anjali/200/200',
    gender: Gender.Female,
    verificationType: VerificationType.Aadhaar,
    isVerified: true,
    trustScore: 4.9,
    reviews: [
        { id: 'r6', rideId: 'ride_x6', raterId: 'u1', rating: 5, comment: 'Anjali is the best! Very safe driver, super clean car, and she even offered snacks. It felt like travelling with a friend.' },
        { id: 'r7', rideId: 'ride_x7', raterId: 'u2', rating: 5, comment: 'On time, professional, and a very comfortable ride. The women-only option is a fantastic feature.' },
    ]
  },
   {
    id: 'user_4',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/vikram/200/200',
    gender: Gender.Male,
    verificationType: VerificationType.LinkedIn,
    isVerified: false,
    trustScore: 3.2,
    reviews: [
        { id: 'r8', rideId: 'ride_x8', raterId: 'u9', rating: 3, comment: 'The ride was okay, but the driver was 30 minutes late for pickup.' },
        { id: 'r9', rideId: 'ride_x9', raterId: 'u10', rating: 4, comment: 'Decent trip, got me from A to B.' },
        { id: 'r10', rideId: 'ride_x10', raterId: 'u11', rating: 2, comment: 'Car was not very clean and the driving was a bit aggressive for my liking.' },
    ]
  },
  {
    id: 'user_passenger_1',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/rohan/200/200',
    gender: Gender.Male,
    verificationType: VerificationType.LinkedIn,
    isVerified: true,
    trustScore: 4.6,
    reviews: [],
  },
];

// Helper for dates
const d = new Date();
const tomorrow = new Date(d);
tomorrow.setDate(d.getDate() + 1);
const nextWeek = new Date(d);
nextWeek.setDate(d.getDate() + 7);
const twoDaysFromNow = new Date(d);
twoDaysFromNow.setDate(d.getDate() + 2);

const yesterday = new Date(d);
yesterday.setDate(d.getDate() - 1);
const lastWeek = new Date(d);
lastWeek.setDate(d.getDate() - 7);

const toYyyyMmDd = (date: Date) => date.toISOString().split('T')[0];

export const mockRides: Ride[] = [
  {
    id: 'ride_1',
    driverId: 'user_1',
    from: 'Chennai',
    to: 'Bangalore',
    departureDate: toYyyyMmDd(tomorrow),
    departureTime: '06:00 AM',
    estimatedArrivalTime: '12:00 PM',
    pricePerSeat: 850,
    availableSeats: 2,
    car: { make: 'Hyundai', model: 'Creta', color: 'White', plateNumber: 'TN01AB1234' },
  },
  {
    id: 'ride_2',
    driverId: 'user_2',
    from: 'Chennai',
    to: 'Bangalore',
    departureDate: toYyyyMmDd(yesterday),
    departureTime: '07:30 AM',
    estimatedArrivalTime: '01:30 PM',
    pricePerSeat: 800,
    availableSeats: 1,
    car: { make: 'Maruti Suzuki', model: 'Swift', color: 'Red', plateNumber: 'TN02CD5678' },
  },
  {
    id: 'ride_3',
    driverId: 'user_3',
    from: 'Chennai',
    to: 'Bangalore',
    departureDate: toYyyyMmDd(nextWeek),
    departureTime: '09:00 AM',
    estimatedArrivalTime: '03:00 PM',
    pricePerSeat: 900,
    availableSeats: 3,
    car: { make: 'Kia', model: 'Seltos', color: 'Grey', plateNumber: 'TN03EF9012' },
  },
   {
    id: 'ride_4',
    driverId: 'user_4',
    from: 'Chennai',
    to: 'Bangalore',
    departureDate: toYyyyMmDd(lastWeek),
    departureTime: '05:00 AM',
    estimatedArrivalTime: '11:00 AM',
    pricePerSeat: 750,
    availableSeats: 2,
    car: { make: 'Tata', model: 'Nexon', color: 'Blue', plateNumber: 'TN04GH3456' },
  },
  {
    id: 'ride_5',
    driverId: 'user_1',
    from: 'Bangalore',
    to: 'Chennai',
    departureDate: toYyyyMmDd(twoDaysFromNow),
    departureTime: '04:00 PM',
    estimatedArrivalTime: '10:00 PM',
    pricePerSeat: 850,
    availableSeats: 3,
    car: { make: 'Hyundai', model: 'Creta', color: 'White', plateNumber: 'TN01AB1234' },
  },
];

export const mockConversations: Conversation[] = [
    {
        rideId: 'ride_1',
        messages: [
            { id: 'msg_1', senderId: 'user_passenger_1', text: 'Hi Priya! Just booked my seat. Can you let me know the exact pickup point?', timestamp: '10:30 AM' },
            { id: 'msg_2', senderId: 'user_1', text: 'Hi there! Of course. I will pick you up from the main entrance of Koyambedu Bus Stand. Is that okay?', timestamp: '10:31 AM' },
        ]
    }
];