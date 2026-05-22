import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role === 'customer') return Response.json({ error: "Forbidden" }, { status: 403 });

        const { env } = getCloudflareContext();
        const db = env.DB;

        // Run 4 optimized queries concurrently for the Dashboard Stats
        const [revenueRes, ticketsRes, moviesRes, usersRes] = await db.batch([
            db.prepare("SELECT COALESCE(SUM(totalPrice), 0) as total FROM bookings WHERE status = 'confirmed'"),
            db.prepare("SELECT COUNT(*) as total FROM booking_seats"),
            db.prepare("SELECT COUNT(*) as total FROM movies WHERE status = 'now-showing'"),
            db.prepare("SELECT COUNT(*) as total FROM users") // <-- NEW QUERY ADDED HERE
        ]);

        return Response.json({
            totalRevenue: revenueRes.results[0].total,
            ticketsSold: ticketsRes.results[0].total,
            activeMovies: moviesRes.results[0].total,
            totalUsers: usersRes.results[0].total // <-- SEND TO FRONTEND
        }, { status: 200 });

    } catch (error) {
        return Response.json({ error: "Failed to fetch statistics" }, { status: 500 });
    }
}