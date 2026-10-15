import { useState } from 'react';
import { Bell, Flame, Activity, ShieldCheck, Star } from 'lucide-react';
import { Match } from '../types';

interface LiveFootballViewProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onQuickStake?: (selection: { matchTitle: string; market: string; odds: number }) => void;
  onToggleFavorite?: (matchId: string) => void;
  onOpenTeam?: (teamId: string) => void;
}

export const LiveFootballView = ({
  matches,
  onSelectMatch,
  onQuickStake,
  onToggleFavorite
}: LiveFootballViewProps) => {
  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const [matchAlertsEnabled, setMatchAlertsEnabled] = useState<Record<string, boolean>>({});

  const toggleAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMatchAlertsEnabled((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-4 pb-12 select-none">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Live Football Centre</span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {liveMatches.length} Matches In-Play
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Real-time match minute, goals, cards, possession, shots, and in-play odds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clock Synchronized</span>
          </span>
        </div>
      </div>

      {liveMatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Flame className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Matches Currently In-Play</h3>
          <p className="text-xs text-slate-400 mt-1">Check today's scheduled fixtures in the Matches tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {liveMatches.map((match) => {
            const hasAlert = matchAlertsEnabled[match.id];

            return (
              <div
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#4169e1] transition-all p-4 shadow-2xs hover:shadow-sm cursor-pointer space-y-3.5"
              >
                {/* Match header */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {match.day || 'Today'}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>{match.time}</span>
                    </span>
                    <span className="text-slate-400 font-medium">In-Play</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleAlert(match.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        hasAlert
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                      title={hasAlert ? 'Alerts active for goals & cards' : 'Enable live match alerts'}
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite?.(match.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        match.isFavorite
                          ? 'border-amber-300 bg-amber-50 text-amber-500'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                      title="Favorite match"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Scoreboard row */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  {/* Home Team */}
                  <div className="col-span-5 flex items-center gap-2.5">
                    <img src={match.homeFlag} alt={match.homeTeam} className="w-8 h-8 object-contain rounded-md shrink-0" />
                    <span className="font-bold text-sm text-slate-900 truncate">{match.homeTeam}</span>
                  </div>

                  {/* Live Score */}
                  <div className="col-span-2 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5 text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                      <span>{match.homeScore ?? 0}</span>
                      <span className="text-slate-400 font-light">-</span>
                      <span>{match.awayScore ?? 0}</span>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="col-span-5 flex items-center justify-end gap-2.5 text-right">
                    <span className="font-bold text-sm text-slate-900 truncate">{match.awayTeam}</span>
                    <img src={match.awayFlag} alt={match.awayTeam} className="w-8 h-8 object-contain rounded-md shrink-0" />
                  </div>
                </div>

                {/* Simulated In-Play Match Metrics (Possession, Shots, Corners) */}
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  {/* Possession Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                      <span>54% Possession</span>
                      <span>46%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden flex">
                      <div className="bg-[#4169e1] w-[54%]" />
                      <div className="bg-slate-300 w-[46%]" />
                    </div>
                  </div>

                  {/* Stats Pill Matrix */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] text-slate-600 pt-1">
                    <div className="bg-slate-50 p-1 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">Shots</span>
                      <span className="font-bold">8 - 5</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">On Target</span>
                      <span className="font-bold">4 - 2</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">Corners</span>
                      <span className="font-bold">5 - 3</span>
                    </div>
                    <div className="bg-slate-50 p-1 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">Fouls</span>
                      <span className="font-bold">7 - 9</span>
                    </div>
                  </div>
                </div>

                {/* Live Odds & Stake Shortcuts */}
                {match.odds && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                      <span>In-Play Markets</span>
                      <span className="text-emerald-600 font-semibold">Live Odds</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickStake?.({
                            matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
                            market: `${match.homeTeam} to Win`,
                            odds: match.odds!.home
                          });
                        }}
                        className="p-1.5 rounded-lg bg-blue-50/70 hover:bg-blue-100 text-blue-900 border border-blue-200 text-center transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] text-blue-600 font-medium block">1</span>
                        <span className="text-xs font-black">{match.odds.home.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickStake?.({
                            matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
                            market: 'Draw',
                            odds: match.odds!.draw
                          });
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-center transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] text-slate-500 font-medium block">X</span>
                        <span className="text-xs font-black">{match.odds.draw.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickStake?.({
                            matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
                            market: `${match.awayTeam} to Win`,
                            odds: match.odds!.away
                          });
                        }}
                        className="p-1.5 rounded-lg bg-blue-50/70 hover:bg-blue-100 text-blue-900 border border-blue-200 text-center transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] text-blue-600 font-medium block">2</span>
                        <span className="text-xs font-black">{match.odds.away.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
