import { NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
import {
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// GET - Only accessible by Admin
export const GET = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const res = await api.get(`/categories/${params.id}`);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Category GET error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch category",
        },
        { status: error.response?.status || 500 }
      );
    }
  }
);

// PUT - Only accessible by Admin
export const PUT = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const body = await request.json();

      // Validate ID parameter
      if (!params.id || params.id.trim() === "") {
        return NextResponse.json(
          { error: "Category ID is required" },
          { status: 400 }
        );
      }

      // Validate request body
      if (!body.name || body.name.trim() === "") {
        return NextResponse.json(
          { error: "Category name is required" },
          { status: 400 }
        );
      }

      const sanitizedId = params.id.trim();

      console.log("PUT /api/categories/[id] - Updating category:", {
        id: sanitizedId,
        name: body.name,
        originalParams: params,
      });

      const res = await api.put(`/categories/${sanitizedId}`, body);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Category PUT error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.error || error.response?.data?.message || "";

        if (errorMessage.includes("Record to update not found")) {
          return NextResponse.json(
            {
              error: `Category with ID "${params.id}" was not found. It may have been deleted by another user.`,
            },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to update category",
        },
        { status: error.response?.status || 500 }
      );
    }
  }
);

// DELETE - Only accessible by Admin
export const DELETE = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      // Validate ID parameter
      if (!params.id || params.id.trim() === "") {
        return NextResponse.json(
          { error: "Category ID is required" },
          { status: 400 }
        );
      }

      const sanitizedId = params.id.trim();

      console.log("DELETE /api/categories/[id] - Deleting category:", {
        id: sanitizedId,
        originalParams: params,
      });

      await api.delete(`/categories/${sanitizedId}`);
      return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      console.error("Category DELETE error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.error || error.response?.data?.message || "";

        if (
          errorMessage.includes("Record to update not found") ||
          errorMessage.includes("not found")
        ) {
          return NextResponse.json(
            {
              error: `Category with ID "${params.id}" was not found. It may have already been deleted.`,
            },
            { status: 404 }
          );
        }

        if (
          errorMessage.includes("constraint") ||
          errorMessage.includes("foreign key")
        ) {
          return NextResponse.json(
            {
              error:
                "Cannot delete this category because it's being used by existing articles. Please move the articles to another category first.",
            },
            { status: 409 }
          );
        }
      }

      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to delete category",
        },
        { status: error.response?.status || 500 }
      );
    }
  }
);
