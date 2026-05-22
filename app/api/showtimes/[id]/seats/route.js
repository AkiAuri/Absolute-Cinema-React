import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        // 1. Await the dynamic params (Next.js 15+)
        const resolvedParams = await params;
        const showtimeId = resolvedParams.id;

        // 2. Connect to Cloudflare DB
        const { env } = getCloudflareContext();
        const db = env.DB;

        if (!db) {
            return NextResponse.json({ error: "Database binding not found." }, { status: 500 });
        }

        // 3. Get the booked and locked seats
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

        // 4. Get the theater layout for this showtime
        const layoutQuery = `
            SELECT t.rows, t.cols, t.layoutConfig
            FROM showtimes s
                     JOIN theaters t ON s.theaterId = t.id
            WHERE s.id = ?
        `;
        const layoutResult = await db.prepare(layoutQuery).bind(showtimeId).first();

        // Safety check in case layoutResult is undefined
        const config = layoutResult?.layoutConfig ? JSON.parse(layoutResult.layoutConfig) : {};

        return NextResponse.json({
            bookedSeats,
            layout: {
                rows: layoutResult?.rows || 10,
                cols: layoutResult?.cols || 12,
                config
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}