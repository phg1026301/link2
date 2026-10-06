'use client';

import { useState } from 'react';
import { useLinks } from '../context/LinksContext';

interface EditFolderModalProps {
  folderId: string;
  folderName: string;
  onClose: () => void;
}

export function EditFolderModal({ folderId, folderName, onClose }: EditFolderModalProps) {
  const [newName, setNewName] = useState(folderName);
  const { editFolder } = useLinks();

  const trimmed = newName.trim();
  const canSave = trimmed.length > 0 && trimmed !== folderName;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      await editFolder(folderId, trimmed);
      onClose();
    } catch (error) {
      console.error('Failed to edit folder:', error);
      alert('폴더 이름 수정에 실패했습니다');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-folder-title"
        className="bg-[var(--card)] rounded-[16px] shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="edit-folder-title" className="text-lg font-bold text-[var(--text)] mb-4">폴더 이름 수정</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="폴더 이름 입력"
          className="w-full px-4 py-2 border border-[var(--border)] rounded-[8px] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-sub)] mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') onClose();
          }}
          onFocus={(e) => e.target.select()}
          autoFocus
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-[8px] border border-[var(--border)] text-[var(--text)] font-semibold hover:bg-[var(--accent-light)] transition-smooth"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-6 py-2 rounded-[8px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
