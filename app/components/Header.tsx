'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  onNewFolderClick?: () => void;
}

export function Header({ onNewFolderClick }: HeaderProps) {
  const router = useRouter();

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
      </div>
    </header>
  );
}
