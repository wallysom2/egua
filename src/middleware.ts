import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "~/env";

export async function middleware(request: NextRequest) {
  console.log("[DEBUG] Middleware - Request URL:", request.nextUrl.pathname);
  
  try {
    const token = await getToken({ 
      req: request,
      secret: env.AUTH_SECRET,
    });
    
    console.log("[DEBUG] Middleware - Token:", token ? "Token exists" : "No token");
    
    const isAuthPage = request.nextUrl.pathname === "/";
    const isApiAuth = request.nextUrl.pathname.startsWith("/api/auth");

    // Permitir rotas de auth do NextAuth
    if (isApiAuth) {
      return NextResponse.next();
    }

    if (isAuthPage) {
      if (token) {
        console.log("[DEBUG] Middleware - Redirecting from auth page to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (!token) {
      console.log("[DEBUG] Middleware - No token, redirecting to login");
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[ERROR] Middleware exception:", error);
    // Se for uma rota de API auth, permitir continuar
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
    // Fallback to login page on error
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}; 