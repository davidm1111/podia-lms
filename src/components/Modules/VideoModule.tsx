import React from 'react';
import { Play, Video } from 'lucide-react';

interface VideoModuleProps {
  videoUrl?: string;
  title: string;
}

export const VideoModule: React.FC<VideoModuleProps> = ({ videoUrl, title }) => {
  if (!videoUrl) {
    return (
      <div className="p-8 rounded-3xl bg-[#faf8f5] border border-stone-200 text-center text-stone-500">
        <Video className="w-8 h-8 mx-auto mb-2 text-stone-400" />
        <p className="text-sm">No se ha especificado URL de vídeo para esta lección.</p>
      </div>
    );
  }

  // Convert standard YouTube watch URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm');

  return (
    <div className="space-y-4">
      <div className="relative rounded-3xl overflow-hidden bg-black shadow-lg border border-stone-800 aspect-video">
        {isDirectVideo ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            title={title}
          />
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-stone-500 px-1">
        <Play className="w-3.5 h-3.5 text-purple-600 fill-current" />
        <span>Reproductor de Vídeo HD · Compatible con pantallas móviles y ordenadores</span>
      </div>
    </div>
  );
};
