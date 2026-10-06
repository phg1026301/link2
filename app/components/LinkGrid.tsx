import { LinkCard } from './LinkCard';
import { useLinks } from '../context/LinksContext';

interface LinkGridProps {
  selectedFolder?: string | null;
}

export function LinkGrid({ selectedFolder = 'all' }: LinkGridProps) {
  const { links, folders, isLoading } = useLinks();

  const folderName = (id: string | null) => folders.find((f) => f.id === id)?.name ?? '미분류';

  const filteredLinks =
    selectedFolder === 'all' ? links : links.filter((link) => link.folderId === selectedFolder);

  return (
    <main className="p-5">
      <div className="max-w-[640px] mx-auto">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
            {selectedFolder === 'all' ? '모든 링크' : folderName(selectedFolder)}
          </h2>
          <p className="text-[var(--text-sub)] text-sm">
            {isLoading
              ? '불러오는 중...'
              : filteredLinks.length === 0
                ? '링크가 없습니다'
                : `총 ${filteredLinks.length}개의 링크`}
          </p>
        </div>
        {isLoading ? null : filteredLinks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-[var(--text-sub)] text-lg">이 폴더에 링크가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLinks.map((link) => (
              <LinkCard key={link.id} {...link} folder={folderName(link.folderId)} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
