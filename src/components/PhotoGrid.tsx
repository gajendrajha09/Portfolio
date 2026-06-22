"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteImage } from "@/lib/types";
import { Lightbox } from "./Lightbox";

interface PhotoGridProps {
  images: SiteImage[];
  columns?: number;
  gutter?: number;
}

export function PhotoGrid({ images, columns = 2, gutter = 16 }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gutter}px`,
        }}
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative block w-full overflow-hidden bg-canvas-soft text-left"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {image.caption && (
              <p className="mt-3 text-xs text-ink-muted">{image.caption}</p>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
