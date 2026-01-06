
import React, { useState } from 'react';
import { Video, Sparkles, Download, RotateCcw, Loader2, Play, Info } from 'lucide-react';
import { generateJewelryVideo } from '../services/geminiService';
import { playCompletionSound } from '../utils/audio';

interface Props {
  onReset: () => void;
}

export const VideoStudio: React.FC<Props> = ({ onReset }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startGeneration = async () => {
    if (!image) return;
    
    // Check for Veo API key requirement
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setStep('processing');
    try {
      const url = await generateJewelryVideo(image);
      setVideoUrl(url);
      setStep('result');
      // Play sound when video is ready
      playCompletionSound();
    } catch (err: any) {
      setError(err.message);
      setStep('upload');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {step === 'upload' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Motion Studio
            </div>
            <h2 className="text-4xl font-serif font-bold text-white">Cinematic Jewelry Motion</h2>
            <p className="text-white/40 max-w-xl mx-auto">Transform your static product photo into a high-end commercial video with slow-motion reflections and studio lighting.</p>
          </div>

          {!image ? (
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 hover:border-amber-400/50 hover:bg-white/5 transition-all group">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <Video className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-medium">Drop a retouched photo</p>
                  <p className="text-white/40 text-sm mt-2">Best results with high-quality PNGs</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </label>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={image} alt="Selected" className="w-full h-full object-contain p-4" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ready for Production</h3>
                  <p className="text-sm text-white/40">Our AI will generate a cinematic slow-pan video showing off the facets of your jewelry.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={startGeneration} className="w-full py-4 px-6 btn-gold text-black font-bold rounded-2xl flex items-center justify-center gap-2">
                    <Play className="w-5 h-5 fill-current" />
                    Generate Video
                  </button>
                  <button onClick={() => setImage(null)} className="text-sm text-white/40 hover:text-white transition-colors">Choose different photo</button>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[10px] text-blue-200/60">
                  <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <p>Video generation takes ~2-3 minutes. Requires a paid API key for Veo models.</p>
                </div>
              </div>
            </div>
          )}
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
        </div>
      )}

      {step === 'processing' && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full animate-pulse" />
            <Loader2 className="w-16 h-16 text-amber-400 animate-spin relative z-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold gold-gradient mb-4">Rendering Cinematic Motion...</h2>
          <div className="max-w-md text-white/60 space-y-2">
            <p className="animate-pulse">This usually takes about 2 minutes.</p>
            <p className="text-sm">Veo is generating light paths and realistic metallic reflections frame-by-frame.</p>
          </div>
        </div>
      )}

      {step === 'result' && videoUrl && (
        <div className="space-y-8 animate-in fade-in duration-1000">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold gold-gradient">Masterpiece Ready</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
            <video src={videoUrl} controls autoPlay loop className="w-full aspect-video bg-black shadow-2xl" />
          </div>
          <div className="flex justify-center gap-4">
            <a href={videoUrl} download="jewelry-cinematic.mp4" className="px-8 py-4 btn-gold text-black font-bold rounded-2xl flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download MP4
            </a>
            <button onClick={onReset} className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all">
              <RotateCcw className="w-5 h-5" />
              Create New
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
