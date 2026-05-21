import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        const { id: showtimeId } = await params;

        if (!showtimeId) {
            return Response.json({ error: "Showtime ID is required" }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = env.DB;

        // Fetch all seat IDs tied to a confirmed booking for this specific showtime
        const query = `
            SELECT bs.seatId 
            FROM booking_seats bs
            JOIN bookings b ON bs.bookingId = b.id
            WHERE b.showtimeId = ? AND b.status = 'confirmed'
        `;

        const { results } = await db.prepare(query).bind(parseInt(showtimeId, 10)).all();

        // Convert the SQL result objects into a simple array of strings: ['A1', 'A2', 'B5', ...]
        const bookedSeats = results.map(row => row.seatId);

        return Response.json(bookedSeats, { status: 200 });

    } catch (error) {
        console.error("GET Booked Seats Error:", error);
        return Response.json({ error: "Failed to fetch booked seats" }, { status: 500 });
    }
}