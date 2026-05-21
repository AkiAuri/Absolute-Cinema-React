import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    try {
        const showtimeId = params.id;
        const { seats, userId } = await request.json();

        // 1. Clean up expired locks first (e.g., locks older than current time)
        await db.prepare(`DELETE FROM locked_seats WHERE locked_until <= CURRENT_TIMESTAMP`).run();

        // 2. Check if any of the requested seats are already booked OR currently locked
        for (const seat of seats) {
            // Check permanent bookings
            const isBooked = await db.prepare(`
                SELECT 1 FROM booking_seats bs
                                  JOIN bookings b ON bs.bookingId = b.id
                WHERE b.showtimeId = ? AND bs.seatId = ? AND b.status = 'confirmed'
            `).bind(showtimeId, seat).first();

            // Check active locks
            const isLocked = await db.prepare(`
                SELECT 1 FROM locked_seats
                WHERE showtimeId = ? AND seatId = ? AND locked_until > CURRENT_TIMESTAMP
            `).bind(showtimeId, seat).first();

            if (isBooked || isLocked) {
                return NextResponse.json({ error: `Seat ${seat} is no longer available.` }, { status: 409 });
            }
        }

        // 3. Lock the seats for 10 minutes
        // (SQLite CURRENT_TIMESTAMP is UTC, adding 10 minutes in SQLite logic)
        const insertQuery = `
            INSERT INTO locked_seats (showtimeId, seatId, locked_until, userId)
            VALUES (?, ?, datetime(CURRENT_TIMESTAMP, '+10 minutes'), ?)
        `;

        for (const seat of seats) {
            await db.prepare(insertQuery).bind(showtimeId, seat, userId).run();
        }

        return NextResponse.json({ message: 'Seats locked successfully for 10 minutes' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}