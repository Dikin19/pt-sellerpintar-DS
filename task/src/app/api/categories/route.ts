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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    console.log("=== CATEGORIES API REQUEST ===");
    console.log("Page:", page);
    console.log("Limit:", limit);
    console.log("Search:", search);

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search && search.trim().length > 0) {
      queryParams.append("search", search.trim());
      console.log("✓ Adding search parameter");
    }

    const apiUrl = `/categories?${queryParams.toString()}`;
    console.log("Final API URL:", apiUrl);

    const res = await api.get(apiUrl);

    console.log("=== BACKEND RESPONSE ===");
    console.log("Status:", res.status);
    console.log("Data structure:", {
      hasData: !!res.data,
      dataKeys: res.data ? Object.keys(res.data) : [],
      dataType: Array.isArray(res.data) ? "array" : typeof res.data,
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Categories GET error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

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

// POST - Only accessible by Admin (create categories)
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

    const res = await api.post("/categories", body);
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.error("Categories POST error:", error);
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
