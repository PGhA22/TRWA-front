import { useEffect, useRef, useState } from "react";

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoBox({
  src = "/vid/mission.mp4",
  poster,
  title = "The Real Wolves Academy",
  videoText = "PHASE 1 , MODULE 5",
  className = "w-full aspect-video",
}) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoadedMeta = () => {
      setDuration(v.duration || 0);
      setIsReady(true);
    };

    const onTime = () => {
      if (!seeking) setCurrent(v.currentTime || 0);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [seeking]);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? await v.play() : v.pause();
  };

  const onScrubStart = () => setSeeking(true);
  const onScrubEnd = () => setSeeking(false);

  const onScrubChange = (val) => {
    const t = Number(val);
    setCurrent(t);
    const v = videoRef.current;
    if (v) v.currentTime = t;
  };

  const toggleFullscreen = async () => {
    const el = wrapRef.current;
    if (!el) return;

    const isFs = document.fullscreenElement;
    if (!isFs) await el.requestFullscreen?.();
    else await document.exitFullscreen?.();
  };

  const progress = duration ? (current / duration) * 100 : 0;
  const remaining = duration - current;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className} rounded-[30px] overflow-hidden border border-[#40B7FF]/60 bg-[#081a33]`}
      onClick={togglePlay}
    >
      <style>{`
        .trwRange {
          -webkit-appearance: none;
          appearance: none;
        }
        .trwRange::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 0px;
          height: 0px;
          background: transparent;
          border: none;
        }
        .trwRange::-moz-range-thumb {
          width: 0px;
          height: 0px;
          background: transparent;
          border: none;
        }
        .trwRange::-ms-thumb {
          width: 0px;
          height: 0px;
          background: transparent;
          border: none;
        }
      `}</style>

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="metadata"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,25,88,0.10)_0%,rgba(2,25,88,0.55)_60%,rgba(2,25,88,0.85)_100%)]" />

      <div className="absolute bottom-14 left-6 text-white z-4 flex flex-col gap-2">
        <span className="text-xs">{videoText}</span>
        <span className="font-bold">{title}</span>
      </div>

      {!isPlaying && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="mb-8 absolute inset-0 z-3 flex items-center justify-center"
          aria-label="Play"
        >
          {/* play btn */}
          <div className="rounded-full bg-white/0 backdrop-blur-xs flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 300"
              className="w-10.5 text-white"
              fill="currentColor"
            >
              <path d="M150.32,25.01c69.35,0.42,125.05,56.37,124.69,125.25c-0.36,69.29-56.42,125.08-125.27,124.68c-69.33-0.41-125.06-56.39-124.69-125.26C25.43,80.39,81.49,24.6,150.32,25.01z M250.11,150.05c0.12-54.99-44.98-100.13-100.06-100.14c-54.97-0.01-99.76,44.68-100.08,99.83c-0.31,54.87,44.69,100.04,99.92,100.29C204.78,250.28,249.99,205.18,250.11,150.05z" />
              <path d="M112.52,150.04c0-12.5-0.02-25,0.01-37.49c0.03-10.23,9.63-15.84,18.4-10.56c20.9,12.57,41.74,25.24,62.52,38c8.1,4.97,8.18,14.93,0.12,19.89c-20.85,12.83-41.78,25.55-62.77,38.15c-8.62,5.18-18.23-0.45-18.26-10.49C112.49,175.04,112.52,162.54,112.52,150.04z" />
            </svg>
          </div>
        </button>
      )}

      <div
        className="absolute left-0 right-0 bottom-0 z-4 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ Full بالاتر */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className="absolute bottom-17 right-4 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm"
        >
          Full
        </button>

        <div className="relative mt-3">
          {/* ✅ زمان سمت راست */}
          <div className="absolute -top-6 right-0 text-white/80 text-sm tabular-nums">
            {formatTime(remaining)} LEFT
          </div>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.05"
            value={current}
            disabled={!isReady}
            onMouseDown={onScrubStart}
            onMouseUp={onScrubEnd}
            onTouchStart={onScrubStart}
            onTouchEnd={onScrubEnd}
            onChange={(e) => onScrubChange(e.target.value)}
            className="trwRange w-full h-1.5 bg-white/20 rounded-full outline-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, rgba(64,183,255,1) ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
