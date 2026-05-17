export const runtime = 'edge';

export async function POST(request) {
    try {
        const { tmdbId } = await request.json();

        // Access the hidden secret key securely on the server
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

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
        const db = process.env.DB;
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

        // 4. Return the formatted movie so the React frontend can update immediately
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