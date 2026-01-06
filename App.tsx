
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ImageUploader } from './components/ImageUploader';
import { BatchManager } from './components/BatchManager';
import { VideoStudio } from './components/VideoStudio';
import { ResultView } from './components/ResultView';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { AppMode, ProcessingState, RetouchOptions, BatchItem } from './types';
import { retouchJewelryImage } from './services/geminiService';
import { playCompletionSound } from './utils/audio';
import { ChevronDown, Image as ImageIcon, Layers, Video, Sparkles, CreditCard, ShoppingCart } from 'lucide-react';

const LuxeSelect = ({ label, value, options, onChange }: { 
  label: string, 
  value: string, 
  options: { value: string, label: string }[], 
  onChange: (val: any) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-black mb-1 ml-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-black border border-[#d4af37]/30 rounded-xl px-5 py-3 min-w-[180px] text-xs font-bold text-white/90 cursor-pointer transition-all hover:border-[#d4af37] hover:bg-[#d4af37]/5 shadow-lg"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-black border border-[#d4af37]/40 rounded-xl overflow-hidden z-[60] shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`px-5 py-3 text-xs font-bold transition-colors cursor-pointer ${value === opt.value ? 'bg-[#d4af37] text-black' : 'text-white/70 hover:bg-[#d4af37]/10 hover:text-[#d4af37]'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('single');
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('luxelens_credits');
    return saved !== null ? parseInt(saved) : 3;
  });

  const [state, setState] = useState<ProcessingState>({
    status: 'idle',
    batchItems: [],
    currentProcessingIndex: -1,
  });

  const [options, setOptions] = useState<RetouchOptions>({
    background: 'white',
    intensity: 'pro',
    metalColor: 'silver',
    stoneColor: 'original',
    aspectRatio: '1:1'
  });

  useEffect(() => {
    localStorage.setItem('luxelens_credits', credits.toString());
  }, [credits]);

  const processNextInQueue = async (index: number, items: BatchItem[]) => {
    if (index >= items.length) {
      setState(prev => ({ ...prev, status: 'completed' }));
      return;
    }

    // Double check credits before processing each item
    if (credits <= 0) {
      setState(prev => ({
        ...prev,
        status: 'error',
        batchItems: prev.batchItems.map((item, idx) => 
          idx >= index ? { ...item, status: 'error', error: 'Out of credits' } : item
        )
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      currentProcessingIndex: index,
      batchItems: prev.batchItems.map((item, idx) => 
        idx === index ? { ...item, status: 'processing' } : item
      )
    }));

    try {
      const result = await retouchJewelryImage(items[index].originalImage, options);
      
      playCompletionSound();
      setCredits(prev => Math.max(0, prev - 1));

      setState(prev => {
        const newBatch = prev.batchItems.map((item, idx) => 
          idx === index ? { ...item, status: 'completed' as const, resultImage: result } : item
        );
        setTimeout(() => processNextInQueue(index + 1, newBatch), 300);
        return { ...prev, batchItems: newBatch };
      });
    } catch (err: any) {
      setState(prev => {
        const newBatch = prev.batchItems.map((item, idx) => 
          idx === index ? { ...item, status: 'error' as const, error: err.message } : item
        );
        setTimeout(() => processNextInQueue(index + 1, newBatch), 300);
        return { ...prev, batchItems: newBatch };
      });
    }
  };

  const handleImagesSelected = (base64Array: string[]) => {
    if (credits <= 0) return;

    // Limit batch to remaining credits
    const allowedImages = base64Array.slice(0, credits);
    
    const newItems: BatchItem[] = allowedImages.map((img) => ({
      id: Math.random().toString(36).substr(2, 9),
      originalImage: img,
      status: 'pending' as const
    }));

    const effectiveMode = allowedImages.length > 1 ? 'batch' : mode;
    if (effectiveMode !== mode) setMode(effectiveMode);

    setState({
      status: 'processing',
      batchItems: newItems,
      currentProcessingIndex: 0
    });

    processNextInQueue(0, newItems);
  };

  const reset = () => {
    setState({
      status: 'idle',
      batchItems: [],
      currentProcessingIndex: -1
    });
  };

  const renderOptions = () => (
    <div className="flex flex-wrap justify-center gap-6 bg-[#0a0a0a] p-10 rounded-[3rem] border border-[#d4af37]/30 mb-14 shadow-[0_30px_70px_-15px_rgba(212,175,55,0.15)] relative overflow-visible">
      <LuxeSelect 
        label="Metal Polish" 
        value={options.metalColor || 'silver'} 
        onChange={(v) => setOptions({...options, metalColor: v})}
        options={[
          { value: 'silver', label: 'Fine Silver' },
          { value: 'gold', label: '18K Yellow Gold' },
          { value: 'rose-gold', label: 'Rose Gold' }
        ]}
      />
      <LuxeSelect 
        label="Gem Selection" 
        value={options.stoneColor || 'original'} 
        onChange={(v) => setOptions({...options, stoneColor: v})}
        options={[
          { value: 'original', label: 'Original Gem' },
          { value: 'diamond', label: 'Pure Diamond' },
          { value: 'ruby', label: 'Royal Ruby' },
          { value: 'sapphire', label: 'Blue Sapphire' },
          { value: 'emerald', label: 'Green Emerald' },
          { value: 'amethyst', label: 'Purple Amethyst' }
        ]}
      />
      <LuxeSelect 
        label="Studio Base" 
        value={options.background} 
        onChange={(v) => setOptions({...options, background: v})}
        options={[
          { value: 'white', label: 'High-Key White' },
          { value: 'marble', label: 'Italian Marble' },
          { value: 'black', label: 'Noir Black' },
          { value: 'natural', label: 'Soft Mist' }
        ]}
      />
      <LuxeSelect 
        label="Polish Grade" 
        value={options.intensity} 
        onChange={(v) => setOptions({...options, intensity: v})}
        options={[
          { value: 'natural', label: 'Natural Look' },
          { value: 'pro', label: 'E-com Polish' },
          { value: 'ultra-sparkle', label: 'Maximum Fire' }
        ]}
      />
    </div>
  );

  return (
    <Layout credits={credits}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-black border border-[#d4af37]/30 rounded-2xl shadow-[0_10px_40px_rgba(212,175,55,0.05)]">
            <button 
              onClick={() => { setMode('single'); reset(); }}
              className={`flex items-center gap-2 px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${mode === 'single' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/40' : 'text-white/40 hover:text-[#d4af37]'}`}
            >
              <ImageIcon className="w-4 h-4" />
              Single Shot
            </button>
            <button 
              onClick={() => { setMode('batch'); reset(); }}
              className={`flex items-center gap-2 px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${mode === 'batch' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/40' : 'text-white/40 hover:text-[#d4af37]'}`}
            >
              <Layers className="w-4 h-4" />
              Batch
            </button>
            <button 
              onClick={() => { setMode('video'); reset(); }}
              className={`flex items-center gap-2 px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${mode === 'video' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/40' : 'text-white/40 hover:text-[#d4af37]'}`}
            >
              <Video className="w-4 h-4" />
              Motion
            </button>
          </div>
        </div>

        {credits <= 0 && state.status === 'idle' ? (
          <div className="animate-in fade-in zoom-in-95 duration-1000 max-w-2xl mx-auto">
            <div className="bg-[#0a0a0a] border-2 border-[#d4af37]/30 rounded-[3rem] p-16 text-center space-y-8 shadow-[0_0_80px_rgba(212,175,55,0.1)]">
              <div className="w-24 h-24 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto border border-[#d4af37]/20">
                <CreditCard className="w-10 h-10 text-[#d4af37]" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold gold-gradient">Credits Exhausted</h2>
                <p className="text-white/40 max-w-md mx-auto leading-relaxed">
                  You have used your 3 complimentary luxury retouches. Upgrade to a professional plan to continue mastering your jewelry collection.
                </p>
              </div>
              <button className="w-full py-5 px-8 btn-gold text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl flex items-center justify-center gap-3 shadow-xl">
                <ShoppingCart className="w-5 h-5" />
                View Professional Plans
              </button>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Plans start at $29/mo for unlimited exports</p>
            </div>
          </div>
        ) : mode === 'video' ? (
          <VideoStudio onReset={reset} />
        ) : state.status === 'idle' ? (
          <div className="animate-in fade-in slide-in-from-top-6 duration-1000 max-w-5xl mx-auto">
            <div className="text-center space-y-6 mb-20">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37] text-[11px] font-black uppercase tracking-[0.4em] mb-4">
                <Sparkles className="w-4 h-4" />
                LUXELENS V2.5
              </div>
              <h2 className="text-8xl md:text-9xl font-serif font-bold gold-gradient tracking-tighter leading-none">
                Simply <br /> Brilliant.
              </h2>
              <p className="text-xl text-white/30 max-w-2xl mx-auto font-light leading-relaxed italic">
                The absolute gold standard in AI jewelry retouching.
              </p>
            </div>

            {renderOptions()}

            <ImageUploader 
              onImagesSelected={handleImagesSelected} 
              isProcessing={false} 
            />
          </div>
        ) : mode === 'single' ? (
          state.status === 'processing' ? (
            <ProcessingOverlay />
          ) : state.status === 'completed' && state.batchItems[0]?.resultImage ? (
            <div className="animate-in fade-in zoom-in-95 duration-1000">
               <ResultView 
                retouched={state.batchItems[0].resultImage} 
                onReset={reset}
              />
            </div>
          ) : (
            <div className="text-center p-20 bg-black border border-red-500/20 rounded-[3rem]">
              <p className="text-red-400 font-bold uppercase tracking-widest">Engine Error</p>
              <button onClick={reset} className="mt-8 px-10 py-4 bg-[#d4af37] text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">Reset Engine</button>
            </div>
          )
        ) : (
          <BatchManager 
            items={state.batchItems} 
            currentIndex={state.currentProcessingIndex} 
            onReset={reset}
            status={state.status}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
