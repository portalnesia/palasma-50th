# PALASMA 50th Anniversary — Website Undangan Digital

Selamat datang di repositori **website undangan digital HUT ke-50 PALASMA** — "Setengah Abad PALASMA: Reuni, Nostalgia, dan Perayaan".

Website ini adalah landing page statik untuk acara Reuni Akbar PALASMA yang akan diselenggarakan pada **29–30 Agustus 2026** di **Aranka Tempasan**. Dibangun dengan Astro + Tailwind CSS + GSAP, dirancang mobile-first dan ramah untuk alumni dari berbagai generasi.

## Tech Stack

| Layer         | Teknologi                                    |
| ------------- | -------------------------------------------- |
| **Framework** | [Astro](https://astro.build) (static output) |
| **CSS**       | [Tailwind CSS v4](https://tailwindcss.com)   |
| **Animasi**   | [GSAP](https://gsap.com) + ScrollTrigger     |
| **Fonts**     | Inter, Nunito, Open Sans (Google Fonts)      |

## Fitur Utama (Rencana)

- **Splash Screen** — halaman pembuka dengan countdown dan tombol "Buka Undangan"
- **Kata Sambutan** — sambutan dari panitia
- **Detail Acara & Google Maps** — informasi lokasi dan peta interaktif
- **Twibbon Generator** — buat twibbon langsung di browser (Croppie.js)
- **RSVP Interaktif** — konfirmasi kehadiran dua arah (Hadir/Absen)
- **Galeri Foto Nostalgia** — foto ekspedisi PALASMA lintas dekade
- **Ucapan & Doa** — kirim ucapan untuk PALASMA (Supabase)

## Cara Menjalankan

**Prasyarat:** Bun v1.3.14

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Astro check
bunx --bun astro check

# Format (write)
bun run format

# Format (check)
bun run format:check

# Unit testing
bun run test

# e2e testing
bun run test:e2e

# Build production
bun run build

# Preview production build
bun run preview
```

## Struktur Proyek

```
src/
  components/      # Komponen Astro
  config/          # Konfigurasi terpusat (teks, link, aset, kontak)
  layouts/         # Layout halaman
  pages/           # Routing halaman
  styles/          # Global CSS / Tailwind theme
  utils/           # Utility functions (GSAP, helpers)
public/
  assets/
    images/        # Gambar statis (logo, foto, galeri)
    audio/         # Audio latar
    fonts/         # Font lokal (jika diperlukan)
```

## Konfigurasi

Semua konten dapat diubah melalui file di `src/config/`:

| File          | Isi                                                    |
| ------------- | ------------------------------------------------------ |
| `site.ts`     | Info acara (tanggal, waktu, lokasi, Google Maps)       |
| `content.ts`  | Semua teks (splash, hero, sambutan, modal, footer)     |
| `links.ts`    | Link eksternal (Google Form, WA, Google Drive, medsos) |
| `assets.ts`   | Path gambar dan aset                                   |
| `contacts.ts` | Kontak panitia                                         |

## Status Pengembangan

🚧 Proyek dalam tahap pengembangan awal. Lihat [Issue Tracker](https://github.com/portalnesia/palasma-50th/issues) untuk progress.

## Lisensi

Hak cipta © 2026 PALASMA.
