interface LinkCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon?: string;
  folder: string;
}

export function LinkCard({ title, description, url, favicon, folder }: LinkCardProps) {
  const displayUrl = new URL(url).hostname.replace('www.', '');

  return (
    <div className="bg-[var(--card)] rounded-[16px] border border-[var(--border)] p-5 card-hover cursor-pointer group transition-smooth">
      <div className="flex items-start gap-4">
        {favicon ? (
          <img
            src={favicon}
            alt={title}
            className="w-10 h-10 rounded-[10px] flex-shrink-0 object-cover"
            onError={(e) => {
              e.currentTarget.src = '🔗';
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-[10px] bg-[var(--accent)] flex items-center justify-center flex-shrink-0 text-white">
            🔗
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors text-base">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-sub)] line-clamp-2 mt-1">
            {description}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] truncate block mt-3 font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            {displayUrl} →
          </a>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <span className="inline-block bg-[var(--accent-light)] text-[var(--accent)] text-xs px-3 py-1 rounded-[8px] font-bold">
          {folder}
        </span>
        <button
          className="text-[var(--text-disabled)] hover:text-[var(--error)] transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
