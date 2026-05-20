import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]); // Start empty, no mock data!
  const [loading, setLoading] = useState(true);

  // Fetch from our new API when the app loads
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const addMovie = async (tmdbId) => {
    try {
      const response = await fetch('/api/movies/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We only send the ID! The server does the heavy lifting.
        body: JSON.stringify({ tmdbId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add movie');
      }

      // Add the real, newly fetched movie from the server into our React state
      setMovies((prevMovies) => [...prevMovies, data.movie]);
      return data.movie;

    } catch (error) {
      console.error("Error adding movie from TMDB:", error);
      throw error; // Let the component know it failed so it can show a toast/alert
    }
  };

  const updateMovie = async (id, movieData) => {
    try {
      const existingMovie = movies.find(m => m.id === id);
      const updatedPayload = { ...existingMovie, ...movieData };

      // 2. Send the PUT request to the backend
      const response = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update movie');
      }

      // 3. If successful, update the React state so the UI reflects the change
      setMovies((prevMovies) =>
          prevMovies.map((movie) =>
              movie.id === id ? updatedPayload : movie
          )
      );

    } catch (error) {
      console.error("Error updating movie:", error);
      alert("Failed to update movie: " + error.message);
    }
  };

  const deleteMovie = async (id) => {
    try {
      // 1. Send DELETE request to the backend
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete movie');
      }

      // 2. If successful, remove it from the React state
      setMovies((prevMovies) => prevMovies.filter((m) => m.id !== id));

    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie: " + error.message);
    }
  };

  const getMovies = () => movies;
  const getMovieById = (id) => movies.find((m) => m.id === id);

  const value = {
    movies,
    loading, // Added loading state so the UI can wait gracefully
    addMovie,
    updateMovie,
    deleteMovie,
    getMovies,
    getMovieById,
  };

  return (
      <MovieContext.Provider value={value}>
        {children}
      </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used within MovieProvider');
  return context;
}