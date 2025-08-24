# Role-Based Access Control (RBAC) Implementation

## Overview

# Role-Based Access Control (RBAC) Implementation

## Overview

Sistem ini telah diimplementasikan dengan role-based access control yang membedakan akses antara role **Admin** dan **User**. Setelah login, user akan otomatis diarahkan ke halaman yang sesuai dengan role mereka.

## 🔄 Role-Based Login Redirect

### Automatic Redirect After Login

- **Admin** → `/admin/articles` (Admin Dashboard)
- **User** → `/articles` (Public Articles Page)

### Homepage Redirect

Ketika mengakses root path `/`, user akan otomatis diarahkan berdasarkan role:

- **Logged-in Admin** → Admin Dashboard
- **Logged-in User** → Articles Page
- **Not logged in** → Login Page

## Roles dan Permissions

### Admin Role

**Akses penuh untuk semua operasi:**

- ✅ **Create** - Membuat artikel dan kategori baru
- ✅ **Read** - Membaca semua artikel dan kategori
- ✅ **Update** - Mengedit artikel dan kategori yang ada
- ✅ **Delete** - Menghapus artikel dan kategori
- ✅ **Access Admin Panel** - Akses ke dashboard admin
- ✅ **Manage Content** - Manajemen semua konten

### User Role

**Akses read-only (hanya membaca):**

- ✅ **Read** - Membaca artikel dan melihat detail
- ✅ **View Categories** - Melihat daftar kategori
- ✅ **Search & Filter** - Mencari dan memfilter artikel
- ✅ **Navigate** - Navigasi antar halaman
- ❌ **Create/Edit/Delete** - Tidak bisa membuat, mengedit, atau menghapus

## Implementation Details

### 1. Role-Based Redirect System

**Utility Functions** (`/lib/role-utils.ts`):

- `getRoleBasedRedirectPath(role)` - Determines redirect destination
- `isPathAccessibleForRole(path, role)` - Validates path access
- `getRoleMenuItems(role)` - Gets role-specific navigation
- `getRoleWelcomeMessage(role)` - Returns personalized welcome message

**Login Flow**:

1. User submits login credentials
2. API validates and returns user data with role
3. `useLogin` hook calls `getRoleBasedRedirectPath()`
4. User redirected to appropriate dashboard

**Homepage Logic**:

- Checks authentication status
- If authenticated, redirects based on user role
- If not authenticated, redirects to login

### 2. Welcome Banners & User Experience

**Role-Specific Welcome Components**:

- `RoleWelcomeBanner` - General welcome for articles page
- `AdminWelcomeBanner` - Enhanced admin dashboard welcome

**Features**:

- Personalized welcome messages
- Role-specific navigation hints
- Quick access buttons based on permissions
- Visual role indicators and badges

### 3. Backend API Protection

Semua API routes telah dilindungi dengan middleware authentication:

**Protected Endpoints:**

- `POST /api/articles` - Admin only (create article)
- `PUT /api/articles/[id]` - Admin only (edit article)
- `DELETE /api/articles/[id]` - Admin only (delete article)
- `POST /api/categories` - Admin only (create category)
- `PUT /api/categories/[id]` - Admin only (edit category)
- `DELETE /api/categories/[id]` - Admin only (delete category)

**Public Endpoints (with auth):**

- `GET /api/articles` - Admin & User (read articles)
- `GET /api/articles/[id]` - Admin & User (read article detail)
- `GET /api/categories` - Admin & User (read categories)

### 4. Frontend Route Protection

**RoleGuard Component:**
Komponen wrapper yang melindungi halaman berdasarkan role.

```tsx
// Admin only pages
<RoleGuard allowedRoles={["Admin"]}>
  <AdminComponent />
</RoleGuard>

// Both Admin and User
<RoleGuard allowedRoles={["Admin", "User"]}>
  <ArticleComponent />
</RoleGuard>
```

**Protected Pages:**

- `/admin/*` - Admin only
- `/articles` - Admin & User (dengan UI berbeda)
- `/articles/[id]` - Admin & User (dengan indikator read-only untuk User)

### 5. UI Differences by Role

**Admin Interface:**

- Full admin dashboard dengan sidebar
- Create/Edit/Delete buttons visible
- Admin panel access button
- Content management features

**User Interface:**

- Read-only article views
- No admin panel access
- "View Permissions" button untuk melihat akses
- Visual indicators menunjukkan read-only mode
- Warning messages tentang keterbatasan akses

### 6. Auth Context & Permissions

**useAuth Hook:**

```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

**usePermission Hook:**

```tsx
const { isAdmin, isUser, hasRole } = usePermission();
```

### 7. Error Handling

**Access Denied Screen:**

- Tampil ketika user mencoba mengakses halaman yang tidak diizinkan
- Menampilkan role yang dibutuhkan vs role saat ini
- Link untuk kembali ke halaman yang diizinkan

**API Error Responses:**

- `401 Unauthorized` - Token tidak valid/tidak ada
- `403 Forbidden` - Role tidak memiliki permission
- Error message yang jelas tentang permission yang dibutuhkan

## Usage Examples

### 1. Login dengan Different Roles

**Admin Login:**

- Username: admin_user
- Akses: Full dashboard, CRUD operations, admin panel

**User Login:**

- Username: regular_user
- Akses: Read-only articles, categories view only

### 2. API Request Headers

Semua request harus menyertakan:

```
Authorization: Bearer <token>
```

### 3. Frontend Components Usage

**Conditional Rendering berdasarkan Role:**

```tsx
{
  isAdmin() && <Button onClick={handleCreate}>Create New Article</Button>;
}

{
  !isAdmin() && <Badge variant="outline">Read-only access</Badge>;
}
```

## Security Features

1. **JWT Token Validation** - Setiap request divalidasi
2. **Role-based API Protection** - Endpoint dilindungi berdasarkan role
3. **Frontend Route Guards** - Halaman dilindungi di client-side
4. **Automatic Redirects** - User diarahkan sesuai permission
5. **Session Management** - Token management & refresh

## Testing Access Control

### Test Admin Access:

1. Login sebagai Admin
2. Navigate ke `/admin` - Should succeed
3. Try creating/editing articles - Should succeed
4. Access all CRUD operations - Should succeed

### Test User Access:

1. Login sebagai User
2. Navigate ke `/admin` - Should show access denied
3. Try artikel CRUD via direct API - Should get 403 error
4. View articles & details - Should succeed (read-only)

## Visual Indicators

**Role Badges:**

- Admin: Blue badge with "Admin" text
- User: Green badge with "User" text

**Access Indicators:**

- "Read-only mode" labels untuk User
- Shield icons untuk permission warnings
- Color-coded UI elements (green=allowed, red=restricted)

**Navigation:**

- Admin: "Admin Panel" button visible
- User: "View Permissions" button to see access rights

## Future Enhancements

1. **More Granular Permissions** - Sub-roles within Admin/User
2. **Content Ownership** - Users can edit own content only
3. **Approval Workflows** - User submissions require admin approval
4. **Audit Logging** - Track all CRUD operations by role
5. **Dynamic Role Assignment** - Admin can change user roles
