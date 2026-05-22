import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

// UPDATE a showtime
export async function PUT(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await request.json();

        // Extract editable fields
        const { start_time, pricePerSeat, theaterId } = body;

        const { env } = getCloudflareContext();
        const db = env.DB;

        const query = `
            UPDATE showtimes
            SET start_time = ?, pricePerSeat = ?, theaterId = ?
            WHERE id = ?
        `;

        await db.prepare(query).bind(start_time, pricePerSeat, theaterId, id).run();

        return NextResponse.json({ message: 'Showtime updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a showtime
export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const { env } = getCloudflareContext();
        const db = env.DB;

        // Check if there are existing bookings before deleting!
        const checkBookings = await db.prepare(`SELECT count(*) as count FROM bookings WHERE showtimeId = ?`).bind(id).first();
        if (checkBookings.count > 0) {
            return NextResponse.json({ error: 'Cannot delete showtime. Tickets have already been sold.' }, { status: 400 });
        }

        await db.prepare(`DELETE FROM showtimes WHERE id = ?`).bind(id).run();

        return NextResponse.json({ message: 'Showtime deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}