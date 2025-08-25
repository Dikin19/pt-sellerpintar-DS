import { NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
import {
  withUserAuth,
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// GET - Accessible by both Admin and User
export const GET = withUserAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const res = await api.get(`/articles/${params.id}`);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Article GET error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch article",
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

      if (!body.title || !body.content || !body.categoryId) {
        return NextResponse.json(
          { error: "Title, content, and category are required" },
          { status: 400 }
        );
      }

      const res = await api.put(`/articles/${params.id}`, body);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Article PUT error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to update article",
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

      await api.delete(`/articles/${params.id}`);
      return NextResponse.json({ message: "Article deleted successfully" });
    } catch (error: any) {
      console.error("Article DELETE error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to delete article",
        },
        { status: error.response?.status || 500 }
      );
    }
  }
);
