import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN belum terhubung di Vercel Project Storage.' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'video/mp4',
            'video/quicktime',
            'audio/mpeg',
            'audio/wav',
            'audio/mp4',
            'audio/x-m4a'
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ uploadedBy: 'public-user' })
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Vercel Blob upload selesai:', blob.url);
      }
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error?.message || 'Gagal membuat token upload Vercel Blob.' });
  }
}
