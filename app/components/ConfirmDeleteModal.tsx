'use client';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  folderName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ isOpen, folderName, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--card)] rounded-[16px] shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold text-[var(--text)] mb-2">폴더 삭제</h2>
        <p className="text-[var(--text-sub)] mb-6">
          &quot;{folderName}&quot; 폴더와 폴더 안의 북마크를 모두 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-[8px] border border-[var(--border)] text-[var(--text)] font-semibold hover:bg-[var(--accent-light)] transition-smooth"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-[8px] bg-red-500 hover:bg-red-600 text-white font-semibold transition-smooth"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
