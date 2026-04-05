"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn, formatPlayerTime } from "@/lib/utils";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const playerBtnClass =
  "flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all";

interface VideoPlayerProps {
  src: string | null;
  embedUrl: string;
  poster?: string;
  title: string;
}

type PlayerMode = "native" | "embed";

export function VideoPlayer({
  src,
  embedUrl,
  poster,
  title,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [mode, setMode] = useState<PlayerMode>("embed");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayPulse, setShowPlayPulse] = useState(false);

  const resetIdleTimer = useCallback(() => {
    setShowControls(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isPlaying) {
      idleTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) setShowControls(true);
  }, [isPlaying]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    if (mode !== "native") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setShowPlayPulse(true);
    setTimeout(() => setShowPlayPulse(false), 400);

    if (video.paused) {
      video.play().catch(() => setMode("embed"));
      setHasStarted(true);
    } else {
      video.pause();
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(
      0,
      Math.min(video.duration, video.currentTime + seconds),
    );
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      if (!video || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const fraction = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      video.currentTime = fraction * duration;
    },
    [duration],
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video) return;
      const val = parseFloat(e.target.value);
      video.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    },
    [],
  );

  const cycleSpeed = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const currentIdx = SPEEDS.indexOf(playbackRate);
    const nextIdx = (currentIdx + 1) % SPEEDS.length;
    const newRate = SPEEDS[nextIdx];
    video.playbackRate = newRate;
    setPlaybackRate(newRate);
  }, [playbackRate]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  const handleVideoError = useCallback(() => {
    console.warn("Video playback error, switching to embed player");
    setMode("embed");
  }, []);

  const updateBuffered = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.buffered.length) return;
    const end = video.buffered.end(video.buffered.length - 1);
    setBuffered(video.duration > 0 ? (end / video.duration) * 100 : 0);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (mode === "embed") {
    return (
      <div
        ref={containerRef}
        className="relative mx-3 overflow-hidden rounded-2xl bg-black sm:mx-0"
      >
        <iframe
          src={embedUrl}
          className="aspect-video w-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen"
          title={title}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="group relative mx-3 overflow-hidden rounded-2xl bg-black sm:mx-0"
      onMouseMove={resetIdleTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      tabIndex={0}
      role="region"
      aria-label={`Video player: ${title}`}
    >
      <video
        ref={videoRef}
        src={src || undefined}
        poster={poster}
        className="aspect-video w-full cursor-pointer bg-black"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
          updateBuffered();
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onError={handleVideoError}
        onProgress={updateBuffered}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
      />

      {/* Buffering spinner */}
      {isBuffering && hasStarted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>
      )}

      {/* Play/pause pulse */}
      {showPlayPulse && hasStarted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 animate-[pulse-out_0.4s_ease-out]">
            {isPlaying ? (
              <Pause className="h-7 w-7 text-white" fill="currentColor" />
            ) : (
              <Play className="h-7 w-7 text-white ml-1" fill="currentColor" />
            )}
          </div>
        </div>
      )}

      {/* Big initial play button */}
      {!hasStarted && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-label="Putar video"
        >
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/90 text-black shadow-[0_4px_32px_var(--color-primary-glow)] transition-transform hover:scale-110 active:scale-95">
            <Play className="ml-1 h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Controls overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-4 pb-3 pt-16 sm:px-5 sm:pb-4 transition-opacity duration-300",
          showControls || !isPlaying
            ? "opacity-100"
            : "opacity-0 pointer-events-none",
        )}
      >
        {/* Progress bar */}
        <div className="mb-3 flex items-center gap-3">
          <div
            className="group/progress relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/15 hover:h-2.5 transition-all"
            onClick={handleSeek}
            role="slider"
            aria-label="Posisi video"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/10"
              style={{ width: `${buffered}%` }}
            />
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-primary to-primary-light z-[1]"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 z-[2] -translate-y-1/2 h-4 w-4 rounded-full bg-primary shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: "-8px" }}
            />
          </div>
          <span className="shrink-0 text-[11px] text-white/60 tabular-nums font-medium">
            {formatPlayerTime(currentTime)} / {formatPlayerTime(duration)}
          </span>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => skip(-10)}
              className={playerBtnClass}
              aria-label="10 detik mundur"
            >
              <SkipBack className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              aria-label={isPlaying ? "Jeda" : "Putar"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
              )}
            </button>
            <button
              onClick={() => skip(10)}
              className={playerBtnClass}
              aria-label="10 detik maju"
            >
              <SkipForward className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="group/vol flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className={playerBtnClass}
                aria-label={isMuted ? "Nyalakan suara" : "Bisukan"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="hidden sm:block h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/20 accent-primary transition-all group-hover/vol:w-20"
              />
            </div>

            <button
              onClick={cycleSpeed}
              className="hidden sm:flex h-7 items-center rounded-md bg-white/10 px-2 text-[11px] font-semibold text-white/80 hover:bg-white/20 transition-colors"
              aria-label={`Kecepatan ${playbackRate}x`}
            >
              {playbackRate}x
            </button>

            <button
              onClick={() => setMode("embed")}
              className={playerBtnClass}
              aria-label="Buka di pemutar Internet Archive"
            >
              <ExternalLink className="h-4 w-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className={playerBtnClass}
              aria-label={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
