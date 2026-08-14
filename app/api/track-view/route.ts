import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity/client';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const id = 'viewStats';
    const today = new Date().toISOString().slice(0, 10);

    await writeClient.createIfNotExists({
      _id: id,
      _type: 'viewStats',
      total: 0,
      daily: [],
    });

    const doc = await writeClient.fetch<{ daily?: { _key: string; date: string; count: number }[] }>(
      `*[_id == $id][0]{daily}`,
      { id }
    );
    const daily = doc?.daily || [];
    const existing = daily.find((d) => d.date === today);

    let patch = writeClient.patch(id).inc({ total: 1 });

    if (existing) {
      patch = patch.inc({ [`daily[_key=="${existing._key}"].count`]: 1 });
    } else {
      patch = patch.setIfMissing({ daily: [] }).append('daily', [
        { _key: today, date: today, count: 1 },
      ]);
    }

    await patch.commit();

    const refreshed = await writeClient.fetch<{ daily?: { date: string }[] }>(
      `*[_id == $id][0]{daily}`,
      { id }
    );
    const list = refreshed?.daily || [];
    if (list.length > 30) {
      const excess = list.length - 30;
      await writeClient.patch(id).unset([`daily[0:${excess}]`]).commit();
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('track-view error', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
