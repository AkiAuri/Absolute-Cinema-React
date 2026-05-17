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

  const updateMovie = (id, movieData) => {
    setMovies(movies.map((movie) =>
        movie.id === id ? { ...movie, ...movieData } : movie
    ));
  };

  const deleteMovie = (id) => {
    setMovies(movies.filter((m) => m.id !== id));
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