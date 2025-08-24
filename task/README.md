# Article Management System

A full-stack Next.js application for managing articles and categories with role-based authentication.

## Features

### Authentication & Authorization

- ✅ User registration and login with form validation
- ✅ Role-based access control (Admin/User)
- ✅ JWT token-based authentication
- ✅ Automatic redirect after login/logout
- ✅ Protected routes

### User Features

- ✅ Browse articles with pagination (9 items per page)
- ✅ Filter articles by category
- ✅ Search articles with debounced input (400ms delay)
- ✅ View detailed article content
- ✅ Related articles from same category (up to 3)
- ✅ Responsive design for mobile, tablet, and desktop

### Admin Features

- ✅ Article management (CRUD operations)
- ✅ Category management (CRUD operations)
- ✅ Advanced filtering and search (debounced)
- ✅ Pagination for large datasets (10+ items)
- ✅ Form validation with preview functionality
- ✅ Bulk operations support

## Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context (Auth)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend API

- **External API**: https://test-fe.mysellerpintar.com/api-docs/

### Development Tools

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin panel pages
│   ├── articles/          # Article pages
│   ├── api/               # API route handlers
│   └── login/             # Auth pages
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── articles/         # Article components
│   ├── auth/             # Authentication components
│   └── ui/               # Base UI components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
└── lib/                  # Utilities and configurations
```

## API Integration

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile

### Article Endpoints

- `GET /articles` - List articles with filtering and pagination
- `GET /articles/{id}` - Get single article
- `POST /articles` - Create article (Admin only)
- `PUT /articles/{id}` - Update article (Admin only)
- `DELETE /articles/{id}` - Delete article (Admin only)

### Category Endpoints

- `GET /categories` - List categories with pagination
- `POST /categories` - Create category (Admin only)
- `PUT /categories/{id}` - Update category (Admin only)
- `DELETE /categories/{id}` - Delete category (Admin only)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd article-management-system
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### For Users

1. Register/Login to access the system
2. Browse articles on the main page
3. Use search and category filters to find specific content
4. Click on articles to read full content
5. View related articles at the bottom of each article

### For Admins

1. Login with admin credentials
2. Access the admin panel from the user menu
3. Manage articles: create, edit, delete
4. Manage categories: create, edit, delete
5. Use advanced filtering and search capabilities

## Form Validation

All forms include comprehensive validation:

### Article Form

- Title: 5-200 characters
- Content: 50-10,000 characters
- Category: Required selection

### Category Form

- Name: 2-50 characters, alphanumeric with spaces/hyphens

### Authentication Forms

- Username: 3-20 characters, alphanumeric with underscores
- Password: 6-100 characters
- Role selection: Admin/User

## Features Implemented

✅ **Authentication System**

- Login/Register forms with validation
- JWT token management
- Role-based access control
- Automatic redirects

✅ **Article Management**

- CRUD operations for articles
- Category filtering and search
- Pagination (9 items for users, 10 for admin)
- Related articles functionality

✅ **Category Management**

- CRUD operations for categories
- Search with debounce
- Pagination for large lists

✅ **User Interface**

- Responsive design
- Loading states
- Error handling
- Success feedback
- Preview functionality for articles

✅ **Admin Panel**

- Dedicated admin interface
- Advanced filtering options
- Bulk management capabilities
- Form validation with preview

## Best Practices Implemented

- **Type Safety**: Full TypeScript implementation
- **Performance**: Debounced search, pagination, lazy loading
- **UX**: Loading states, error boundaries, responsive design
- **Security**: Protected routes, role-based access
- **Code Quality**: ESLint, consistent naming, modular structure
- **Accessibility**: Semantic HTML, keyboard navigation
- **SEO**: Meta tags, proper heading structure

## API Documentation

### Base URL

- External API: `https://test-fe.mysellerpintar.com/api`

### Authentication Endpoints

#### Register User

**POST** `/api/auth/register`

Request Body:

```json
{
  "username": "string",
  "password": "string",
  "role": "User"
}
```

#### Login User

**POST** `/api/auth/login`

Request Body:

```json
{
  "username": "string",
  "password": "string"
}
```

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "User"
  }
}
```

## Articles Endpoints

### 3. Get Articles

**GET** `/api/articles`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Headers:**

- `Authorization: Bearer <token>` (optional)

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "userId": "string",
      "categoryId": "string",
      "createdAt": "2025-08-23T11:24:30.354Z",
      "updatedAt": "2025-08-23T11:24:30.354Z",
      "category": {
        "id": "string",
        "name": "string",
        "userId": "string",
        "createdAt": "2025-08-23T11:24:30.354Z",
        "updatedAt": "2025-08-23T11:24:30.354Z"
      },
      "user": {
        "id": "string",
        "username": "string",
        "role": "User"
      }
    }
  ],
  "total": 0,
  "page": 0,
  "limit": 0
}
```

## Testing with Postman

### 1. Test Register

- Method: POST
- URL: `http://localhost:3001/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "username": "testuser",
  "password": "testpassword",
  "role": "User"
}
```

### 2. Test Login

- Method: POST
- URL: `http://localhost:3001/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

### 3. Test Get Articles

- Method: GET
- URL: `http://localhost:3001/api/articles?page=1&limit=10`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token_from_login>` (if authentication is required)

## Notes

- All endpoints proxy requests to `https://test-fe.mysellerpintar.com/api`
- Token from login should be stored and used for authenticated requests
- The server handles CORS and request forwarding automatically
