import type { Metadata } from 'next';
import { NewLinkForm } from './NewLinkForm';

export const metadata: Metadata = {
  title: '새 링크 추가',
  description: '저장할 링크의 URL과 폴더를 선택해 북마크를 추가합니다.',
  robots: { index: false, follow: false },
};

export default function NewLinkPage() {
  return <NewLinkForm />;
}
