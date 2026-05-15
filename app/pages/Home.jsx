import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import { MOCK_MOVIES } from '../lib/mockData';

function Home() {
  const [filter, setFilter] = useState('all');

  const filteredMovies = filter === 'all' ? MOCK_MOVIES : MOCK_MOVIES.filter((m) => m.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-b border-gray-700 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Welcome to AbsoluteCinema!</h1>
          <p className="text-gray-300 text-lg md:text-xl mb-4">Book your movie tickets in minutes</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Movies
          </button>
          <button
            onClick={() => setFilter('now-showing')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'now-showing'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'upcoming'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
