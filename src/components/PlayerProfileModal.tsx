import { useState } from 'react';
import { X, Star, Award, ShieldCheck, Activity } from 'lucide-react';
import { PLAYERS_DATA, PlayerDetail } from '../data/extendedFootballData';

interface PlayerProfileModalProps {
  playerId: string | null;
  onClose: () => void;
  onOpenTeam?: (teamId: string) => void;
}

export const PlayerProfileModal = ({
  playerId,
  onClose,
  onOpenTeam
}: PlayerProfileModalProps) => {
  const [isFollowed, setIsFollowed] = useState(true);

  if (!playerId) return null;

  const player: PlayerDetail | undefined = PLAYERS_DATA[playerId] || PLAYERS_DATA['saka'];
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header Hero Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden border-2 border-white/20 shrink-0">
              <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                  #{player.number} · {player.position}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black truncate mt-0.5">{player.name}</h2>
              <div
                onClick={() => {
                  onClose();
                  onOpenTeam?.(player.teamId);
                }}
                className="flex items-center gap-2 text-xs text-slate-300 mt-1 cursor-pointer hover:text-white"
              >
                <img src={player.teamLogo} alt={player.team} className="w-4 h-4 object-contain" />
                <span className="font-semibold underline">{player.team}</span>
                <span>·</span>
                <span>{player.nationality}</span>
              </div>
            </div>

            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isFollowed
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="Follow Player"
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Bio specs */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Age</span>
              <span className="font-black text-slate-900">{player.age} yrs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Height</span>
              <span className="font-black text-slate-900">{player.height}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Preferred</span>
              <span className="font-black text-slate-900">{player.foot} Foot</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Rating</span>
              <span className="font-black text-emerald-600">{player.seasonStats.rating}</span>
            </div>
          </div>

          {/* Season Statistics Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">2026/27 Season Statistics</h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-[10px] text-blue-600 block font-bold uppercase">Goals</span>
                <span className="text-2xl font-black text-[#4169e1] mt-0.5 block">{player.seasonStats.goals}</span>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <span className="text-[10px] text-purple-600 block font-bold uppercase">Assists</span>
                <span className="text-2xl font-black text-purple-600 mt-0.5 block">{player.seasonStats.assists}</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-600 block font-bold uppercase">Pass Acc %</span>
                <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{player.seasonStats.passAccuracy}%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 pt-1">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Appearances</span>
                <span className="font-bold text-slate-800">{player.seasonStats.appearances}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Minutes Played</span>
                <span className="font-bold text-slate-800">{player.seasonStats.minutes}'</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Yellow Cards</span>
                <span className="font-bold text-amber-600">{player.seasonStats.yellowCards}</span>
              </div>
            </div>
          </div>

          {/* Recent Performances Timeline with ONEKICKX Rating */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Recent Performances</h3>
            <div className="space-y-2">
              {player.recentPerformances.map((perf, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{perf.match}</h4>
                    <span className="text-[11px] text-slate-400">{perf.date} · {perf.minutes} mins</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-[11px] text-slate-500">
                      <span>{perf.goals}G, {perf.assists}A</span>
                    </div>
                    <div className="bg-[#00c5d4] text-white px-2.5 py-1 rounded-md font-black text-xs shadow-2xs">
                      {perf.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
