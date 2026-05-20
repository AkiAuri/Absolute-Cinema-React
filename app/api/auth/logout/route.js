import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token"); // Destroy the session cookie
    return Response.json({ success: true });
}