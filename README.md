## Deskripsi Proyek

Project ini merupakan aplikasi backend sederhana yang menggunakan Node.js dan TypeScript untuk mengelola user dan post. Struktur proyek sudah diatur agar mudah dikembangkan dan dipelihara.

## Fitur Utama

- Autentikasi pengguna
- Manajemen user
- Manajemen post
- Middleware untuk otentikasi dan penanganan error

## Struktur Folder

├── .env.example # Contoh file environment
├── fix_users_table.sql # Skrip SQL untuk memperbaiki tabel users
├── package-lock.json # Lock file npm
├── package.json # Konfigurasi npm
├── schema.sql # Skrip SQL untuk membuat skema database
├── src/
│ ├── helper/
│ │ └── utils.ts # Fungsi utilitas
│ ├── index.ts # Entry point aplikasi
│ ├── middleware/
│ │ ├── auth.ts # Middleware autentikasi
│ │ └── error.ts # Middleware error handling
│ ├── models/
│ │ ├── Post.ts # Model Post
│ │ ├── User.ts # Model User
│ │ └── index.ts # Inisialisasi model
│ └── routes/
│ ├── auth.ts # Routing autentikasi
│ └── posts.ts # Routing post
└── tsconfig.json # Konfigurasi TypeScript

## Instalasi

1. Clone repository ini
2. Install dependencies: `npm install`
3. Konfigurasi environment: Salin `.env.example` menjadi `.env` dan isi dengan data yang sesuai
4. Buat database dan import skema: `mysql -u root -p < schema.sql`
5. Jalankan aplikasi: `npm start`

## Testing

1. Jalankan test: `npm test`

## Dokumentasi API

- Swagger: `http://localhost:${PORT}/api-docs`
