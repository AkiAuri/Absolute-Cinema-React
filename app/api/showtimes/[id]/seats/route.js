import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const showtimeId = params.id;

        // 1. Get the booked and locked seats
        const bookedQuery = `
      SELECT bs.seatId FROM booking_seats bs 
      JOIN bookings b ON bs.bookingId = b.id 
      WHERE b.showtimeId = ? AND b.status IN ('confirmed', 'used')
      UNION
      SELECT seatId FROM locked_seats 
      WHERE showtimeId = ? AND locked_until > CURRENT_TIMESTAMP
    `;
        const bookedResult = await db.prepare(bookedQuery).bind(showtimeId, showtimeId).all();
        const bookedSeats = bookedResult.results.map(row => row.seatId);

        // 2. Get the theater layout for this showtime
        const layoutQuery = `
            SELECT t.rows, t.cols, t.layoutConfig
            FROM showtimes s
                     JOIN theaters t ON s.theaterId = t.id
            WHERE s.id = ?
        `;
        const layoutResult = await db.prepare(layoutQuery).bind(showtimeId).first();

        // Parse the JSON string from the database (fallback to empty object if null)
        const config = layoutResult.layoutConfig ? JSON.parse(layoutResult.layoutConfig) : {};

        return NextResponse.json({
            bookedSeats,
            layout: {
                rows: layoutResult.rows || 10,
                cols: layoutResult.cols || 12,
                config
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}