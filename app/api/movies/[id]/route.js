import { getCloudflareContext } from "@opennextjs/cloudflare";

// 1. Force Cloudflare NOT to cache this dynamic route
export const dynamic = 'force-dynamic';

// Handle updating a movie (PUT)
export async function PUT(request, { params }) {
    try {
        // Next.js 15+ safely unwraps params, and we force the ID to an Integer for D1
        const resolvedParams = await params;
        const movieId = parseInt(resolvedParams.id, 10);

        const body = await request.json();

        const { env } = getCloudflareContext();
        const db = env.DB;

        if (!db) {
            return Response.json({ error: "Database binding not found." }, { status: 500 });
        }

        // Run the UPDATE query, making sure duration is also a strict number
        await db.prepare(`
            UPDATE movies 
            SET title = ?, genre = ?, rating = ?, duration = ?, status = ?, synopsis = ?
            WHERE id = ?
        `).bind(
            body.title,
            body.genre,
            body.rating,
            parseInt(body.duration, 10),
            body.status,
            body.synopsis,
            movieId
        ).run();

        return Response.json({ success: true, message: "Movie updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("PUT Error:", error);
        return Response.json({ error: "Failed to update movie: " + error.message }, { status: 500 });
    }
}

// Handle deleting a movie (DELETE)
export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const movieId = parseInt(resolvedParams.id, 10);

        const { env } = getCloudflareContext();
        const db = env.DB;

        if (!db) {
            return Response.json({ error: "Database binding not found." }, { status: 500 });
        }

        await db.prepare(`DELETE FROM movies WHERE id = ?`).bind(movieId).run();

        return Response.json({ success: true, message: "Movie deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("DELETE Error:", error);
        return Response.json({ error: "Failed to delete movie: " + error.message }, { status: 500 });
    }
}