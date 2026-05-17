import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function DELETE(request, { params }) {
    try {
        const { env } = getCloudflareContext();
        const db = env.DB;

        // Grab the ID from the URL (/api/movies/[id])
        const { id } = params;

        if (!db) {
            return Response.json({ error: "Database binding not found." }, { status: 500 });
        }

        // Delete the movie from the D1 database
        const info = await db.prepare("DELETE FROM movies WHERE id = ?").bind(id).run();

        if (info.success) {
            return Response.json({ success: true, message: "Movie deleted" }, { status: 200 });
        } else {
            return Response.json({ error: "Failed to delete movie from database" }, { status: 400 });
        }
    } catch (error) {
        console.error("Database Error:", error);
        return Response.json({ error: "Failed to delete movie" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { env } = getCloudflareContext();
        const db = env.DB;
        const { id } = params;

        // Get the updated movie data from the request body
        const data = await request.json();

        if (!db) {
            return Response.json({ error: "Database binding not found." }, { status: 500 });
        }

        // Destructure the data
        const { title, genre, rating, duration, status, synopsis, poster } = data;

        // Update the movie in the D1 database
        const info = await db.prepare(
            `UPDATE movies 
             SET title = ?, genre = ?, rating = ?, duration = ?, status = ?, synopsis = ?, poster = ?
             WHERE id = ?`
        ).bind(title, genre, rating, duration, status, synopsis, poster, id).run();

        if (info.success) {
            return Response.json({ success: true, message: "Movie updated" }, { status: 200 });
        } else {
            return Response.json({ error: "Failed to update movie in database" }, { status: 400 });
        }
    } catch (error) {
        console.error("Database Error:", error);
        return Response.json({ error: "Failed to update movie" }, { status: 500 });
    }
}