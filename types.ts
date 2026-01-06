
export type AppMode = 'single' | 'batch' | 'video';

export interface RetouchOptions {
  background: 'white' | 'marble' | 'black' | 'natural';
  intensity: 'natural' | 'pro' | 'ultra-sparkle';
  metalColor?: 'silver' | 'gold' | 'rose-gold';
  stoneColor?: 'original' | 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'canary';
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
}

export interface BatchItem {
  id: string;
  originalImage: string;
  resultImage?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'completed' | 'error';
  batchItems: BatchItem[];
  currentProcessingIndex: number;
}

export interface VideoState {
  status: 'idle' | 'processing' | 'completed' | 'error';
  originalImage?: string;
  videoUrl?: string;
  error?: string;
}

export enum ModelNames {
  FLASH_IMAGE = 'gemini-2.5-flash-image',
  PRO_IMAGE = 'gemini-3-pro-image-preview',
  VEO = 'veo-3.1-fast-generate-preview'
}
