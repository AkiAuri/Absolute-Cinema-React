import React, { useState, useEffect } from 'react';

function SeatMap({ showtimeId, onSeatsChange, selectedSeats = [], pricePerSeat = 12 }) {
  const [seats, setSeats] = useState([]);
  const [layout, setLayout] = useState({ rows: 10, cols: 12, config: {} });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeatsAndGenerateGrid = async () => {
      if (!showtimeId) return;
      setIsLoading(true);

      try {
        const response = await fetch(`/api/showtimes/${showtimeId}/seats`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        const booked = data.bookedSeats || [];
        const config = data.layout.config || {};

        setLayout(data.layout);

        const newSeats = [];
        for (let i = 0; i < data.layout.rows; i++) {
          const rowLetter = String.fromCharCode(65 + i);

          for (let j = 0; j < data.layout.cols; j++) {
            const seatNumber = j + 1;
            const seatId = `${rowLetter}${seatNumber}`;

            // Check config for special seats
            const isMissing = config.missingSeats?.includes(seatId);
            const isWheelchair = config.wheelchair?.includes(seatId);

            newSeats.push({
              id: seatId,
              row: rowLetter,
              number: seatNumber,
              isAvailable: !booked.includes(seatId) && !isMissing,
              isMissing,
              isWheelchair,
              // Check if we need to add a gap (aisle) AFTER this seat
              addColGap: config.aisleColumns?.includes(seatNumber),
              addRowGap: config.aisleRows?.includes(rowLetter) && j === 0 // only flag row gap once per row
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
  }, [showtimeId]);

  const handleSeatClick = (seat) => {
    if (!seat.isAvailable || seat.isMissing) return;

    const isCurrentlySelected = selectedSeats.includes(seat.id);
    let newSelectedSeats = isCurrentlySelected
        ? selectedSeats.filter((s) => s !== seat.id)
        : [...selectedSeats, seat.id];

    onSeatsChange(newSelectedSeats);
  };

  if (isLoading) return <div className="text-center py-10 text-amber-500 animate-pulse">Loading real-time seat availability...</div>;

  return (
      <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900 overflow-x-auto">
        {/* Screen */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-2xl border-t-4 border-amber-600 rounded-t-[50%] py-2 text-center shadow-[0_-10px_20px_rgba(217,119,6,0.1)]">
            <p className="text-gray-400 text-sm tracking-widest mt-2">SCREEN</p>
          </div>
        </div>

        {/* Seats Container */}
        <div className="flex flex-col items-center gap-2 min-w-max">
          {/* We map through rows first to handle row-level gaps */}
          {Array.from({ length: layout.rows }).map((_, rowIndex) => {
            const rowLetter = String.fromCharCode(65 + rowIndex);
            const rowSeats = seats.filter(s => s.row === rowLetter);

            return (
                <React.Fragment key={rowLetter}>
                  {/* Add vertical row gap if needed */}
                  {rowSeats[0]?.addRowGap && <div className="h-6 w-full"></div>}

                  <div className="flex gap-2 items-center">
                    {/* Row Label Left */}
                    <span className="w-6 text-center text-gray-500 font-bold mr-2">{rowLetter}</span>

                    {rowSeats.map((seat) => (
                        <React.Fragment key={seat.id}>
                          {seat.isMissing ? (
                              <div className="w-8 h-8 pointer-events-none"></div> // Empty space for missing seats
                          ) : (
                              <button
                                  onClick={() => handleSeatClick(seat)}
                                  disabled={!seat.isAvailable}
                                  title={seat.isWheelchair ? 'Wheelchair Accessible' : seat.id}
                                  className={`
                          w-8 h-8 rounded text-xs font-bold transition-all relative flex items-center justify-center
                          ${!seat.isAvailable ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50' : 'cursor-pointer'}
                          ${seat.isAvailable && !selectedSeats.includes(seat.id) ? 'bg-gray-600 hover:bg-gray-500 text-white' : ''}
                          ${selectedSeats.includes(seat.id) ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(217,119,6,0.5)]' : ''}
                          ${seat.isWheelchair ? 'border-2 border-blue-400' : ''}
                        `}
                              >
                                {seat.isWheelchair ? '♿' : seat.number}
                              </button>
                          )}
                          {/* Add horizontal column gap if needed */}
                          {seat.addColGap && <div className="w-6"></div>}
                        </React.Fragment>
                    ))}

                    {/* Row Label Right */}
                    <span className="w-6 text-center text-gray-500 font-bold ml-2">{rowLetter}</span>
                  </div>
                </React.Fragment>
            );
          })}
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
      </div>
  );
}

export default SeatMap;