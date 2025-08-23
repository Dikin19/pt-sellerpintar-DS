import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Set default role if not provided
    const requestData = {
      username: body.username,
      password: body.password,
      role: body.role,
    };

    const res = await api.post("/auth/register", requestData);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      },
      { status: error.response?.status || 500 }
    );
  }
}
