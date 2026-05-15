import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';

function Booking() {
  const navigate = useNavigate();
  const { bookingData, updateBooking, clearBooking } = useBooking();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState('');

  // Check if the user is staff (employee or admin)
  const isStaff = user?.role === 'employee' || user?.role === 'admin';

  if (!bookingData.selectedMovie) {
    navigate('/');
    return null;
  }

  const pricePerSeat = bookingData.selectedShowtime?.pricePerSeat || 12;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const handleSeatsChange = (seats) => {
    setSelectedSeats(seats);
    updateBooking({ selectedSeats: seats, totalPrice: seats.length * pricePerSeat });
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = () => {
    // Create sold ticket record
    const ticket = {
      id: `TK${Date.now()}`,
      // For staff sales, track who sold it and to whom
      soldById: isStaff ? user.id : null,
      soldByName: isStaff ? user.name : null,
      soldByRole: isStaff ? user.role : null,
      customerId: isStaff ? null : user.id,
      customerName: isStaff ? customerName : user.name,
      movieId: bookingData.selectedMovie.id,
      movieTitle: bookingData.selectedMovie.title,
      showtime: `${bookingData.selectedDate} ${bookingData.selectedTime}`,
      theater: bookingData.selectedShowtime.theater,
      seats: selectedSeats,
      totalPrice,
      status: 'sold',
      saleDate: new Date().toISOString().split('T')[0],
      saleTimestamp: new Date().toISOString(),
    };

    // Store sold ticket in localStorage
    const existingSoldTickets = JSON.parse(localStorage.getItem('soldTickets') || '[]');
    existingSoldTickets.push(ticket);
    localStorage.setItem('soldTickets', JSON.stringify(existingSoldTickets));

    clearBooking();
    navigate('/success', { state: { booking: ticket, isStaffSale: isStaff } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step >= s ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${step > s ? 'bg-amber-600' : 'bg-gray-700'}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between text-gray-400 text-xs mt-2">
            <span>Seats</span>
            <span>Payment</span>
            <span>Confirmation</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900 mb-8">
          {step === 1 && (
            <>
              <h2 className="text-white text-2xl font-bold mb-6">Step 1: Select Seats</h2>
              <SeatMap
                theater={bookingData.selectedShowtime?.theater}
                onSeatsChange={handleSeatsChange}
                selectedSeats={selectedSeats}
                pricePerSeat={pricePerSeat}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-white text-2xl font-bold mb-6">Step 2: {isStaff ? 'Customer Info & Payment' : 'Payment'}</h2>
              <div className="bg-gray-700 rounded-lg p-6 dark:bg-gray-800">
                {/* Customer name input for staff sales */}
                {isStaff && (
                  <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-medium mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      required
                    />
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-white text-2xl font-bold mb-6">Step 3: Confirmation</h2>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4 dark:bg-gray-800">
                  <p className="text-gray-400 text-sm">Movie</p>
                  <p className="text-white font-bold text-lg">{bookingData.selectedMovie.title}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 dark:bg-gray-800">
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-bold">{bookingData.selectedDate}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 dark:bg-gray-800">
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-white font-bold">{bookingData.selectedTime}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 dark:bg-gray-800">
                    <p className="text-gray-400 text-sm">Theater</p>
                    <p className="text-white font-bold">{bookingData.selectedShowtime.theater}</p>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 dark:bg-gray-800">
                  <p className="text-gray-400 text-sm">Seats</p>
                  <p className="text-white font-bold text-lg">{selectedSeats.join(', ')}</p>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-white text-2xl font-bold mb-6">Step 4: Review</h2>
              <div className="text-center">
                <div className="bg-gray-700 rounded-lg p-8 dark:bg-gray-800 mb-6">
                  <p className="text-gray-400 text-sm mb-2">Total Amount</p>
                  <p className="text-white text-5xl font-bold text-amber-600">₱{totalPrice}</p>
                </div>
                <p className="text-gray-300">
                  {isStaff ? 'Ready to complete this sale?' : 'Ready to complete your purchase?'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={(step === 1 && selectedSeats.length === 0) || (step === 2 && isStaff && !customerName.trim())}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            {step === 4 ? (isStaff ? 'Confirm Sale' : 'Confirm Purchase') : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booking;
