import { NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
import {
  withUserAuth,
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// GET - Accessible by both Admin and User
export const GET = withUserAuth(async (request: AuthenticatedRequest) => {
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);

    // Get query parameters for pagination, search, and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";

    console.log("=== ARTICLE API REQUEST ===");
    console.log("Page:", page);
    console.log("Limit:", limit);
    console.log("Search:", search);
    console.log("CategoryId:", categoryId);

    // Build query string - only add parameters that have values
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search && search.trim().length > 0) {
      queryParams.append("search", search.trim());
      console.log("✓ Adding search parameter");
    }

    if (categoryId && categoryId.trim().length > 0) {
      queryParams.append("categoryId", categoryId.trim());
      console.log("✓ Adding categoryId parameter");
    }

    const apiUrl = `/articles?${queryParams.toString()}`;
    console.log("Final API URL:", apiUrl);

    const res = await api.get(apiUrl);

    console.log("=== BACKEND RESPONSE ===");
    console.log("Status:", res.status);
    console.log("Data structure:", {
      hasData: !!res.data,
      dataKeys: res.data ? Object.keys(res.data) : [],
      dataType: Array.isArray(res.data) ? "array" : typeof res.data,
    });

    // Check if response has pagination structure
    if (res.data && typeof res.data === "object" && "data" in res.data) {
      console.log("✓ Paginated response detected");
      console.log("Articles count:", res.data.data?.length || 0);
      console.log("Total items:", res.data.total || 0);
      console.log("Current page:", res.data.page || 1);
      console.log("Total pages:", res.data.totalPages || 1);
    } else if (Array.isArray(res.data)) {
      console.log("✓ Direct array response");
      console.log("Articles count:", res.data.length);
    }

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Articles GET error:", error);
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
          "Failed to fetch articles",
      },
      { status: error.response?.status || 500 }
    );
  }
});

// POST - Only accessible by Admin
export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
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

    const res = await api.post("/articles", body);
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.error("Articles POST error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create article",
      },
      { status: error.response?.status || 500 }
    );
  }
});
