import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, createAuthenticatedApi } from "@/lib/server-api";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    username: string;
    role: "Admin" | "User";
    email?: string;
  };
}

export async function withAuth(
  handler: (
    request: AuthenticatedRequest,
    ...args: any[]
  ) => Promise<NextResponse>,
  requiredRoles?: ("Admin" | "User")[]
) {
  return async function (request: NextRequest, ...args: any[]) {
    try {
      const token = getTokenFromRequest(request);

      if (!token) {
        return NextResponse.json(
          { error: "Authentication token required" },
          { status: 401 }
        );
      }

      // Verify token and get user data
      const api = createAuthenticatedApi(token);
      const userResponse = await api.get("/auth/me");
      const user = userResponse.data;

      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      // Check role permissions if required
      if (requiredRoles && requiredRoles.length > 0) {
        const hasPermission = requiredRoles.includes(user.role);
        if (!hasPermission) {
          return NextResponse.json(
            {
              error: `Access denied. Required role: ${requiredRoles.join(
                " or "
              )}. Your role: ${user.role}`,
              requiredRoles,
              userRole: user.role,
            },
            { status: 403 }
          );
        }
      }

      // Add user to request object
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = user;

      return handler(authenticatedRequest, ...args);
    } catch (error: any) {
      console.error("Authentication middleware error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

// Convenience functions for common role checks
export function withAdminAuth(
  handler: (
    request: AuthenticatedRequest,
    ...args: any[]
  ) => Promise<NextResponse>
) {
  return withAuth(handler, ["Admin"]);
}

export function withUserAuth(
  handler: (
    request: AuthenticatedRequest,
    ...args: any[]
  ) => Promise<NextResponse>
) {
  return withAuth(handler, ["User", "Admin"]);
}

export function withAnyAuth(
  handler: (
    request: AuthenticatedRequest,
    ...args: any[]
  ) => Promise<NextResponse>
) {
  return withAuth(handler);
}
