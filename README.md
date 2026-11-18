# Alat Motion Control, Lagu & Edit Gambar Ajaib by Sofyan (Vercel + Blob Ready)

Paket proyek lengkap siap deploy ke **Vercel** agar bisa diakses **publik dari semua HP & laptop** tanpa kendala CORS, lengkap dengan upload media langsung hingga **100 MB** lewat **Vercel Blob** untuk **Emix AI** dan **Kie AI**.

## Struktur File
- `index.html` — Antarmuka 3-in-1 (Motion Control Kling 3.0/2.6, Lagu & Cover Suno V6–V4, Edit Gambar Seedream 5.0 Pro/Flash/Lite). Otomatis mendeteksi `/api/proxy` & `/api/blob-upload` saat online di Vercel.
- `api/proxy.js` — Serverless proxy aman (allowlist `api.kie.ai`, `kieai.redpandaai.co`, `api.emix.ai`) agar semua pengunjung bisa memakai API key masing-masing tanpa error CORS browser.
- `api/blob-upload.js` — Client-direct upload ke **Vercel Blob** (`@vercel/blob/client`) yang menembus batas 4,5 MB serverless function (mendukung video 100 MB, audio 50 MB, gambar 10 MB).
- `api/blob-cleanup.js` — Pembersihan otomatis harian via Vercel Cron untuk file sementara > 24 jam.
- `package.json` & `vercel.json` — Konfigurasi dependensi dan timeout 60 detik.

## Cara Deploy ke Vercel (3 Langkah)
1. Ekstrak file ZIP ini lalu unggah ke repository GitHub baru (atau jalankan `npx vercel` dari folder ini).
2. Di dashboard **Vercel**, klik **Add New → Project** → pilih repository tadi → klik **Deploy**.
3. Masuk ke menu **Storage** di proyek Vercel kamu → klik **Create Database → Blob** → pilih **Public** → sambungkan ke proyek (Vercel otomatis menambahkan `BLOB_READ_WRITE_TOKEN`) → lakukan **Redeploy** sekali. Selesai!
