import { Link } from 'react-router-dom';
import { Calendar, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Content<span className="gradient-text">Cal</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI-Powered Content Planning</span>
          </div>
        </div>
      </div>
    </header>
  );
}
