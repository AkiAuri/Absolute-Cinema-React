import { getCloudflareContext } from "@opennextjs/cloudflare";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        const { env } = getCloudflareContext();
        const db = env.DB;

        // 1. Check if email is already registered
        const existing = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
        if (existing) {
            return Response.json({ error: "Email is already registered." }, { status: 400 });
        }

        // 2. Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into the D1 Database (Default role is 'customer' per schema)
        await db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
            .bind(name, email, hashedPassword)
            .run();

        return Response.json({ success: true, message: "User created" }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return Response.json({ error: "Failed to create user" }, { status: 500 });
    }
}