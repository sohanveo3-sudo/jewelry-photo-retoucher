
import React from 'react';
import { Diamond, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  credits: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, credits }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-[#d4af37]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="p-2 bg-gradient-to-tr from-[#d4af37] to-[#f1e5ac] rounded-lg group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Diamond className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-serif font-bold gold-gradient tracking-tight">LuxeLens AI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
            <a href="#" className="hover:text-[#d4af37] transition-colors">Catalog</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Batch</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors border-b border-[#d4af37]/50 pb-1 text-[#d4af37]">Pricing</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Enterprise</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-black border border-[#d4af37]/40 rounded-full text-[10px] font-bold text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.1)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>REMAINING: {credits}/3 CREDITS</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        {children}
      </main>

      <footer className="border-t border-[#d4af37]/10 py-10 px-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/20">
        <p>© 2025 LuxeLens Studio. The Gold Standard in Jewelry Retouching.</p>
      </footer>
    </div>
  );
};
