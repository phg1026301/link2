'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';
import { AuthForm, AuthInput } from '../components/AuthForm';
import { Toast } from '../components/Toast';

const SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  user_already_exists: '이미 가입된 이메일입니다.',
  email_exists: '이미 가입된 이메일입니다.',
  weak_password: '비밀번호가 너무 약합니다. 6자 이상으로 입력해 주세요.',
  email_address_invalid: '올바른 이메일 주소를 입력해 주세요.',
  validation_failed: '올바른 이메일 주소를 입력해 주세요.',
  over_email_send_rate_limit: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  over_request_rate_limit: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  signup_disabled: '현재 회원가입이 비활성화되어 있습니다.',
  email_provider_disabled: '현재 이메일 회원가입이 비활성화되어 있습니다.',
};

const toKoreanError = (error: unknown) => {
  if (error instanceof AuthError && error.code && SIGNUP_ERROR_MESSAGES[error.code]) {
    return SIGNUP_ERROR_MESSAGES[error.code];
  }
  return '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.';
};

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const closeToast = useCallback(() => setToastMessage(null), []);

  const isFilled = email.trim() !== '' && password !== '' && passwordConfirm !== '';

  const handleSignup = async () => {
    if (password !== passwordConfirm) {
      setToastMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await createClient().auth.signUp({ email: email.trim(), password });
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Failed to sign up:', error);
      setToastMessage(toKoreanError(error));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast message={toastMessage} onClose={closeToast} />
      <AuthForm
        submitLabel={isSubmitting ? '가입 중...' : '회원가입'}
        footerText="이미 계정이 있으신가요?"
        footerLinkLabel="로그인"
        footerHref="/login"
        onSubmit={handleSignup}
        submitDisabled={!isFilled || isSubmitting}
      >
        <AuthInput id="email" label="이메일" type="email" placeholder="example@email.com" autoComplete="email" value={email} onChange={setEmail} />
        <AuthInput id="password" label="비밀번호" type="password" placeholder="비밀번호 입력" autoComplete="new-password" value={password} onChange={setPassword} />
        <AuthInput id="passwordConfirm" label="비밀번호 확인" type="password" placeholder="비밀번호 다시 입력" autoComplete="new-password" value={passwordConfirm} onChange={setPasswordConfirm} />
      </AuthForm>
    </>
  );
}
