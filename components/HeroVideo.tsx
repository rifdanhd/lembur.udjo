"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Connection = EventTarget & { saveData?: boolean };

function connection() {
  return (navigator as Navigator & { connection?: Connection }).connection;
}

function subscribe(callback: () => void) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const network = connection();
  motion.addEventListener("change", callback);
  document.addEventListener("visibilitychange", callback);
  network?.addEventListener("change", callback);
  return () => {
    motion.removeEventListener("change", callback);
    document.removeEventListener("visibilitychange", callback);
    network?.removeEventListener("change", callback);
  };
}

function canPlay() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    && !document.hidden && !connection()?.saveData;
}

export default function HeroVideo({ src, poster, paused }: { src: string; poster: string; paused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const allowed = useSyncExternalStore(subscribe, canPlay, () => false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    if (paused) video.pause();
    else {
      video.muted = true;
      void video.play().catch(() => { if (!cancelled) setFailed(true); });
    }
    return () => { cancelled = true; video.pause(); };
  }, [allowed, paused, failed]);

  if (!allowed || failed) return null;

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay={!paused}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setReady(true)}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
