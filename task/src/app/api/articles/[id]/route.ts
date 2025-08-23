import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);

    const res = await api.get(`/articles/${params.id}`);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const res = await api.put(`/articles/${params.id}`, {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);

    const res = await api.delete(`/articles/${params.id}`);
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