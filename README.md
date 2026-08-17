# Backend Starter: Bun + ElysiaJS + Drizzle ORM + MySQL

Proyek backend modern menggunakan kombinasi teknologi berkinerja tinggi:
- **Runtime**: [Bun](https://bun.sh)
- **Web Framework**: [ElysiaJS](https://elysiajs.com)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Database**: [MySQL](https://www.mysql.com) (`mysql2` driver)

---

## Struktur Direktori

```text
.
├── drizzle/              # Folder file migrasi SQL hasil generate
├── src/
│   ├── db/
│   │   ├── index.ts      # Inisialisasi koneksi pool & Drizzle ORM
│   │   └── schema.ts     # Definisi skema tabel database
│   └── index.ts          # Server utama ElysiaJS & routing
├── test/
│   └── index.test.ts     # Unit testing
├── .env.example          # Template konfigurasi environment
├── drizzle.config.ts     # Konfigurasi Drizzle Kit
├── package.json          # Dependencies & npm scripts
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## Persiapan & Menjalankan Aplikasi

### 1. Salin Environment
Salin template `.env.example` ke `.env` lalu sesuaikan kredensial database MySQL Anda:
```bash
cp .env.example .env
```

### 2. Jalankan Migrasi Database (Opsional)
Untuk menghasilkan file migrasi SQL dari schema:
```bash
bun run db:generate
```
Untuk mengaplikasikan schema langsung ke database MySQL:
```bash
bun run db:push
```

### 3. Menjalankan Server
Mode Development (auto-reload):
```bash
bun run dev
```

Mode Production:
```bash
bun run start
```

### 4. Menjalankan Test
```bash
bun test
```

---

## Endpoint API

- `GET /` : Health check status server.
- `GET /api/users` : Mendapatkan daftar seluruh user dari MySQL.
- `POST /api/users` : Menambahkan user baru (Body: `{ "name": "John Doe", "email": "john@example.com" }`).
