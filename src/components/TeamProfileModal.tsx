import { useState } from 'react';
import { X, Star, MapPin, User, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { TEAMS_DATA, TeamDetail } from '../data/extendedFootballData';

interface TeamProfileModalProps {
  teamId: string | null;
  onClose: () => void;
  onOpenPlayer?: (playerId: string) => void;
}

export const TeamProfileModal = ({
  teamId,
  onClose,
  onOpenPlayer
}: TeamProfileModalProps) => {
  const [isFollowed, setIsFollowed] = useState(true);

  if (!teamId) return null;

  const team: TeamDetail | undefined = TEAMS_DATA[teamId] || TEAMS_DATA['arsenal'];
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={team.logo}
                alt={team.name}
                className="w-16 h-16 object-contain bg-white/10 p-2 rounded-2xl border border-white/20"
              />
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                  {team.league} · #{team.leagueRank} in Table
                </span>
                <h2 className="text-2xl font-black mt-0.5">{team.name}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {team.stadium}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {team.manager}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isFollowed
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span>{isFollowed ? 'Following' : 'Follow Team'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Stats Row */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Points</span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">{team.points}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Win Rate</span>
              <span className="text-xl font-black text-emerald-600 mt-0.5 block">{team.stats.winRate}%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Goals +/-</span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">
                {team.stats.goalsScored}:{team.stats.goalsConceded}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Possession</span>
              <span className="text-xl font-black text-[#4169e1] mt-0.5 block">{team.stats.avgPossession}%</span>
            </div>
          </div>

          {/* Squad Roster List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Current Squad Roster</h3>
              <span className="text-xs text-slate-400">{team.squad.length} Players Listed</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {team.squad.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    onClose();
                    onOpenPlayer?.(player.id.replace('p-', ''));
                  }}
                  className="p-3 px-4 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-xs text-slate-400">
                      #{player.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 hover:text-[#4169e1]">
                        {player.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-600">{player.position}</span>
                        <span>·</span>
                        <span>{player.nationality}</span>
                        <span>·</span>
                        <span>Age {player.age}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {player.rating}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
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
