import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

function SoldTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Sold Tickets</h1>
          <p className="text-gray-400">View all ticket transactions across the cinema.</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900 border border-gray-700">
          <div className="mb-6 flex items-center bg-gray-700 rounded-lg px-4 py-2">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
                type="text"
                placeholder="Search by Booking ID or Customer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-white w-full focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-3 px-4 font-medium">Booking ID</th>
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Movie</th>
                <th className="py-3 px-4 font-medium">Date Sold</th>
                <th className="py-3 px-4 font-medium">Payment</th>
                <th className="py-3 px-4 font-medium">Total</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
              </thead>
              <tbody>
              {loading ? (
                  <tr><td colSpan="7" className="py-4 px-4 text-center animate-pulse">Loading records...</td></tr>
              ) : filteredTickets.length === 0 ? (
                  <tr><td colSpan="7" className="py-4 px-4 text-center">No records found.</td></tr>
              ) : (
                  filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                        <td className="py-3 px-4 font-mono text-xs text-amber-500">{ticket.id}</td>
                        <td className="py-3 px-4 font-medium text-white">{ticket.customerName || 'Walk-in'}</td>
                        <td className="py-3 px-4">{ticket.movieTitle}</td>
                        <td className="py-3 px-4 text-sm">{new Date(ticket.bookingDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 capitalize">{ticket.paymentMethod.replace('-', ' ')}</td>
                        <td className="py-3 px-4 font-bold text-white">₱{ticket.totalPrice}</td>
                        <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${ticket.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {ticket.status.toUpperCase()}
                      </span>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

export default SoldTickets;