import { getCloudflareContext } from "@opennextjs/cloudflare";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// In production, set this in your Cloudflare Env Variables!
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-fallback-key");

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const { env } = getCloudflareContext();
        const db = env.DB;

        // 1. Find the user
        const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        if (!user) {
            return Response.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // 2. Verify the hashed password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return Response.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // 3. Create a secure JWT Token
        const token = await new SignJWT({ id: user.id, role: user.role })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h") // Token lasts for 24 hours
            .sign(JWT_SECRET);

        // 4. Set the token as an HTTP-Only Cookie (un-hackable via Client JS)
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        // 5. Send user data back (never send the password hash back!)
        delete user.password_hash;
        return Response.json({ success: true, user }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return Response.json({ error: "Failed to login" }, { status: 500 });
    }
}