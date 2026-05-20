import { getCloudflareContext } from "@opennextjs/cloudflare";

// Add this line at the top to stop Cloudflare Pages from caching the API response!
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { env } = getCloudflareContext();
        const db = env.DB;

        if (!db) {
            return Response.json({ error: "Database binding not found." }, { status: 500 });
        }

        const { results } = await db.prepare("SELECT * FROM movies").all();

        return Response.json(results, { status: 200 });
    } catch (error) {
        console.error("Database Error:", error);
        return Response.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}