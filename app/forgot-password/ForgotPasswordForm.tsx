'use client';

import { useCallback, useState } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';
import { AuthForm, AuthInput } from '../components/AuthForm';
import { Toast } from '../components/Toast';

const RESET_ERROR_MESSAGES: Record<string, string> = {
  validation_failed: '올바른 이메일 주소를 입력해 주세요.',
  email_address_invalid: '올바른 이메일 주소를 입력해 주세요.',
  over_email_send_rate_limit: '메일 발송 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  over_request_rate_limit: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
};

const toKoreanError = (error: unknown) => {
  if (error instanceof AuthError && error.code && RESET_ERROR_MESSAGES[error.code]) {
    return RESET_ERROR_MESSAGES[error.code];
  }
  return '재설정 링크 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
};

export function ForgotPasswordForm({ initialError }: { initialError: string | null }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(initialError);
  const closeToast = useCallback(() => setToastMessage(null), []);

  const handleSend = async () => {
    const trimmed = email.trim();
    setIsSubmitting(true);
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      setSentTo(trimmed);
    } catch (error) {
      console.error('Failed to send reset email:', error);
      setToastMessage(toKoreanError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast message={toastMessage} onClose={closeToast} />
      <AuthForm
        submitLabel={isSubmitting ? '발송 중...' : sentTo ? '재설정 링크 다시 발송' : '비밀번호 재설정 링크 발송'}
        footerText="비밀번호가 기억나셨나요?"
        footerLinkLabel="로그인"
        footerHref="/login"
        onSubmit={handleSend}
        submitDisabled={email.trim() === '' || isSubmitting}
      >
        <p className="text-sm text-[var(--text-sub)]">
          가입한 이메일을 입력하면 비밀번호를 재설정할 수 있는 링크를 보내드립니다.
        </p>
        <AuthInput id="email" label="이메일" type="email" placeholder="example@email.com" autoComplete="email" value={email} onChange={setEmail} />
        {sentTo && (
          <p className="text-sm font-semibold text-[var(--accent)] bg-[var(--accent-light)] rounded-[10px] px-4 py-3">
            {sentTo}(으)로 재설정 링크를 보냈습니다. 메일함을 확인해 주세요.
          </p>
        )}
      </AuthForm>
    </>
  );
}
