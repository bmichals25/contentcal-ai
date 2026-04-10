import { FileText, Video, Hash } from 'lucide-react';
import type { ContentItem } from '../types';
import { CONTENT_TYPE_LABELS } from '../types';
import PlatformBadge from './PlatformBadge';

interface ContentCardProps {
  item: ContentItem;
  onClick: () => void;
}

export default function ContentCard({ item, onClick }: ContentCardProps) {
  const hasScript = !!item.script;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl bg-white border border-slate-100 card-hover hover:border-indigo-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <PlatformBadge platform={item.platform} />
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          {CONTENT_TYPE_LABELS[item.content_type]}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1.5">
        {item.title}
      </h4>
      {item.idea && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{item.idea}</p>
      )}
      <div className="flex items-center gap-2">
        {item.draft_content && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            <FileText className="w-3 h-3" /> Draft
          </span>
        )}
        {hasScript && (
          <span className="flex items-center gap-1 text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
            <Video className="w-3 h-3" /> Script
          </span>
        )}
        {item.hashtags && item.hashtags.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            <Hash className="w-3 h-3" /> {item.hashtags.length}
          </span>
        )}
      </div>
    </button>
  );
}
