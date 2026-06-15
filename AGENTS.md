# AGENTS.md

Panduan ini menjelaskan proyek portfolio Rafael Nicholas Po untuk agent atau contributor yang akan melanjutkan pekerjaan di repo ini.

## Ringkasan Proyek

Proyek ini adalah website portfolio berbasis Vite, React, dan TypeScript dengan konsep "professional pirate voyage". Visualnya terinspirasi dari nuansa petualangan laut, peta, wanted poster, treasure card, dan route log, tetapi tidak memakai karakter, logo, atau aset resmi One Piece.

Nama package proyek: `rafael-voyage-portfolio`.

Tujuan utama website:

- Menampilkan profil Rafael Nicholas Po secara profesional.
- Memperlihatkan project, skill, pengalaman, sertifikasi, dan journey/timeline.
- Menyediakan akses untuk melihat CV melalui file PDF di folder `public`.
- Menggunakan animasi kontinu dan scroll-based storytelling dengan Framer Motion dan GSAP.

## Tech Stack

- `Vite` sebagai dev server dan build tool.
- `React 18` untuk UI.
- `TypeScript` untuk type safety.
- `Framer Motion` untuk reveal, transition, hover/tap motion, dan animasi ringan.
- `GSAP`, `@gsap/react`, dan `ScrollTrigger` untuk animasi kontinu, scroll-driven animation, route drawing, counter, carousel, dan scroll storytelling.
- `lucide-react` dan `react-icons` untuk ikon.
- CSS global di `src/styles.css`, dengan CSS variables untuk warna, spacing, dan treatment visual.

## Cara Menjalankan

Install dependency jika belum tersedia:

```powershell
npm.cmd install
```

Jalankan dev server:

```powershell
npm.cmd run dev -- --host 127.0.0.1
```

Build production:

```powershell
npm.cmd run build
```

Preview hasil build:

```powershell
npm.cmd run preview
```

## Struktur Proyek

```text
.
|-- public/
|   |-- Rafael_Nicholas_Po_CV.pdf
|   `-- assets/
|       |-- profile.png
|       `-- straw-hat.png
|-- src/
|   |-- components/
|   |   `-- GsapVoyageEffects.tsx
|   |-- App.tsx
|   |-- main.tsx
|   |-- styles.css
|   `-- vite-env.d.ts
|-- index.html
|-- package.json
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.node.json
`-- vite.config.ts
```

Catatan generated/ignored:

- `node_modules/` berisi dependency lokal dan tidak perlu diedit manual.
- `dist/` adalah output build dan tidak perlu diedit manual.
- File `.env` dan `.env.local` diabaikan oleh git.

## File Penting

### `src/App.tsx`

File utama untuk komposisi halaman. Di sini terdapat:

- Data portfolio seperti project, skills, timeline, certification, dan social links.
- Struktur section utama: hero, about, projects, route log, skills, certifications, journey, CV, dan contact.
- Integrasi komponen animasi dari `GsapVoyageEffects.tsx`.
- Penggunaan Framer Motion untuk reveal, stagger, dan interaction animation.

Saat memperbarui konten website, prioritaskan update data array di file ini sebelum membuat markup hardcoded baru.

### `src/components/GsapVoyageEffects.tsx`

File ini berisi komponen dan hook animasi GSAP, termasuk:

- `useGsapHoverEffects`
- `GsapStrawHatStory`
- `GsapBountyCarousel`
- `GsapHeroConstellation`
- `GsapBountyCounter`
- `GsapJourneyRoute`
- `GsapRouteLogbook`

Gunakan pola `useGSAP` dengan ref scope saat menambah animasi React agar cleanup tetap aman ketika komponen unmount atau route berubah.

### `src/styles.css`

File CSS global untuk:

- Design tokens seperti warna ocean navy, sea teal, parchment, ink, gold, dan red accent.
- Layout responsive semua section.
- Styling kartu, wanted poster, project grid, timeline, CV viewer, contact, dan efek visual.
- State accessibility seperti focus-visible.
- Reduced motion behavior melalui media query.

Saat menambah style, gunakan token CSS yang sudah ada agar visual tetap konsisten.

### `public/Rafael_Nicholas_Po_CV.pdf`

File CV yang ditampilkan atau dibuka dari website. Jika CV berubah, replace file ini dengan nama yang sama agar link existing tidak rusak.

### `public/assets/straw-hat.png`

Aset topi jerami transparent-background untuk scroll storytelling dari hero ke about section. Aset ini custom generated dan dipakai oleh `GsapStrawHatStory`.

## Cara Kerja Website

Website berjalan sebagai single-page React app. `src/main.tsx` mount komponen `App` ke root DOM dari `index.html`.

Konten utama bersifat data-driven. Project, skill group, timeline, dan link sosial didefinisikan sebagai struktur data di `src/App.tsx`, lalu dirender ke beberapa section. Ini membuat update konten lebih mudah tanpa mengubah banyak markup.

Animasi dibagi menjadi dua lapisan:

- Framer Motion dipakai untuk animasi UI yang dekat dengan lifecycle React: section reveal, card entrance, hover/tap interaction, dan transisi kecil.
- GSAP dipakai untuk animasi yang lebih sinematik dan scroll-linked: straw hat scroll story, carousel stat bounty, route drawing, counter, constellation loop, dan hover effects yang membutuhkan kontrol timeline lebih detail.

Visual utama website menggunakan tema ocean voyage:

- Hero menampilkan nuansa laut, route, dan headline portfolio.
- About memakai gaya wanted poster dan bounty stats.
- Projects memakai kartu treasure/voyage log.
- Skills memakai crew inventory.
- Journey memakai route/timeline pulau.
- Contact memakai nuansa message-in-a-bottle atau ship deck.

## Pedoman Editing

- Jangan gunakan aset resmi anime, karakter, logo, atau artwork berlisensi. Gunakan motif original seperti ocean, compass, map, ship, parchment, rope, treasure, dan custom straw hat.
- Untuk update konten portfolio, ubah data di `src/App.tsx` terlebih dahulu.
- Untuk update animasi GSAP, kerjakan di `src/components/GsapVoyageEffects.tsx`.
- Untuk update visual dan responsive behavior, kerjakan di `src/styles.css`.
- Simpan aset gambar di `public/assets/`.
- Simpan CV di `public/` agar bisa diakses langsung oleh Vite.
- Hormati `prefers-reduced-motion`; animasi besar harus bisa collapse menjadi fade atau state yang lebih sederhana.
- Prioritaskan animasi berbasis `transform` dan `opacity` untuk performa.
- Pastikan semua action penting tetap bisa diakses tanpa hover-only interaction.
- Pastikan keyboard focus terlihat.
- Jangan commit perubahan kecuali user secara eksplisit meminta commit.

## Checklist Setelah Mengubah Kode

Jalankan build:

```powershell
npm.cmd run build
```

Untuk perubahan UI, cek minimal viewport:

- 375px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

Periksa juga:

- Tidak ada horizontal overflow.
- Text tidak overlap.
- CTA dan link CV bisa diklik.
- Scroll animation tidak menutup konten penting.
- Reduced motion tetap nyaman.

## Catatan Git

Repo ini dapat memiliki perubahan user yang belum di-commit. Jangan revert file yang tidak sedang dikerjakan. Jika perlu melihat status:

```powershell
git status --short
```

Jika user meminta commit, staging dan commit harus dilakukan secara eksplisit setelah memastikan file yang masuk commit memang sesuai request.
