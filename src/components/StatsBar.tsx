import { useMemo } from 'react';
import { BarChart3, FileText, Video, Calendar } from 'lucide-react';
import type { ContentItem, Platform } from '../types';
import { PLATFORM_CONFIG } from '../types';

interface StatsBarProps {
  items: ContentItem[];
}

export default function StatsBar({ items }: StatsBarProps) {
  const stats = useMemo(() => {
    const platforms: Record<string, number> = {};
    let drafts = 0;
    let scripts = 0;
    items.forEach((item) => {
      platforms[item.platform] = (platforms[item.platform] || 0) + 1;
      if (item.draft_content) drafts++;
      if (item.script) scripts++;
    });
    return { platforms, drafts, scripts, total: items.length };
  }, [items]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-slate-500 mb-1"><Calendar className="w-4 h-4" /><span className="text-xs font-semibold uppercase tracking-wider">Total</span></div>
        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        <p className="text-xs text-slate-400">content pieces</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-emerald-500 mb-1"><FileText className="w-4 h-4" /><span className="text-xs font-semibold uppercase tracking-wider">Drafts</span></div>
        <p className="text-2xl font-bold text-slate-900">{stats.drafts}</p>
        <p className="text-xs text-slate-400">ready to post</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-purple-500 mb-1"><Video className="w-4 h-4" /><span className="text-xs font-semibold uppercase tracking-wider">Scripts</span></div>
        <p className="text-2xl font-bold text-slate-900">{stats.scripts}</p>
        <p className="text-xs text-slate-400">video/audio</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-blue-500 mb-1"><BarChart3 className="w-4 h-4" /><span className="text-xs font-semibold uppercase tracking-wider">Platforms</span></div>
        <p className="text-2xl font-bold text-slate-900">{Object.keys(stats.platforms).length}</p>
        <div className="flex gap-1 mt-1">
          {Object.keys(stats.platforms).map((p) => (<span key={p} className="text-sm" title={PLATFORM_CONFIG[p as Platform]?.label}>{PLATFORM_CONFIG[p as Platform]?.icon}</span>))}
        </div>
      </div>
    </div>
  );
}
