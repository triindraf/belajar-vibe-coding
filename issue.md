# Implementasi Endpoint Get Current User (Elysia.js)

## Deskripsi Tugas
Tugas ini adalah mengimplementasikan fitur untuk mengambil data profil user yang sedang login (Current User) dengan cara memvalidasi token session yang dikirimkan melalui header `Authorization`.

## 1. Spesifikasi API Get Current User

Buat endpoint untuk mengambil data user yang sedang login.

- **Endpoint:** `GET /api/users/current`
- **Headers:**
  - `Authorization: Bearer <token>`
    *(Token adalah UUID yang tersimpan di tabel `session` dari hasil proses login).*

**Response Body - Success (200 OK):**
```json
{
    "data": {
        "id": 1,
        "name": "tri",
        "email": "tri@localhost",
        "createdAt": "2026-08-17T10:00:00.000Z"
    }
}
```

**Response Body - Error (401 Unauthorized):**
```json
{
    "error": "Unauthorized"
}
```
*(Dikembalikan jika header Authorization tidak disisipkan, formatnya salah, atau token tidak ditemukan/tidak valid di database).*

## 2. Struktur Folder & File

Gunakan struktur folder dan penamaan file berikut di dalam direktori `src/` (lanjutkan pada file yang sudah ada):

- `src/routes/` : Berisi routing Elysia.js.
  - File: `src/routes/users-route.ts` (Tambahkan route baru di sini)
- `src/services/` : Berisi logic bisnis aplikasi.
  - File: `src/services/users-service.ts` (Tambahkan fungsi untuk get current user di sini)

## 3. Tahapan Implementasi yang Harus Dilakukan

Ikuti langkah-langkah berikut untuk menyelesaikan fitur ini secara sistematis:

### Langkah 1: Buat Service Layer (`src/services/users-service.ts`)
1. Buka file `src/services/users-service.ts`.
2. Tambahkan method statis baru, misalnya `getCurrentUser(token: string)`.
3. **Validasi Token & Ambil Data User:** Lakukan query menggunakan Drizzle ORM. Lakukan operasi `JOIN` (bisa dengan Inner Join) antara tabel `session` dan tabel `users` untuk mencari baris data di mana nilai `session.token` sama dengan parameter `token`.
4. Jika hasil query tidak menemukan kecocokan, maka lemparkan (throw) sebuah custom error, misalnya `throw new Error("Unauthorized")`.
5. Jika data ditemukan, buat object baru dari hasil query yang hanya berisi profil user (`id`, `name`, `email`, `createdAt`). Pastikan untuk **membuang/tidak mengikutsertakan kolom password** demi keamanan.
6. Kembalikan (return) object profil user tersebut.

### Langkah 2: Tambahkan Route Handler (`src/routes/users-route.ts`)
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan deklarasi route baru untuk method GET: `.get('/current', handler)`.
3. Di dalam parameter handler, ambil nilai dari header request (khususnya header `authorization`). Di Elysia, Anda bisa mengaksesnya via properti `headers`.
4. **Pengecekan Header:** Periksa apakah header `authorization` ada. Jika tidak ada, langsung atur `set.status = 401` dan kembalikan JSON `{ "error": "Unauthorized" }`.
5. **Ekstraksi Token:** Biasanya nilai authorization berbentuk `"Bearer <uuid-token>"`. Lakukan pemisahan (misalnya menggunakan `.split(' ')`) untuk mengekstrak string tokennya saja. Jika formatnya bukan Bearer token, kembalikan status `401 Unauthorized`.
6. Panggil method `UsersService.getCurrentUser(token)`.
7. Tangani response dengan `try-catch`:
   - Jika berhasil, kembalikan JSON `{ "data": result }`.
   - Jika `catch` menangkap error (misal pesan error "Unauthorized"), atur HTTP status menjadi `401`, lalu kembalikan JSON `{ "error": "Unauthorized" }`.
   - Untuk error sistem lainnya, atur HTTP status menjadi `500` dan kembalikan error bawaan.

### Langkah 3: Pengujian (Testing)
1. Buka file `test/users.test.ts`.
2. **Test Case 1 (Sukses):** Buat *spy/mock* pada method `getCurrentUser` di `UsersService` agar mengembalikan data user palsu (dummy). Lakukan HTTP request GET ke `/api/users/current` dengan menyertakan header `Authorization: Bearer token-dummy`. Lakukan assertion (expect) untuk memastikan mendapat HTTP 200 dan data user yang benar.
3. **Test Case 2 (Gagal Tanpa Header):** Lakukan request GET tanpa menyisipkan header Authorization. Pastikan HTTP status adalah 401 dengan JSON error "Unauthorized".
4. **Test Case 3 (Token Tidak Valid):** Buat *mock* yang mensimulasikan kegagalan dari service (melempar error "Unauthorized"). Lakukan request GET dengan menyisipkan token acak. Pastikan mendapat HTTP 401 dan pesan error yang sesuai.
