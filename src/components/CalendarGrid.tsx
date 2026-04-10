import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { Filter } from 'lucide-react';
import type { ContentItem, Platform } from '../types';
import { PLATFORM_CONFIG } from '../types';
import ContentCard from './ContentCard';
import ContentModal from './ContentModal';

interface CalendarGridProps {
  items: ContentItem[];
  month: number;
  year: number;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ items, month, year }: CalendarGridProps) {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

  const calendarDate = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(calendarDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const filteredItems = useMemo(() => {
    if (platformFilter === 'all') return items;
    return items.filter((item) => item.platform === platformFilter);
  }, [items, platformFilter]);

  const itemsByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    filteredItems.forEach((item) => {
      const dateKey = item.scheduled_date;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(item);
    });
    return map;
  }, [filteredItems]);

  const platforms = Object.keys(PLATFORM_CONFIG) as Platform[];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        <button
          onClick={() => setPlatformFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${platformFilter === 'all' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >All ({items.length})</button>
        {platforms.map((platform) => {
          const count = items.filter((i) => i.platform === platform).length;
          if (count === 0) return null;
          const config = PLATFORM_CONFIG[platform];
          return (
            <button
              key={platform}
              onClick={() => setPlatformFilter(platform)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${platformFilter === platform ? `${config.bgColor} ring-2 ring-offset-1` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <span>{config.icon}</span>
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-slate-900">{format(calendarDate, 'MMMM yyyy')}</h2>
        <p className="text-sm text-slate-500 mt-1">{filteredItems.length} content pieces planned</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {allDays.map((day, idx) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayItems = itemsByDate[dateKey] || [];
            const inMonth = isSameMonth(day, calendarDate);
            const today = isToday(day);
            return (
              <div key={idx} className={`min-h-[140px] border-b border-r border-slate-100 p-2 ${!inMonth ? 'bg-slate-50/50' : ''} ${today ? 'bg-indigo-50/30' : ''}`}>
                <div className={`text-sm font-semibold mb-1.5 ${!inMonth ? 'text-slate-300' : today ? 'text-indigo-600' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                  {today && <span className="ml-1.5 text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">TODAY</span>}
                </div>
                <div className="space-y-1.5">
                  {dayItems.map((item) => (<ContentCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedItem && <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
