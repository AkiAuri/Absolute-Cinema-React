import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

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
        const movieId = searchParams.get('movieId');
        const date = searchParams.get('date');

        // Base query: join movies to get the title for the frontend
        let query = `
      SELECT s.*, m.title as movieTitle 
      FROM showtimes s
      JOIN movies m ON s.movieId = m.id
      WHERE 1=1
    `;
        let params = [];

        // Filter by specific Movie ID
        if (movieId) {
            query += ` AND s.movieId = ?`;
            params.push(movieId);
        }

        // Filter by specific Date (Extracts the YYYY-MM-DD part from the SQL DATETIME string)
        if (date) {
            query += ` AND date(s.start_time) = ?`;
            params.push(date);
        }

        // Sort by time so early showings appear first
        query += ` ORDER BY s.start_time ASC`;

        const result = await db.prepare(query).bind(...params).all();

        return NextResponse.json(result.results || result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
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
            parseInt(movieId, 10),     // Movie ID is an INTEGER in schema
            String(theaterId),         // <--- FIX: Ensure Theater ID remains TEXT to match schema!
            start_time,                // Start time is DATETIME (String)
            parseInt(pricePerSeat, 10) // Price is an INTEGER in schema
        ).run();

        return Response.json({ success: true, message: "Showtime scheduled successfully" }, { status: 201 });

    } catch (error) {
        console.error("POST Showtime Error:", error);
        return Response.json({ error: "Failed to schedule showtimes: " + error.message }, { status: 500 });
    }
}