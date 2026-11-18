import { list, del } from '@vercel/blob';

export default async function handler(req, res) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ ok: true, skipped: 'No BLOB_READ_WRITE_TOKEN' });
  }

  try {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    let cursor;
    let deletedCount = 0;

    do {
      const page = await list({ cursor, limit: 100 });
      const expired = page.blobs
        .filter((b) => new Date(b.uploadedAt).getTime() < cutoff)
        .map((b) => b.url);

      if (expired.length > 0) {
        await del(expired);
        deletedCount += expired.length;
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    return res.status(200).json({ ok: true, deletedCount });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || 'Cleanup gagal' });
  }
}
