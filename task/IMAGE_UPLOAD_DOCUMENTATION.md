# Image Upload Feature Documentation

## Overview

This document describes the image upload functionality implemented for the Article Management System. The feature allows administrators to upload images for articles through a dedicated API endpoint.

## API Endpoints

### Upload Article Image

**Endpoint**: `PUT /api/articles/[id]/image`

**Description**: Upload an image for a specific article

**Authentication**: Admin only

**Request Body**:

```
Content-Type: multipart/form-data

image: File (binary)
```

**Request Body Specifications**:

- **Field Name**: `image`
- **Type**: `File` (binary)
- **Supported Formats**: JPEG, JPG, PNG, GIF, WebP
- **Maximum Size**: 5MB
- **Required**: Yes

**Response**:

```json
{
  "imageUrl": "https://your-s3-bucket.amazonaws.com/uploads/image123.jpg"
}
```

**Error Responses**:

- `400 Bad Request`: Invalid file type or size
- `401 Unauthorized`: No authentication token
- `403 Forbidden`: Insufficient permissions (non-admin user)
- `404 Not Found`: Article not found
- `500 Internal Server Error`: Server error

## Implementation Details

### Frontend Components

#### 1. ImageUploadDialog Component

**File**: `src/components/admin/articles/image-upload-dialog.tsx`

Features:

- File selection with drag-and-drop support
- Image preview before upload
- File type and size validation
- Progress indication during upload
- Toast notifications for success/error states

#### 2. AdminArticleTable Component

**File**: `src/components/admin/articles/admin-article-table.tsx`

Enhanced with:

- "Upload Image" option in dropdown menu
- Image thumbnail display in table

#### 3. Admin Articles Page

**File**: `src/app/admin/articles/page.tsx`

Updated with:

- Image upload dialog integration
- State management for upload dialog

### API Route Implementation

**File**: `src/app/api/articles/[id]/image/route.ts`

Features:

- Admin-only access control using `withAdminAuth` middleware
- File type validation (JPEG, PNG, GIF, WebP)
- File size validation (5MB limit)
- FormData handling for multipart uploads
- Error handling with appropriate HTTP status codes
- Integration with backend API

### API Client Integration

**File**: `src/lib/api.ts`

Added function:

```typescript
export async function uploadArticleImage(
  id: string,
  imageFile: File
): Promise<{ imageUrl: string }>;
```

## Usage

### For Administrators

1. Navigate to Admin > Articles
2. Find the article you want to add an image to
3. Click the three-dot menu (⋯) for that article
4. Select "Upload Image"
5. Choose an image file (JPEG, PNG, GIF, or WebP, max 5MB)
6. Preview the image
7. Click "Upload" to submit

### For Developers

#### Using the API directly:

```javascript
const formData = new FormData();
formData.append("image", imageFile);

fetch("/api/articles/123/image", {
  method: "PUT",
  headers: {
    Authorization: "Bearer your-admin-token",
  },
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log("Image URL:", data.imageUrl));
```

#### Using the API client:

```typescript
import { uploadArticleImage } from "@/lib/api";

const result = await uploadArticleImage("article-id", imageFile);
console.log("Image URL:", result.imageUrl);
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── articles/
│   │       └── [id]/
│   │           └── image/
│   │               └── route.ts          # Image upload API route
│   └── admin/
│       └── articles/
│           └── page.tsx                  # Admin articles page (updated)
├── components/
│   └── admin/
│       └── articles/
│           ├── admin-article-table.tsx   # Table component (updated)
│           └── image-upload-dialog.tsx   # New upload dialog component
└── lib/
    └── api.ts                           # API client (updated)
```

## Security Features

- **Authentication**: Only authenticated users can access the endpoint
- **Authorization**: Only Admin users can upload images
- **File Validation**: Strict file type and size validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Input Sanitization**: Automatic sanitization through Next.js

## Future Enhancements

1. **Drag and Drop**: Enhanced drag-and-drop functionality
2. **Multiple Images**: Support for multiple image uploads per article
3. **Image Editing**: Basic image editing capabilities (crop, resize)
4. **Cloud Storage**: Direct integration with cloud storage providers
5. **Image Optimization**: Automatic image compression and optimization
6. **Alt Text**: Support for image alt text and captions

## Error Handling

The implementation includes comprehensive error handling:

- **Client-side**: Form validation, file type/size checks, user-friendly error messages
- **Server-side**: Proper HTTP status codes, detailed error messages, logging
- **Network**: Timeout handling, retry mechanisms, offline support

## Testing

To test the image upload functionality:

1. Ensure you're logged in as an Admin user
2. Navigate to the Articles management page
3. Try uploading different file types and sizes
4. Verify error handling with invalid files
5. Check that uploaded images appear in the article thumbnails

## Troubleshooting

### Common Issues

1. **File too large**: Ensure file is under 5MB
2. **Unsupported format**: Use JPEG, PNG, GIF, or WebP
3. **Upload fails**: Check network connection and authentication token
4. **Permission denied**: Ensure user has Admin role
