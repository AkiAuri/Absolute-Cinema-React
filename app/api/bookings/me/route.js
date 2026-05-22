import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const { env } = getCloudflareContext();

        // Fetch bookings specific to the logged-in user
        const { results } = await env.DB.prepare(`
            SELECT 
                b.id, b.totalPrice, b.status, b.qrCode, b.bookingDate,
                m.title AS movieTitle, m.poster,
                s.start_time,
                t.id AS theater,
                GROUP_CONCAT(bs.seatId) as seats
            FROM bookings b
            JOIN showtimes s ON b.showtimeId = s.id
            JOIN movies m ON s.movieId = m.id
            JOIN theaters t ON s.theaterId = t.id
            LEFT JOIN booking_seats bs ON bs.bookingId = b.id
            WHERE b.userId = ?
            GROUP BY b.id
            ORDER BY b.bookingDate DESC
        `).bind(payload.id).all();

        // Convert seats string "A1,A2" into an array ["A1", "A2"] for the frontend
        const formattedResults = results.map(booking => ({
            ...booking,
            seats: booking.seats ? booking.seats.split(',') : []
        }));

        return Response.json(formattedResults, { status: 200 });
    } catch (error) {
        console.error("Fetch User Bookings Error:", error);
        return Response.json({ error: "Failed to fetch your bookings" }, { status: 500 });
    }
}