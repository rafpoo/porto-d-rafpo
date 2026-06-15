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
|       |-- straw-hat.png
|       `-- wanted-poster.png
|-- src/
|   |-- components/
|   |   |-- sections/
|   |   |   |-- About.tsx
|   |   |   |-- Certifications.tsx
|   |   |   |-- Contact.tsx
|   |   |   |-- Cv.tsx
|   |   |   |-- Hero.tsx
|   |   |   |-- Journey.tsx
|   |   |   |-- Projects.tsx
|   |   |   |-- RouteLog.tsx
|   |   |   `-- Skills.tsx
|   |   |-- GsapVoyageEffects.tsx
|   |   |-- Section.tsx
|   |   `-- TechIcon.tsx
|   |-- data/
|   |   `-- portfolio.ts
|   |-- utils/
|   |   `-- motion.ts
|   |-- App.tsx
|   |-- main.tsx
|   |-- styles.css
|   |-- types.ts
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

File shell utama untuk komposisi halaman. Di sini terdapat:

- Import dan urutan section utama: hero, about, projects, route log, skills, certifications, journey, CV, dan contact.
- Header, navigasi desktop/mobile, skip link, scroll progress, dan `GsapStrawHatStory`.
- Pemanggilan `useGsapHoverEffects` untuk efek hover global.

Jangan menaruh data portfolio baru di `App.tsx`; gunakan `src/data/portfolio.ts`.

### `src/data/portfolio.ts`

File sumber data utama untuk konten website. Di sini terdapat:

- URL asset publik seperti `CV_URL`, `STRAW_HAT_URL`, `PROFILE_IMAGE_URL`, dan `WANTED_POSTER_URL`.
- `navItems`.
- `projects`, termasuk stack, kategori, visual label, dan link GitHub.
- `skillGroups`, `timelineItems`, `socialLinks`, `certifications`, dan `heroStackStreamItems`.

Saat memperbarui konten portfolio, prioritaskan update data array di file ini sebelum membuat markup hardcoded baru. Project roulette dan project grid memakai data `projects` yang sama.

Link GitHub yang saat ini dipakai di project roulette:

- TrustEnd: `https://github.com/rafpoo/TrustEnd`
- MAXIMA client web: `https://github.com/MAXIMA-2025/mxm25-app-client`
- MAXIMA internal web: `https://github.com/MAXIMA-2025/mxm25-app-internal`
- MAXIMA API: `https://github.com/MAXIMA-2025/mxm25-server-internal`
- MAXIMA mailer microservice: `https://github.com/MAXIMA-2025/mxm25-app-mailer`
- MedEase: `https://github.com/rafpoo/MedEase`

### `src/components/sections/*.tsx`

Setiap section besar dipisahkan menjadi component sendiri:

- `Hero.tsx`
- `About.tsx`
- `Projects.tsx`
- `RouteLog.tsx`
- `Skills.tsx`
- `Certifications.tsx`
- `Journey.tsx`
- `Cv.tsx`
- `Contact.tsx`

Gunakan file section yang sesuai saat mengubah markup section tertentu. Jangan menggabungkan kembali semua section ke `App.tsx`.

### `src/components/Section.tsx`

Wrapper reusable untuk section konten, heading, eyebrow, dan treatment khusus heading About dengan straw-hat dock.

### `src/components/TechIcon.tsx`

Komponen ikon teknologi reusable untuk tampilan stack/brand visual.

### `src/components/GsapVoyageEffects.tsx`

File ini berisi komponen dan hook animasi GSAP, termasuk:

- `useGsapHoverEffects`
- `GsapStrawHatStory`
- `GsapBountyCarousel`
- `GsapAboutScrollytelling`
- `GsapHeroConstellation`
- `GsapBountyCounter`
- `GsapJourneyRoute`
- `GsapRouteLogbook`

Gunakan pola `useGSAP` dengan ref scope saat menambah animasi React agar cleanup tetap aman ketika komponen unmount atau route berubah. Hindari selector global untuk target animasi section; scope-kan selector ke root component agar animasi tidak saling overwrite.

Catatan animasi terbaru:

- `GsapAboutScrollytelling` mengatur wanted poster dan project roulette di About section.
- Project roulette menggunakan layout 3D carousel/roulette dengan fan-shaped app screenshots di sisi kiri kartu.
- `GsapJourneyRoute` dan `GsapRouteLogbook` memakai `ScrollTrigger.create` dengan callback eksplisit (`onEnter`, `onEnterBack`, `onLeave`, `onLeaveBack`) agar route drawing tidak stuck saat user scroll cepat.
- Ship SVG dipisah menjadi outer group untuk reveal dan inner `*-ship-body` untuk idle floating supaya transform GSAP tidak saling overwrite.

### `src/styles.css`

File CSS global untuk:

- Design tokens seperti warna ocean navy, sea teal, parchment, ink, gold, dan red accent.
- Layout responsive semua section dan project roulette.
- Styling kartu, wanted poster image, project grid, project roulette links, timeline, CV viewer, contact, dan efek visual.
- State accessibility seperti focus-visible.
- Reduced motion behavior melalui media query.

Saat menambah style, gunakan token CSS yang sudah ada agar visual tetap konsisten.

### `public/Rafael_Nicholas_Po_CV.pdf`

File CV yang ditampilkan atau dibuka dari website. Jika CV berubah, replace file ini dengan nama yang sama agar link existing tidak rusak.

### `public/assets/straw-hat.png`

Aset topi jerami transparent-background untuk scroll storytelling dari hero ke about section. Aset ini custom generated dan dipakai oleh `GsapStrawHatStory`.

### `public/assets/wanted-poster.png`

Aset wanted poster final untuk About section. Gambar ini dirender langsung via `WANTED_POSTER_URL` di `About.tsx`, bukan lagi dibuat dari markup poster internal. Hover pada poster dibuat static melalui `data-gsap-hover="static"` agar ukuran poster tidak berubah saat hover.

## Cara Kerja Website

Website berjalan sebagai single-page React app. `src/main.tsx` mount komponen `App` ke root DOM dari `index.html`.

Konten utama bersifat data-driven. Project, skill group, timeline, certification, asset URL, dan link sosial didefinisikan sebagai struktur data di `src/data/portfolio.ts`, lalu dirender ke section component di `src/components/sections/`. Ini membuat update konten lebih mudah tanpa mengubah banyak markup.

Animasi dibagi menjadi dua lapisan:

- Framer Motion dipakai untuk animasi UI yang dekat dengan lifecycle React: section reveal, card entrance, hover/tap interaction, dan transisi kecil.
- GSAP dipakai untuk animasi yang lebih sinematik dan scroll-linked: straw hat scroll story, project roulette, carousel stat bounty, route drawing, counter, constellation loop, idle ship floating, dan hover effects yang membutuhkan kontrol timeline lebih detail.

Visual utama website menggunakan tema ocean voyage:

- Hero menampilkan nuansa laut, route, dan headline portfolio.
- About memakai wanted poster image, bounty stats, dan project roulette.
- Projects memakai kartu treasure/voyage log.
- Skills memakai crew inventory.
- Route log dan Journey memakai route/timeline pulau dengan SVG route drawing.
- Contact memakai nuansa message-in-a-bottle atau ship deck.

## Pedoman Editing

- Jangan gunakan aset resmi anime, karakter, logo, atau artwork berlisensi. Gunakan motif original seperti ocean, compass, map, ship, parchment, rope, treasure, dan custom straw hat.
- Untuk update konten portfolio, ubah data di `src/data/portfolio.ts` terlebih dahulu.
- Untuk update markup section, kerjakan file terkait di `src/components/sections/`.
- Untuk update animasi GSAP, kerjakan di `src/components/GsapVoyageEffects.tsx`.
- Untuk update visual dan responsive behavior, kerjakan di `src/styles.css`.
- Simpan aset gambar di `public/assets/`.
- Simpan CV di `public/` agar bisa diakses langsung oleh Vite.
- Hormati `prefers-reduced-motion`; animasi besar harus bisa collapse menjadi fade atau state yang lebih sederhana.
- Prioritaskan animasi berbasis `transform` dan `opacity` untuk performa.
- Untuk GSAP React, gunakan `useGSAP` dengan scope ref dan cleanup otomatis. Saat animasi route/roulette terasa diam atau stuck, cek apakah selector masih global, apakah `ScrollTrigger.refresh()` diperlukan setelah layout/image berubah, dan apakah dua tween menulis transform ke target yang sama.
- Untuk project roulette, pastikan link penting tetap berupa `<a>` yang bisa diklik dan tidak hanya muncul lewat hover.
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
- Link GitHub di project grid dan project roulette bisa diklik.
- Scroll animation tidak menutup konten penting.
- Route drawing di "Engineering Route Map" dan "Journey Timeline" bergerak saat section masuk viewport dan tidak stuck saat scroll cepat.
- Wanted poster About section muncul dari `public/assets/wanted-poster.png` dan tidak membesar saat hover.
- Reduced motion tetap nyaman.

## Catatan Git

Repo ini dapat memiliki perubahan user yang belum di-commit. Jangan revert file yang tidak sedang dikerjakan. Jika perlu melihat status:

```powershell
git status --short
```

Jika user meminta commit, staging dan commit harus dilakukan secara eksplisit setelah memastikan file yang masuk commit memang sesuai request.
