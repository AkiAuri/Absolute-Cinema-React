import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

export async function POST(request) {
    try {
        // 1. Verify user authentication
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return Response.json({ error: "Authentication required to book tickets." }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);

        // 2. Parse request body
        const { showtimeId, seats, totalPrice, paymentMethod } = await request.json();

        if (!showtimeId || !seats || !seats.length || !totalPrice || !paymentMethod) {
            return Response.json({ error: "Missing required booking details." }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = env.DB;

        // 3. Generate unique Booking ID and random placeholder QR data string
        const bookingId = `BKG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const qrCodeData = `VALIDATE-${bookingId}`;

        // 4. Use a secure database transaction to prevent double bookings
        // If seat verification logic succeeds, execute everything sequentially
        const queries = [
            // Insert core booking metadata including the payment selection
            db.prepare(`
                INSERT INTO bookings (id, userId, showtimeId, totalPrice, paymentMethod, qrCode)
                VALUES (?, ?, ?, ?, ?, ?)
            `).bind(bookingId, payload.id, parseInt(showtimeId, 10), parseInt(totalPrice, 10), paymentMethod, qrCodeData)
        ];

        // Add an insert statement for every seat selected
        seats.forEach(seatId => {
            queries.push(
                db.prepare("INSERT INTO booking_seats (bookingId, seatId) VALUES (?, ?)").bind(bookingId, seatId)
            );
        });

        // Run the batch statement transaction on Cloudflare
        await db.batch(queries);

        return Response.json({ success: true, bookingId, message: "Booking confirmed successfully!" }, { status: 201 });

    } catch (error) {
        console.error("Booking Error:", error);
        return Response.json({ error: "Failed to complete transaction: " + error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role === 'customer') return Response.json({ error: "Forbidden" }, { status: 403 });

        const { env } = getCloudflareContext();

        // Massive JOIN updated to include the seats!
        const { results } = await env.DB.prepare(`
            SELECT
                b.id,
                b.totalPrice,
                b.paymentMethod,
                b.status,
                b.bookingDate,
                u.name AS customerName,
                m.title AS movieTitle,
                s.start_time,
                t.id AS theater,
                GROUP_CONCAT(bs.seatId) as seats
            FROM bookings b
                     LEFT JOIN users u ON b.userId = u.id
                     JOIN showtimes s ON b.showtimeId = s.id
                     JOIN movies m ON s.movieId = m.id
                     JOIN theaters t ON s.theaterId = t.id
                     LEFT JOIN booking_seats bs ON bs.bookingId = b.id
            GROUP BY b.id
            ORDER BY b.bookingDate DESC
        `).all();

        // Safety check: ensure 'seats' is always at least an empty string
        // so .split(',') never crashes the frontend again, even if a booking has 0 seats.
        const safeResults = results.map(row => ({
            ...row,
            seats: row.seats || ""
        }));

        return Response.json(safeResults, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}