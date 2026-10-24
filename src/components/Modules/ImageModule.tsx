import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageModuleProps {
  imageUrl?: string;
  caption?: string;
  title: string;
}

export const ImageModule: React.FC<ImageModuleProps> = ({ imageUrl, caption, title }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!imageUrl) {
    return (
      <div className="p-8 rounded-3xl bg-[#faf8f5] border border-stone-200 text-center text-stone-500">
        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-stone-400" />
        <p className="text-sm">No se ha especificado imagen para esta lección.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-white p-2 sm:p-4 shadow-sm group">
        <img
          src={imageUrl}
          alt={caption || title}
          className={`w-full rounded-2xl object-contain transition-all duration-300 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in max-h-[600px]'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-6 right-6 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          title={isZoomed ? 'Reducir tamaño' : 'Ampliar imagen'}
        >
          {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
        </button>
      </div>

      {caption && (
        <p className="text-xs sm:text-sm text-stone-500 italic text-center px-4 leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  );
};
