# 📚 Article Management System

Sistem manajemen artikel dan kategori berbasis web yang dibangun dengan Next.js 15, dilengkapi dengan autentikasi role-based dan fitur CRUD lengkap.

## 🌟 Fitur Utama

### 🔐 Autentikasi & Otorisasi
- ✅ **Registrasi & Login** dengan validasi form komprehensif
- ✅ **Role-based Access Control** (Admin/User)
- ✅ **JWT Token Authentication** untuk keamanan
- ✅ **Auto-redirect** setelah login/logout
- ✅ **Protected Routes** untuk halaman admin
- ✅ **Password Security** dengan validasi kekuatan password
- ✅ **Session Management** dengan auto-logout

### 👤 Fitur User
- ✅ **Browse Articles** dengan pagination (9 item per halaman)
- ✅ **Filter by Category** untuk pencarian spesifik
- ✅ **Search Articles** dengan debounced input (400ms delay)
- ✅ **Detail Article View** dengan konten lengkap
- ✅ **Related Articles** dari kategori yang sama (maksimal 3)
- ✅ **Responsive Design** untuk mobile, tablet, dan desktop
- ✅ **Loading States** dan error handling yang baik
- ✅ **Toast Notifications** untuk feedback user

### 🛠️ Fitur Admin
- ✅ **Article Management** (Create, Read, Update, Delete)
- ✅ **Category Management** (Create, Read, Update, Delete)
- ✅ **Advanced Search & Filter** dengan debounced input
- ✅ **Pagination** untuk dataset besar (10+ items)
- ✅ **Form Validation** dengan preview functionality
- ✅ **Bulk Operations** support
- ✅ **Admin Dashboard** dengan statistik
- ✅ **Content Preview** sebelum publish

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context (Auth)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios dengan interceptors
- **Icons**: Lucide React
- **TypeScript**: Full type safety

### Backend API
- **External API**: https://test-fe.mysellerpintar.com/api
- **Authentication**: JWT tokens
- **CORS**: Configured untuk cross-origin requests

### Development Tools
- **ESLint**: Code linting dan best practices
- **PostCSS**: CSS processing dan optimization
- **TypeScript**: Static type checking

## 📁 Struktur Proyek

```
src/
├── app/                           # Next.js App Router pages
│   ├── admin/                     # 🔐 Admin panel pages (Protected)
│   │   ├── page.tsx              # Dashboard admin
│   │   ├── [id]/                 # Admin detail pages
│   │   ├── articles/             # Admin article management
│   │   └── categories/           # Admin category management
│   ├── articles/                  # 📖 Public article pages
│   │   ├── page.tsx              # Article listing dengan filter
│   │   └── [id]/                 # Detail artikel
│   ├── api/                       # 🔌 API route handlers
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/            # POST /api/auth/login
│   │   │   └── register/         # POST /api/auth/register
│   │   ├── articles/             # Article endpoints
│   │   │   ├── route.ts          # GET, POST /api/articles
│   │   │   └── [id]/             # GET, PUT, DELETE /api/articles/[id]
│   │   │       ├── route.ts      # CRUD operations
│   │   │       └── image/        # Image handling
│   │   └── categories/           # Category endpoints
│   │       ├── route.ts          # GET, POST /api/categories
│   │       └── [id]/             # GET, PUT, DELETE /api/categories/[id]
│   ├── dashboard/                 # 📊 User dashboard
│   ├── login/                     # 🔑 Login page
│   ├── register/                  # 📝 Registration page
│   ├── permissions/               # 👥 Role & permissions info
│   └── styles/                    # 🎨 Global styles
├── components/                    # 🧩 Reusable components
│   ├── admin/                    # Admin-specific components
│   │   ├── admin-header.tsx      # Admin navigation
│   │   ├── admin-layout.tsx      # Admin page layout
│   │   ├── admin-sidebar.tsx     # Admin navigation sidebar
│   │   ├── admin-welcome-banner.tsx # Welcome message
│   │   ├── articles/             # Admin article components
│   │   └── categories/           # Admin category components
│   ├── articles/                 # Article display components
│   │   ├── article-card.tsx      # Article preview card
│   │   ├── article-filters.tsx   # Search & category filters
│   │   ├── article-grid.tsx      # Grid layout untuk articles
│   │   └── article-list.tsx      # List layout untuk articles
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx        # Login form dengan validation
│   │   ├── register-form.tsx     # Registration form
│   │   ├── role-guard.tsx        # Protected route wrapper
│   │   ├── permissions-dashboard.tsx # Role permissions display
│   │   └── role-welcome-banner.tsx   # Role-based welcome
│   ├── categories/               # Category components
│   │   └── category-list.tsx     # Category listing
│   ├── forms/                    # Form components
│   │   └── category-form.tsx     # Category create/edit form
│   ├── layout/                   # Layout components
│   │   ├── dashboard-layout.tsx  # Main app layout
│   │   └── sidebar.tsx           # Main navigation sidebar
│   └── ui/                       # 🎨 Base UI components (shadcn/ui)
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card component
│       ├── form.tsx              # Form utilities
│       ├── input.tsx             # Input component
│       ├── loading-spinner.tsx   # Loading indicators
│       ├── pagination.tsx        # Pagination component
│       ├── search-input.tsx      # Search input dengan debounce
│       ├── toast.tsx             # Toast notifications
│       └── ...                   # Other UI components
├── contexts/                      # 🔄 React contexts
│   └── auth-context.tsx          # Authentication state management
├── hooks/                         # 🎣 Custom React hooks
│   ├── use-articles.ts           # Article data fetching
│   ├── use-categories.ts         # Category data fetching
│   ├── use-debounce.ts           # Debounced search functionality
│   ├── use-login.ts              # Login form handling
│   ├── use-register.ts           # Registration form handling
│   ├── use-search-articles.ts    # Article search functionality
│   ├── use-toast.ts              # Toast notification hook
│   └── use-validation.ts         # Form validation utilities
├── lib/                           # 📚 Utilities & configurations
│   ├── api.ts                    # API client functions
│   ├── axios.ts                  # Axios configuration
│   ├── auth-middleware.ts        # Route protection middleware
│   ├── form-validation.ts        # Enhanced form validation
│   ├── server-api.ts             # Server-side API utilities
│   ├── toast-utils.ts            # Toast notification utilities
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # General utilities
└── types/                         # 📋 TypeScript type definitions
    └── index.ts                  # Application interfaces
```

## 🔌 API Documentation

### Base Configuration
- **External API**: `https://test-fe.mysellerpintar.com/api`
- **Local Proxy**: `http://localhost:3000/api`
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`

### 🔐 Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "testuser",      // 3-20 karakter, alfanumerik + underscore
  "password": "password123",   // 6-100 karakter, validasi kekuatan
  "role": "User"              // "Admin" atau "User"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "username": "testuser",
    "role": "User"
  }
}
```

**Validasi:**
- Username: Unique, 3-20 karakter, hanya alfanumerik dan underscore
- Password: 6-100 karakter, kompleksitas divalidasi
- Role: Harus "Admin" atau "User"

#### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "username": "testuser",
    "role": "User"
  }
}
```

### 📰 Articles Endpoints

#### 3. Get Articles (Public + Private)
**GET** `/api/articles`

**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Items per halaman (default: 9 untuk user, 10 untuk admin)
- `search` (optional): Pencarian dalam title/content
- `categoryId` (optional): Filter berdasarkan kategori

**Headers:**
- `Authorization: Bearer <token>` (optional, memberikan akses lebih banyak data)

**Example Request:**
```
GET /api/articles?page=1&limit=10&search=javascript&categoryId=cat-123
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "article-123",
      "title": "Belajar JavaScript Modern",
      "content": "Content lengkap artikel...",
      "userId": "user-456",
      "categoryId": "cat-123",
      "createdAt": "2025-08-23T11:24:30.354Z",
      "updatedAt": "2025-08-23T11:24:30.354Z",
      "category": {
        "id": "cat-123",
        "name": "Programming",
        "userId": "admin-789",
        "createdAt": "2025-08-23T11:24:30.354Z",
        "updatedAt": "2025-08-23T11:24:30.354Z"
      },
      "user": {
        "id": "user-456",
        "username": "author1",
        "role": "Admin"
      }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### 4. Get Single Article
**GET** `/api/articles/[id]`

**Headers:**
- `Authorization: Bearer <token>` (optional)

**Response (200 OK):**
```json
{
  "id": "article-123",
  "title": "Belajar JavaScript Modern",
  "content": "Content lengkap artikel dengan detail...",
  "userId": "user-456",
  "categoryId": "cat-123",
  "createdAt": "2025-08-23T11:24:30.354Z",
  "updatedAt": "2025-08-23T11:24:30.354Z",
  "category": {
    "id": "cat-123",
    "name": "Programming"
  },
  "user": {
    "id": "user-456",
    "username": "author1",
    "role": "Admin"
  }
}
```

#### 5. Create Article (Admin Only)
**POST** `/api/articles`

**Headers:**
- `Authorization: Bearer <admin-token>` (Required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Artikel Baru",          // 5-200 karakter
  "content": "Content artikel...",  // 50-10,000 karakter
  "categoryId": "cat-123"          // ID kategori yang valid
}
```

**Response (201 Created):**
```json
{
  "id": "article-new",
  "title": "Artikel Baru",
  "content": "Content artikel...",
  "userId": "admin-id",
  "categoryId": "cat-123",
  "createdAt": "2025-08-25T12:00:00.000Z",
  "updatedAt": "2025-08-25T12:00:00.000Z"
}
```

#### 6. Update Article (Admin Only)
**PUT** `/api/articles/[id]`

**Headers:**
- `Authorization: Bearer <admin-token>` (Required)

**Request Body:** Same as Create Article

**Response (200 OK):** Updated article object

#### 7. Delete Article (Admin Only)
**DELETE** `/api/articles/[id]`

**Headers:**
- `Authorization: Bearer <admin-token>` (Required)

**Response (200 OK):**
```json
{
  "message": "Article deleted successfully"
}
```

### 📂 Categories Endpoints

#### 8. Get Categories
**GET** `/api/categories`

**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Items per halaman (default: 10)
- `search` (optional): Pencarian dalam nama kategori

**Headers:**
- `Authorization: Bearer <token>` (optional)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "cat-123",
      "name": "Programming",
      "userId": "admin-789",
      "createdAt": "2025-08-23T11:24:30.354Z",
      "updatedAt": "2025-08-23T11:24:30.354Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### 9. Create Category (Admin Only)
**POST** `/api/categories`

**Headers:**
- `Authorization: Bearer <admin-token>` (Required)

**Request Body:**
```json
{
  "name": "New Category"  // 2-50 karakter, alfanumerik + spasi/hyphen
}
```

#### 10. Update Category (Admin Only)
**PUT** `/api/categories/[id]`

**Headers:**
- `Authorization: Bearer <admin-token>` (Required)

#### 11. Delete Category (Admin Only)
**DELETE** `/api/categories/[id]`

**Headers:**
- `Authorization: Bearer <admin-token>` (Required)

## ⚡ Getting Started

### 📋 Prerequisites
- **Node.js**: 18.0.0 atau lebih baru
- **npm**: 8.0.0 atau yarn sebagai package manager
- **Browser**: Chrome, Firefox, Safari, atau Edge terbaru

### 🚀 Installation

1. **Clone Repository**
```bash
git clone https://github.com/Dikin19/pt-sellerpintar-DS.git
cd pt-sellerpintar-DS/task
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

3. **Environment Setup**
```bash
# Copy environment file (jika ada)
cp .env.example .env.local
```

4. **Start Development Server**
```bash
npm run dev
# atau
yarn dev
```

5. **Open Application**
   - Browser: [http://localhost:3000](http://localhost:3000)
   - API Base: [http://localhost:3000/api](http://localhost:3000/api)

### 🏗️ Build for Production

```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

### 🔧 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 📖 Cara Penggunaan

### 👤 Untuk User Biasa

1. **Registrasi/Login**
   - Buka halaman register: `/register`
   - Isi form dengan username, password, dan pilih role "User"
   - Setelah berhasil, login di halaman `/login`

2. **Browse Articles**
   - Halaman utama menampilkan daftar artikel dengan pagination
   - Gunakan search bar untuk mencari artikel spesifik
   - Filter berdasarkan kategori menggunakan dropdown
   - Klik artikel untuk membaca detail lengkap

3. **Fitur Pencarian**
   - Search otomatis dengan debounce 400ms
   - Pencarian berdasarkan title dan content
   - Filter kategori tersedia di sidebar

4. **Detail Artikel**
   - Baca artikel lengkap dengan formatting
   - Lihat related articles di bagian bawah
   - Navigasi antar artikel dengan mudah

### 🛠️ Untuk Admin

1. **Login Admin**
   - Login dengan role "Admin"
   - Akses otomatis ke admin panel di `/admin`

2. **Article Management**
   - **Create**: Buat artikel baru dengan form validation
   - **Edit**: Update artikel existing dengan preview
   - **Delete**: Hapus artikel dengan konfirmasi
   - **View**: Lihat semua artikel dengan pagination advanced

3. **Category Management**
   - **Create**: Buat kategori baru dengan validasi
   - **Edit**: Update nama kategori
   - **Delete**: Hapus kategori (jika tidak ada artikel terkait)
   - **Search**: Cari kategori dengan debounced search

4. **Admin Dashboard**
   - Overview statistik artikel dan kategori
   - Quick actions untuk management
   - Recent activities dan logs

### 🔐 Role & Permissions

#### User Role
- ✅ Browse dan search articles
- ✅ View article details
- ✅ Access public content
- ❌ Cannot create/edit/delete

#### Admin Role
- ✅ Semua hak User
- ✅ Create, edit, delete articles
- ✅ Manage categories
- ✅ Access admin panel
- ✅ View advanced statistics

## ✅ Form Validation

### 🔑 Authentication Forms

#### Login Form
- **Username**: 
  - Required field
  - 3-20 karakter
  - Hanya alfanumerik dan underscore (_)
  - Real-time validation
- **Password**: 
  - Required field
  - 6-100 karakter
  - Validasi kekuatan (warnings untuk weak password)

#### Register Form
- **Username**: Same as login + uniqueness check
- **Password**: 
  - 6-100 karakter minimum
  - Kekuatan password validation:
    - Weak: < 3 kriteria
    - Moderate: 3-4 kriteria
    - Strong: 5 kriteria (uppercase, lowercase, numbers, special chars, length ≥8)
- **Role**: Required selection (Admin/User)
- **Confirm Password**: Must match password field

### 📝 Article Form (Admin Only)

- **Title**: 
  - Required field
  - 5-200 karakter
  - No HTML tags allowed
- **Content**: 
  - Required field
  - 50-10,000 karakter
  - Rich text formatting supported
- **Category**: 
  - Required selection
  - Must be existing category ID
- **Preview**: Real-time preview available

### 🏷️ Category Form (Admin Only)

- **Name**: 
  - Required field
  - 2-50 karakter
  - Alfanumerik dengan spasi dan hyphen
  - Uniqueness validation
  - Auto-capitalization

### 🛡️ Advanced Validation Features

- **Real-time Validation**: Form errors muncul saat user mengetik
- **Toast Notifications**: Success/error feedback dengan toast
- **Client & Server Validation**: Double validation untuk security
- **Debounced Input**: Pencegahan spam validation requests
- **Custom Error Messages**: Pesan error yang user-friendly
- **Form State Management**: Loading, success, error states

## 🎯 Fitur yang Diimplementasi

### ✅ **Authentication System**
- [x] Login/Register forms dengan validasi komprehensif
- [x] JWT token management dan auto-refresh
- [x] Role-based access control (Admin/User)
- [x] Auto-redirect berdasarkan role
- [x] Session persistence dan logout
- [x] Protected routes middleware
- [x] Password strength validation

### ✅ **Article Management**
- [x] CRUD operations untuk articles (Admin)
- [x] Article browsing dengan pagination (User)
- [x] Category filtering dan advanced search
- [x] Pagination (9 items untuk user, 10 untuk admin)
- [x] Related articles functionality
- [x] Rich text content display
- [x] Article preview dalam admin form
- [x] Debounced search (400ms delay)

### ✅ **Category Management**
- [x] CRUD operations untuk categories (Admin only)
- [x] Category search dengan debounce
- [x] Pagination untuk large lists
- [x] Category validation dan uniqueness
- [x] Auto-capitalization untuk category names

### ✅ **User Interface & Experience**
- [x] Fully responsive design (mobile-first)
- [x] Loading states dan skeleton screens
- [x] Error handling dengan user-friendly messages
- [x] Success feedback dengan toast notifications
- [x] Form preview functionality
- [x] Dark/light mode support (via Tailwind)
- [x] Smooth animations dan transitions
- [x] Accessibility features (ARIA labels, keyboard navigation)

### ✅ **Admin Panel**
- [x] Dedicated admin interface dengan sidebar
- [x] Admin dashboard dengan statistics
- [x] Advanced filtering options
- [x] Bulk management capabilities
- [x] Form validation dengan real-time preview
- [x] Admin-only route protection
- [x] Quick actions dan shortcuts

### ✅ **Technical Implementation**
- [x] **Type Safety**: Full TypeScript implementation
- [x] **Performance**: Debounced search, efficient pagination
- [x] **UX**: Loading states, error boundaries, responsive design
- [x] **Security**: Protected routes, input sanitization
- [x] **Code Quality**: ESLint, consistent naming, modular structure
- [x] **API Integration**: Axios dengan interceptors dan error handling
- [x] **State Management**: Context API untuk authentication
- [x] **Form Handling**: React Hook Form + Zod validation

## 🛠️ Best Practices yang Diterapkan

### 📝 **Code Quality**
- **TypeScript**: 100% type coverage untuk type safety
- **ESLint**: Consistent code style dan best practices
- **Component Structure**: Modular, reusable components
- **Naming Convention**: Clear, descriptive naming
- **Error Handling**: Comprehensive error boundaries

### 🚀 **Performance**
- **Debounced Search**: Mengurangi API calls yang tidak perlu
- **Pagination**: Efficient data loading
- **Lazy Loading**: Components loaded when needed
- **Memoization**: React.memo untuk expensive components
- **Image Optimization**: Next.js Image component

### 🔒 **Security**
- **Input Validation**: Client dan server-side validation
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based authentication
- **Role-based Access**: Route dan feature protection
- **Password Security**: Strength validation dan hashing

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first approach
- **Loading States**: Clear feedback untuk user actions
- **Error Messages**: User-friendly error communication
- **Accessibility**: WCAG guidelines compliance
- **Intuitive Navigation**: Clear information architecture

### 🔧 **Development Experience**
- **Hot Reload**: Fast development dengan Next.js
- **Type Safety**: Compile-time error catching
- **Component Library**: Reusable UI components (shadcn/ui)
- **Development Tools**: Comprehensive debugging tools

## 🧪 Testing dengan Postman

### 🔧 Setup Postman Environment

1. **Create New Environment**
   - Name: `Article Management API`
   - Variables:
     - `baseUrl`: `http://localhost:3000/api`
     - `token`: (akan diisi setelah login)

### 📝 Test Scenarios

#### 1. **Test Register User**

**Method**: `POST`  
**URL**: `{{baseUrl}}/auth/register`  
**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "username": "testuser123",
  "password": "SecurePass123!",
  "role": "User"
}
```

**Expected Response (201)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "username": "testuser123",
    "role": "User"
  }
}
```

#### 2. **Test Login User**

**Method**: `POST`  
**URL**: `{{baseUrl}}/auth/login`  
**Headers**:
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "username": "testuser123",
  "password": "SecurePass123!"
}
```

**Expected Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "username": "testuser123",
    "role": "User"
  }
}
```

**Post-Response Script**:
```javascript
// Auto-save token to environment
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    pm.environment.set("token", responseJson.token);
    console.log("Token saved:", responseJson.token);
}
```

#### 3. **Test Get Articles (Public)**

**Method**: `GET`  
**URL**: `{{baseUrl}}/articles?page=1&limit=10`  
**Headers**:
```
Content-Type: application/json
```

#### 4. **Test Get Articles (Authenticated)**

**Method**: `GET`  
**URL**: `{{baseUrl}}/articles?page=1&limit=10&search=javascript`  
**Headers**:
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

#### 5. **Test Get Single Article**

**Method**: `GET`  
**URL**: `{{baseUrl}}/articles/article-id-here`  
**Headers**:
```
Authorization: Bearer {{token}}
```

#### 6. **Test Create Article (Admin Only)**

**Method**: `POST`  
**URL**: `{{baseUrl}}/articles`  
**Headers**:
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body**:
```json
{
  "title": "Tutorial JavaScript Modern untuk Pemula",
  "content": "Dalam tutorial ini, kita akan mempelajari dasar-dasar JavaScript modern yang mencakup ES6+ features, async/await, dan banyak lagi. JavaScript telah berkembang pesat dalam beberapa tahun terakhir...",
  "categoryId": "category-id-here"
}
```

#### 7. **Test Get Categories**

**Method**: `GET`  
**URL**: `{{baseUrl}}/categories?page=1&limit=10`  
**Headers**:
```
Authorization: Bearer {{token}}
```

#### 8. **Test Create Category (Admin Only)**

**Method**: `POST`  
**URL**: `{{baseUrl}}/categories`  
**Headers**:
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body**:
```json
{
  "name": "Web Development"
}
```

### 🔍 Advanced Testing

#### **Search Articles with Filters**
```
GET {{baseUrl}}/articles?page=1&limit=5&search=react&categoryId=web-dev-123
```

#### **Test Error Handling**
```json
// Invalid data untuk testing validation
{
  "username": "ab",     // Too short
  "password": "123",    // Too weak
  "role": "Invalid"     // Invalid role
}
```

#### **Test Pagination**
```
GET {{baseUrl}}/articles?page=2&limit=5
GET {{baseUrl}}/articles?page=999&limit=10  // Test invalid page
```

### 📊 Response Examples

#### **Success Response**:
```json
{
  "data": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### **Error Response**:
```json
{
  "error": "Username must be at least 3 characters",
  "status": 400
}
```

#### **Validation Error**:
```json
{
  "error": "Title, content, and category are required",
  "status": 400
}
```

### ⚠️ Important Notes

- **Token Expiration**: JWT tokens mungkin expire, perlu login ulang
- **CORS**: Pastikan server berjalan di `localhost:3000`
- **Role Permissions**: Beberapa endpoints hanya bisa diakses Admin
- **Rate Limiting**: API mungkin memiliki rate limiting
- **Data Persistence**: Data disimpan di external API server

## 📱 Component Documentation

### 🔐 Authentication Components

#### `LoginForm` (`src/components/auth/login-form.tsx`)
**Props:**
- `onSubmit?: (data: LoginFormData) => Promise<void>`
- `isLoading?: boolean`
- `error?: string | null`
- `clearError?: () => void`

**Features:**
- Password visibility toggle
- Real-time validation
- Auto-clear errors on input change
- Form submission dengan loading state

#### `RegisterForm` (`src/components/auth/register-form.tsx`)
**Features:**
- Role selection (Admin/User)
- Password strength validation
- Confirm password matching
- Enhanced validation dengan warnings

#### `RoleGuard` (`src/components/auth/role-guard.tsx`)
**Props:**
- `allowedRoles: string[]`
- `children: React.ReactNode`
- `fallback?: React.ReactNode`

**Purpose:** Proteksi component berdasarkan user role

### 📰 Article Components

#### `ArticleCard` (`src/components/articles/article-card.tsx`)
**Props:**
- `article: Article`
- `showCategory?: boolean`
- `showAuthor?: boolean`

**Features:**
- Responsive card layout
- Category badge
- Author information
- Read more link

#### `ArticleGrid` (`src/components/articles/article-grid.tsx`)
**Props:**
- `articles: Article[]`
- `loading?: boolean`
- `error?: string`

**Features:**
- Grid layout responsif
- Loading skeleton
- Empty state handling

#### `ArticleFilters` (`src/components/articles/article-filters.tsx`)
**Props:**
- `onSearch: (query: string) => void`
- `onCategoryChange: (categoryId: string) => void`
- `categories: Category[]`

**Features:**
- Debounced search input
- Category dropdown filter
- Clear filters option

### 🏷️ Category Components

#### `CategoryForm` (`src/components/forms/category-form.tsx`)
**Props:**
- `category?: Category`
- `mode: 'create' | 'edit'`

**Features:**
- Form validation dengan Zod
- Real-time validation feedback
- Success/error toast notifications

#### `CategoryList` (`src/components/categories/category-list.tsx`)
**Props:**
- `categories: Category[]`
- `onEdit?: (category: Category) => void`
- `onDelete?: (categoryId: string) => void`

### 🎨 UI Components (shadcn/ui)

#### `Button` (`src/components/ui/button.tsx`)
**Variants:**
- `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`

**Sizes:**
- `default` | `sm` | `lg` | `icon`

#### `Input` (`src/components/ui/input.tsx`)
**Props:** Standard HTML input props + className styling

#### `Card` (`src/components/ui/card.tsx`)
**Components:**
- `Card` - Container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Description text
- `CardContent` - Main content
- `CardFooter` - Footer actions

#### `Pagination` (`src/components/ui/pagination.tsx`)
**Props:**
- `currentPage: number`
- `totalPages: number`
- `onPageChange: (page: number) => void`

#### `LoadingSpinner` (`src/components/ui/loading-spinner.tsx`)
**Props:**
- `size?: 'sm' | 'md' | 'lg'`
- `className?: string`

#### `Toast` (`src/components/ui/toast.tsx`)
**Usage via hooks:**
```typescript
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()
toast({
  title: "Success",
  description: "Action completed successfully",
  variant: "default" | "destructive"
})
```

### 🏗️ Layout Components

#### `DashboardLayout` (`src/components/layout/dashboard-layout.tsx`)
**Props:**
- `children: React.ReactNode`
- `title?: string`

**Features:**
- Responsive sidebar
- Header dengan user menu
- Navigation breadcrumbs

#### `AdminLayout` (`src/components/admin/admin-layout.tsx`)
**Features:**
- Admin-specific navigation
- Role-based menu items
- Quick action buttons

### 🎣 Custom Hooks

#### `useArticles` (`src/hooks/use-articles.ts`)
```typescript
const {
  articles,
  loading,
  error,
  pagination,
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle
} = useArticles()
```

#### `useCategories` (`src/hooks/use-categories.ts`)
```typescript
const {
  categories,
  loading,
  error,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = useCategories()
```

#### `useDebounce` (`src/hooks/use-debounce.ts`)
```typescript
const debouncedValue = useDebounce(searchTerm, 400)
```

#### `useLogin` (`src/hooks/use-login.ts`)
```typescript
const {
  loginUser,
  isLoading,
  error,
  clearError
} = useLogin()
```

### 🔧 Utility Functions

#### API Functions (`src/lib/api.ts`)
- `login(credentials: LoginFormData)`
- `register(userData: RegisterFormData)`
- `getArticles(params: ArticleParams)`
- `createArticle(data: ArticleFormData)`
- `updateArticle(id: string, data: ArticleFormData)`
- `deleteArticle(id: string)`
- `getCategories(params: CategoryParams)`
- `createCategory(data: CategoryFormData)`

#### Validation Utils (`src/lib/form-validation.ts`)
- `validateLoginForm(data: LoginFormData)`
- `validateRegisterForm(data: RegisterFormData)`
- `validateArticleForm(data: ArticleFormData)`
- `validateCategoryForm(data: CategoryFormData)`

#### Toast Utils (`src/lib/toast-utils.ts`)
- `showSuccessToast(message: string)`
- `showErrorToast(message: string)`
- `showWarningToast(message: string)`
- `showPromiseToast(promise: Promise<any>, messages: ToastMessages)`

### 📋 TypeScript Interfaces

```typescript
// User & Authentication
interface User {
  id: string
  username: string
  role: "Admin" | "User"
  email?: string
}

// Articles
interface Article {
  id: string
  title: string
  content: string
  userId: string
  categoryId: string
  createdAt: string
  updatedAt: string
  category: Category
  user: User
}

// Categories
interface Category {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
}

// API Responses
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

## 🚀 Deployment Guide

### 🌐 Production Deployment

#### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### **Netlify**
```bash
# Build command
npm run build

# Publish directory
.next
```

#### **Docker Deployment**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 🔧 Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://test-fe.mysellerpintar.com/api
NODE_ENV=production
```

### ⚡ Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic dengan Next.js App Router
- **Caching**: API responses di-cache dengan proper headers
- **Bundle Analysis**: `npm run build` untuk analisis bundle size

## 🐛 Troubleshooting

### Common Issues

#### **CORS Errors**
```bash
# Pastikan API external mengizinkan domain Anda
# Cek network tab di browser developer tools
```

#### **Authentication Issues**
```bash
# Clear localStorage
localStorage.clear()

# Check token validity
console.log(localStorage.getItem('auth-token'))
```

#### **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### **API Connection Issues**
```bash
# Check external API status
curl https://test-fe.mysellerpintar.com/api/articles

# Verify local server
curl http://localhost:3000/api/articles
```

### 🤝 Contributing Guidelines

1. **Fork** repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### 📧 Contact

- **Developer**: [Dikin19](https://github.com/Dikin19)
- **Repository**: [pt-sellerpintar-DS](https://github.com/Dikin19/pt-sellerpintar-DS)

---

**Made with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**
