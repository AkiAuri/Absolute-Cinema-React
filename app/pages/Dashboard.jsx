import React, { useEffect, useState } from 'react';
import { Ticket, Video, Users, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';

function Dashboard() {
  // 1. Add totalUsers to the initial state
  const [stats, setStats] = useState({ totalRevenue: 0, ticketsSold: 0, activeMovies: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Cinema Overview</h1>
          <p className="text-gray-400">Welcome to the management dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value={`₱${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+12.5%" />
          <StatCard title="Tickets Sold" value={loading ? "..." : stats.ticketsSold} icon={Ticket} trend="+8.2%" />
          <StatCard title="Active Movies" value={loading ? "..." : stats.activeMovies} icon={Video} />
          <StatCard title="Total Users" value={loading ? "..." : stats.totalUsers.toLocaleString()} icon={Users} trend="+15.3%" />
        </div>
      </div>
  );
}

export default Dashboard;