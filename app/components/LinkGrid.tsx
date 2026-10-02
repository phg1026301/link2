import { LinkCard } from './LinkCard';
import { useLinks, type Link } from '../context/LinksContext';

interface LinkGridProps {
  selectedFolder?: string | null;
}

export function LinkGrid({ selectedFolder = 'all' }: LinkGridProps) {
  const { links } = useLinks();

  const sampleLinks: Link[] = [
    {
      id: '1',
      title: 'Next.js Documentation',
      description: 'The official documentation for Next.js framework',
      url: 'https://nextjs.org/docs',
      favicon: 'https://nextjs.org/favicon.ico',
      folder: 'Development',
    },
    {
      id: '2',
      title: 'Tailwind CSS',
      description: 'Utility-first CSS framework for rapid UI development',
      url: 'https://tailwindcss.com',
      favicon: 'https://tailwindcss.com/favicons/favicon.ico',
      folder: 'Development',
    },
    {
      id: '3',
      title: 'React Official Site',
      description: 'A JavaScript library for building user interfaces',
      url: 'https://react.dev',
      favicon: 'https://react.dev/favicon.ico',
      folder: 'Learning',
    },
    {
      id: '4',
      title: 'Web Design Trends',
      description: 'Latest trends in web design and UX',
      url: 'https://webdesigntrends.com',
      favicon: undefined,
      folder: 'Design',
    },
    {
      id: '5',
      title: 'GitHub',
      description: 'Where the world builds software',
      url: 'https://github.com',
      favicon: 'https://github.githubassets.com/favicons/favicon.ico',
      folder: 'Work',
    },
    {
      id: '6',
      title: 'CSS-Tricks',
      description: 'Daily articles about CSS, HTML, JavaScript, and web design',
      url: 'https://css-tricks.com',
      favicon: 'https://css-tricks.com/favicon.svg',
      folder: 'Learning',
    },
  ];

  const allLinks = [...sampleLinks, ...links];

  const filteredLinks =
    selectedFolder === 'all'
      ? allLinks
      : allLinks.filter((link) => link.folder.toLowerCase() === selectedFolder?.toLowerCase());

  return (
    <main className="p-5">
      <div className="max-w-[640px] mx-auto">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
            {selectedFolder === 'all' ? '모든 링크' : selectedFolder}
          </h2>
          <p className="text-[var(--text-sub)] text-sm">
            {filteredLinks.length === 0 ? '링크가 없습니다' : `총 ${filteredLinks.length}개의 링크`}
          </p>
        </div>
        {filteredLinks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-[var(--text-sub)] text-lg">이 폴더에 링크가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLinks.map((link) => (
              <LinkCard key={link.id} {...link} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
