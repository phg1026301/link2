'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';
import { AuthForm, AuthInput } from '../components/AuthForm';
import { Toast } from '../components/Toast';
import { KakaoLoginButton } from './KakaoLoginButton';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  email_not_confirmed: '이메일 인증이 완료되지 않았습니다. 받은 메일함을 확인해 주세요.',
  user_banned: '이용이 정지된 계정입니다.',
  validation_failed: '올바른 이메일 주소를 입력해 주세요.',
  over_request_rate_limit: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  email_provider_disabled: '현재 이메일 로그인이 비활성화되어 있습니다.',
};

const toKoreanError = (error: unknown) => {
  if (error instanceof AuthError && error.code && LOGIN_ERROR_MESSAGES[error.code]) {
    return LOGIN_ERROR_MESSAGES[error.code];
  }
  return '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
};

export function LoginForm({ initialError }: { initialError: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(initialError);
  const closeToast = useCallback(() => setToastMessage(null), []);

  const isFilled = email.trim() !== '' && password !== '';

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Failed to log in:', error);
      setToastMessage(toKoreanError(error));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast message={toastMessage} onClose={closeToast} />
      <AuthForm
        submitLabel={isSubmitting ? '로그인 중...' : '로그인'}
        footerText="계정이 없으신가요?"
        footerLinkLabel="회원가입"
        footerHref="/signup"
        onSubmit={handleLogin}
        submitDisabled={!isFilled || isSubmitting}
        secondaryLink={{ href: '/forgot-password', label: '비밀번호를 잊으셨나요?' }}
        belowSubmit={<KakaoLoginButton onError={setToastMessage} />}
      >
        <AuthInput id="email" label="이메일" type="email" placeholder="example@email.com" autoComplete="email" value={email} onChange={setEmail} />
        <AuthInput id="password" label="비밀번호" type="password" placeholder="비밀번호 입력" autoComplete="current-password" value={password} onChange={setPassword} />
      </AuthForm>
    </>
  );
}
