import type { Metadata } from 'next';
import { pageSocialMetadata } from '../shared-metadata';
import { SignupForm } from './SignupForm';

const description = '링크에 가입하고 흩어진 즐겨찾기를 폴더별로 정리해 보세요.';

export const metadata: Metadata = {
  title: '회원가입',
  description,
  ...pageSocialMetadata('회원가입', description, '/signup'),
};

export default function SignupPage() {
  return <SignupForm />;
}
