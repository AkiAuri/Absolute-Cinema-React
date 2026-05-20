import React from 'react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

function Home() {
  // 1. Pull live data from your Cloudflare D1 backend via Context
  const { movies, loading } = useMovies();

  // 2. Pull the secure HTTP-Only session user data
  const { user } = useAuth();

  // 3. Automatically categorize movies based on their database status
  const nowShowing = movies.filter(movie => movie.status === 'now-showing');
  const comingSoon = movies.filter(movie => movie.status === 'upcoming');

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <p className="text-amber-500 font-bold text-xl animate-pulse">Loading cinema lineup...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-900 pb-12">
        {/* Dynamic Hero Section */}
        <div className="relative bg-gray-800 border-b border-gray-700 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {/* Personalize the greeting if they are logged in */}
              Welcome to CineBook{user ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {user?.role === 'admin' || user?.role === 'employee'
                  ? "Access your dashboard to manage showtimes, ticket sales, and cinema records."
                  : "Experience the magic of cinema. Book tickets for the latest blockbusters and upcoming releases."}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Now Showing Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white border-l-4 border-amber-500 pl-3">Now Showing</h2>
            </div>

            {nowShowing.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {nowShowing.map(movie => (
                      <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                  <p className="text-gray-400">No movies are currently showing. Check back later!</p>
                </div>
            )}
          </div>

          {/* Coming Soon Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white border-l-4 border-gray-500 pl-3">Coming Soon</h2>
            </div>

            {comingSoon.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {comingSoon.map(movie => (
                      <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                  <p className="text-gray-400">No upcoming movies announced yet.</p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Home;