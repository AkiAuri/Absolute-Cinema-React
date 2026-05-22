import { getCloudflareContext } from "@opennextjs/cloudflare";

// Force edge/dynamic so it always runs live
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // 1. Secure the endpoint using an Authorization header (Vercel/Next standard)
        const authHeader = request.headers.get('authorization');

        // Set CRON_SECRET in your Cloudflare environment variables
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return Response.json({ error: 'Unauthorized CRON request' }, { status: 401 });
        }

        const { env } = getCloudflareContext();

        // 2. Delete all locks where the expiration time has passed
        const result = await env.DB.prepare(`
            DELETE FROM locked_seats 
            WHERE locked_until <= CURRENT_TIMESTAMP
        `).run();

        return Response.json({
            success: true,
            message: "Pruning complete.",
            changes: result.meta?.changes || 0
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return Response.json({ error: "Failed to prune seats" }, { status: 500 });
    }
}