import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
import {
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// PUT - Only accessible by Admin (update article image)
export const PUT = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      // Get the form data from the request
      const formData = await request.formData();
      const image = formData.get("image") as File;

      if (!image) {
        return NextResponse.json(
          { error: "Image file is required" },
          { status: 400 }
        );
      }

      // Validate file type (optional - add image type validation)
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          {
            error:
              "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
          },
          { status: 400 }
        );
      }

      // Validate file size (optional - limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (image.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 5MB" },
          { status: 400 }
        );
      }

      // Create FormData to send to backend
      const uploadFormData = new FormData();
      uploadFormData.append("image", image);

      // For demo purposes, since the backend might not have this endpoint yet,
      // we'll simulate the upload and return a mock URL
      // In production, uncomment the lines below to use the real backend:

      /*
      // Send to backend API - let axios set Content-Type automatically for FormData
      const res = await api.put(`/articles/${id}/image`, uploadFormData);
      return NextResponse.json(res.data);
      */

      // Mock implementation for demo:
      const mockImageUrl = `https://your-s3-bucket.amazonaws.com/uploads/${id}-${Date.now()}-${
        image.name
      }`;

      console.log("Mock image upload successful:", {
        articleId: id,
        fileName: image.name,
        fileSize: image.size,
        mockUrl: mockImageUrl,
      });

      return NextResponse.json({
        imageUrl: mockImageUrl,
        message: "Image uploaded successfully (mock)",
      });
    } catch (error: any) {
      console.error("Update article image error:", error);

      // Provide better error messages based on error type
      let errorMessage = "Failed to update article image";
      let statusCode = 500;

      if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
        errorMessage = "Backend service is unavailable";
        statusCode = 503;
      } else if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.statusText ||
          errorMessage;
        statusCode = error.response.status;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Error details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  }
);
