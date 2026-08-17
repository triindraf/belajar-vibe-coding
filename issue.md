# Issue: Implement User Logout API

## Deskripsi Tugas
Tugas ini adalah membuat endpoint API untuk fitur logout user. Fitur ini bertugas untuk menghapus data session pengguna berdasarkan token yang diberikan.

## Spesifikasi API

- **Endpoint:** `DELETE /api/users/logout`
- **Headers:**
  - `Authorization: Bearer <token>` (Token ini adalah token yang valid dan tersimpan di table session/user)

### Response

**Success Response (200 OK):**
```json
{
  "data": "OK"
}
```
*Syarat/Efek Samping (Side-effect): Jika sukses logout, maka data session dengan token tersebut harus dihapus dari database (table session).*

**Error Response (401 Unauthorized):**
*Kondisi: Jika token tidak dikirimkan, tidak valid, atau tidak ditemukan di database.*
```json
{
  "error": "Unauthorized"
}
```

## Struktur Proyek & File
- Direktori `src/routes/`: Berisi definisi routing menggunakan framework Elysia JS.
- Direktori `src/services/`: Berisi logika bisnis (business logic) aplikasi.

**Target File yang Harus Dimodifikasi:**
- **File Route:** `src/routes/users-route.ts`
- **File Service:** `src/services/users-service.ts`

---

## Tahapan Implementasi (Step-by-Step Guide)

Ikuti panduan langkah demi langkah berikut untuk mengimplementasikan fitur logout:

### 1. Implementasi Logika Bisnis di Service (`src/services/users-service.ts`)
- Buka file `src/services/users-service.ts`.
- Tambahkan sebuah function atau method baru, misalnya bernama `logout(token: string)`.
- Di dalam method `logout` tersebut, buat query ke database untuk mencari data session berdasarkan token yang diberikan.
- Jika data session dengan token tersebut **tidak ditemukan**, throw sebuah Error (misalnya `ResponseError(401, "Unauthorized")` atau sesuai konvensi error handling yang ada di proyek ini).
- Jika data session **ditemukan**, eksekusi query hapus (DELETE) untuk menghapus record session tersebut dari tabel database.
- Kembalikan response (atau string) yang sesuai agar bisa digunakan oleh controller/route untuk membentuk response `{ data: "OK" }`.

### 2. Implementasi Routing dan Handler (`src/routes/users-route.ts`)
- Buka file `src/routes/users-route.ts`.
- Daftarkan endpoint baru `delete('/api/users/logout', ...)` (atau sesuaikan dengan grup routing yang mungkin sudah ada).
- Di dalam handler route tersebut, pastikan kamu membaca header `Authorization`.
- Ekstrak nilai token dari format `Bearer <token>`.
- Jika header tidak ada atau tidak menggunakan format Bearer, langsung kembalikan response HTTP Status 401 dengan JSON `{ "error": "Unauthorized" }`.
- Jika token berhasil diekstrak, panggil method `UserService.logout(token)` yang sudah dibuat pada Langkah 1.
- Jika eksekusi service berhasil, kembalikan HTTP Status 200 beserta JSON `{ "data": "OK" }`.
- Pastikan semua error yang dilempar oleh service tertangkap dengan baik dan menghasilkan response `{ "error": "Unauthorized" }` dengan status HTTP 401.

### 3. Pengujian (Testing)
- Jika ada file test (misal `test/users.test.ts`), buatlah minimal dua skenario pengujian:
  - **Skenario Positif:** Test request hapus dengan token yang valid. Pastikan HTTP response adalah 200 OK, body berisikan `{ "data": "OK" }`, dan pastikan record session di database benar-benar sudah terhapus (hilang).
  - **Skenario Negatif:** Test request hapus tanpa header token atau dengan token asal-asalan. Pastikan HTTP response adalah 401 Unauthorized dan body berisikan `{ "error": "Unauthorized" }`.
