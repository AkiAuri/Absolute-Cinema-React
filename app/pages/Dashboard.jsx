import React from 'react';
import StatCard from '../components/StatCard';
import { MOCK_STATS, MOCK_MOVIES } from '../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Ticket, DollarSign } from 'lucide-react';

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-white text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your cinema overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets Sold"
          value={MOCK_STATS.totalTicketsSold}
          icon={Ticket}
          trend={{ isPositive: true, percentage: 12 }}
        />
        <StatCard
          title="Total Revenue"
          value={`₱${MOCK_STATS.totalRevenue}`}
          icon={DollarSign}
          trend={{ isPositive: true, percentage: 8 }}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${MOCK_STATS.occupancyRate}%`}
          icon={Users}
          trend={{ isPositive: true, percentage: 5 }}
        />
        <StatCard
          title="Avg Ticket Price"
          value={`₱${MOCK_STATS.averageTicketPrice}`}
          icon={TrendingUp}
          trend={{ isPositive: false, percentage: 2 }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue */}
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <h2 className="text-white text-xl font-bold mb-6">Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_STATS.weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="revenue" fill="#c2a14d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Movie Performance */}
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <h2 className="text-white text-xl font-bold mb-6">Top Movies</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={MOCK_STATS.moviePerformance}
                dataKey="ticketsSold"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={false}
              >
                <Cell fill="#c2a14d" />
                <Cell fill="#666666" />
                <Cell fill="#999999" />
                <Cell fill="#d9d9d9" />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movie Performance Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden dark:bg-gray-900">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">Movie Performance</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-700">
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Movie</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Tickets Sold</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Revenue</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STATS.moviePerformance.map((movie) => {
              const percentage = ((movie.ticketsSold / MOCK_STATS.totalTicketsSold) * 100).toFixed(1);
              return (
                <tr key={movie.movieId} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-6 py-4 text-white font-medium">{movie.title}</td>
                  <td className="px-6 py-4 text-gray-300">{movie.ticketsSold}</td>
                  <td className="px-6 py-4 text-gray-300">₱{movie.revenue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-amber-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-sm">{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
