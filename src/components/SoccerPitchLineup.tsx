import { Star } from 'lucide-react';
import { DynamicMatchDetail, MatchPlayer } from '../data/matchDetailsGenerator';
import { PlayerAvatar } from './PlayerAvatar';

interface SoccerPitchLineupProps {
  details: DynamicMatchDetail;
  homeTeamName: string;
  awayTeamName: string;
  homeFlag: string;
  awayFlag: string;
}

export const SoccerPitchLineup = ({
  details,
  homeTeamName,
  awayTeamName,
  homeFlag,
  awayFlag
}: SoccerPitchLineupProps) => {
  // Rating color helper
  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 8.5) return 'bg-[#00c5d4] text-white font-black ring-1 ring-[#00aab7]'; // Cyan star
    if (rating >= 8.0) return 'bg-[#00c5d4] text-white font-bold';
    if (rating >= 7.0) return 'bg-[#22c55e] text-white font-bold'; // Green
    if (rating >= 6.5) return 'bg-[#f59e0b] text-white font-semibold'; // Yellow/Orange
    return 'bg-[#f97316] text-white font-semibold'; // Orange
  };

  // Generic Dynamic Formation Parser (handles 4-2-3-1, 4-3-3, 3-5-2, 5-4-1, 3-5-1-1, 4-4-2, etc.)
  const parseFormationRows = (formationStr: string, players: MatchPlayer[]) => {
    if (!players || players.length === 0) return [];

    let counts = (formationStr || '4-4-2')
      .split(/[-–—/]/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    const sum = counts.reduce((acc, c) => acc + c, 0);
    if (counts.length === 0 || sum !== 10) {
      // Automatic fallback if formation count is unusual
      if (players.length >= 11) {
        counts = [4, 4, 2];
      } else {
        counts = [players.length - 1];
      }
    }

    const rows: MatchPlayer[][] = [];
    // Row 0: Goalkeeper
    rows.push(players.slice(0, 1));

    let currentIdx = 1;
    for (const count of counts) {
      const slice = players.slice(currentIdx, currentIdx + count);
      if (slice.length > 0) {
        rows.push(slice);
      }
      currentIdx += count;
    }

    // Attach any leftover starting 11
    if (currentIdx < Math.min(11, players.length)) {
      if (rows.length > 1) {
        rows[rows.length - 1] = [
          ...rows[rows.length - 1],
          ...players.slice(currentIdx, 11)
        ];
      }
    }

    return rows;
  };

  const homeRows = parseFormationRows(details.homeFormation, details.homeLineup);
  const awayRows = parseFormationRows(details.awayFormation, details.awayLineup);

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Top Formations Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <img
            src={homeFlag}
            alt={homeTeamName}
            className="w-4 h-3 object-cover rounded-xs"
          />
          <span className="font-bold text-slate-900">{homeTeamName}</span>
          <span className="px-1.5 py-0.5 rounded text-[11px] font-black bg-[#00c5d4] text-white">
            {details.homeRatingAvg.toFixed(2)}
          </span>
          <span className="text-slate-500 font-semibold">{details.homeFormation}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">{details.awayFormation}</span>
          <span className="px-1.5 py-0.5 rounded text-[11px] font-black bg-[#f59e0b] text-white">
            {details.awayRatingAvg.toFixed(2)}
          </span>
          <span className="font-bold text-slate-900">{awayTeamName}</span>
          <img
            src={awayFlag}
            alt={awayTeamName}
            className="w-4 h-3 object-cover rounded-xs"
          />
        </div>
      </div>

      {/* Soccer Pitch Graphic */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-800/40 shadow-inner bg-[#2e7d32] select-none">
        {/* Pitch Lines SVG Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none">
            {/* Outer boundary */}
            <rect x="15" y="15" width="370" height="570" fill="none" stroke="#ffffff" strokeWidth="2" />
            {/* Half line */}
            <line x1="15" y1="300" x2="385" y2="300" stroke="#ffffff" strokeWidth="2" />
            {/* Center circle */}
            <circle cx="200" cy="300" r="45" fill="none" stroke="#ffffff" strokeWidth="2" />
            <circle cx="200" cy="300" r="3" fill="#ffffff" />
            {/* Top penalty box */}
            <rect x="95" y="15" width="210" height="90" fill="none" stroke="#ffffff" strokeWidth="2" />
            <rect x="145" y="15" width="110" height="35" fill="none" stroke="#ffffff" strokeWidth="2" />
            <path d="M 160 105 A 40 40 0 0 0 240 105" fill="none" stroke="#ffffff" strokeWidth="2" />
            {/* Bottom penalty box */}
            <rect x="95" y="495" width="210" height="90" fill="none" stroke="#ffffff" strokeWidth="2" />
            <rect x="145" y="550" width="110" height="35" fill="none" stroke="#ffffff" strokeWidth="2" />
            <path d="M 160 495 A 40 40 0 0 1 240 495" fill="none" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>

        {/* Grass Alternating Stripes Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2e7d32] via-[#2a732e] to-[#256929] opacity-90" />
        <div className="absolute inset-0 flex flex-col pointer-events-none opacity-10">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>

        {/* Players Formation Layout Container */}
        <div className="relative z-10 p-4 min-h-[620px] flex flex-col justify-between">
          {/* 1. HOME TEAM (Top Half) */}
          <div className="flex flex-col justify-between h-[285px]">
            {homeRows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="flex items-center justify-around px-2"
              >
                {row.map((p) => (
                  <div key={p.id} className="flex flex-col items-center group cursor-pointer">
                    <div className="relative">
                      <PlayerAvatar
                        playerId={p.id}
                        name={p.name}
                        jerseyNumber={p.number}
                        teamType="home"
                        isGoalkeeper={p.position === 'GK' || rIdx === 0}
                        className="w-9 h-9"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded-xs text-[9px] flex items-center gap-0.5 ${getRatingBadgeClass(
                          p.rating
                        )}`}
                      >
                        {p.isPlayerOfTheMatch && <Star className="w-2 h-2 fill-current" />}
                        {p.rating.toFixed(1)}
                      </span>
                      {p.hasGoal && (
                        <span className="absolute -top-1 -right-1 text-[10px]" title="Goal">
                          ⚽
                        </span>
                      )}
                      {p.hasAssist && (
                        <span className="absolute -top-1 -right-1 text-[10px]" title="Assist">
                          👟
                        </span>
                      )}
                      {p.hasYellowCard && (
                        <span className="absolute -top-1 -left-1 text-[10px]" title="Yellow Card">
                          🟨
                        </span>
                      )}
                      {p.isSubbedOut && (
                        <span className="absolute -top-1 -left-1 text-[10px]" title="Substituted">
                          ⇄
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow mt-1 text-center truncate max-w-[65px]">
                      {p.shortName}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Center line buffer */}
          <div className="h-4" />

          {/* 2. AWAY TEAM (Bottom Half) - Rendered upwards from goal to center */}
          <div className="flex flex-col-reverse justify-between h-[285px]">
            {awayRows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="flex items-center justify-around px-2"
              >
                {row.map((p) => (
                  <div key={p.id} className="flex flex-col items-center group cursor-pointer">
                    <div className="relative">
                      <PlayerAvatar
                        playerId={p.id}
                        name={p.name}
                        jerseyNumber={p.number}
                        teamType="away"
                        isGoalkeeper={p.position === 'GK' || rIdx === 0}
                        className="w-9 h-9"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded-xs text-[9px] flex items-center gap-0.5 ${getRatingBadgeClass(
                          p.rating
                        )}`}
                      >
                        {p.isPlayerOfTheMatch && <Star className="w-2 h-2 fill-current" />}
                        {p.rating.toFixed(1)}
                      </span>
                      {p.hasGoal && (
                        <span className="absolute -top-1 -right-1 text-[10px]" title="Goal">
                          ⚽
                        </span>
                      )}
                      {p.hasYellowCard && (
                        <span className="absolute -top-1 -right-1 text-[10px]" title="Yellow Card">
                          🟨
                        </span>
                      )}
                      {p.isSubbedOut && (
                        <span className="absolute -top-1 -left-1 text-[10px]" title="Substituted">
                          ⇄
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow mt-1 text-center truncate max-w-[65px]">
                      {p.shortName}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referee & Managers Bar */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Referee
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base">🇳🇴</span>
            <div>
              <span className="font-bold text-slate-900 block">{details.referee.name}</span>
              <span className="text-[10px] text-slate-500">
                Avg. cards: 🟥 {details.referee.avgRed} 🟨 {details.referee.avgYellow}
              </span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Managers
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[100px]">
                {details.homeManager.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[100px]">
                {details.awayManager.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Substitutions Full List */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5">
        <h4 className="text-xs font-bold text-slate-900 mb-3 text-center">
          Substitutions
        </h4>

        <div className="flex flex-col divide-y divide-slate-100 text-xs">
          {details.substitutions.map((sub, sIdx) => (
            <div key={sIdx} className="py-2.5 flex items-center justify-between">
              {/* Player IN with PlayerAvatar */}
              <div className="flex items-center gap-2.5 flex-1">
                <PlayerAvatar
                  name={sub.playerIn.name}
                  jerseyNumber={sub.playerIn.number}
                  teamType={sub.team}
                  className="w-7 h-7 text-[10px]"
                />
                <div>
                  <div className="font-bold text-slate-900 text-[11px]">
                    {sub.playerIn.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">➔ {sub.minute}&apos;</span>
                    <span>Out: {sub.playerOut.name}</span>
                  </div>
                </div>
              </div>

              {/* Rating badge */}
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${getRatingBadgeClass(sub.playerIn.rating)}`}>
                {sub.playerIn.rating.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
