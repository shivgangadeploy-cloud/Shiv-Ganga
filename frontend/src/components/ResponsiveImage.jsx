import React from 'react';

// Small helper to build srcset variants by inserting `-WIDTH` before extension.
const makeVariants = (src, widths = [400, 800, 1200]) => {
  if (!src) return '';

  // Don't append variants for remote URLs or URLs with query params
  if (/^https?:\/\//i.test(src) || src.includes('?')) return '';

  // Skip absolute public paths (e.g., /images/...) to avoid generating variants that don't exist
  if (src.startsWith('/')) return '';

  // Detect Vite hashed asset filenames like /assets/name.[hash].webp and skip
  if (/\.[a-f0-9]{6,}\./i.test(src)) return '';

  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return '';
  const base = src.slice(0, lastDot);
  const ext = src.slice(lastDot + 1);

  return widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
};

export default function ResponsiveImage({ src, alt = '', className = '', sizes = '100vw', widths, style }) {
  const webpSrcSet = makeVariants(src, widths || [400, 800, 1200]);

  return (
    <picture>
      {webpSrcSet ? (
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      ) : null}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        sizes={sizes}
        style={style}
      />
    </picture>
  );
}
