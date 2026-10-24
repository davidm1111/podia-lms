import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Headphones } from 'lucide-react';

interface AudioModuleProps {
  audioUrl?: string;
  audioTitle?: string;
}

export const AudioModule: React.FC<AudioModuleProps> = ({ audioUrl, audioTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!audioUrl) {
    return (
      <div className="p-8 rounded-3xl bg-[#faf8f5] border border-stone-200 text-center text-stone-500">
        <Headphones className="w-8 h-8 mx-auto mb-2 text-stone-400" />
        <p className="text-sm">No se ha especificado archivo de audio para esta lección.</p>
      </div>
    );
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-gradient-to-br from-[#281434] to-[#3f1f54] text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
          <Headphones className="w-7 h-7" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full">
            Lección en Audio / Podcast
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            {audioTitle || 'Reproducción de Audio'}
          </h3>
        </div>
      </div>

      {/* Player Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#724ae8] hover:bg-[#5d38cc] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="flex-1 space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-purple-400 h-1.5 bg-purple-900/60 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-200/80 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <Volume2 className="w-5 h-5 text-purple-300 hidden sm:block shrink-0" />
        </div>
      </div>
    </div>
  );
};
