## Deskripsi Proyek

Project ini merupakan aplikasi backend sederhana yang menggunakan Node.js dan TypeScript untuk mengelola user dan post. Struktur proyek sudah diatur agar mudah dikembangkan dan dipelihara.

## Fitur Utama

- Autentikasi pengguna
- Manajemen user
- Manajemen post
- Middleware untuk otentikasi dan penanganan error

## Struktur Folder

├── .env.example           # Contoh file environment <br>
├── package-lock.json      # Lock file npm <br>
├── package.json           # Konfigurasi npm <br>
├── schema.sql             # Skrip SQL untuk membuat skema database <br>
├── src/ <br>
│   ├── helper/ <br>
│   │   └── utils.ts       # Fungsi utilitas <br>
│   ├── index.ts           # Entry point aplikasi <br>
│   ├── middleware/ <br>
│   │   ├── auth.ts        # Middleware autentikasi <br>
│   │   └── error.ts       # Middleware error handling <br>
│   ├── models/ <br>
│   │   ├── Post.ts        # Model Post <br>
│   │   ├── User.ts        # Model User <br>
│   │   └── index.ts       # Inisialisasi model <br>
│   └── routes/ <br>
│       ├── auth.ts        # Routing autentikasi <br>
│       └── posts.ts       # Routing post <br>
└── tsconfig.json          # Konfigurasi TypeScript <br>

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

