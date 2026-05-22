import { NextResponse } from 'next/server';
// You might need to import a crypto library if not in a Node edge environment
// In Cloudflare Pages, crypto is globally available.

export async function POST(request) {
    try {
        const { email } = await request.json();

        // 1. Generate a secure random token
        const token = crypto.randomUUID();

        // 2. Set expiry (e.g., 1 hour from now)
        const expiry = new Date(Date.now() + 3600000).toISOString().replace('T', ' ').slice(0, 19);

        // 3. Update the user in the database
        const query = `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`;
        const result = await db.prepare(query).bind(token, expiry, email).run();

        if (result.meta.changes > 0) {
            // 4. In a real app, integrate Resend or Nodemailer here to email the link:
            const resetLink = `https://yourwebsite.com/reset-password?token=${token}`;
            console.log(`[MOCK EMAIL] Send to ${email}: Click here to reset your password: ${resetLink}`);
        }

        // Always return success even if email not found (security best practice to prevent email enumeration)
        return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}