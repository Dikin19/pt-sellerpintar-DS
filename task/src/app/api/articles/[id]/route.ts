import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
import {
  withUserAuth,
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// GET - Accessible by both Admin and User (read article detail)
export const GET = withUserAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const res = await api.get(`/articles/${id}`);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Article fetch error:", error);
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

// PUT - Only accessible by Admin (edit article)
export const PUT = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const body = await request.json();

      if (!body.title || !body.content || !body.categoryId) {
        return NextResponse.json(
          { error: "Title, content, and category are required" },
          { status: 400 }
        );
      }

      const res = await api.put(`/articles/${id}`, {
        title: body.title,
        content: body.content,
        categoryId: body.categoryId,
      });
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Update article error:", error);
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

// DELETE - Only accessible by Admin (delete article)
export const DELETE = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const res = await api.delete(`/articles/${id}`);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Delete article error:", error);
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
