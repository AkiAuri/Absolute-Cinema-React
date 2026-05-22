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

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  // UPDATED: Intercepting step 1 to lock seats
  const handleContinue = async () => {
    if (step === 1) {
      // Trying to move from Seat Selection -> Payment
      setIsSubmitting(true);
      setError(null);
      try {
        const lockRes = await fetch(`/api/showtimes/${bookingData.selectedShowtime.id}/lock-seats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seats: selectedSeats, userId: user?.id })
        });

        if (!lockRes.ok) {
          const errData = await lockRes.json();
          throw new Error(errData.error || "Some of these seats were just taken! Please select others.");
        }

        // Seats locked successfully, proceed to Step 2
        setStep(2);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else if (step < 4) {
      // Normal step progression
      setStep(step + 1);
      setError(null);
    } else {
      // Final submission
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtimeId: bookingData.selectedShowtime.id,
          seats: selectedSeats,
          totalPrice: totalPrice,
          paymentMethod: paymentMethod
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm booking.');
      }

      const ticket = {
        id: data.bookingId,
        soldById: isStaff ? user.id : null,
        customerName: isStaff ? customerName : user.name,
        movieTitle: bookingData.selectedMovie.title,
        showtime: `${bookingData.selectedDate} ${bookingData.selectedTime}`,
        theater: bookingData.selectedShowtime.theater,
        seats: selectedSeats,
        totalPrice,
        paymentMethod,
        status: 'confirmed',
      };

      clearBooking();
      // UPDATED: Navigate to /success/:id so refresh works
      navigate(`/success/${data.bookingId}`, { state: { booking: ticket, isStaffSale: isStaff } });

    } catch (err) {
      console.error("Checkout Error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900 mb-8 shadow-xl border border-gray-700">

            {/* Added a Global Error Banner for Seat Lock Failures */}
            {error && step === 1 && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 text-center animate-in fade-in">
                  <p className="font-bold">Cannot Lock Seats</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            {step === 1 && (
                <>
                  <h2 className="text-white text-2xl font-bold mb-6">Step 1: Select Seats</h2>
                  <SeatMap
                      showtimeId={bookingData.selectedShowtime?.id}
                      theater={bookingData.selectedShowtime?.theater}
                      onSeatsChange={handleSeatsChange}
                      selectedSeats={selectedSeats}
                      pricePerSeat={pricePerSeat}
                  />
                </>
            )}

            {/* ... Rest of your UI steps (Step 2, Step 3) remain exactly identical to what you wrote! ... */}
            {step === 2 && (
                <>
                  <h2 className="text-white text-2xl font-bold mb-6">Step 2: {isStaff ? 'Customer Info & Payment' : 'Payment Options'}</h2>
                  {/* Your existing Step 2 UI here */}
                </>
            )}

            {step === 3 && (
                <>
                  <h2 className="text-white text-2xl font-bold mb-6">Step 3: Confirmation</h2>
                  {/* Your existing Step 3 UI here */}
                </>
            )}

            {step === 4 && (
                <>
                  <h2 className="text-white text-2xl font-bold mb-6">Step 4: Review</h2>
                  {error && (
                      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 text-center">
                        <p className="font-bold">Booking Failed</p>
                        <p className="text-sm mt-1">{error}</p>
                      </div>
                  )}
                  <div className="text-center">
                    <div className="bg-gray-700 rounded-lg p-8 dark:bg-gray-800 mb-6 border border-gray-600">
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
                disabled={step === 1 || isSubmitting}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              Back
            </button>

            <button
                onClick={handleContinue}
                disabled={
                    (step === 1 && selectedSeats.length === 0) ||
                    (step === 2 && isStaff && !customerName.trim()) ||
                    isSubmitting
                }
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
              ) : (
                  step === 4 ? (isStaff ? 'Confirm Sale' : 'Confirm Purchase') : 'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
  );
}

export default Booking;