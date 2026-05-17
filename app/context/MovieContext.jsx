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

  const addMovie = async (movieData) => {
    // NOTE: This will only update the local UI for now.
    // In our next step, we will update this to send a POST request to TMDB/D1!
    const newMovie = {
      id: Date.now(),
      ...movieData,
      duration: parseInt(movieData.duration),
      poster: movieData.poster || 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=300&h=450&fit=crop',
    };
    setMovies([...movies, newMovie]);
    return newMovie;
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