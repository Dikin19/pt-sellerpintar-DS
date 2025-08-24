import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/axios";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Forward the request to the backend API with the authorization header
    const res = await api.get("/auth/me", {
      headers: {
        Authorization: authHeader,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to get user data",
      },
      { status: error.response?.status || 500 }
    );
  }
}
