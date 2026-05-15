import React, { useState } from 'react';
import MovieTable from '../components/MovieTable';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, X } from 'lucide-react';

function MovieRecords() {
  const { movies, updateMovie } = useMovies();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    genre: '',
    rating: 'PG-13',
    duration: '',
    status: 'now-showing',
    synopsis: '',
  });

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || movie.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditClick = (movie) => {
    setSelectedMovie(movie);
    setEditFormData({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      duration: movie.duration.toString(),
      status: movie.status,
      synopsis: movie.synopsis,
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-3xl font-bold mb-2">Movie Records</h1>
        <p className="text-gray-400">Manage and view all cinema movies.</p>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
            >
              <option value="all">All Status</option>
              <option value="now-showing">Now Showing</option>
              <option value="upcoming">Coming Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Table */}
      <MovieTable movies={filteredMovies} showActions={true} onEdit={handleEditClick} />

      {/* Results count */}
      <div className="text-gray-400 text-sm">
        Showing {filteredMovies.length} of {movies.length} movies
      </div>

      {/* Edit/View Movie Modal */}
      {isEditModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">
                {user?.role === 'admin' ? 'Edit Movie' : 'Movie Details'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {user?.role === 'admin' ? (
              // Admin Edit Form
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateMovie(selectedMovie.id, editFormData);
                  closeModal();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Movie Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      placeholder="Enter movie title"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editFormData.genre}
                      onChange={handleEditFormChange}
                      placeholder="e.g., Action, Drama, Comedy"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Rating</label>
                    <select
                      name="rating"
                      value={editFormData.rating}
                      onChange={handleEditFormChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                    >
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                      <option value="NC-17">NC-17</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={editFormData.duration}
                      onChange={handleEditFormChange}
                      placeholder="120"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                    >
                      <option value="now-showing">Now Showing</option>
                      <option value="upcoming">Coming Soon</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Synopsis</label>
                  <textarea
                    name="synopsis"
                    value={editFormData.synopsis}
                    onChange={handleEditFormChange}
                    placeholder="Enter movie synopsis"
                    rows="4"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                    required
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition font-bold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Employee View-Only Display
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Title</label>
                  <p className="text-white text-lg font-semibold">{selectedMovie.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Genre</label>
                    <p className="text-white">{selectedMovie.genre}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Rating</label>
                    <p className="text-white">{selectedMovie.rating}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Duration</label>
                    <p className="text-white">{selectedMovie.duration} minutes</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Status</label>
                    <p className="text-white">
                      {selectedMovie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Synopsis</label>
                  <p className="text-gray-300 leading-relaxed">{selectedMovie.synopsis}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition font-bold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieRecords;
