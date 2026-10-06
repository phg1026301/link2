'use client';

import { useState } from 'react';
import { useLinks } from '../context/LinksContext';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewFolderModal({ isOpen, onClose }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const { addFolder } = useLinks();

  const handleSave = async () => {
    if (!folderName.trim()) return;
    try {
      await addFolder(folderName.trim());
      setFolderName('');
      onClose();
    } catch (error) {
      console.error('Failed to add folder:', error);
      alert('폴더 추가에 실패했습니다');
    }
  };

  const handleCancel = () => {
    setFolderName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--card)] rounded-[16px] shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold text-[var(--text)] mb-4">새 폴더 추가</h2>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="폴더 이름 입력"
          className="w-full px-4 py-2 border border-[var(--border)] rounded-[8px] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-sub)] mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-[8px] border border-[var(--border)] text-[var(--text)] font-semibold hover:bg-[var(--accent-light)] transition-smooth"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-[8px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-smooth"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
