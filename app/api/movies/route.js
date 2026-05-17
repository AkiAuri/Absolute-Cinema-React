import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
    try {
        // 1. Get the Cloudflare environment bindings safely
        const { env } = getCloudflareContext();

        // 2. Access your D1 Database binding
        const db = env.DB;

        if (!db) {
            return Response.json({ error: "Database binding not found." }, { status: 500 });
        }

        // Fetch all movies from the new normalized table
        const { results } = await db.prepare("SELECT * FROM movies").all();

        return Response.json(results, { status: 200 });
    } catch (error) {
        console.error("Database Error:", error);
        return Response.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}