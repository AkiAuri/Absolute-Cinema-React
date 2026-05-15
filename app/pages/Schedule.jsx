import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_MOVIES, MOCK_SHOWTIMES } from '../lib/mockData';
import { useBooking } from '../context/BookingContext';
import { Clock, MapPin, Ticket } from 'lucide-react';

function Schedule() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const movie = MOCK_MOVIES.find((m) => m.id === parseInt(movieId));
  const showtimes = MOCK_SHOWTIMES.filter((s) => s.movieId === parseInt(movieId));

  if (!movie) {
    return <div className="text-white">Movie not found</div>;
  }

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
        {/* Movie Header */}
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 dark:bg-gray-900">
          <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="w-40 flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-56 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold mb-2">{movie.title}</h1>
              <p className="text-gray-400 text-lg mb-4">{movie.synopsis}</p>
              <div className="flex gap-4 flex-wrap mb-4">
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

        {/* Showtimes */}
        <h2 className="text-white text-2xl font-bold mb-6">Select Date & Time</h2>

        {Object.entries(groupedShowtimes).map(([date, dateShowtimes]) => (
          <div key={date} className="mb-8">
            <h3 className="text-white text-lg font-bold mb-4">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {dateShowtimes.map((showtime) => (
                <button
                  key={showtime.id}
                  onClick={() => handleSelectShowtime(showtime)}
                  className="bg-gray-800 hover:bg-amber-600 border-2 border-gray-700 hover:border-amber-600 rounded-lg p-4 transition group dark:bg-gray-900"
                >
                  <div className="text-white font-bold text-xl mb-2 group-hover:text-gray-900">{showtime.time}</div>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-900 text-sm mb-2">
                    <MapPin size={14} />
                    {showtime.theater}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-900 text-sm">
                    <Ticket size={14} />
                    ₱{showtime.pricePerSeat}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;
