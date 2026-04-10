export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'blog' | 'youtube';

export type ContentType = 'post' | 'story' | 'reel' | 'thread' | 'article' | 'video_script' | 'carousel';

export type ContentStatus = 'draft' | 'reviewed' | 'approved' | 'published';

export type CalendarStatus = 'generating' | 'complete' | 'error';

export interface Business {
  id: string;
  website_url: string;
  business_name: string | null;
  industry: string | null;
  description: string | null;
  target_audience: string | null;
  brand_tone: string | null;
  key_products: string[] | null;
  raw_content: string | null;
  created_at: string;
}

export interface Calendar {
  id: string;
  business_id: string;
  month: number;
  year: number;
  status: CalendarStatus;
  total_items: number;
  created_at: string;
}

export interface ContentItem {
  id: string;
  calendar_id: string;
  scheduled_date: string;
  platform: Platform;
  content_type: ContentType;
  title: string;
  idea: string | null;
  draft_content: string | null;
  script: string | null;
  hashtags: string[] | null;
  notes: string | null;
  status: ContentStatus;
  created_at: string;
}

export interface BusinessAnalysis {
  business_name: string;
  industry: string;
  description: string;
  target_audience: string;
  brand_tone: string;
  key_products: string[];
}

export interface GenerateRequest {
  business_id: string;
  calendar_id: string;
}

export const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bgColor: string; icon: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C', bgColor: 'bg-pink-100 text-pink-800', icon: '\uD83D\uDCF8' },
  twitter: { label: 'Twitter/X', color: '#1DA1F2', bgColor: 'bg-sky-100 text-sky-800', icon: '\uD83D\uDC26' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', bgColor: 'bg-blue-100 text-blue-800', icon: '\uD83D\uDCBC' },
  tiktok: { label: 'TikTok', color: '#00F2EA', bgColor: 'bg-teal-100 text-teal-800', icon: '\uD83C\uDFB5' },
  blog: { label: 'Blog', color: '#10B981', bgColor: 'bg-emerald-100 text-emerald-800', icon: '\uD83D\uDCDD' },
  youtube: { label: 'YouTube', color: '#FF0000', bgColor: 'bg-red-100 text-red-800', icon: '\uD83C\uDFAC' },
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  post: 'Post',
  story: 'Story',
  reel: 'Reel',
  thread: 'Thread',
  article: 'Article',
  video_script: 'Video Script',
  carousel: 'Carousel',
};
