import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "~/env";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: env.AUTH_SECRET 
  });
  
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/";
  const isDashboardPage = pathname.startsWith("/dashboard");

  // Se estiver na página de autenticação e já estiver logado, redireciona para o dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se estiver tentando acessar o dashboard sem estar logado, redireciona para a página inicial
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Se não for nenhum dos casos acima, permite o acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 