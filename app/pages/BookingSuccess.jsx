import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Download, Copy, Check } from 'lucide-react';

function BookingSuccess() {
  const location = useLocation();
  const { id } = useParams(); // Get the ID from the URL (e.g. /success/123)

  // Try to use local routing state first, fallback to null
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [isStaffSale] = useState(location.state?.isStaffSale || false);
  const [loading, setLoading] = useState(!booking);
  const [copied, setCopied] = useState(false);

  // NEW: Fetch from API if refreshed
  useEffect(() => {
    if (!booking && id) {
      const fetchReceipt = async () => {
        try {
          const res = await fetch(`/api/bookings/${id}`);
          if (res.ok) {
            const data = await res.json();
            setBooking(data);
          }
        } catch (error) {
          console.error("Error fetching receipt:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReceipt();
    } else {
      setLoading(false);
    }
  }, [id, booking]);

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <p className="text-amber-500 animate-pulse font-bold text-xl">Loading your receipt...</p>
        </div>
    );
  }

  if (!booking) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-400">Ticket not found. Please try again.</p>
            <Link to="/" className="text-amber-600 hover:text-amber-500 font-bold mt-4 inline-block">
              Back to Home
            </Link>
          </div>
        </div>
    );
  }

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-500" size={48} />
            </div>
            <h1 className="text-white text-4xl font-bold mb-2">
              {isStaffSale ? 'Sale Complete!' : 'Purchase Confirmed!'}
            </h1>
            <p className="text-gray-400 text-lg">
              {isStaffSale
                  ? `Ticket sold to ${booking.customerName}`
                  : 'Your tickets have been successfully booked'}
            </p>
          </div>

          {/* Ticket Details Card */}
          <div className="bg-gray-800 rounded-lg p-8 dark:bg-gray-900 mb-8">
            {/* Ticket ID */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6 dark:bg-gray-800">
              <p className="text-gray-400 text-sm mb-2">Ticket ID</p>
              <div className="flex items-center justify-between">
                <p className="text-white text-2xl font-bold font-mono">{booking.id}</p>
                <button
                    onClick={handleCopyBookingId}
                    className="text-amber-600 hover:text-amber-500 transition"
                    title="Copy booking ID"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Movie Details */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Movie</p>
                <p className="text-white text-2xl font-bold">{booking.movieTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Date</p>
                  <p className="text-white font-bold text-lg">
                    {new Date(booking.showtime || booking.start_time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Time</p>
                  <p className="text-white font-bold text-lg">
                    {new Date(booking.showtime || booking.start_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Theater</p>
                  <p className="text-white font-bold text-lg">{booking.theater || booking.theaterId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Seats</p>
                  <p className="text-white font-bold text-lg">{booking.seats ? booking.seats.join(', ') : 'N/A'}</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm mb-1">Total Amount Paid</p>
                <p className="text-amber-600 text-3xl font-bold">₱{booking.totalPrice}</p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-gray-800 rounded-lg p-8 text-center dark:bg-gray-900 mb-8">
            <p className="text-gray-400 text-sm mb-4">Your QR Code (Save for entry)</p>
            <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center mb-4">
              <div className="text-center">
                {/* Dynamic QR using a generic API just like your bank checkout */}
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.id}`}
                    alt="Entry QR Code"
                    className="w-full h-full"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Present this QR code at the cinema entrance</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition font-bold">
              <Download size={20} />
              Download Ticket
            </button>
            {isStaffSale ? (
                <Link
                    to="/dashboard/sold-tickets"
                    className="flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-bold"
                >
                  View Sold Tickets
                </Link>
            ) : (
                <Link
                    to="/account"
                    className="flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-bold"
                >
                  View My Tickets
                </Link>
            )}
          </div>

          {/* Continue */}
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">
              {isStaffSale ? 'Sell more tickets?' : 'Want to buy more tickets?'}
            </p>
            <Link
                to="/"
                className="text-amber-600 hover:text-amber-500 font-bold transition"
            >
              Browse More Movies
            </Link>
          </div>
        </div>
      </div>
  );
}

export default BookingSuccess;