export async function POST(request) {
    try {
        const { tmdbId } = await request.json();

        // Get env - try multiple paths for OpenNext compatibility
        let env = request.cf?.env || process.env;

        const TMDB_API_KEY = env.TMDB_API_KEY;

        if (!TMDB_API_KEY) {
            return Response.json({ error: "TMDB API key is missing on the server." }, { status: 500 });
        }

        // 1. Fetch real movie data from TMDB
        const tmdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
        if (!tmdbResponse.ok) {
            throw new Error("Movie not found on TMDB. Check the ID.");
        }
        const movieData = await tmdbResponse.json();

        // 2. Format the data for our Cloudflare D1 database
        const posterUrl = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
        const genres = movieData.genres.map(g => g.name).join(', ');

        // 3. Insert the new movie into D1
        // Try multiple ways to access the DB binding
        let db = env.DB;

        if (!db) {
            // If env.DB doesn't work, try request.cf.env.DB directly
            db = request.cf?.env?.DB;
        }

        if (!db) {
            console.error("Available env keys:", Object.keys(env || {}));
            console.error("Request CF:", request.cf);
            return Response.json({
                error: "Database binding not found. Check wrangler.jsonc configuration.",
                debug: {
                    hasEnv: !!env,
                    hasCF: !!request.cf,
                    envKeys: Object.keys(env || {})
                }
            }, { status: 500 });
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

        const newMovie = {
            id: movieData.id,
            title: movieData.title,
            genre: genres,
            duration: movieData.runtime,
            poster: posterUrl,
            status: 'now-showing',
            synopsis: movieData.overview
        };

        return Response.json({ success: true, movie: newMovie }, { status: 200 });

    } catch (error) {
        console.error("TMDB Integration Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}