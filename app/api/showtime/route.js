import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Disable edge caching to ensure live schedule changes reflect instantly
export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

// Security helper to verify admin status
async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role === 'admin';
    } catch {
        return false;
    }
}

// 1. GET /api/showtimes (Public) - Combines data from showtimes, movies, and theaters
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get("movieId");

        const { env } = getCloudflareContext();
        const db = env.DB;

        if (!db) {
            return Response.json({ error: "Database binding not found." }, { status: 500 });
        }

        // Using SQL JOINs to gather all necessary data in a single optimized query
        let query = `
            SELECT 
                s.id, 
                s.movieId, 
                s.theaterId, 
                s.start_time, 
                s.pricePerSeat,
                m.title AS movieTitle,
                m.poster AS moviePoster,
                t.capacity AS theaterCapacity
            FROM showtimes s
            JOIN movies m ON s.movieId = m.id
            JOIN theaters t ON s.theaterId = t.id
        `;

        let stmt;
        if (movieId) {
            // Filter by specific movie when requested on the schedule page
            query += " WHERE s.movieId = ? ORDER BY s.start_time ASC";
            stmt = db.prepare(query).bind(parseInt(movieId, 10));
        } else {
            query += " ORDER BY s.start_time ASC";
            stmt = db.prepare(query);
        }

        const { results } = await stmt.all();
        return Response.json(results, { status: 200 });

    } catch (error) {
        console.error("GET Showtimes Error:", error);
        return Response.json({ error: "Failed to fetch showtimes: " + error.message }, { status: 500 });
    }
}

// 2. POST /api/showtimes (Admin Only) - Creates a new movie session schedule
export async function POST(request) {
    try {
        if (!(await verifyAdmin())) {
            return Response.json({ error: "Unauthorized. Admin panel access required." }, { status: 403 });
        }

        const { movieId, theaterId, start_time, pricePerSeat } = await request.json();

        if (!movieId || !theaterId || !start_time || !pricePerSeat) {
            return Response.json({ error: "Missing required booking details fields." }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = env.DB;

        await db.prepare(`
            INSERT INTO showtimes (movieId, theaterId, start_time, pricePerSeat)
            VALUES (?, ?, ?, ?)
        `).bind(
            parseInt(movieId, 10),
            parseInt(theaterId, 10), // <--- THE FIX: Force the dropdown string into an Integer!
            start_time,
            parseInt(pricePerSeat, 10)
        ).run();

        return Response.json({ success: true, message: "Showtime scheduled successfully" }, { status: 201 });

    } catch (error) {
        console.error("POST Showtime Error:", error);
        return Response.json({ error: "Failed to schedule showtime: " + error.message }, { status: 500 });
    }
}