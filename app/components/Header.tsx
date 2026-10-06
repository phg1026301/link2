'use client';

import { useRouter } from 'next/navigation';
import { useLinks } from '../context/LinksContext';

interface HeaderProps {
  onNewFolderClick?: () => void;
}

export function Header({ onNewFolderClick }: HeaderProps) {
  const router = useRouter();
  const { user, signOut } = useLinks();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
      alert('로그아웃에 실패했습니다');
    }
  };

  return (
    <header className="h-14 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🔗</div>
        <div className="text-xl font-bold text-[var(--text)]">링크</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onNewFolderClick}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold px-6 py-2 rounded-[12px] transition-smooth btn-press"
        >
          + 폴더 추가
        </button>
        <button
          onClick={() => router.push('/new')}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold px-6 py-2 rounded-[12px] transition-smooth btn-press"
        >
          + 링크 추가
        </button>
        {user && (
          <div className="flex items-center gap-3 pl-3 ml-1 border-l border-[var(--border)]">
            <span className="text-sm font-semibold text-[var(--text)] max-w-[200px] truncate" title={user.email}>
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-[12px] border border-[var(--border)] text-sm font-bold text-[var(--text-sub)] hover:bg-[var(--accent-light)] hover:text-[var(--text)] transition-smooth"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
