
import React from 'react';
import { Loader2, Sparkles, Diamond } from 'lucide-react';

export const ProcessingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="relative">
          <Loader2 className="w-24 h-24 text-amber-400 animate-spin relative z-10 opacity-20" />
          <Diamond className="w-10 h-10 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
        </div>
      </div>
      
      <div className="space-y-6 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center justify-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-[0.4em]">
          <Sparkles className="w-4 h-4" />
          Analyzing Facets
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif font-bold gold-gradient">Mastering Perfection</h2>
        
        <div className="text-white/40 space-y-2 font-light text-sm italic">
          <p>Polishing metallic surfaces to a mirror finish...</p>
          <p className="text-[11px] opacity-60">Aligning studio light paths for maximum brilliance.</p>
        </div>

        <div className="pt-8 flex justify-center gap-1">
          {[0, 1, 2].map(i => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" 
              style={{ animationDelay: `${i * 0.1}s` }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
