import { useState, useEffect } from 'react';
import { Sparkles, Zap, Calendar, FileText } from 'lucide-react';
import UrlInput from '../components/UrlInput';
import BusinessCard from '../components/BusinessCard';
import LoadingState from '../components/LoadingState';
import CalendarGrid from '../components/CalendarGrid';
import StatsBar from '../components/StatsBar';
import { supabase } from '../lib/supabase';
import type { Business, Calendar as CalendarType, ContentItem } from '../types';

type Stage = 'idle' | 'scraping' | 'analyzing' | 'generating' | 'saving' | 'complete';

export default function HomePage() {
  const [stage, setStage] = useState<Stage>('idle');
  const [business, setBusiness] = useState<Business | null>(null);
  const [calendar, setCalendar] = useState<CalendarType | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!calendar || stage !== 'generating') return;
    const interval = setInterval(async () => {
      const { data: items } = await supabase
        .from('contentcal_content_items')
        .select('*')
        .eq('calendar_id', calendar.id)
        .order('scheduled_date', { ascending: true });
      if (items && items.length > 0) {
        setContentItems(items);
        setProgress(Math.min(100, Math.round((items.length / 60) * 100)));
      }
      const { data: cal } = await supabase
        .from('contentcal_calendars')
        .select('*')
        .eq('id', calendar.id)
        .single();
      if (cal?.status === 'complete') {
        setCalendar(cal);
        setStage('complete');
        clearInterval(interval);
      } else if (cal?.status === 'error') {
        setError('Content generation failed. Please try again.');
        setStage('idle');
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [calendar, stage]);

  const handleSubmit = async (url: string) => {
    setError(null);
    setStage('scraping');
    setProgress(0);
    setContentItems([]);
    setBusiness(null);
    setCalendar(null);
    try {
      setStage('analyzing');
      const analyzeRes = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze website');
      }
      const { business: biz, calendar: cal } = await analyzeRes.json();
      setBusiness(biz);
      setCalendar(cal);
      setStage('generating');
      const genRes = await fetch('/.netlify/functions/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: biz.id, calendar_id: cal.id }),
      });
      if (!genRes.ok && genRes.status !== 202) {
        throw new Error('Failed to start content generation');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setStage('idle');
    }
  };

  const isLoading = stage !== 'idle' && stage !== 'complete';

  return (
    <div>
      {stage === 'idle' && !business && (
        <section className="gradient-hero text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Content Strategy
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Turn Any Website Into a<br /><span className="text-yellow-300">Content Calendar</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Enter a business URL and our AI will analyze the brand, then generate a full month of content ideas, copy-ready drafts, and video scripts across all platforms.
            </p>
            <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              {[
                { icon: Zap, title: 'Instant Analysis', desc: 'Scans any business website in seconds' },
                { icon: Calendar, title: '30-Day Calendar', desc: 'Full month of strategic content' },
                { icon: FileText, title: 'Drafts & Scripts', desc: 'Ready-to-post copy and video scripts' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left">
                  <Icon className="w-8 h-8 mb-3 text-yellow-300" />
                  <h3 className="font-bold text-lg mb-1">{title}</h3>
                  <p className="text-white/70 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {(isLoading || stage === 'complete') && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 py-6 px-4">
          <div className="max-w-4xl mx-auto">
            {stage === 'complete' && <div className="text-center"><UrlInput onSubmit={handleSubmit} isLoading={false} /></div>}
          </div>
        </div>
      )}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">Warning: {error}</div>
        </div>
      )}
      {isLoading && !contentItems.length && (
        <div className="max-w-4xl mx-auto px-4">
          <LoadingState stage={stage as 'scraping' | 'analyzing' | 'generating' | 'saving'} progress={progress} />
        </div>
      )}
      {(business || contentItems.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {business && <BusinessCard business={business} />}
          {contentItems.length > 0 && calendar && (
            <>
              <StatsBar items={contentItems} />
              <CalendarGrid items={contentItems} month={calendar.month} year={calendar.year} />
            </>
          )}
          {stage === 'generating' && contentItems.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 rounded-full px-4 py-2 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-indigo-500 pulse-dot" />
                Generating more content... ({contentItems.length} items so far)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
