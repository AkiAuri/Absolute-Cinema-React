import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

        // 1. Verify the secure token
        const { payload } = await jwtVerify(token, JWT_SECRET);

        const { env } = getCloudflareContext();
        const db = env.DB;

        // 2. Fetch fresh user data
        const user = await db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").bind(payload.id).first();
        if (!user) return Response.json({ error: "User not found" }, { status: 404 });

        // 3. Optional Bonus: Fetch all of this user's past bookings via JOINs!
        const { results: bookings } = await db.prepare(`
            SELECT b.*, s.start_time, m.title, m.poster 
            FROM bookings b
            JOIN showtimes s ON b.showtimeId = s.id
            JOIN movies m ON s.movieId = m.id
            WHERE b.userId = ?
            ORDER BY b.bookingDate DESC
        `).bind(user.id).all();

        user.bookings = bookings || [];

        return Response.json({ user }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Invalid session" }, { status: 401 });
    }
}