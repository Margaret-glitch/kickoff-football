import React from 'react';

interface GlassmorphicPreloaderProps {
  isFadingOut: boolean;
}

/**
 * Spikey Spinner:
 * Precision SVG with 12 tapered sharp radiating spikes / blades
 * rotating smoothly in the center of the transparent glassmorphic overlay.
 */
export const SpikeySpinner: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = '#4169e1'
}) => {
  // 12 tapered radiating spikes arranged around 360 degrees
  const spikes = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30;
    // Ascending opacity gradient for the trailing motion effect
    const opacity = Math.max(0.18, ((i + 1) / 12));
    return { angle, opacity };
  });

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      aria-label="Loading real-time matches"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-spin"
        style={{
          animationDuration: '0.8s',
          animationTimingFunction: 'linear',
          transformOrigin: '50% 50%'
        }}
      >
        {spikes.map(({ angle, opacity }, idx) => (
          <g key={idx} transform={`rotate(${angle} 50 50)`}>
            {/* Precision tapered sharp spike blade */}
            <path
              d="M 47.5 24 L 50 7 L 52.5 24 L 51 27 L 49 27 Z"
              fill={color}
              opacity={opacity}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

/**
 * Full-screen Transparent Glassmorphic Preloader:
 * - Pure transparent glassmorphic effect (no dark, no shadows, no tags)
 * - Centered spikey spinner
 * - Fades away smoothly once real match data is loaded
 * - No text banners or mentions
 */
export const GlassmorphicPreloader: React.FC<GlassmorphicPreloaderProps> = ({ isFadingOut }) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.45)'
      }}
    >
      {/* Central Spikey Spinner */}
      <div className="relative flex flex-col items-center justify-center">
        <SpikeySpinner size={68} color="#4169e1" />
      </div>
    </div>
  );
};
