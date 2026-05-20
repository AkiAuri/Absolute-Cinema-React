import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

export async function POST(request, { params }) {
    try {
        // 1. Verify the user is logged in
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const { payload } = await jwtVerify(token, JWT_SECRET);

        const resolvedParams = await params;
        const bookingId = resolvedParams.id; // String ID (e.g., 'BKG-12345')

        const { env } = getCloudflareContext();
        const db = env.DB;

        // 2. Fetch the booking to make sure it belongs to the user (unless they are an admin)
        const booking = await db.prepare("SELECT * FROM bookings WHERE id = ?").bind(bookingId).first();

        if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });
        if (booking.userId !== payload.id && payload.role !== 'admin') {
            return Response.json({ error: "You can only refund your own tickets." }, { status: 403 });
        }
        if (booking.status === 'cancelled' || booking.status === 'refunded') {
            return Response.json({ error: "Ticket is already cancelled." }, { status: 400 });
        }

        // 3. The Transaction: Mark booking as cancelled AND delete the reserved seats
        await db.batch([
            db.prepare("UPDATE bookings SET status = 'refunded' WHERE id = ?").bind(bookingId),
            // By deleting the seats from the booking_seats table, they immediately become
            // available on the SeatMap for other customers!
            db.prepare("DELETE FROM booking_seats WHERE bookingId = ?").bind(bookingId)
        ]);

        return Response.json({ success: true, message: "Refund processed successfully. Seats have been released." });

    } catch (error) {
        console.error("Refund Error:", error);
        return Response.json({ error: "Failed to process refund." }, { status: 500 });
    }
}