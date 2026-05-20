import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role === 'admin';
    } catch {
        return false;
    }
}

// GET /api/theaters (Admin Only) - Fetches cinema screen details
export async function GET() {
    try {
        if (!(await verifyAdmin())) {
            return Response.json({ error: "Unauthorized." }, { status: 403 });
        }

        const { env } = getCloudflareContext();
        const db = env.DB;

        const { results } = await db.prepare("SELECT * FROM theaters").all();
        return Response.json(results, { status: 200 });

    } catch (error) {
        console.error("GET Theaters Error:", error);
        return Response.json({ error: "Failed to fetch theaters: " + error.message }, { status: 500 });
    }
}