import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 로그인 전용 페이지: 비로그인만 접근, 로그인 상태면 인덱스로 이동
const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];
// 로그인 여부와 관계없이 항상 통과 (이메일 링크 인증 코드 교환, 링크 공유 썸네일)
const ALWAYS_ALLOWED = ["/auth/callback", "/opengraph-image", "/twitter-image"];

const matches = (pathname: string, paths: string[]) =>
  paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  // 세션 갱신 + JWT 검증
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;
  const isAuthPage = matches(pathname, AUTH_PAGES);

  // 비로그인 → 로그인 페이지로, 로그인 상태에서 로그인/회원가입 페이지 접근 → 인덱스로
  const redirectPath = matches(pathname, ALWAYS_ALLOWED)
    ? null
    : !isLoggedIn && !isAuthPage
      ? "/login"
      : isLoggedIn && isAuthPage
        ? "/"
        : null;

  if (redirectPath) {
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    url.search = "";
    const redirectResponse = NextResponse.redirect(url);
    // 갱신된 세션 쿠키 유지
    supabaseResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image files in public/
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
