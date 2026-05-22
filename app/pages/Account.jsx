import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Ticket, Trash2 } from 'lucide-react';

function Account() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMyTickets = async () => {
      if (!user) return;
      try {
        // 1. Fetch securely using the specific 'me' endpoint
        const response = await fetch('/api/bookings/me');

        if (response.ok) {
          const userTickets = await response.json();
          // 2. The backend already filtered by the user's JWT token,
          // so we can just set the tickets directly!
          setTickets(userTickets);
        } else {
          console.error("Failed to fetch user tickets. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchMyTickets();
  }, [user]);

  const filteredTickets = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  const handleCancelTicket = async (ticketId) => {
    try {
      // Make sure your backend route app/api/bookings/[id]/refund/route.js handles this correctly
      const response = await fetch(`/api/bookings/${ticketId}/refund`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel ticket');

      // Update the UI to reflect the cancelled status instantly
      setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? { ...t, status: 'cancelled' } : t))
      );

      alert("Ticket cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      alert(error.message);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 dark:bg-gray-900">
            <h1 className="text-white text-3xl font-bold mb-2">My Account</h1>
            <p className="text-gray-400">Welcome back, {user?.name}!</p>
            <p className="text-gray-500 text-sm mt-2">Email: {user?.email}</p>
          </div>

          {/* Tickets Section */}
          <h2 className="text-white text-2xl font-bold mb-6">My Tickets</h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-lg font-bold transition ${
                    filter === 'all'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              All Tickets ({tickets.length})
            </button>
            <button
                onClick={() => setFilter('sold')}
                className={`px-6 py-2 rounded-lg font-bold transition ${
                    filter === 'sold'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Active ({tickets.filter((t) => t.status === 'sold' || t.status === 'confirmed').length})
            </button>
            <button
                onClick={() => setFilter('cancelled')}
                className={`px-6 py-2 rounded-lg font-bold transition ${
                    filter === 'cancelled'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Cancelled ({tickets.filter((t) => t.status === 'cancelled').length})
            </button>
          </div>

          {/* Tickets List */}
          {filteredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTickets.map((ticket) => {
                  const isActive = ticket.status === 'sold' || ticket.status === 'confirmed';
                  return (
                      <div
                          key={ticket.id}
                          className={`bg-gray-800 rounded-lg overflow-hidden transition ${
                              ticket.status === 'cancelled' ? 'opacity-60' : ''
                          } dark:bg-gray-900`}
                      >
                        <div
                            className={`h-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
                        ></div>

                        <div className="p-6">
                          {/* Ticket Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-white text-xl font-bold">{ticket.movieTitle}</h3>
                              <p className="text-gray-500 text-sm">Ticket ID: {ticket.id}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    isActive
                                        ? 'bg-green-500/10 text-green-400'
                                        : 'bg-red-500/10 text-red-400'
                                }`}
                            >
                        {isActive ? 'Active' : 'Cancelled'}
                      </span>
                          </div>

                          {/* Ticket Details */}
                          <div className="space-y-3 mb-6 border-t border-gray-700 pt-4">
                            <div className="flex items-center gap-3">
                              <Calendar className="text-amber-600" size={18} />
                              <div>
                                <p className="text-gray-400 text-sm">Date & Time</p>
                                {/* Updated to format the correct start_time variable */}
                                <p className="text-white font-bold">
                                  {ticket.start_time ? new Date(ticket.start_time).toLocaleString() : 'TBA'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <MapPin className="text-amber-600" size={18} />
                              <div>
                                <p className="text-gray-400 text-sm">Theater</p>
                                <p className="text-white font-bold">{ticket.theater}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Ticket className="text-amber-600" size={18} />
                              <div>
                                <p className="text-gray-400 text-sm">Seats</p>
                                <p className="text-white font-bold">{ticket.seats?.join(', ') || 'None'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Total Amount */}
                          <div className="bg-gray-700 rounded-lg p-3 mb-4 dark:bg-gray-800">
                            <p className="text-gray-400 text-sm">Total Amount</p>
                            <p className="text-white text-2xl font-bold text-amber-600">₱{ticket.totalPrice}</p>
                          </div>

                          {/* Actions */}
                          {isActive && (
                              <button
                                  onClick={() => handleCancelTicket(ticket.id)}
                                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 py-2 rounded-lg transition font-bold"
                              >
                                <Trash2 size={18} />
                                Cancel Ticket
                              </button>
                          )}
                        </div>
                      </div>
                  );
                })}
              </div>
          ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center dark:bg-gray-900">
                <Ticket className="text-gray-600 mx-auto mb-4" size={48} />
                <p className="text-gray-400 text-lg">
                  {filter === 'all'
                      ? "You haven't purchased any tickets yet"
                      : `No ${filter} tickets found`}
                </p>
                <p className="text-gray-500 text-sm mt-2">Start exploring movies to get your tickets</p>
              </div>
          )}
        </div>
      </div>
  );
}

export default Account;