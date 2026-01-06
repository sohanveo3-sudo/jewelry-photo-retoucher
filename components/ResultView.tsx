
import React from 'react';
import { Download, Share2, RotateCcw, Sparkles, Diamond } from 'lucide-react';

interface Props {
  retouched: string;
  onReset: () => void;
}

export const ResultView: React.FC<Props> = ({ retouched, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = retouched;
    link.download = 'luxelens-jewelry-master.png';
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Final Image Showcase */}
        <div className="lg:col-span-8 relative group">
          <div className="absolute -inset-4 bg-amber-500/5 blur-3xl opacity-50 rounded-full" />
          <div className="relative aspect-square bg-white/[0.02] backdrop-blur-md rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center p-8">
            <img 
              src={retouched} 
              alt="Mastered Jewelry"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-[1.02]"
            />
            
            {/* Elegant corner accents */}
            <div className="absolute top-8 left-8 p-3 border-l border-t border-amber-400/30 rounded-tl-xl" />
            <div className="absolute bottom-8 right-8 p-3 border-r border-b border-amber-400/30 rounded-br-xl" />
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
              <Sparkles className="w-3 h-3" />
              Retouching Perfected
            </div>
            <h3 className="font-serif text-5xl font-bold gold-gradient">Studio Master.</h3>
            <p className="text-white/40 leading-relaxed font-light">
              Gemini AI has polished metallic surfaces, enhanced gemstone fire, and removed all artifacts from your source image.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-white/60 text-xs italic">
              <Diamond className="w-4 h-4 text-amber-400/60" />
              Ready for Instagram, Shopify, or Print.
            </div>
            
            <button 
              onClick={handleDownload}
              className="w-full py-5 px-8 btn-gold text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10"
            >
              <Download className="w-5 h-5" />
              Download Master
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={onReset}
                className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retouch New
              </button>
            </div>
          </div>

          {/* Luxury Detail card */}
          <div className="p-6 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 rounded-3xl space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Technical Specs</h4>
            <div className="grid grid-cols-2 gap-4 text-[10px] text-white/30">
              <div>
                <p className="font-bold text-white/50">FORMAT</p>
                <p>PNG Lossless</p>
              </div>
              <div>
                <p className="font-bold text-white/50">DEPTH</p>
                <p>32-bit Render</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
