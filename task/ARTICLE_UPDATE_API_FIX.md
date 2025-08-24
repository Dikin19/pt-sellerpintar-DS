# Perbaikan API PUT Articles/{id}

## Perubahan yang Dilakukan

### 1. API Backend (Sudah Benar)

- Endpoint: `PUT /api/articles/{id}`
- Request body hanya menggunakan 3 field:
  ```json
  {
    "title": "string",
    "content": "string",
    "categoryId": "string"
  }
  ```
- Response tetap lengkap sesuai spesifikasi:
  ```json
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "userId": "string",
    "categoryId": "string",
    "createdAt": "2025-08-24T05:37:44.162Z",
    "updatedAt": "2025-08-24T05:37:44.162Z",
    "category": {
      "id": "string",
      "name": "string",
      "userId": "string",
      "createdAt": "2025-08-24T05:37:44.162Z",
      "updatedAt": "2025-08-24T05:37:44.162Z"
    },
    "user": {
      "id": "string",
      "username": "string",
      "role": "User"
    }
  }
  ```

### 2. Frontend Changes

#### Validations (`lib/validations.ts`)

- Ditambahkan `articleUpdateSchema` untuk validasi form update yang hanya menggunakan 3 field
- Ditambahkan type `ArticleUpdateData` untuk TypeScript

#### Form Dialog (`components/admin/articles/article-form-dialog.tsx`)

- Menggunakan `ArticleUpdateData` dan `articleUpdateSchema` untuk form editing
- Field `excerpt` dan `thumbnail` dihapus dari form UI
- Preview tidak lagi menampilkan excerpt dan thumbnail
- Auto-generate excerpt dari content saat membuat artikel baru

#### API Client (`lib/api.ts`)

- Function `updateArticle` sekarang menggunakan `ArticleUpdateData`
- Hanya mengirim 3 field yang dibutuhkan: title, content, categoryId

#### Admin Article Table (`components/admin/articles/admin-article-table.tsx`)

- Kolom thumbnail dihapus
- Excerpt dihapus dari tampilan title
- Tampilan lebih sederhana hanya menampilkan: Title, Category, Created Date

#### Article Card (`components/articles/article-card.tsx`)

- Tetap menggunakan content field untuk preview (sudah sesuai)
- Tidak ada perubahan karena sudah tidak menggunakan excerpt

### 3. Fitur yang Dipertahankan

- Create article tetap mendukung semua field (auto-generate excerpt dari content)
- Response API tetap lengkap sesuai spesifikasi
- Frontend menampilkan data sesuai yang di-request (hanya 3 field)

### 4. Benefits

- Form lebih sederhana dan fokus pada 3 field utama
- API request lebih ringan
- UI lebih clean tanpa field yang tidak diperlukan
- Tetap backward compatible untuk artikel yang sudah ada
