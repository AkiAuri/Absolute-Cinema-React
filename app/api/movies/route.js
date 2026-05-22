import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request) {
    try {
        // 1. Get the Cloudflare context and D1 Database binding
        const { env } = getCloudflareContext();
        const db = env.DB;

        if (!db) {
            return NextResponse.json({ error: "Database binding not found." }, { status: 500 });
        }

        // 2. Extract query parameters from the URL
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

        // 3. Execute the query using the Cloudflare D1 binding
        const result = await db.prepare(query).bind(...params).all();

        return NextResponse.json(result.results || result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}