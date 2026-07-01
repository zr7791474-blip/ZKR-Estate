"use client";

import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const image =
    images[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
      <Image
        src={image}
        alt="Property image"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 66vw"
      />
    </div>
  );
}