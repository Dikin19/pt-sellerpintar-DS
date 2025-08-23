# API Documentation

## Base URL

- Local Development: `http://localhost:3001/api`
- External API: `https://test-fe.mysellerpintar.com/api`

## Authentication Endpoints

### 1. Register User

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "role": "User"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "role": "User"
  }
}
```

### 2. Login User

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response:**

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
