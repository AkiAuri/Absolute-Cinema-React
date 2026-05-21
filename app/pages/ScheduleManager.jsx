import React, { useState, useEffect } from 'react';
import { useMovies } from '../context/MovieContext';
import { CalendarPlus, Clock, MapPin, DollarSign } from 'lucide-react';

function ScheduleManager() {
    const { movies } = useMovies();
    const [theaters, setTheaters] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        movieId: '',
        theaterId: '',
        date: '',
        time: '',
        pricePerSeat: 350
    });

    // Fetch theaters and existing showtimes on load
    const fetchData = async () => {
        try {
            const [theatersRes, showtimesRes] = await Promise.all([
                fetch('/api/theaters'),
                fetch('/api/showtimes')
            ]);

            if (theatersRes.ok) setTheaters(await theatersRes.json());
            if (showtimesRes.ok) setShowtimes(await showtimesRes.json());
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Format start_time to match SQL DATETIME format: 'YYYY-MM-DD HH:MM:SS'
        const start_time = `${formData.date} ${formData.time}:00`;

        try {
            const res = await fetch('/api/showtimes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    movieId: formData.movieId,
                    theaterId: formData.theaterId,
                    start_time,
                    pricePerSeat: formData.pricePerSeat
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create showtime");
            }

            alert("Showtime scheduled successfully!");
            fetchData(); // Refresh the table
            setFormData({ ...formData, time: '' }); // Reset time for easy consecutive booking
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Only show movies that are "now-showing" or "upcoming"
    const activeMovies = movies.filter(m => m.status !== 'archived');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-white text-3xl font-bold mb-2">Schedule Manager</h1>
                <p className="text-gray-400">Assign movies to theaters and set ticket prices.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6 dark:bg-gray-900 border border-gray-700 h-fit">
                    <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                        <CalendarPlus className="text-amber-500" /> New Showtime
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Select Movie</label>
                            <select name="movieId" value={formData.movieId} onChange={handleChange} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none">
                                <option value="">-- Choose a Movie --</option>
                                {activeMovies.map(movie => (
                                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2"><MapPin size={16}/> Select Theater</label>
                            <select name="theaterId" value={formData.theaterId} onChange={handleChange} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none">
                                <option value="">-- Choose a Theater --</option>
                                {theaters.map(theater => (
                                    <option key={theater.id} value={theater.id}>
                                        Theater {theater.id} (Capacity: {theater.capacity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none [color-scheme:dark]" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2"><Clock size={16}/> Time</label>
                                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none [color-scheme:dark]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2"><DollarSign size={16}/> Price per Seat (₱)</label>
                            <input type="number" name="pricePerSeat" value={formData.pricePerSeat} onChange={handleChange} required min="1" className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none" />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition font-bold disabled:opacity-50 mt-4">
                            {isSubmitting ? 'Scheduling...' : 'Add Showtime'}
                        </button>
                    </form>
                </div>

                {/* Existing Schedules Table */}
                <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 dark:bg-gray-900 border border-gray-700">
                    <h2 className="text-white text-xl font-bold mb-6">Current Schedule</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="py-3 px-4 font-medium">Movie</th>
                                <th className="py-3 px-4 font-medium">Theater</th>
                                <th className="py-3 px-4 font-medium">Date & Time</th>
                                <th className="py-3 px-4 font-medium">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4" className="py-4 text-center animate-pulse">Loading schedule...</td></tr>
                            ) : showtimes.length === 0 ? (
                                <tr><td colSpan="4" className="py-4 text-center">No showtimes scheduled.</td></tr>
                            ) : (
                                showtimes.map((showtime) => {
                                    const dateObj = new Date(showtime.start_time.replace(' ', 'T'));
                                    return (
                                        <tr key={showtime.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                                            <td className="py-3 px-4 font-medium text-white">{showtime.movieTitle}</td>
                                            <td className="py-3 px-4">Theater {showtime.theaterId}</td>
                                            <td className="py-3 px-4 text-amber-500">
                                                {dateObj.toLocaleDateString()} @ {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="py-3 px-4">₱{showtime.pricePerSeat}</td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleManager;