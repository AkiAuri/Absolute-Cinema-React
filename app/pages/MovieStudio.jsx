import React, { useState, useRef } from 'react';
import { useMovies } from '../context/MovieContext';
import { Plus, Edit2, Trash2, X, Film, Pencil, Upload, ImageIcon, Link as LinkIcon } from 'lucide-react';

function MovieStudio() {
  const { movies, addMovie, updateMovie, deleteMovie } = useMovies();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'upload'
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    rating: 'PG-13',
    duration: '',
    status: 'upcoming',
    synopsis: '',
    poster: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Update preview when poster URL changes
    if (name === 'poster') {
      setImagePreview(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prev) => ({
          ...prev,
          poster: base64String,
        }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setFormData((prev) => ({
      ...prev,
      poster: '',
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddMovie = (e) => {
    e.preventDefault();
    addMovie({
      ...formData,
      poster: formData.poster || 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=300&h=450&fit=crop',
    });
    setFormData({
      title: '',
      genre: '',
      rating: 'PG-13',
      duration: '',
      status: 'now-showing',
      synopsis: '',
      poster: '',
    });
    setImagePreview('');
    setImageInputType('url');
    setShowAddForm(false);
  };

  const handleUpdateMovie = (e) => {
    e.preventDefault();
    updateMovie(editingMovie.id, {
      ...formData,
      poster: formData.poster || editingMovie.poster,
    });
    setFormData({
      title: '',
      genre: '',
      rating: 'PG-13',
      duration: '',
      status: 'now-showing',
      synopsis: '',
      poster: '',
    });
    setImagePreview('');
    setImageInputType('url');
    setShowEditForm(false);
    setEditingMovie(null);
  };

  const handleDeleteMovie = (id) => {
    deleteMovie(id);
  };

  const openEditForm = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      duration: movie.duration.toString(),
      status: movie.status,
      synopsis: movie.synopsis,
      poster: movie.poster || '',
    });
    setImagePreview(movie.poster || '');
    setImageInputType('url');
    setShowAddForm(false); // Close add form if open
    setShowEditForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setFormData({
      title: '',
      genre: '',
      rating: 'PG-13',
      duration: '',
      status: 'now-showing',
      synopsis: '',
      poster: '',
    });
    setImagePreview('');
    setImageInputType('url');
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingMovie(null);
    setFormData({
      title: '',
      genre: '',
      rating: 'PG-13',
      duration: '',
      status: 'now-showing',
      synopsis: '',
      poster: '',
    });
    setImagePreview('');
    setImageInputType('url');
  };

  const openAddForm = () => {
    setShowEditForm(false); // Close edit form if open
    setEditingMovie(null);
    setFormData({
      title: '',
      genre: '',
      rating: 'PG-13',
      duration: '',
      status: 'now-showing',
      synopsis: '',
      poster: '',
    });
    setImagePreview('');
    setImageInputType('url');
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Movie Studio</h1>
          <p className="text-gray-400">Create and manage cinema movies.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition font-bold"
        >
          <Plus size={20} />
          Add Movie
        </button>
      </div>

      {/* ADD MOVIE FORM - Green Theme */}
      {showAddForm && (
        <div className="relative">
          {/* Visual indicator bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-l-lg"></div>
          
          <div className="bg-gradient-to-br from-green-900/30 to-gray-800 border border-green-500/30 rounded-lg p-6 ml-1">
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Film className="text-green-400" size={24} />
              </div>
              <div>
                <h2 className="text-green-400 text-xl font-bold">Add New Movie</h2>
                <p className="text-green-400/60 text-sm">Create a new movie entry for the cinema</p>
              </div>
              <button
                onClick={closeAddForm}
                className="ml-auto text-gray-400 hover:text-white transition p-2"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMovie}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-green-300/80 text-sm font-medium mb-2">Movie Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter movie title"
                    className="w-full bg-gray-800/80 border border-green-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-green-300/80 text-sm font-medium mb-2">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleFormChange}
                    placeholder="e.g., Action, Drama, Comedy"
                    className="w-full bg-gray-800/80 border border-green-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-green-300/80 text-sm font-medium mb-2">Rating</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleFormChange}
                    className="w-full bg-gray-800/80 border border-green-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>
                <div>
                  <label className="block text-green-300/80 text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    placeholder="120"
                    className="w-full bg-gray-800/80 border border-green-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-green-300/80 text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-gray-800/80 border border-green-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="now-showing">Now Showing</option>
                    <option value="upcoming">Coming Soon</option>
                  </select>
                </div>
              </div>

              {/* Movie Poster Image Section */}
              <div className="mb-6">
                <label className="block text-green-300/80 text-sm font-medium mb-2">Movie Poster</label>
                
                {/* Toggle between URL and Upload */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageInputType('url')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      imageInputType === 'url'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <LinkIcon size={16} />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType('upload')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      imageInputType === 'upload'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                </div>

                {/* URL Input */}
                {imageInputType === 'url' && (
                  <input
                    type="url"
                    name="poster"
                    value={formData.poster}
                    onChange={handleFormChange}
                    placeholder="https://example.com/movie-poster.jpg"
                    className="w-full bg-gray-800/80 border border-green-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                )}

                {/* File Upload */}
                {imageInputType === 'upload' && (
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center gap-2 w-full bg-gray-800/80 border-2 border-dashed border-green-500/30 text-green-400 px-4 py-6 rounded-lg hover:border-green-500/50 hover:bg-gray-800 transition cursor-pointer">
                      <Upload size={20} />
                      <span>Click to upload image</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3 flex items-start gap-4">
                    <img
                      src={imagePreview}
                      alt="Poster preview"
                      className="w-24 h-36 object-cover rounded-lg border border-green-500/30"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-green-400 text-sm">Poster preview</p>
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {!imagePreview && (
                  <p className="text-gray-500 text-xs mt-2">
                    Leave empty to use a default placeholder image
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-green-300/80 text-sm font-medium mb-2">Synopsis</label>
                <textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleFormChange}
                  placeholder="Enter movie synopsis"
                  rows="4"
                  className="w-full bg-gray-800/80 border border-green-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold"
                >
                  <Plus size={20} />
                  Add Movie
                </button>
                <button
                  type="button"
                  onClick={closeAddForm}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MOVIE FORM - Blue Theme */}
      {showEditForm && editingMovie && (
        <div className="relative">
          {/* Visual indicator bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-lg"></div>
          
          <div className="bg-gradient-to-br from-blue-900/30 to-gray-800 border border-blue-500/30 rounded-lg p-6 ml-1">
            {/* Header with icon and movie info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Pencil className="text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-blue-400 text-xl font-bold">Edit Movie</h2>
                <p className="text-blue-400/60 text-sm">
                  Modifying: <span className="text-blue-300 font-medium">{editingMovie.title}</span>
                </p>
              </div>
              <button
                onClick={closeEditForm}
                className="text-gray-400 hover:text-white transition p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Current movie preview */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 flex items-center gap-4">
              <img
                src={editingMovie.poster}
                alt={editingMovie.title}
                className="w-16 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="text-blue-300 text-sm">Currently editing</p>
                <p className="text-white font-bold">{editingMovie.title}</p>
                <p className="text-gray-400 text-sm">{editingMovie.genre} - {editingMovie.duration} min</p>
              </div>
            </div>

            <form onSubmit={handleUpdateMovie}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-blue-300/80 text-sm font-medium mb-2">Movie Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter movie title"
                    className="w-full bg-gray-800/80 border border-blue-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-blue-300/80 text-sm font-medium mb-2">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleFormChange}
                    placeholder="e.g., Action, Drama, Comedy"
                    className="w-full bg-gray-800/80 border border-blue-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-blue-300/80 text-sm font-medium mb-2">Rating</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleFormChange}
                    className="w-full bg-gray-800/80 border border-blue-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>
                <div>
                  <label className="block text-blue-300/80 text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    placeholder="120"
                    className="w-full bg-gray-800/80 border border-blue-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-blue-300/80 text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-gray-800/80 border border-blue-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="now-showing">Now Showing</option>
                    <option value="upcoming">Coming Soon</option>
                  </select>
                </div>
              </div>

              {/* Movie Poster Image Section - Edit Form */}
              <div className="mb-6">
                <label className="block text-blue-300/80 text-sm font-medium mb-2">Movie Poster</label>
                
                {/* Toggle between URL and Upload */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageInputType('url')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      imageInputType === 'url'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <LinkIcon size={16} />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType('upload')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      imageInputType === 'upload'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                </div>

                {/* URL Input */}
                {imageInputType === 'url' && (
                  <input
                    type="url"
                    name="poster"
                    value={formData.poster}
                    onChange={handleFormChange}
                    placeholder="https://example.com/movie-poster.jpg"
                    className="w-full bg-gray-800/80 border border-blue-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                )}

                {/* File Upload */}
                {imageInputType === 'upload' && (
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center gap-2 w-full bg-gray-800/80 border-2 border-dashed border-blue-500/30 text-blue-400 px-4 py-6 rounded-lg hover:border-blue-500/50 hover:bg-gray-800 transition cursor-pointer">
                      <Upload size={20} />
                      <span>Click to upload new image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3 flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Poster preview"
                        className="w-24 h-36 object-cover rounded-lg border border-blue-500/30"
                      />
                      {imagePreview !== editingMovie?.poster && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-blue-400 text-sm">
                        {imagePreview === editingMovie?.poster ? 'Current poster' : 'New poster preview'}
                      </p>
                      {imagePreview !== editingMovie?.poster && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, poster: editingMovie?.poster || '' }));
                            setImagePreview(editingMovie?.poster || '');
                          }}
                          className="flex items-center gap-1 text-gray-400 hover:text-gray-300 text-sm"
                        >
                          <X size={14} />
                          Revert to original
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-blue-300/80 text-sm font-medium mb-2">Synopsis</label>
                <textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleFormChange}
                  placeholder="Enter movie synopsis"
                  rows="4"
                  className="w-full bg-gray-800/80 border border-blue-500/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold"
                >
                  <Edit2 size={20} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditForm}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div>
        <h2 className="text-white text-xl font-bold mb-4">All Movies ({movies.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className={`bg-gray-800 rounded-lg overflow-hidden dark:bg-gray-900 transition-all ${
                editingMovie?.id === movie.id 
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
                  : 'hover:ring-1 hover:ring-gray-600'
              }`}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {editingMovie?.id === movie.id && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Currently Editing
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-2 line-clamp-2">{movie.title}</h3>
                <div className="text-gray-400 text-sm mb-4">
                  <p>{movie.genre} - {movie.duration}min</p>
                  <p className="text-xs mt-1">{movie.rating}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(movie)}
                    disabled={editingMovie?.id === movie.id}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition font-bold text-sm ${
                      editingMovie?.id === movie.id
                        ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                        : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                    }`}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-lg transition font-bold text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {movies.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 text-center dark:bg-gray-900">
          <Film className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">No movies yet. Create your first movie!</p>
          <button
            onClick={openAddForm}
            className="mt-4 inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition font-bold"
          >
            <Plus size={20} />
            Add Your First Movie
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieStudio;
