import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
<<<<<<< HEAD
import {
  withUserAuth,
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// GET - Accessible by both Admin and User (read categories)
export const GET = withUserAuth(async (request: AuthenticatedRequest) => {
=======

export async function GET(request: NextRequest) {
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);

<<<<<<< HEAD
    // Get query parameters for pagination and search
=======
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

<<<<<<< HEAD
    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    if (search) {
      queryParams.append("search", search);
    }

=======
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    });

>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
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
<<<<<<< HEAD
});

// POST - Only accessible by Admin (create category)
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

    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

<<<<<<< HEAD
    const res = await api.post("/categories", {
      name: body.name,
    });

=======
    const res = await api.post("/categories", { name: body.name });
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
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
<<<<<<< HEAD
});
=======
}
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
