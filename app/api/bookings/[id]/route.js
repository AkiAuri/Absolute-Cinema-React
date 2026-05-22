import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const { env } = getCloudflareContext();
        const db = env.DB;

        // Fetch the booking, joined with showtime and user info
        const query = `
      SELECT b.*, s.start_time, s.theaterId, m.title as movieTitle, u.name as userName
      FROM bookings b
      JOIN showtimes s ON b.showtimeId = s.id
      JOIN movies m ON s.movieId = m.id
      JOIN users u ON b.userId = u.id
      WHERE b.id = ?
    `;

        // Pseudo-code for DB execution
        const booking = await db.prepare(query).bind(id).first();

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Fetch the seats for this booking
        const seatsQuery = `SELECT seatId FROM booking_seats WHERE bookingId = ?`;
        const seatsResult = await db.prepare(seatsQuery).bind(id).all();
        const seats = seatsResult.results.map(row => row.seatId);

        return NextResponse.json({ ...booking, seats }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}