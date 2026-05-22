import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request) {
    try {
        const { env } = getCloudflareContext();
        const db = env.DB;

        const { token, newPassword } = await request.json();

        // 1. Find user with this token and ensure it hasn't expired
        // (SQLite CURRENT_TIMESTAMP is UTC, so ensure your expiry logic matches)
        const checkQuery = `
      SELECT id FROM users 
      WHERE reset_token = ? AND reset_token_expiry > datetime('now')
    `;
        const user = await db.prepare(checkQuery).bind(token).first();

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
        }

        // 2. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update password and clear the token so it can't be reused
        const updateQuery = `
      UPDATE users 
      SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL 
      WHERE id = ?
    `;
        await db.prepare(updateQuery).bind(hashedPassword, user.id).run();

        return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}