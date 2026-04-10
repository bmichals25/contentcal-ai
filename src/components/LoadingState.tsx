import { Globe, Brain, Calendar, PenTool, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  stage: 'scraping' | 'analyzing' | 'generating' | 'saving';
  progress?: number;
}

const STAGES = {
  scraping: { icon: Globe, title: 'Scanning Website', description: 'Reading your business website content...', color: 'text-blue-500' },
  analyzing: { icon: Brain, title: 'Analyzing Business', description: 'Understanding your brand, audience, and offerings...', color: 'text-purple-500' },
  generating: { icon: PenTool, title: 'Creating Content Calendar', description: 'Generating ideas, drafts, and scripts for the month...', color: 'text-indigo-500' },
  saving: { icon: Calendar, title: 'Finalizing Calendar', description: 'Saving your content calendar...', color: 'text-emerald-500' },
};

export default function LoadingState({ stage, progress }: LoadingStateProps) {
  const current = STAGES[stage];
  const stageOrder = ['scraping', 'analyzing', 'generating', 'saving'];
  const currentIdx = stageOrder.indexOf(stage);

  return (
    <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-20" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{current.title}</h3>
      <p className="text-slate-500 mb-8">{current.description}</p>
      <div className="flex items-center justify-center gap-3 mb-6">
        {stageOrder.map((s, i) => {
          const StageIcon = STAGES[s as keyof typeof STAGES].icon;
          const isActive = i === currentIdx;
          const isDone = i < currentIdx;
          return (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-emerald-100 text-emerald-600' : isActive ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300' : 'bg-slate-100 text-slate-400'}`}>
                <StageIcon className="w-5 h-5" />
              </div>
              {i < stageOrder.length - 1 && <div className={`w-8 h-0.5 rounded ${isDone ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
            </div>
          );
        })}
      </div>
      {progress !== undefined && (
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
