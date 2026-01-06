
import React, { useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface Props {
  onImagesSelected: (base64Array: string[]) => void;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<Props> = ({ onImagesSelected, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Added explicit type for file to resolve the 'unknown' type error in some TS environments
      const readers = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const base64Array = await Promise.all(readers);
      onImagesSelected(base64Array);
    }
  };

  const triggerInput = () => {
    if (!isProcessing) fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        onClick={triggerInput}
        className={`relative group border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-400/50 hover:bg-white/5'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-amber-400" />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Upload Jewelry Photos</h3>
            <p className="text-white/40 max-w-xs mx-auto">
              Select one or multiple photos. Snap them with your phone or drag and drop. 
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm">
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm">
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </div>
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          disabled={isProcessing}
        />
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-8 text-xs text-white/30 uppercase tracking-widest font-semibold">
        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3"/> Background Removal</span>
        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3"/> Sparkle Boost</span>
        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3"/> Metal Polish</span>
      </div>
    </div>
  );
};
