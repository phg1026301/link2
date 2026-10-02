'use client';

import { useState } from 'react';
import { useLinks } from '../context/LinksContext';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EditFolderModal } from './EditFolderModal';

interface SidebarProps {
  selectedFolder?: string | null;
  onSelectFolder?: (folder: string) => void;
}

export function Sidebar({ selectedFolder = 'all', onSelectFolder }: SidebarProps) {
  const { folders, deleteFolder } = useLinks();
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      setDeleteConfirm({ id: folderId, name: folder.name });
    }
  };

  const handleEditClick = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      setEditingFolder({ id: folderId, name: folder.name });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteFolder(deleteConfirm.id);
      setDeleteConfirm(null);
      setHoveredFolderId(null);
    }
  };

  return (
    <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">카테고리</h2>
      </div>
      <nav className="space-y-1">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onMouseEnter={() => setHoveredFolderId(folder.id)}
            onMouseLeave={() => setHoveredFolderId(null)}
            className="relative"
          >
            <button
              onClick={() => onSelectFolder?.(folder.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] transition-smooth font-bold ${
                selectedFolder === folder.id
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--text)] hover:bg-[var(--accent-light)]'
              }`}
            >
              <span className="text-lg">{folder.icon}</span>
              <span className="flex-1 text-left">{folder.name}</span>
              {hoveredFolderId === folder.id && folder.id !== 'all' && (
                <div className="flex gap-1">
                  <button
                    onClick={(e) => handleEditClick(e, folder.id)}
                    className="p-1.5 hover:bg-blue-500/20 rounded-md transition-smooth text-blue-500"
                    title="수정"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, folder.id)}
                    className="p-1.5 hover:bg-red-500/20 rounded-md transition-smooth text-red-500"
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </button>
          </div>
        ))}
      </nav>
      <ConfirmDeleteModal
        isOpen={deleteConfirm !== null}
        folderName={deleteConfirm?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
      <EditFolderModal
        isOpen={editingFolder !== null}
        folderId={editingFolder?.id || null}
        folderName={editingFolder?.name || ''}
        onClose={() => setEditingFolder(null)}
      />
    </aside>
  );
}
