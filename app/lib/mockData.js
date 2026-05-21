// Mock movie data
export const MOCK_MOVIES = [
  {
    id: 1,
    title: 'The Quantum Paradox',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    duration: 148,
    poster: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop',
    status: 'now-showing',
    synopsis: 'A mind-bending journey through parallel dimensions.',
  },
  {
    id: 2,
    title: 'Echoes of Tomorrow',
    genre: 'Drama',
    rating: 'R',
    duration: 132,
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
    status: 'now-showing',
    synopsis: 'A powerful story of love, loss, and redemption.',
  },
  {
    id: 3,
    title: 'The Last Horizon',
    genre: 'Adventure',
    rating: 'PG',
    duration: 156,
    poster: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=300&h=450&fit=crop',
    status: 'now-showing',
    synopsis: 'An epic adventure to the edge of the world.',
  },
  {
    id: 4,
    title: 'Midnight Crimes',
    genre: 'Thriller',
    rating: 'R',
    duration: 118,
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
    status: 'now-showing',
    synopsis: 'A detective races against time to stop a serial killer.',
  },
  {
    id: 5,
    title: 'Love in Paris',
    genre: 'Romance',
    rating: 'PG-13',
    duration: 124,
    poster: 'https://images.unsplash.com/photo-1472027784056-d282a0be896b?w=300&h=450&fit=crop',
    status: 'upcoming',
    synopsis: 'A romantic journey through the streets of Paris.',
  },
  {
    id: 6,
    title: 'Robot Uprising',
    genre: 'Action',
    rating: 'PG-13',
    duration: 142,
    poster: 'https://images.unsplash.com/photo-1485579149c01123123aab0d?w=300&h=450&fit=crop',
    status: 'upcoming',
    synopsis: 'Humanity fights back against artificial intelligence.',
  },
];

// Mock showtimes data
export const MOCK_SHOWTIMES = [
  {
    id: 1,
    movieId: 1,
    date: '2026-03-21',
    time: '10:00',
    theater: 'A',
    pricePerSeat: 12,
  },
  {
    id: 2,
    movieId: 1,
    date: '2026-03-21',
    time: '13:30',
    theater: 'B',
    pricePerSeat: 12,
  },
  {
    id: 3,
    movieId: 1,
    date: '2026-03-21',
    time: '16:00',
    theater: 'A',
    pricePerSeat: 12,
  },
  {
    id: 4,
    movieId: 1,
    date: '2026-03-21',
    time: '19:30',
    theater: 'C',
    pricePerSeat: 15,
  },
  {
    id: 5,
    movieId: 1,
    date: '2026-03-21',
    time: '22:00',
    theater: 'B',
    pricePerSeat: 15,
  },
  {
    id: 6,
    movieId: 2,
    date: '2026-03-21',
    time: '11:00',
    theater: 'C',
    pricePerSeat: 12,
  },
  {
    id: 7,
    movieId: 2,
    date: '2026-03-21',
    time: '14:30',
    theater: 'A',
    pricePerSeat: 12,
  },
  {
    id: 8,
    movieId: 2,
    date: '2026-03-21',
    time: '17:00',
    theater: 'B',
    pricePerSeat: 12,
  },
  {
    id: 9,
    movieId: 2,
    date: '2026-03-21',
    time: '20:00',
    theater: 'C',
    pricePerSeat: 15,
  },
];

// Mock seat data for theaters
export const MOCK_SEATS = {
  A: generateSeats(10, 12),
  B: generateSeats(10, 12),
  C: generateSeats(8, 10),
};

function generateSeats(rows, seatsPerRow) {
  const seats = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < seatsPerRow; j++) {
      seats.push({
        id: `${String.fromCharCode(65 + i)}${j + 1}`,
        row: String.fromCharCode(65 + i),
        number: j + 1,
        isAvailable: Math.random() > 0.2, // 80% seats available
        isSelected: false,
      });
    }
  }
  return seats;
}

// Mock users
export const MOCK_USERS = [
  {
    id: 1,
    email: 'customer@example.com',
    password: 'password123',
    name: 'John Customer',
    role: 'customer',
  },
  {
    id: 2,
    email: 'employee@example.com',
    password: 'password123',
    name: 'Jane Employee',
    role: 'employee',
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
  },
];

// Mock bookings
export const MOCK_BOOKINGS = [
  {
    id: 'BK001',
    userId: 1,
    movieId: 1,
    movieTitle: 'The Quantum Paradox',
    showtime: '2026-03-21 19:30',
    theater: 'C',
    seats: ['C1', 'C2', 'C3'],
    totalPrice: 45,
    status: 'confirmed',
    qrCode: 'data:image/svg+xml,...', // Placeholder
    bookingDate: '2026-03-20',
  },
  {
    id: 'BK002',
    userId: 1,
    movieId: 2,
    movieTitle: 'Echoes of Tomorrow',
    showtime: '2026-03-22 14:30',
    theater: 'A',
    seats: ['A5', 'A6'],
    totalPrice: 24,
    status: 'confirmed',
    qrCode: 'data:image/svg+xml,...', // Placeholder
    bookingDate: '2026-03-19',
  },
];

// Mock statistics data
export const MOCK_STATS = {
  totalTicketsSold: 1240,
  totalRevenue: 18600,
  occupancyRate: 78.5,
  averageTicketPrice: 15,
  weeklyRevenue: [
    { day: 'Mon', revenue: 2400 },
    { day: 'Tue', revenue: 2100 },
    { day: 'Wed', revenue: 2200 },
    { day: 'Thu', revenue: 2290 },
    { day: 'Fri', revenue: 2800 },
    { day: 'Sat', revenue: 3200 },
    { day: 'Sun', revenue: 3000 },
  ],
  moviePerformance: [
    { movieId: 1, title: 'The Quantum Paradox', ticketsSold: 380, revenue: 5700 },
    { movieId: 2, title: 'Echoes of Tomorrow', ticketsSold: 320, revenue: 4800 },
    { movieId: 3, title: 'The Last Horizon', ticketsSold: 290, revenue: 4350 },
    { movieId: 4, title: 'Midnight Crimes', ticketsSold: 250, revenue: 3750 },
  ],
};
