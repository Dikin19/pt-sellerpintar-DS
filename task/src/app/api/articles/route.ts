import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";

export async function GET(request: NextRequest) {
  try {
    // Get authentication token from request headers
    const token = getTokenFromRequest(request);

    // Create authenticated API instance
    const api = createAuthenticatedApi(token || undefined);

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    const res = await api.get(`/articles?${queryParams}`);

    // Return the response with expected format
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Articles fetch error:", error);
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
}
