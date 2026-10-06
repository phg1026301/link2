'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';
import { AuthForm, AuthInput } from '../components/AuthForm';
import { Toast } from '../components/Toast';

const UPDATE_ERROR_MESSAGES: Record<string, string> = {
  same_password: '이전과 다른 비밀번호를 입력해 주세요.',
  weak_password: '비밀번호가 너무 약합니다. 6자 이상으로 입력해 주세요.',
  session_not_found: '재설정 링크가 만료되었습니다. 비밀번호 찾기를 다시 진행해 주세요.',
  over_request_rate_limit: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
};

const toKoreanError = (error: unknown) => {
  if (error instanceof AuthError && error.code && UPDATE_ERROR_MESSAGES[error.code]) {
    return UPDATE_ERROR_MESSAGES[error.code];
  }
  return '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.';
};

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const closeToast = useCallback(() => setToastMessage(null), []);

  const isFilled = password !== '' && passwordConfirm !== '';

  const handleReset = async () => {
    if (password !== passwordConfirm) {
      setToastMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Failed to update password:', error);
      setToastMessage(toKoreanError(error));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast message={toastMessage} onClose={closeToast} />
      <AuthForm
        submitLabel={isSubmitting ? '변경 중...' : '비밀번호 변경'}
        footerText="비밀번호를 바꾸지 않으시나요?"
        footerLinkLabel="메인으로"
        footerHref="/"
        onSubmit={handleReset}
        submitDisabled={!isFilled || isSubmitting}
      >
        <p className="text-sm text-[var(--text-sub)]">새로 사용할 비밀번호를 입력해 주세요.</p>
        <AuthInput id="password" label="새 비밀번호" type="password" placeholder="새 비밀번호 입력" autoComplete="new-password" value={password} onChange={setPassword} />
        <AuthInput id="passwordConfirm" label="새 비밀번호 확인" type="password" placeholder="새 비밀번호 다시 입력" autoComplete="new-password" value={passwordConfirm} onChange={setPasswordConfirm} />
      </AuthForm>
    </>
  );
}
