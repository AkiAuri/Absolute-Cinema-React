import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useBooking } from '../context/BookingContext';
import { Clock, MapPin, Ticket } from 'lucide-react';

function Schedule() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { getMovieById, loading: moviesLoading } = useMovies();
  const { updateBooking } = useBooking();

  const [showtimes, setShowtimes] = useState([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);

  const movie = getMovieById(parseInt(movieId, 10));

  // Fetch real live session showtimes from the Cloudflare D1 backend
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch(`/api/showtimes?movieId=${movieId}`);
        if (!response.ok) throw new Error("Failed to load showtimes.");
        const data = await response.json();

        // Dynamically map single 'start_time' string into standalone 'date' & 'time' keys
        const formattedShowtimes = data.map((st) => {
          // Replace space with 'T' to make parsing reliable across browsers
          const dateObj = new Date(st.start_time.replace(' ', 'T'));

          return {
            ...st,
            date: dateObj.toISOString().split('T')[0], // "2026-05-22"
            time: dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }), // "18:30"
            theater: `Theater ${st.theaterId}` // Converts 'A' into 'Theater A'
          };
        });

        setShowtimes(formattedShowtimes);
      } catch (error) {
        console.error("Schedule Loading Error:", error);
      } finally {
        setLoadingShowtimes(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  if (moviesLoading || loadingShowtimes) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <p className="text-amber-500 font-bold text-xl animate-pulse">Loading schedule information...</p>
        </div>
    );
  }

  if (!movie) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl font-bold mb-4">Movie not found</p>
            <button onClick={() => navigate('/')} className="bg-amber-600 text-white px-4 py-2 rounded-lg">
              Back to Home
            </button>
          </div>
        </div>
    );
  }

  // Group showtimes by date string for organized UI categorizing
  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const date = showtime.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {});

  const handleSelectShowtime = (showtime) => {
    updateBooking({
      selectedMovie: movie,
      selectedShowtime: showtime,
      selectedDate: showtime.date,
      selectedTime: showtime.time,
    });
    navigate('/booking');
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Movie Header Banner */}
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 dark:bg-gray-900 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="w-40 flex-shrink-0 mx-auto md:mx-0">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-56 object-cover rounded-lg shadow-md border border-gray-700"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-white text-3xl font-bold mb-2">{movie.title}</h1>
                <p className="text-gray-400 text-base mb-4 leading-relaxed">{movie.synopsis}</p>
                <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-4">
                  <div className="bg-gray-700 px-3 py-1 rounded-lg">
                    <p className="text-gray-300 text-sm">Genre: <span className="font-bold text-white">{movie.genre}</span></p>
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded-lg">
                    <p className="text-gray-300 text-sm">Rating: <span className="font-bold text-white">{movie.rating}</span></p>
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded-lg">
                    <p className="text-gray-300 text-sm">Duration: <span className="font-bold text-white">{movie.duration} min</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Dates Content Section */}
          <h2 className="text-white text-2xl font-bold mb-6">Select Date & Time</h2>

          {Object.keys(groupedShowtimes).length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <p className="text-gray-400 text-lg">No screening showtimes are currently scheduled for this movie.</p>
              </div>
          ) : (
              Object.entries(groupedShowtimes).map(([date, dateShowtimes]) => (
                  <div key={date} className="mb-8">
                    <h3 className="text-amber-500 text-lg font-bold mb-4">
                      {new Date(date + "T00:00:00").toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {dateShowtimes.map((showtime) => (
                          <button
                              key={showtime.id}
                              onClick={() => handleSelectShowtime(showtime)}
                              className="bg-gray-800 hover:bg-amber-600 border-2 border-gray-700 hover:border-amber-600 rounded-lg p-4 transition group text-left dark:bg-gray-900 shadow-md"
                          >
                            <div className="text-white font-bold text-2xl mb-2 group-hover:text-gray-900 transition-colors">{showtime.time}</div>
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-900 text-sm mb-2 transition-colors">
                              <MapPin size={14} />
                              {showtime.theater}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-900 text-sm transition-colors">
                              <Ticket size={14} />
                              ₱{showtime.pricePerSeat}
                            </div>
                          </button>
                      ))}
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
}

export default Schedule;