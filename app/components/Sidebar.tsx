'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLinks } from '../context/LinksContext';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EditFolderModal } from './EditFolderModal';

interface SidebarProps {
  selectedFolder?: string | null;
  onSelectFolder?: (folder: string) => void;
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

export function Sidebar({ selectedFolder = 'all', onSelectFolder }: SidebarProps) {
  const { user, folders, deleteFolder } = useLinks();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteFolder(deleteConfirm.id);
      if (selectedFolder === deleteConfirm.id) onSelectFolder?.('all');
    } catch (error) {
      console.error('Failed to delete folder:', error);
      alert('폴더 삭제에 실패했습니다');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <aside className="w-64 flex flex-col bg-[var(--card)] border-r border-[var(--border)] p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">카테고리</h2>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-1">
        {folders.map((folder) => {
          const isSelected = selectedFolder === folder.id;
          const actionClass = `p-1.5 rounded-md transition-smooth ${
            isSelected ? 'text-white hover:bg-white/20' : 'text-[var(--text-sub)] hover:bg-black/5'
          }`;

          return (
            <div key={folder.id} className="group relative">
              <button
                onClick={() => onSelectFolder?.(folder.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] transition-smooth font-bold ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text)] hover:bg-[var(--accent-light)]'
                } ${folder.id !== 'all' ? 'group-hover:pr-20 group-focus-within:pr-20' : ''}`}
              >
                <span className="text-lg">{folder.icon}</span>
                <span className="flex-1 text-left truncate">{folder.name}</span>
              </button>
              {folder.id !== 'all' && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 pointer-events-none transition-smooth group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                  <button
                    onClick={() => setEditingFolder({ id: folder.id, name: folder.name })}
                    className={`${actionClass} ${isSelected ? '' : 'hover:text-[var(--accent)]'}`}
                    title="폴더 이름 수정"
                    aria-label={`${folder.name} 폴더 이름 수정`}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ id: folder.id, name: folder.name })}
                    className={`${actionClass} ${isSelected ? '' : 'hover:text-[var(--error)]'}`}
                    title="폴더 삭제"
                    aria-label={`${folder.name} 폴더 삭제`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {user === null && (
        <div className="pt-4 mt-4 border-t border-[var(--border)] space-y-2">
          <Link
            href="/login"
            className="block w-full text-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-2.5 rounded-[12px] transition-smooth btn-press"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="block w-full text-center bg-[var(--accent-light)] hover:opacity-80 text-[var(--accent)] font-bold py-2.5 rounded-[12px] transition-smooth"
          >
            회원가입
          </Link>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={deleteConfirm !== null}
        folderName={deleteConfirm?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
      {editingFolder && (
        <EditFolderModal
          key={editingFolder.id}
          folderId={editingFolder.id}
          folderName={editingFolder.name}
          onClose={() => setEditingFolder(null)}
        />
      )}
    </aside>
  );
}
