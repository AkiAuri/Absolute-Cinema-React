import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_STATS } from '../lib/mockData';
import { Calendar } from 'lucide-react';

function Statistics() {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for different time ranges
  const monthlyData = [
    { month: 'Jan', revenue: 12000, tickets: 800 },
    { month: 'Feb', revenue: 15000, tickets: 1000 },
    { month: 'Mar', revenue: 18600, tickets: 1240 },
  ];

  const getData = () => {
    switch (timeRange) {
      case 'week':
        return MOCK_STATS.weeklyRevenue;
      case 'month':
        return monthlyData;
      default:
        return MOCK_STATS.weeklyRevenue;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-3xl font-bold mb-2">Statistics</h1>
        <p className="text-gray-400">Track cinema performance and analytics.</p>
      </div>

      {/* Time Range Filter */}
      <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <Calendar className="text-gray-500" size={20} />
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                timeRange === 'week'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                timeRange === 'month'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <h2 className="text-white text-xl font-bold mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={timeRange === 'week' ? 'day' : 'month'} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#f3f4f6' }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c2a14d"
                dot={{ fill: '#c2a14d' }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tickets Chart */}
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <h2 className="text-white text-xl font-bold mb-6">Tickets Sold</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={timeRange === 'week' ? 'day' : 'month'} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#f3f4f6' }} />
              <Bar dataKey="tickets" fill="#c2a14d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-gray-400 text-sm mb-2">Peak Day</p>
          <p className="text-white text-2xl font-bold">Saturday</p>
          <p className="text-gray-500 text-xs mt-2">Highest revenue day</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-gray-400 text-sm mb-2">Avg Daily Revenue</p>
          <p className="text-white text-2xl font-bold">₱{(MOCK_STATS.weeklyRevenue.reduce((a, b) => a + b.revenue, 0) / 7).toFixed(0)}</p>
          <p className="text-gray-500 text-xs mt-2">7-day average</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-gray-400 text-sm mb-2">Occupancy Trend</p>
          <p className="text-white text-2xl font-bold">{MOCK_STATS.occupancyRate}%</p>
          <p className="text-green-400 text-xs mt-2">+5% from last month</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
