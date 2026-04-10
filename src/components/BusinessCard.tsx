import { Users, Palette, Package, ExternalLink } from 'lucide-react';
import type { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{business.business_name || 'Business'}</h2>
          <a
            href={business.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-1"
          >
            {business.website_url} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {business.industry && (
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
            {business.industry}
          </span>
        )}
      </div>

      {business.description && (
        <p className="text-slate-600 mb-5 leading-relaxed">{business.description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {business.target_audience && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
            <Users className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audience</p>
              <p className="text-sm text-slate-700 mt-0.5">{business.target_audience}</p>
            </div>
          </div>
        )}
        {business.brand_tone && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
            <Palette className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand Tone</p>
              <p className="text-sm text-slate-700 mt-0.5">{business.brand_tone}</p>
            </div>
          </div>
        )}
        {business.key_products && business.key_products.length > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
            <Package className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</p>
              <p className="text-sm text-slate-700 mt-0.5">{business.key_products.slice(0, 3).join(', ')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
