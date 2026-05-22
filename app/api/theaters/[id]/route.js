import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function PUT(request, { params }) {
    try {
        const resolvedParams = await params;
        const oldId = resolvedParams.id;
        const { id: newId, capacity } = await request.json();

        const { env } = getCloudflareContext();
        const db = env.DB;

        const query = `UPDATE theaters SET id = ?, capacity = ? WHERE id = ?`;
        await db.prepare(query).bind(newId, capacity, oldId).run();

        return NextResponse.json({ message: 'Theater updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const { env } = getCloudflareContext();
        const db = env.DB;

        // Prevent deleting a theater that has scheduled showtimes
        const check = await db.prepare(`SELECT count(*) as count FROM showtimes WHERE theaterId = ?`).bind(id).first();
        if (check.count > 0) {
            return NextResponse.json({ error: 'Cannot delete theater. It has active showtimes.' }, { status: 400 });
        }

        await db.prepare(`DELETE FROM theaters WHERE id = ?`).bind(id).run();
        return NextResponse.json({ message: 'Theater deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}