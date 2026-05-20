import { getCloudflareContext } from "@opennextjs/cloudflare";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

// Helper function to ensure only admins can trigger this code
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

export async function GET() {
    if (!(await verifyAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

    const { env } = getCloudflareContext();
    const { results } = await env.DB.prepare("SELECT id, name, email, role FROM users").all();
    return Response.json(results);
}

export async function PUT(request) {
    if (!(await verifyAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

    const { userId, newRole } = await request.json();
    const { env } = getCloudflareContext();

    await env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(newRole, userId).run();
    return Response.json({ success: true, message: "User role updated" });
}