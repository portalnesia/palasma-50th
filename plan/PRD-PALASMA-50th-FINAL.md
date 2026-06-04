# Product Requirements Document (PRD)
## Website Undangan HUT ke-50 PALASMA
### "Setengah Abad PALASMA: Reuni, Nostalgia, dan Perayaan"

---

**Dokumen Versi**: 1.0 (Final)
**Tanggal**: 4 Juni 2026
**Untuk**: Tim Developer

---

## Daftar Isi

1. Ringkasan Eksekutif
2. Persyaratan Non-Fungsional: UI/UX & Aksesibilitas
3. Struktur Konten Landing Page
4. Fitur Utama 1: RSVP Kondisional (Tanpa Database Internal)
5. Fitur Utama 2: Ucapan & Doa (Supabase)
6. Fitur Utama 3: Twibbon Generator (Croppie)
7. Arsitektur Teknis
8. Daftar Kebutuhan Aset Eksternal (Stakeholder Deliverables)
9. Kriteria Sukses

---

## 1. Ringkasan Eksekutif

### 1.1 Latar Belakang
PALASMA (Pecinta Alam SMAN 1 Mataram) genap berusia 50 tahun pada tahun 2026 — sebuah pencapaian **Golden Anniversary** yang patut dirayakan secara besar. Berdiri sejak tahun 1976, organisasi ini telah melewati setengah abad dengan ribuan anggota dari berbagai angkatan, mulai dari alumni senior era 70-an hingga anggota aktif saat ini.

### 1.2 Tujuan Produk
Membangun website undangan digital yang menjadi pusat informasi, interaksi, dan dokumentasi perayaan HUT ke-50 PALASMA. Website ini bukan sekadar undangan — melainkan wadah nostalgia lintas generasi yang memperkuat kembali ikatan emosional antar sesama PALASMA.

### 1.3 Target Audiens
- **Rentang Usia**: 17–50+ tahun
- **Segmentasi**:
  - Alumni senior (angkatan 70-an, 80-an, 90-an) — usia 40–60+ tahun
  - Alumni madya (angkatan 2000-an) — usia 30–40 tahun
  - Alumni muda (angkatan 2010-an) — usia 20–30 tahun
  - Anggota aktif (siswa SMA) — usia 15–18 tahun
- **Jumlah Target**: 500+ undangan

### 1.4 Esensi Produk
Website ini harus membangun tiga atmosfer sekaligus:
1. **Reuni Akbar** — menjembatani pertemuan lintas angkatan
2. **Penghormatan Sejarah** — merayakan warisan 50 tahun PALASMA
3. **Nostalgia** — membangkitkan kenangan indah melalui foto, video, dan cerita

---

## 2. Persyaratan Non-Fungsional: UI/UX & Aksesibilitas

### 2.1 Prinsip Aksesibilitas (Alumni Senior Friendly)
Mengingat sebagian audiens berusia 50+ tahun, website harus mematuhi prinsip aksesibilitas berikut:

| Aspek | Spesifikasi |
|-------|-------------|
| **Kontras Warna** | Rasio kontras minimum 4.5:1 untuk teks normal, 3:1 untuk teks besar. Skema **Biru Dongker (#0A1F3E) + Earth Tone** (biru dongker sebagai warna dasar PALASMA, hijau hutan, cokelat tanah, krem hangat). Hindari pastel pucat |
| **Tipografi** | Body text **16px–18px**. Heading minimal **24px+**. Dilarang font kaligrafi/script/tipis. Wajib sans-serif tegas (Inter, Nunito, Open Sans) |
| **Tombol & Target Sentuh** | Ukuran minimum **48x48px**. Jarak cukup antar tombol. Label jelas dan tegas |
| **Spasi & Layout** | Line-height minimal 1.5. White space cukup agar tidak terasa sesak |
| **Navigasi** | Konsisten, sederhana, maksimal 1-2 tap dari halaman mana pun |

### 2.2 Responsivitas & Performa
- **Mobile-first**: Semua fitur harus berfungsi sempurna di smartphone
- **Waktu muat**: Maksimal 3 detik di koneksi 4G
- **Static-first**: Website 100% statik, tanpa server-side runtime

### 2.3 Mood & Tone Visual (Design Guidelines)

**Konsep**: "*Alam yang Merayakan*" — perpaduan elemen alam (gunung, laut, hutan) dengan atmosfer perayaan/pesta yang hangat, kasual, dan meriah. Bukan formal/glamor.

| Elemen | Panduan |
|--------|---------|
| **Palet Warna** | Earth Tone hangat dengan **Biru Dongker (#0A1F3E)** sebagai warna dasar PALASMA, dipadukan dengan: cokelat kayu, krem pasir, hijau lumut, dan aksen emas (golden anniversary) |
| **Tipografi** | Sans-serif untuk body, bold dan ekspresif untuk heading. Aksen display terbatas diperbolehkan selama tetap terbaca |
| **Visual Style** | Alam + atmosfer pesta api unggun (bonfire party) — hangat, kasual, meriah |
| **Elemen Grafis** | Ilustrasi alam semi-realistis atau flat design hangat. Foto ekspedisi asli sebagai latar |
| **Motion** | Animasi scroll-driven elegan (terinspirasi landing page iPhone): parallax, pin & reveal, scrub animation. Gerakan halus dan bermakna. Semua konten tetap terlihat jika JS tidak aktif |
| **Suasana** | Nostalgia + kebersamaan + penghormatan. Terasa "pulang kampung" bagi alumni |

---

## 3. Struktur Konten Landing Page

### 3.0 Splash Screen "Buka Undangan"
Halaman pertama yang muncul saat website diakses — seperti konsep undangan pernikahan digital.

Komponen:
- Visual utama: foto ikonik atau montase PALASMA (full screen)
- Teks: **"PALASMA 50 Tahun — Setengah Abad Alam, Petualangan, dan Persaudaraan"**
- Countdown timer ke hari-H
- Musik latar opsional dengan tombol mute/play
- Satu tombol besar di tengah: **[Buka Undangan]**
- Scroll smooth menuju konten utama saat diklik
- Tidak ada navigasi lain sebelum tombol ditekan

### 3.1 Hero Section
- Visual utama (lanjutan dari splash atau foto berbeda)
- Teks selamat datang singkat + ajakan
- Dua CTA besar kontras: **[Ya, Saya Hadir]** dan **[Maaf, Saya Absen]**

### 3.2 Kata Sambutan
- Sambutan hangat dari panitia (dummy sementara, naskah final sedang disiapkan panitia)
- Tone: mengundang, personal, penuh nostalgia
- Format: teks singkat + foto ketua panitia/perwakilan alumni

### 3.3 Detail Acara

| Item | Detail |
|------|--------|
| **Acara** | HUT ke-50 PALASMA — Reuni Akbar |
| **Tanggal** | Sabtu–Minggu, 29–30 Agustus 2026 |
| **Waktu** | 16.00 WITA – selesai |
| **Lokasi** | Aranka Tempasan |
| **Google Maps** | https://maps.app.goo.gl/xHB2EwxbV69cSc1F7 |
| **Dress Code** | [Menunggu konfirmasi panitia] |

### 3.4 Embed Google Maps
- Peta interaktif menuju Aranka Tempasan
- Embedded iframe yang responsif

### 3.5 Galeri Foto Nostalgia
- Foto-foto ekspedisi PALASMA lintas dekade (70-an hingga kini)
- Fungsi: pemancing nostalgia utama
- Format: masonry grid atau carousel dengan caption
- Opsi full-screen viewing
- Sumber foto: dikumpulkan oleh panitia (gunakan foto dummy untuk development awal)

### 3.6 Fitur Ucapan & Doa
- Section untuk mengirim pesan ucapan/doa
- Implementasi: Supabase (serverless) — lihat detail di Fitur Utama 2

### 3.7 Twibbon Generator
- Section untuk membuat twibbon langsung di website
- Implementasi: Croppie.js — lihat detail di Fitur Utama 3
- Bingkai: **persegi** (menunggu file dari panitia, gunakan dummy untuk development)

### 3.8 Footer
- Informasi kontak panitia
- Sosial media PALASMA
- Credit/attribution

---

## 4. Fitur Utama 1: RSVP Kondisional (Tanpa Database Internal)

### 4.1 Deskripsi
Sistem RSVP dua arah tanpa database internal. Semua data logistik dikelola melalui Google Form eksternal milik panitia (link placeholder: `#` — akan diisi setelah panitia menyiapkan).

### 4.2 User Story

**US-RSVP-01: Respons Kehadiran**
**Sebagai** tamu undangan
**Saya ingin** memberikan konfirmasi kehadiran dengan mudah
**Sehingga** panitia bisa mempersiapkan logistik

**Acceptance Criteria:**
- [ ] Dua tombol utama kontras secara visual:
  - **Tombol warna PALASMA (biru dongker/hijau)** bertuliskan **[Ya, Saya Hadir]**
  - **Tombol abu/cokelat** bertuliskan **[Maaf, Saya Absen]**
- [ ] Ukuran tombol minimum 200x56px, mudah ditap di smartphone
- [ ] Efek hover/active feedback

### 4.3 Alur Interaktif

**Skenario A: Tamu HADIR**

```
Tamu klik [Ya, Saya Hadir]
  → Animasi konfirmasi singkat
  → Redirect ke Google Form eksternal (link: [placeholder #])
  → Google Form: pendataan nama, angkatan, jumlah tamu, alergi makanan, dll.
```

**Acceptance Criteria:**
- [ ] Link Google Form terbuka di tab baru (target="_blank")
- [ ] Konfirmasi visual sebelum redirect

**Skenario B: Tamu TIDAK HADIR**

```
Tamu klik [Maaf, Saya Absen]
  → Pop-up/Modal Dialog Box muncul
  → Isi modal:
    1. Pesan apresiasi hangat (lihat draf di bawah)
    2. Ajakan membuat "Video Ucapan/Nostalgia" (durasi max 1 menit)
    3. Dua tombol CTA besar:
       a. [Kirim via WhatsApp] → wa.me/[nomor placeholder #]
       b. [Upload ke Google Drive] → redirect ke link Drive (placeholder #)
  → Opsi [Tutup] di pojok modal
```

**Acceptance Criteria:**
- [ ] Modal muncul dengan animasi smooth (fade-in + scale)
- [ ] Modal bisa ditutup dengan [Tutup] atau klik di luar modal
- [ ] [Kirim via WhatsApp] membuka `https://wa.me/[nomor]` dengan pesan siap-ketik
- [ ] [Upload ke Google Drive] redirect ke link Drive tujuan
- [ ] Kedua tombol di dalam modal berukuran besar (mobile-friendly)

### 4.4 Draf Pesan Apresiasi (Pop-up Absen)

> *"Terima kasih sudah menjadi bagian dari perjalanan PALASMA selama ini. Meskipun tidak bisa hadir secara langsung, semangat dan kebersamaan kita tetap abadi. Kami sangat menghargai dukunganmu.*

> *Sebagai bentuk partisipasi, kami mengajakmu untuk mengirimkan Video Ucapan atau Nostalgia berdurasi maksimal 1 menit. Video ini akan menjadi kenang-kenangan untuk seluruh keluarga besar PALASMA.*

> *Pilih cara termudah untukmu:*
> - *Kirim langsung via WhatsApp*
> - *Upload ke Google Drive kami*

> *Terima kasih, PALASMA tetap di hati!"*

### 4.5 Catatan Teknis
- Tidak ada penyimpanan data di server internal
- Semua data peserta dikelola melalui Google Workspace panitia
- Website tetap 100% statik

---

## 5. Fitur Utama 2: Ucapan & Doa (Supabase)

### 5.1 Deskripsi
Section untuk mengirim ucapan/doa/kesan untuk PALASMA. Data dikelola serverless via Supabase; website tetap statik.

### 5.2 User Story

**US-UCAPAN-01: Mengirim Ucapan**
**Sebagai** tamu undangan
**Saya ingin** mengirimkan ucapan selamat atau doa untuk PALASMA
**Sehingga** perasaan dan harapan saya tercatat dalam sejarah organisasi

**Acceptance Criteria:**
- [ ] Formulir: `name` (required), `batch_year` (opsional), `message` (required, max 500 karakter)
- [ ] Tombol submit [Kirim Ucapan]
- [ ] Ucapan langsung muncul di galeri secara real-time (tanpa moderasi)
- [ ] Galeri format kartu (card layout), diurutkan dari terbaru
- [ ] Validasi: name dan message tidak boleh kosong

### 5.3 Spesifikasi Teknis

| Aspek | Detail |
|-------|--------|
| **Backend** | Supabase (PostgreSQL + REST API) |
| **Auth** | Anon key dengan Row Level Security (RLS) untuk insert & read |
| **Table** | `messages` — kolom: `id` (uuid), `name` (text), `batch_year` (text, nullable), `message` (text), `created_at` (timestamptz) |
| **Moderasi** | Tidak ada — semua ucapan langsung tampil |
| **Real-time** | Opsional: Supabase Realtime untuk update live |
| **Integrasi** | Panggil Supabase REST API via JavaScript fetch langsung dari file statik |

### 5.4 Arsitektur
```
Browser ←→ Supabase REST API (anon key)
       ←→ File statik (HTML/CSS/JS di hosting)
```

---

## 6. Fitur Utama 3: Twibbon Generator (Croppie)

### 6.1 Deskripsi
Generator bingkai foto (twibbon) yang terintegrasi langsung di dalam website. Pengguna unggah foto, atur posisi dan zoom, lalu unduh hasil akhir dengan bingkai tema 50 Tahun PALASMA.

### 6.2 User Story

**US-TWIBBON-01: Membuat Twibbon**
**Sebagai** tamu undangan
**Saya ingin** membuat foto profil bertema 50 Tahun PALASMA
**Sehingga** saya bisa ikut meramaikan perayaan di media sosial

**Acceptance Criteria:**
- [ ] Section menampilkan preview bingkai + area unggah foto
- [ ] Tombol [Pilih Foto] untuk unggah dari galeri/kamera
- [ ] Area crop Croppie dengan bingkai overlay — bisa **drag** dan **zoom (scroll/pinch)**
- [ ] Preview real-time hasil crop + bingkai
- [ ] Tombol [Unduh Twibbon] untuk download hasil akhir sebagai PNG
- [ ] Bingkai berbentuk **persegi** (sesuai keputusan panitia)

### 6.3 Spesifikasi Teknis

| Aspek | Detail |
|-------|--------|
| **Library** | Croppie.js |
| **Bingkai** | PNG transparan overlay — disediakan panitia (gunakan dummy untuk development) |
| **Canvas Composite** | HTML Canvas: hasil crop + bingkai digabung |
| **Output** | PNG 1080x1080px (Instagram-ready) |
| **Mobile** | Croppie support touch events (pinch zoom, drag) |
| **Batas File** | Maks 10MB |
| **Format Input** | JPG, PNG |

### 6.4 Alur Teknis
```
1. User upload foto → FileReader API baca file
2. Croppie initialize dengan viewport persegi (sesuai bingkai)
3. User atur posisi & zoom
4. User klik [Unduh Twibbon]
5. JavaScript:
   a. Ambil hasil crop dari Croppie (base64)
   b. Buat canvas 1080x1080
   c. Gambar hasil crop sebagai base layer
   d. Gambar bingkai PNG sebagai overlay
   e. Export canvas.toDataURL()
   f. Trigger download
```

### 6.5 Mobile Optimization
- Viewport Croppie proporsional terhadap layar
- CSS `touch-action: none` pada area crop untuk mencegah konflik gesture

---

## 7. Arsitektur Teknis

### 7.1 Rekomendasi Framework

| Framework | Kelebihan | Kekurangan |
|-----------|-----------|------------|
| **Astro** (rekomendasi) | Static-first, zero JS di final build, komponen interaktif sebagai Islands, output HTML murni, performa terbaik | Perlu belajar konsep Island Architecture |
| **SvelteKit** | Developer experience baik, bundle kecil, reaktivitas native | Butuh SSG config, lebih berat dari Astro untuk use case ini |

**Keputusan: Astro** — paling cocok untuk website statik dengan sedikit interaktivitas. Halaman utama fully static, komponen interaktif (RSVP, ucapan, twibbon) sebagai Astro Islands. Output akhir HTML/CSS/JS statik.

### 7.2 Stack Lengkap

| Layer | Teknologi |
|-------|-----------|
| **Hosting** | VPS (Vultr/DigitalOcean/EC2) — nginx sebagai web server untuk serve file statik |
| **Framework** | Astro (static output, zero server runtime) |
| **CSS** | Tailwind CSS (via Astro integration) |
| **Animasi** | GSAP + ScrollTrigger untuk animasi scroll-driven elegan (parallax, pin & reveal, scrub) |
| **Database** | Supabase (serverless — fitur ucapan) |
| **External Services** | Google Forms (RSVP data), Google Drive (upload video), WhatsApp API (link wa.me) |
| **Library** | Croppie.js (twibbon generator) |
| **Icons** | Lucide atau Heroicons (via Tailwind) |
| **Optimasi** | Lazy loading gambar, asset caching |

### 7.3 Prinsip Arsitektur
- **Zero backend**: Tidak ada server runtime — semua file statik
- **VPS sebagai web server saja**: nginx serve HTML/CSS/JS dan assets — tidak ada application server
- **Astro Islands**: Hanya komponen interaktif yang dikirim sebagai JS, sisanya static HTML
- **Minimal dependency**: Total JS tambahan ~65KB gzip (Croppie 12KB + GSAP 30KB + Supabase JS 8KB + Tailwind 10KB + Icons 5KB)
- **Fallback**: Semua konten tetap terlihat meskipun JS tidak aktif

### 7.4 Detail Animasi (iPhone-style)
- **Parallax Scrolling**: Background elements bergerak dengan kecepatan berbeda
- **Pin & Reveal**: Elemen tertahan di viewport lalu terungkap saat scroll
- **Progress-driven**: Animasi terikat posisi scroll (bukan waktu)
- **Subtle & Meaningful**: Setiap animasi memiliki tujuan
- **Fallback**: Tanpa JS, semua konten tetap utuh

---

## 8. Daftar Kebutuhan Aset Eksternal (Stakeholder Deliverables)

### Segera (sebelum development selesai)
- [ ] **Link Google Form** pendataan hadir — placeholder: `#`
- [ ] **Nomor WhatsApp PIC** video ucapan — placeholder: `#`
- [ ] **Link Google Drive** upload video — placeholder: `#`
- [ ] **File bingkai Twibbon** PNG transparan, persegi, min 1080x1080px
- [ ] **Logo PALASMA** (SVG atau PNG resolusi tinggi)
- [ ] **Foto cover/hero** untuk landing page
- [ ] **Naskah kata sambutan** dari ketua panitia

### Untuk Development Awal (dummy)
- [x] **Foto ekspedisi dummy** — untuk placeholder galeri
- [x] **Draf pesan apresiasi** (pop-up absen) — sudah disediakan di section 4.4
- [x] **Bingkai twibbon dummy** — untuk development

### Setelah Development
- [ ] **Foto ekspedisi PALASMA** lintas dekade (min 20-30 foto)
- [ ] **Teks sambutan final**
- [ ] **Domain khusus** (misal: palasma50.id)
- [ ] **Dress code** acara

---

## 9. Kriteria Sukses

| Metrik | Target |
|--------|--------|
| **Pengunjung unik** | 500+ selama masa kampanye |
| **RSVP Hadir** | ≥60% dari total undangan |
| **Ucapan terkumpul** | ≥100 ucapan |
| **Twibbon terdownload** | ≥50 twibbon |
| **Skor Aksesibilitas** | Lighthouse ≥85 |
| **Waktu Muat** | ≤3 detik di koneksi 4G |
| **Timeline** | Website siap luncur dalam **1–2 minggu** |

---

*Dokumen ini adalah cetak biru final pengembangan website undangan HUT ke-50 PALASMA. Siap di-handover ke Project Manager dan tim developer.*

**Catatan untuk PM:**
- Placeholder (`#`) di link Google Form, WA, dan Google Drive perlu diisi panitia sebelum deploy
- Aset visual (foto, bingkai twibbon, logo) menggunakan dummy untuk development awal
- Naskah sambutan final dan foto asli menyusul dari panitia
- Target luncur: 1–2 minggu dari development dimulai
