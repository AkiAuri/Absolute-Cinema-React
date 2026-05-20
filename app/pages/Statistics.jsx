import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'];

function Statistics() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieStats = async () => {
      try {
        // We fetch the live bookings data and group them by movie to build the charts
        const response = await fetch('/api/bookings');
        if (!response.ok) throw new Error("Failed to fetch ticket data.");
        const tickets = await response.json();

        // Tally up tickets per movie
        const movieTally = tickets.reduce((acc, ticket) => {
          if (ticket.status === 'confirmed') {
            const title = ticket.movieTitle;
            if (!acc[title]) acc[title] = { name: title, tickets: 0, revenue: 0 };

            // Note: In our current schema, one booking record equals one checkout transaction,
            // but a checkout can have multiple seats. To be perfectly accurate on tickets sold per movie,
            // you'd typically join on booking_seats. For this overview chart, we approximate revenue.
            acc[title].revenue += ticket.totalPrice;
            acc[title].tickets += Math.floor(ticket.totalPrice / 12); // rough estimate if seats aren't returned explicitly
          }
          return acc;
        }, {});

        // Convert the tally object into an array for Recharts
        const chartData = Object.values(movieTally).sort((a, b) => b.revenue - a.revenue);
        setSalesData(chartData);

      } catch (error) {
        console.error("Stats Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieStats();
  }, []);

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Statistics & Reports</h1>
          <p className="text-gray-400">View cinema performance and sales analytics.</p>
        </div>

        {loading ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <p className="text-amber-500 font-bold animate-pulse">Loading Analytics Data...</p>
            </div>
        ) : salesData.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <p className="text-gray-400 text-lg">No sales data available yet. Start selling tickets to see analytics!</p>
            </div>
        ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Ticket Sales */}
                <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900 border border-gray-700">
                  <h2 className="text-white text-xl font-bold mb-6">Estimated Ticket Sales by Movie</h2>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          data={salesData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                        <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#f59e0b' }}
                        />
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Bar dataKey="tickets" name="Estimated Tickets Sold" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart - Revenue Distribution */}
                <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900 border border-gray-700">
                  <h2 className="text-white text-xl font-bold mb-6">Revenue Distribution</h2>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                            data={salesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="revenue"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {salesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                            formatter={(value) => `₱${value}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Revenue Table */}
              <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900 border border-gray-700 mt-6">
                <h2 className="text-white text-xl font-bold mb-6">Revenue Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-300">
                    <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th className="py-3 px-4 font-medium">Movie Title</th>
                      <th className="py-3 px-4 font-medium text-right">Est. Tickets Sold</th>
                      <th className="py-3 px-4 font-medium text-right">Total Revenue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {salesData.map((data, index) => (
                        <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                          <td className="py-3 px-4 font-medium text-white">{data.name}</td>
                          <td className="py-3 px-4 text-right">{data.tickets}</td>
                          <td className="py-3 px-4 text-right font-bold text-amber-500">₱{data.revenue.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
        )}
      </div>
  );
}

export default Statistics;