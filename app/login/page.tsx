import type { Metadata } from 'next';
import { pageSocialMetadata } from '../shared-metadata';
import { LoginForm } from './LoginForm';

const description = '이메일 또는 카카오 계정으로 로그인하고 저장한 북마크를 확인하세요.';

export const metadata: Metadata = {
  title: '로그인',
  description,
  ...pageSocialMetadata('로그인', description, '/login'),
};

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { error } = await searchParams;
  return <LoginForm initialError={error === 'oauth_failed' ? '소셜 로그인에 실패했습니다. 다시 시도해 주세요.' : null} />;
}
