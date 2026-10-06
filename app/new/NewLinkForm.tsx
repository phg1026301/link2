'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useLinks } from '../context/LinksContext';

export default function NewLinkPage() {
  const router = useRouter();
  const { addLink } = useLinks();
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('development');
  const [isLoading, setIsLoading] = useState(false);

  const folders = [
    { id: 'all', name: 'All' },
    { id: 'work', name: 'Work' },
    { id: 'learning', name: 'Learning' },
    { id: 'design', name: 'Design' },
    { id: 'development', name: 'Development' },
  ];

  const extractTitleFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleSave = async () => {
    if (!linkUrl.trim()) {
      alert('Please enter a valid link');
      return;
    }

    setIsLoading(true);
    try {
      const title = extractTitleFromUrl(linkUrl);
      addLink({
        title: title,
        description: `Saved link from ${title}`,
        url: linkUrl,
        folder: selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1),
      });
      router.push('/');
    } catch (error) {
      console.error('Failed to save link:', error);
      alert('Failed to save link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-5">
          <div className="max-w-[640px] mx-auto">
            <h1 className="text-2xl font-bold text-[var(--text)] mb-7">
              새 링크 추가
            </h1>
            <div className="bg-[var(--card)] rounded-[16px] p-6 border border-[var(--border)] shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-bold text-[var(--text)] mb-2">
                  링크 URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-[10px] bg-[var(--card)] text-[var(--text)] placeholder-[var(--text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-smooth"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                  }}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[var(--text)] mb-2">
                  폴더
                </label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-[10px] bg-[var(--card)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-smooth"
                >
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-6 py-3 rounded-[12px] transition-smooth font-bold btn-press"
                >
                  {isLoading ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="bg-[var(--accent-light)] hover:opacity-80 text-[var(--accent)] px-6 py-3 rounded-[12px] transition-smooth font-bold"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
