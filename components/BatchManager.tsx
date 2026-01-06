
import React from 'react';
import { BatchItem } from '../types';
import { CheckCircle2, CircleDashed, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  items: BatchItem[];
  currentIndex: number;
  onReset: () => void;
  status: string;
}

export const BatchManager: React.FC<Props> = ({ items, currentIndex, onReset, status }) => {
  const completedCount = items.filter(item => item.status === 'completed').length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold gold-gradient">Batch Processing</h2>
            <p className="text-white/40">
              {status === 'completed' 
                ? `Finished processing ${items.length} images` 
                : `Processing item ${currentIndex + 1} of ${items.length}`}
            </p>
          </div>
          {status === 'completed' && (
            <button 
              onClick={onReset}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors text-sm font-bold"
            >
              Start New Batch
            </button>
          )}
        </div>

        <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={item.id} className="relative group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col">
            <div className="aspect-square relative overflow-hidden bg-black/40">
              <img 
                src={item.resultImage || item.originalImage} 
                className={`w-full h-full object-contain p-4 transition-all duration-700 ${item.status === 'processing' ? 'scale-110 blur-sm opacity-50' : ''}`}
                alt="Jewelry"
              />
              
              {/* Overlay Status */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {item.status === 'processing' && (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-black/60 px-3 py-1 rounded-full">Retouching...</span>
                  </div>
                )}
                {item.status === 'completed' && (
                  <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 p-2 rounded-full border border-green-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 p-2 rounded-full border border-red-500/30">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-white/5 bg-black/20">
              <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Image #{idx + 1}</span>
              {item.status === 'completed' && (
                 <a 
                  href={item.resultImage} 
                  download={`jewelry-retouched-${idx + 1}.png`}
                  className="text-amber-400 text-xs font-bold hover:underline"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
