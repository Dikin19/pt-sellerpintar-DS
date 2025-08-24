import { NextRequest, NextResponse } from "next/server";
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

      if (!body.name) {
        return NextResponse.json(
          { error: "Category name is required" },
          { status: 400 }
        );
      }

      const res = await api.put(`/categories/${params.id}`, body);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Category PUT error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
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

      await api.delete(`/categories/${params.id}`);
      return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      console.error("Category DELETE error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to delete category",
        },
        { status: error.response?.status || 500 }
      );
    }
  }
);
