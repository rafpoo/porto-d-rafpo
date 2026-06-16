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
- Flow scroll About section harus dipertahankan: user masuk About melihat wanted poster + description, lalu scroll memindahkan wanted poster ke sisi kanan sambil menampilkan project roulette, lalu scroll berikutnya memainkan exit animation wanted poster dari posisi kanan, dan baru setelah poster jatuh keluar viewport section di-unpin menuju section berikutnya.
- Exit animation wanted poster memakai wrapper/tape terpisah di `GsapAboutScrollytelling`: `wanted-poster-stage` untuk perpindahan ke kanan, `wanted-poster-fall-plane` untuk jatuh, `wanted-poster-hinge-plane` untuk pivot gantung dari kanan atas, serta `wanted-poster-tape-left` dan `wanted-poster-tape-right` untuk tape yang terkelupas.
- Jangan menghapus atau mengganti animasi wanted poster yang pindah ke sisi kanan. Exit animation harus dimainkan setelah poster berada di sisi kanan, bukan menggantikan fase perpindahan poster dan roulette.
- Exit animation wanted poster harus terasa seperti poster masih tertahan oleh tape kanan setelah tape kiri lepas. Pada fase pertama exit (`leftTape` lalu `hang`), ujung kanan atas poster harus tetap dekat/terhubung secara visual dengan `wanted-poster-tape-right`, sementara ujung kiri poster turun lebih dulu. Jangan membalik arah rotasi sehingga ujung kanan yang jatuh duluan.
- Untuk menjaga ilusi tape kanan masih menempel, pertahankan `posterHinge` pivot di kanan atas (`transformOrigin: "100% 0%"`), gunakan rotasi negatif pada fase `hang`/`wiggle`/`fall`, dan jangan membesarkan `hangY` terlalu jauh. `rightTape` punya metrik hang sendiri (`rightTapeHangRotation`, `rightTapeHangX`, `rightTapeHangY`) agar tape kanan ikut turun/geser sedikit bersama pojok kanan poster sebelum akhirnya lepas.
- Project roulette menggunakan layout 3D carousel/roulette dengan fan-shaped app screenshots di sisi kiri kartu.
- Pacing project roulette harus memakai pola hold-then-step, bukan spin linear terus-menerus. Saat roulette muncul, project aktif harus bertahan cukup lama agar tombol GitHub bisa diklik, lalu scroll berikutnya baru memicu transisi pendek ke project berikutnya. Di `GsapAboutScrollytelling`, pertahankan konsep `rouletteHoldDuration`, `rouletteTransitionDuration`, `rouletteSpinDuration`, dan `projectStepScroll` agar kira-kira satu gesture scrollwheel dibutuhkan untuk pindah satu project.
- Active card project roulette jangan dihitung dengan `Math.round(state.frame)` karena itu membuat project berganti saat frame baru setengah jalan. Gunakan threshold yang membuat card aktif bertahan hampir sepanjang fase hold/transisi, sehingga link project tetap mudah diklik.
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

Di About section, image ini dibungkus oleh struktur animasi di `GsapAboutScrollytelling` agar tape dan exit animation bisa berjalan tanpa mengubah desain utama poster. Jangan mengganti isi, ukuran, tipografi, atau desain poster ketika mengubah animasi; ubah wrapper/tape/timeline saja.

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
- Untuk timeline About section, pertahankan satu ScrollTrigger pinned utama dengan `scrub`, `pin: true`, `invalidateOnRefresh: true`, dan label timeline yang jelas. Urutan label penting: fase hold, perpindahan wanted poster ke kanan, roulette, lalu exit poster. Jangan membuat ScrollTrigger terpisah untuk exit poster jika masih bisa masuk timeline yang sama, agar pin tidak saling berebut.
- Saat mengubah pacing project roulette, ubah bersama-sama durasi timeline dan `end` ScrollTrigger. Menambah durasi tween tanpa menambah jarak scroll pin bisa tetap terasa cepat. Hindari mengembalikan roulette ke animasi `state.frame` linear dari `0` ke `maxFrame` dalam satu tween panjang; gunakan fase hold per project dan transisi pendek antar project.
- Saat mengubah exit wanted poster, animasikan transform/opacity (`x`, `y`, `rotation`, `scale`, `autoAlpha`) pada wrapper seperti `wanted-poster-stage`, `wanted-poster-fall-plane`, dan `wanted-poster-hinge-plane`. Jangan animasikan `top`, `left`, `width`, atau layout property lain.
- Saat mengubah fase pertama exit wanted poster, validasi jarak visual antara tape kanan dan pojok kanan atas poster. Jika poster terlihat terpisah dari tape kanan, kurangi `hangY` atau sesuaikan metrik `rightTapeHang*`; jangan menaikkan tape kanan saja sampai lepas dari posisi naturalnya.
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
- Project roulette tidak bergeser terlalu cepat: setelah roulette muncul, satu project harus tetap aktif cukup lama untuk membaca dan mengklik link GitHub, dan perpindahan ke project berikutnya idealnya butuh kira-kira satu gesture scrollwheel/trackpad yang jelas.
- Scroll animation tidak menutup konten penting.
- Flow About scroll storytelling benar: wanted poster + description tampil dulu, poster pindah ke sisi kanan sambil project roulette muncul, exit animation poster berjalan dari sisi kanan, lalu section berikutnya baru muncul setelah poster jatuh keluar viewport.
- Tape kiri dan kanan terlihat di pojok atas poster, ikut berpindah bersama poster ke sisi kanan, lalu terkelupas secara berurutan saat exit animation.
- Pada tahap pertama exit animation, setelah tape kiri lepas, tape kanan masih terlihat menahan pojok kanan atas poster; poster tidak boleh terlihat menggantung jauh di bawah tape kanan atau jatuh dari ujung kanan terlebih dahulu.
- Route drawing di "Engineering Route Map" dan "Journey Timeline" bergerak saat section masuk viewport dan tidak stuck saat scroll cepat.
- Wanted poster About section muncul dari `public/assets/wanted-poster.png` dan tidak membesar saat hover.
- Reduced motion tetap nyaman.

## Catatan Git

Repo ini dapat memiliki perubahan user yang belum di-commit. Jangan revert file yang tidak sedang dikerjakan. Jika perlu melihat status:

```powershell
git status --short
```

Jika user meminta commit, staging dan commit harus dilakukan secara eksplisit setelah memastikan file yang masuk commit memang sesuai request.
