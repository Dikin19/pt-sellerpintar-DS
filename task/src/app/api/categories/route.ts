import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
import {
  withUserAuth,
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// GET - Accessible by both Admin and User (read categories)
export const GET = withUserAuth(async (request: AuthenticatedRequest) => {
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);

    // Get query parameters for pagination and search
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    if (search) {
      queryParams.append("search", search);
    }

    const res = await api.get(`/categories?${queryParams}`);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch categories",
      },
      { status: error.response?.status || 500 }
    );
  }
});

// POST - Only accessible by Admin (create category)
export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
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

    const res = await api.post("/categories", {
      name: body.name,
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create category",
      },
      { status: error.response?.status || 500 }
    );
  }
});
