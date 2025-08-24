import { NextRequest, NextResponse } from "next/server";
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
      isArray: Array.isArray(res.data),
      hasPagination: !!(
        res.data &&
        typeof res.data === "object" &&
        "data" in res.data
      ),
      totalItems: res.data?.data?.length || res.data?.length || 0,
    });

    if (res.data?.data) {
      console.log(
        "Sample articles:",
        res.data.data.slice(0, 2).map((a: any) => ({
          id: a.id,
          title: a.title?.substring(0, 50) + "...",
          hasCategory: !!a.category,
        }))
      );
    }

    // Return the response with expected format
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("=== ARTICLE API ERROR ===", error);
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
<<<<<<< HEAD
});

// POST - Only accessible by Admin
export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);

=======
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);
    
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
    const body = await request.json();

    if (!body.title || !body.content || !body.categoryId) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const res = await api.post("/articles", {
      title: body.title,
      content: body.content,
      categoryId: body.categoryId,
    });
<<<<<<< HEAD

=======
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Create article error:", error);
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
<<<<<<< HEAD
});
=======
}
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
