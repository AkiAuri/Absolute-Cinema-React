import React from 'react';
import { useAuth } from '../context/AuthContext';

function MovieTable({ movies, showActions, onEdit }) {
  const { user } = useAuth();
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden dark:bg-gray-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-700">
            <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Movie</th>
            <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Genre</th>
            <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Rating</th>
            <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Duration</th>
            <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Status</th>
            {showActions && <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
              <td className="px-6 py-4 text-white font-medium">{movie.title}</td>
              <td className="px-6 py-4 text-gray-300">{movie.genre}</td>
              <td className="px-6 py-4 text-gray-300">{movie.rating}</td>
              <td className="px-6 py-4 text-gray-300">{movie.duration} min</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    movie.status === 'now-showing'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                </span>
              </td>
              {showActions && (
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEdit && onEdit(movie)}
                    className="text-amber-600 hover:text-amber-500 text-sm font-medium transition"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovieTable;
