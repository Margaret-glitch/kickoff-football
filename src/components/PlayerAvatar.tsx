import { useState } from 'react';

interface PlayerAvatarProps {
  playerId?: number | string;
  name: string;
  jerseyNumber?: number | string;
  className?: string;
  teamType?: 'home' | 'away';
  isGoalkeeper?: boolean;
}

export const PlayerAvatar = ({
  playerId,
  name,
  jerseyNumber,
  className = 'w-9 h-9',
  teamType = 'home',
  isGoalkeeper = false
}: PlayerAvatarProps) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const cleanPlayerId = playerId && String(playerId).replace(/\D/g, '');
  const hasValidId = Boolean(cleanPlayerId && Number(cleanPlayerId) > 0);
  const imageUrl = hasValidId
    ? `https://img.sofascore.com/api/v1/player/${cleanPlayerId}/image`
    : null;

  const getInitials = (str: string) => {
    const parts = str.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (str.slice(0, 2) || 'P').toUpperCase();
  };

  const bgClass = isGoalkeeper
    ? 'bg-amber-500 text-white'
    : teamType === 'home'
    ? 'bg-[#4169e1] text-white'
    : 'bg-[#b91c1c] text-white';

  return (
    <div
      className={`relative rounded-full overflow-hidden border-2 border-white shadow-xs flex items-center justify-center font-bold text-xs ${bgClass} ${className}`}
    >
      {/* Background fallback badge with Jersey Number or Initials */}
      <span className="select-none pointer-events-none drop-shadow-xs">
        {jerseyNumber ?? getInitials(name)}
      </span>

      {/* Real Player Headshot */}
      {imageUrl && !imgFailed && (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
