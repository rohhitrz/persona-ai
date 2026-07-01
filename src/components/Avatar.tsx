"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  src: string;
  alt: string;
  /** Shown if the image is missing or fails to load. */
  initials: string;
  /** Background colour for the initials fallback. */
  accent: string;
  size?: number;
}

/**
 * Circular avatar that gracefully falls back to a coloured initials badge
 * when the image can't be loaded. The persona images are added manually
 * later, so the app needs to look fine before they exist.
 */
export default function Avatar({
  src,
  alt,
  initials,
  accent,
  size = 96,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex select-none items-center justify-center rounded-full font-semibold tracking-wide text-white"
        style={{
          width: size,
          height: size,
          backgroundColor: accent,
          fontSize: size / 2.8,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
