import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Ticket, DollarSign, User, Clock } from 'lucide-react';

function SoldTickets() {
  const { user } = useAuth();
  const [soldTickets, setSoldTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Get sold tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem('soldTickets') || '[]');
    
    // Both employees and admins can see ALL sold tickets
    setSoldTickets(storedTickets);
  }, [user, isAdmin]);

  // Calculate total revenue (admin only)
  const totalRevenue = soldTickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0);
  const totalTicketsSold = soldTickets.reduce((sum, ticket) => sum + ticket.seats.length, 0);
  const todaysSales = soldTickets.filter(t => t.saleDate === new Date().toISOString().split('T')[0]);
  const todaysRevenue = todaysSales.reduce((sum, ticket) => sum + ticket.totalPrice, 0);

  // Filter tickets
  const getFilteredTickets = () => {
    let filtered = soldTickets;
    
    // Date filter
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => t.saleDate === today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.saleDate) >= weekAgo);
    }
    
    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.status === filter);
    }
    
    return filtered;
  };

  const displayedTickets = getFilteredTickets();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-3xl font-bold mb-2">Sold Tickets</h1>
        <p className="text-gray-400">
          {isAdmin 
            ? 'View all ticket sales across the cinema with full revenue details.' 
            : 'View all tickets sold to customers.'}
        </p>
      </div>

      {/* Stats Cards - Employee sees counts only, Admin sees counts + revenue */}
      <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center">
              <Ticket className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Tickets Sold</p>
              <p className="text-white text-2xl font-bold">{totalTicketsSold}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
              <Clock className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Sales Today</p>
              <p className="text-white text-2xl font-bold">{todaysSales.length}</p>
            </div>
          </div>
        </div>

        {/* Today's Revenue - Admin Only */}
        {isAdmin && (
          <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Today's Revenue</p>
                <p className="text-white text-2xl font-bold">₱{todaysRevenue}</p>
              </div>
            </div>
          </div>
        )}

        {/* Total Revenue - Admin Only */}
        {isAdmin && (
          <div className="bg-gradient-to-br from-amber-600/20 to-amber-600/5 border border-amber-600/30 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-amber-500" size={24} />
              </div>
              <div>
                <p className="text-amber-400 text-sm font-medium">Total Revenue</p>
                <p className="text-white text-2xl font-bold">₱{totalRevenue}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setDateFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              dateFilter === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              dateFilter === 'today'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('week')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              dateFilter === 'week'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Week
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === 'all'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({soldTickets.length})
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === 'sold'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completed ({soldTickets.filter((t) => t.status === 'sold').length})
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      {displayedTickets.length > 0 ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-700">
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Movie</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Customer</th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Sold By</th>
                  )}
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Showtime</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Seats</th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Amount</th>
                  )}
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Sale Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 text-white font-mono text-sm">{ticket.id}</td>
                    <td className="px-6 py-4 text-white font-medium">{ticket.movieTitle}</td>
                    <td className="px-6 py-4 text-gray-300">{ticket.customerName || 'N/A'}</td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.soldByRole === 'admin' 
                            ? 'bg-purple-500/10 text-purple-400' 
                            : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {ticket.soldByName || 'Customer'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-300 text-sm">{ticket.showtime}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{ticket.seats.join(', ')}</td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-amber-500 font-bold">₱{ticket.totalPrice}</td>
                    )}
                    <td className="px-6 py-4 text-gray-400 text-sm">{ticket.saleDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-12 text-center dark:bg-gray-900">
          <Ticket className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">
            {filter === 'all' && dateFilter === 'all'
              ? 'No tickets sold yet'
              : 'No tickets found with the selected filters'}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Start selling tickets to see them here
          </p>
        </div>
      )}
    </div>
  );
}

export default SoldTickets;
