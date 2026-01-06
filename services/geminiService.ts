
import { GoogleGenAI } from "@google/genai";
import { RetouchOptions, ModelNames } from "../types";

export const retouchJewelryImage = async (
  base64Image: string,
  options: RetouchOptions
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeType = base64Image.split(';')[0].split(':')[1];
  const data = base64Image.split(',')[1];

  const metalDescriptions: Record<string, string> = {
    'silver': 'bright, flawless silver or white gold with sharp, high-contrast chrome-like mirror reflections and cold highlights',
    'gold': 'rich, deeply saturated 18k yellow gold with warm honey tones, brilliant metallic luster, and realistic golden glints',
    'rose-gold': 'premium pink-toned rose gold with warm copper-like metallic reflections and soft luxury sheen'
  };

  const stoneDescriptions: Record<string, string> = {
    'original': 'enhance and amplify the current gemstones with maximum internal fire, clarity, and brilliant crystalline dispersion',
    'diamond': 'transform stones into flawless D-grade brilliant-cut diamonds with intense white fire, rainbow dispersion, and sharp facets',
    'ruby': 'convert stones into deep, rich pigeon-blood rubies with a vivid crimson internal glow and crystalline perfection',
    'sapphire': 'convert stones into royal cornflower blue sapphires with velvety depth and brilliant crystalline facets',
    'emerald': 'convert stones into vivid, saturated forest green emeralds with luminous internal clarity and rich grass-green tones',
    'amethyst': 'convert stones into deep siberian purple amethysts with brilliant violet and lilac light refractions'
  };

  const selectedMetalDesc = options.metalColor ? metalDescriptions[options.metalColor] : 'high-quality precious metal';
  const selectedStoneDesc = options.stoneColor ? stoneDescriptions[options.stoneColor] : stoneDescriptions['original'];

  const prompt = `
    Retouch this jewelry photograph for a high-end luxury brand catalog.
    
    CORE REQUIREMENTS:
    1. BACKGROUND & SHADOW: Replace background with a high-end studio ${options.background} surface. Add a soft, anatomically correct professional drop shadow where the piece touches the ground.
    2. GEMSTONE TRANSFORMATION: ${selectedStoneDesc}. Gemstones must look hyper-realistic, with multi-faceted light refraction, internal brilliance, and sharp edges.
    3. LUXURY METAL POLISH: Refine and re-render the metal to look like ${selectedMetalDesc}. Remove all imperfections, fingerprints, phone reflections, and noise.
    4. LIGHTING: Use professional studio lighting setup: two-point key lighting to accentuate the jewelry shape and facets.
    5. IMAGE QUALITY: Output must be ultra-sharp, high-contrast, and in ${options.aspectRatio || '1:1'} aspect ratio.
    
    The final image must look like it was shot by a world-class jewelry photographer. RETURN ONLY THE RETOUCHED IMAGE.
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: ModelNames.FLASH_IMAGE,
      contents: {
        parts: [{ inlineData: { data, mimeType }, }, { text: prompt }],
      },
      config: {
        imageConfig: { aspectRatio: options.aspectRatio || '1:1' }
      }
    });

    let resultImage = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          resultImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    if (!resultImage) throw new Error("AI failed to generate a luxury image.");
    return resultImage;
  } catch (error: any) {
    console.error("LUXELENS_ENGINE_CRASH:", error);
    throw new Error("Luxury processing failed. Please check your source image.");
  }
};

export const generateJewelryVideo = async (
  base64Image: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  const prompt = "A cinematic slow-motion rotation of this jewelry piece, showcasing brilliant reflections and sparkles, studio lighting, depth of field, hyper-realistic detail, luxury atmosphere.";

  let operation = await ai.models.generateVideos({
    model: ModelNames.VEO,
    prompt: prompt,
    image: {
      imageBytes: data,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");
  
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
