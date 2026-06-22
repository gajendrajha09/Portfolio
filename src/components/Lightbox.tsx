"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { SiteImage } from "@/lib/types";

interface LightboxProps {
  images: SiteImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const current = images[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1)
        onNavigate(currentIndex + 1);
    },
    [currentIndex, images.length, onClose, onNavigate],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 text-white/70 transition-colors hover:text-white"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-4 z-10 text-white/70 transition-colors hover:text-white md:left-8"
          aria-label="Previous image"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className="absolute right-4 z-10 text-white/70 transition-colors hover:text-white md:right-8"
          aria-label="Next image"
        >
          <ChevronRight size={36} />
        </button>
      )}

      <div
        className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[75vh] w-full">
          <Image
            src={current.src}
            alt={current.alt}
            width={1600}
            height={1200}
            className="max-h-[75vh] w-auto object-contain"
            priority
          />
        </div>
        {(current.caption || current.alt) && (
          <p className="mt-4 max-w-lg text-center text-sm text-white/60">
            {current.caption || current.alt}
          </p>
        )}
        <p className="mt-2 text-xs text-white/40">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
