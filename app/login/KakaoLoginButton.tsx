'use client';

import { useState } from 'react';
import { createClient } from '../utils/supabase/client';

interface KakaoLoginButtonProps {
  onError: (message: string) => void;
}

// 카카오 로그인 디자인 가이드: 배경 #FEE500, 검정 말풍선 심볼, 레이블 85% 검정
function KakaoSymbol() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#000000"
        d="M12 3C6.48 3 2 6.54 2 10.9c0 2.82 1.87 5.3 4.69 6.7-.15.53-.98 3.4-1.01 3.62 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.29-2.83.55.08 1.12.12 1.7.12 5.52 0 10-3.54 10-7.9S17.52 3 12 3z"
      />
    </svg>
  );
}

export function KakaoLoginButton({ onError }: KakaoLoginButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleKakaoLogin = async () => {
    setIsRedirecting(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });
    // 성공 시 카카오 로그인 페이지로 이동하므로 실패한 경우만 처리
    if (error) {
      console.error('Failed to start Kakao login:', error);
      onError('카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setIsRedirecting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      disabled={isRedirecting}
      className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:brightness-95 text-black/85 font-bold py-3 rounded-[12px] transition-smooth btn-press disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <KakaoSymbol />
      {isRedirecting ? '카카오로 이동 중...' : '카카오 로그인'}
    </button>
  );
}
