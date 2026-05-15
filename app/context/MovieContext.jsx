import React, { createContext, useContext, useState } from 'react';
import { MOCK_MOVIES } from '../lib/mockData';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState(MOCK_MOVIES);

  const addMovie = (movieData) => {
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
      movie.id === id
        ? {
            ...movie,
            ...movieData,
            duration: parseInt(movieData.duration),
            poster: movieData.poster || movie.poster,
          }
        : movie
    ));
  };

  const deleteMovie = (id) => {
    setMovies(movies.filter((m) => m.id !== id));
  };

  const getMovies = () => movies;

  const getMovieById = (id) => movies.find((m) => m.id === id);

  const value = {
    movies,
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
  if (!context) {
    throw new Error('useMovies must be used within MovieProvider');
  }
  return context;
}
