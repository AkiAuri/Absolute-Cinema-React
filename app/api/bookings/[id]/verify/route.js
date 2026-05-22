import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request, props) {
    try {
        // 1. AWAIT the params object (Required in Next.js 15+)
        const params = await props.params;
        const id = params.id;

        const { env } = getCloudflareContext();
        const db = env.DB;

        // 2. Check if the booking exists and is 'confirmed'
        const checkQuery = `SELECT status FROM bookings WHERE id = ?`;
        const booking = await db.prepare(checkQuery).bind(id).first();

        if (!booking) {
            return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 404 });
        }

        if (booking.status === 'used') {
            return NextResponse.json({ error: 'This ticket has already been used!' }, { status: 400 });
        }

        if (booking.status === 'cancelled') {
            return NextResponse.json({ error: 'This ticket was cancelled.' }, { status: 400 });
        }

        // 3. Update status to 'used'
        const updateQuery = `UPDATE bookings SET status = 'used' WHERE id = ?`;
        await db.prepare(updateQuery).bind(id).run();

        return NextResponse.json({ message: 'Ticket verified successfully!' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}