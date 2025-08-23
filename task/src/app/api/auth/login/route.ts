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

    const requestData = {
      username: body.username,
      password: body.password,
    };

    const res = await api.post("/auth/login", requestData);

    // Return the response which should include the token
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: error.response?.data?.message || error.message || "Login failed",
      },
      { status: error.response?.status || 500 }
    );
  }
}
