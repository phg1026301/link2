import type { Metadata } from 'next';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: '비밀번호 찾기',
  description: '가입한 이메일로 비밀번호 재설정 링크를 받을 수 있습니다.',
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({ searchParams }: PageProps<'/forgot-password'>) {
  const { error } = await searchParams;
  return <ForgotPasswordForm initialError={error === 'invalid_link' ? '재설정 링크가 만료되었거나 유효하지 않습니다. 다시 요청해 주세요.' : null} />;
}
