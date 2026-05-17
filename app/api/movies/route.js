export async function GET() {
    try {
        // Access the D1 Database binding configured in your wrangler.jsonc
        const db = process.env.DB;

        // Fetch all movies from the new normalized table
        const { results } = await db.prepare("SELECT * FROM movies").all();

        return Response.json(results, { status: 200 });
    } catch (error) {
        console.error("Database Error:", error);
        return Response.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}