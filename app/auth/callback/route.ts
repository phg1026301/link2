import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

// 이메일 링크(비밀번호 재설정)나 소셜 로그인으로 돌아온 인증 코드를 세션으로 교환한 뒤 next 경로로 이동
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  // 외부 URL로의 오픈 리다이렉트 방지
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';

  if (code) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(safeNext, origin));
    }
    console.error('Failed to exchange auth code:', error);
  }

  // 실패 시: 비밀번호 재설정 흐름이면 비밀번호 찾기로, 그 외(소셜 로그인 취소 등)는 로그인 페이지로
  const url =
    safeNext === '/reset-password'
      ? new URL('/forgot-password?error=invalid_link', origin)
      : new URL('/login?error=oauth_failed', origin);
  return NextResponse.redirect(url);
}
