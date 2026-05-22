import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Extract query parameters from the URL
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query = `SELECT * FROM movies`;
        let params = [];

        // If a status was provided in the URL (e.g., ?status=now-showing)
        if (status) {
            query += ` WHERE status = ?`;
            params.push(status);
        }

        query += ` ORDER BY id DESC`;

        // Execute the query (Adjust `db.prepare` to match your Cloudflare D1 setup)
        const result = await db.prepare(query).bind(...params).all();

        return NextResponse.json(result.results || result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ... Keep your existing POST function for adding movies below this