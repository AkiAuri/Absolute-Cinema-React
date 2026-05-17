import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request) {
    try {
        const { env } = getCloudflareContext();
        const { tmdbId } = await request.json();

        const TMDB_API_KEY = env.TMDB_API_KEY; // ✅ use env, not process.env
        if (!TMDB_API_KEY) {
            return Response.json({ error: "TMDB API key is missing on the server." }, { status: 500 });
        }

        const tmdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
        if (!tmdbResponse.ok) throw new Error("Movie not found on TMDB. Check the ID.");
        const movieData = await tmdbResponse.json();

        const posterUrl = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
        const genres = movieData.genres.map(g => g.name).join(', ');

        const db = env.DB; // ✅ D1 binding here
        if (!db) {
            return Response.json({ error: "Database binding not found. Check your wrangler.jsonc binding name." }, { status: 500 });
        }

        await db.prepare(`
            INSERT INTO movies (id, title, genre, duration, poster, status, synopsis)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            movieData.id,
            movieData.title,
            genres,
            movieData.runtime,
            posterUrl,
            'now-showing',
            movieData.overview
        ).run();

        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("TMDB Integration Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}