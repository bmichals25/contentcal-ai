import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BusinessCard from '../components/BusinessCard';
import CalendarGrid from '../components/CalendarGrid';
import StatsBar from '../components/StatsBar';
import type { Business, Calendar, ContentItem } from '../types';

export default function CalendarPage() {
  const { calendarId } = useParams<{ calendarId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!calendarId) return;
    const fetchData = async () => {
      try {
        const { data: cal, error: calErr } = await supabase.from('contentcal_calendars').select('*').eq('id', calendarId).single();
        if (calErr) throw calErr;
        setCalendar(cal);
        const { data: biz, error: bizErr } = await supabase.from('contentcal_businesses').select('*').eq('id', cal.business_id).single();
        if (bizErr) throw bizErr;
        setBusiness(biz);
        const { data: contentItems, error: itemsErr } = await supabase.from('contentcal_content_items').select('*').eq('calendar_id', calendarId).order('scheduled_date', { ascending: true });
        if (itemsErr) throw itemsErr;
        setItems(contentItems || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load calendar');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [calendarId]);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-red-600 mb-4">{error}</p><Link to="/" className="text-indigo-600 hover:underline flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to home</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"><ArrowLeft className="w-4 h-4" /> Generate another calendar</Link>
      {business && <BusinessCard business={business} />}
      {items.length > 0 && <StatsBar items={items} />}
      {calendar && items.length > 0 && <CalendarGrid items={items} month={calendar.month} year={calendar.year} />}
    </div>
  );
}
