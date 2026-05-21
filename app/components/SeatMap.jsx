import React, { useState, useEffect } from 'react';

// ADDED: showtimeId prop
function SeatMap({ showtimeId, theater = 'A', onSeatsChange, selectedSeats = [], pricePerSeat = 12 }) {
  const ROWS = 10;
  const SEATS_PER_ROW = 12;

  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeatsAndGenerateGrid = async () => {
      if (!showtimeId) return;
      setIsLoading(true);

      try {
        // 1. Fetch the actually occupied seats from your new backend route
        // Note: Change the path if you kept the folder name singular (/api/showtime/...)
        const response = await fetch(`/api/showtimes/${showtimeId}/seats`);
        const bookedSeats = response.ok ? await response.json() : [];

        // 2. Generate the seats grid
        const newSeats = [];
        for (let i = 0; i < ROWS; i++) {
          for (let j = 0; j < SEATS_PER_ROW; j++) {
            const seatId = `${String.fromCharCode(65 + i)}${j + 1}`;

            newSeats.push({
              id: seatId,
              row: String.fromCharCode(65 + i),
              number: j + 1,
              // True ONLY if the seatId is NOT in the database's bookedSeats array
              isAvailable: !bookedSeats.includes(seatId),
            });
          }
        }
        setSeats(newSeats);
      } catch (error) {
        console.error("Failed to load seat map data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatsAndGenerateGrid();
  }, [showtimeId]); // Runs whenever the showtime changes

  const handleSeatClick = (seatId, isAvailable) => {
    if (!isAvailable) return;

    const isCurrentlySelected = selectedSeats.includes(seatId);
    let newSelectedSeats;

    if (isCurrentlySelected) {
      newSelectedSeats = selectedSeats.filter((s) => s !== seatId);
    } else {
      newSelectedSeats = [...selectedSeats, seatId];
    }

    onSeatsChange(newSelectedSeats);
  };

  return (
      <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
        <h3 className="text-white text-lg font-bold mb-4">Select Your Seats</h3>

        {/* Loading state to prevent users from clicking before data arrives */}
        {isLoading ? (
            <div className="text-center py-10 text-amber-500 animate-pulse">
              Loading real-time seat availability...
            </div>
        ) : (
            <>
              {/* Screen */}
              <div className="flex justify-center mb-8">
                <div className="w-full max-w-2xl border-2 border-amber-600 rounded-full py-2 px-4 text-center">
                  <p className="text-gray-400 text-sm">SCREEN</p>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="flex justify-center">
                <div className="inline-block">
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SEATS_PER_ROW}, 1fr)` }}>
                    {seats.map((seat) => (
                        <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat.id, seat.isAvailable)}
                            className={`
                        w-8 h-8 rounded transition-all text-xs font-bold
                        ${!seat.isAvailable ? 'bg-gray-600 cursor-not-allowed text-gray-400 opacity-50' : ''}
                        ${seat.isAvailable && !selectedSeats.includes(seat.id) ? 'bg-gray-600 hover:bg-gray-500 text-white cursor-pointer' : ''}
                        ${selectedSeats.includes(seat.id) ? 'bg-amber-600 text-white hover:bg-amber-700 cursor-pointer shadow-lg' : ''}
                      `}
                            disabled={!seat.isAvailable}
                        >
                          {seat.number}
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span className="text-gray-300 text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-600 rounded"></div>
                  <span className="text-gray-300 text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded opacity-50"></div>
                  <span className="text-gray-300 text-sm">Occupied</span>
                </div>
              </div>

              {/* Summary */}
              {selectedSeats.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4 mt-6 text-center dark:bg-gray-800">
                    <p className="text-white">
                      <span className="font-bold">{selectedSeats.length}</span> seat
                      {selectedSeats.length > 1 ? 's' : ''} selected
                    </p>
                    <p className="text-amber-600 font-bold text-lg">
                      ₱{selectedSeats.length * pricePerSeat}
                    </p>
                  </div>
              )}
            </>
        )}
      </div>
  );
}

export default SeatMap;