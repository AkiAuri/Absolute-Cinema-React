import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
    selectedMovie: null,
    selectedDate: null,
    selectedTime: null,
    selectedSeats: [],
    totalPrice: 0,
    showtime: null,
  });

  const updateBooking = (newData) => {
    setBookingData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const clearBooking = () => {
    setBookingData({
      selectedMovie: null,
      selectedDate: null,
      selectedTime: null,
      selectedSeats: [],
      totalPrice: 0,
      showtime: null,
    });
  };

  const value = {
    bookingData,
    updateBooking,
    clearBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = React.useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
