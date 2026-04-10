import { useState } from 'react';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    onSubmit(finalUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Globe className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a business website URL..."
          className="w-full pl-12 pr-36 py-4 text-lg rounded-2xl border-2 border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              Generate
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-slate-500">
        We'll analyze the website and generate a full month of content ideas, drafts & scripts
      </p>
    </form>
  );
}
