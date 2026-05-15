import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MovieCard({ movie }) {
  const { user } = useAuth();
  const statusColor = movie.status === 'now-showing' ? 'bg-amber-600' : 'bg-gray-600';
  const statusText = movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon';
  
  // Employees and admins "Sell" tickets, customers would "Buy" tickets
  const isStaff = user?.role === 'employee' || user?.role === 'admin';
  const buttonText = isStaff ? 'Sell Tickets' : 'Buy Tickets';

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:border-amber-600 border-2 border-gray-700 transition-all hover:shadow-lg hover:shadow-amber-600/20 dark:bg-gray-900">
      {/* Poster */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 ${statusColor} text-white px-3 py-1 rounded-full text-xs font-bold`}>
          {statusText}
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg line-clamp-2 mb-2">{movie.title}</h3>

        {/* Genre and Rating */}
        <div className="flex justify-between mb-3">
          <span className="text-gray-400 text-sm">{movie.genre}</span>
          <span className="text-amber-600 text-sm font-bold">{movie.rating}</span>
        </div>

        {/* Duration */}
        <p className="text-gray-400 text-xs mb-4">{movie.duration} min</p>

        {/* Button */}
        {movie.status === 'now-showing' ? (
          <Link
            to={`/schedule/${movie.id}`}
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition text-center font-bold text-sm block"
          >
            {buttonText}
          </Link>
        ) : (
          <button disabled className="w-full bg-gray-600 text-gray-400 py-2 rounded-lg cursor-not-allowed text-center font-bold text-sm">
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
