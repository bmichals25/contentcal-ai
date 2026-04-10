import { X, Copy, Check, FileText, Video, Hash, Calendar } from 'lucide-react';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import type { ContentItem } from '../types';
import { CONTENT_TYPE_LABELS } from '../types';
import PlatformBadge from './PlatformBadge';

interface ContentModalProps {
  item: ContentItem;
  onClose: () => void;
}

export default function ContentModal({ item, onClose }: ContentModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 rounded-t-2xl flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <PlatformBadge platform={item.platform} size="md" />
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {CONTENT_TYPE_LABELS[item.content_type]}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>{format(parseISO(item.scheduled_date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {item.idea && (
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Content Idea</h3>
              <p className="text-slate-700 leading-relaxed bg-amber-50 border border-amber-100 rounded-xl p-4">{item.idea}</p>
            </section>
          )}
          {item.draft_content && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" /> Draft Content
                </h3>
                <button onClick={() => copyToClipboard(item.draft_content!, 'draft')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  {copiedField === 'draft' ? (<><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>) : (<><Copy className="w-3.5 h-3.5" /> Copy</>)}
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">{item.draft_content}</div>
            </section>
          )}
          {item.script && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-500" /> Video / Audio Script
                </h3>
                <button onClick={() => copyToClipboard(item.script!, 'script')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  {copiedField === 'script' ? (<><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>) : (<><Copy className="w-3.5 h-3.5" /> Copy</>)}
                </button>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-slate-700 whitespace-pre-wrap leading-relaxed text-sm font-mono">{item.script}</div>
            </section>
          )}
          {item.hashtags && item.hashtags.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" /> Hashtags
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.hashtags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => copyToClipboard(tag, `tag-${i}`)}>{tag}</span>
                ))}
              </div>
              <button onClick={() => copyToClipboard(item.hashtags!.join(' '), 'all-tags')} className="mt-2 text-xs text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                {copiedField === 'all-tags' ? (<><Check className="w-3 h-3 text-emerald-500" /> Copied all!</>) : (<><Copy className="w-3 h-3" /> Copy all hashtags</>)}
              </button>
            </section>
          )}
          {item.notes && (
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Production Notes</h3>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed">{item.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
