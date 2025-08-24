import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedApi, getTokenFromRequest } from "@/lib/server-api";
<<<<<<< HEAD
import {
  withAdminAuth,
  type AuthenticatedRequest,
} from "@/lib/auth-middleware";

// PUT - Only accessible by Admin (edit category)
export const PUT = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const body = await request.json();

      if (!body.name) {
        return NextResponse.json(
          { error: "Category name is required" },
          { status: 400 }
        );
      }

      const res = await api.put(`/categories/${id}`, {
        name: body.name,
      });
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Update category error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to update category",
        },
        { status: error.response?.status || 500 }
      );
    }
  }
);

// DELETE - Only accessible by Admin (delete category)
export const DELETE = withAdminAuth(
  async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const token = getTokenFromRequest(request);
      const api = createAuthenticatedApi(token || undefined);

      const res = await api.delete(`/categories/${id}`);
      return NextResponse.json(res.data);
    } catch (error: any) {
      console.error("Delete category error:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to delete category",
        },
        { status: error.response?.status || 500 }
      );
    }
  }
);
=======

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    const api = createAuthenticatedApi(token || undefined);

    const res = await api.get(`/categories/${params.id}`);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch category",
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

    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const res = await api.put(`/categories/${params.id}`, { name: body.name });
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Update category error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update category",
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

    const res = await api.delete(`/categories/${params.id}`);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete category",
      },
      { status: error.response?.status || 500 }
    );
  }
}
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
