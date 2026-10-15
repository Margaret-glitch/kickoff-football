import { useState } from 'react';
import { Trophy, TrendingUp, Users, Target, BarChart2, Star, ChevronRight } from 'lucide-react';
import { LEAGUES_DATA } from '../data/extendedFootballData';

interface LeaguesHubViewProps {
  onOpenTeam?: (teamId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  onOpenMatch?: (matchId: string) => void;
}

export const LeaguesHubView = ({
  onOpenTeam,
  onOpenPlayer
}: LeaguesHubViewProps) => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('premier-league');
  const [activeSubTab, setActiveSubTab] = useState<'standings' | 'top-scorers' | 'stats' | 'teams'>('standings');

  const currentLeague = LEAGUES_DATA[selectedLeagueId] || LEAGUES_DATA['premier-league'];

  const leagueKeys = Object.keys(LEAGUES_DATA);

  return (
    <div className="space-y-5 pb-12 select-none">
      {/* 1. League Selector Horizontal Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {leagueKeys.map((key) => {
          const l = LEAGUES_DATA[key];
          const isSelected = selectedLeagueId === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedLeagueId(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#4169e1] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <img src={l.logo} alt={l.name} className="w-4 h-4 object-contain rounded-xs bg-white/20 p-0.5" />
              <span>{l.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* 2. League Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentLeague.logo}
            alt={currentLeague.name}
            className="w-14 h-14 object-contain bg-slate-50 p-2 rounded-xl border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{currentLeague.country}</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {currentLeague.season}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-0.5">{currentLeague.name}</h1>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveSubTab('standings')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'standings' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Standings
          </button>
          <button
            onClick={() => setActiveSubTab('top-scorers')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'top-scorers' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Top Scorers
          </button>
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'stats' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            League Stats
          </button>
          <button
            onClick={() => setActiveSubTab('teams')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'teams' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* 3. Standings Table View */}
      {activeSubTab === 'standings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-3 text-center">P</th>
                  <th className="py-3 px-3 text-center">W</th>
                  <th className="py-3 px-3 text-center">D</th>
                  <th className="py-3 px-3 text-center">L</th>
                  <th className="py-3 px-3 text-center">GF:GA</th>
                  <th className="py-3 px-3 text-center">GD</th>
                  <th className="py-3 px-3 text-center font-black text-slate-900">PTS</th>
                  <th className="py-3 px-4 text-center">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentLeague.standings.map((row) => (
                  <tr
                    key={row.teamId}
                    onClick={() => onOpenTeam?.(row.teamId)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-bold text-slate-500">
                      <span className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] ${
                        row.rank <= 4 ? 'bg-blue-100 text-[#4169e1] font-black' : 'text-slate-600'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5 font-bold text-slate-900">
                        <img src={row.logo} alt={row.team} className="w-5 h-5 object-contain" />
                        <span className="hover:text-[#4169e1]">{row.team}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">{row.played}</td>
                    <td className="py-3 px-3 text-center font-semibold text-emerald-600">{row.won}</td>
                    <td className="py-3 px-3 text-center text-slate-500">{row.drawn}</td>
                    <td className="py-3 px-3 text-center font-semibold text-rose-500">{row.lost}</td>
                    <td className="py-3 px-3 text-center text-slate-500">{row.gf}:{row.ga}</td>
                    <td className="py-3 px-3 text-center font-semibold">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                    <td className="py-3 px-3 text-center font-black text-sm text-slate-900">{row.points}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.map((res, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${
                              res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Top Scorers View */}
      {activeSubTab === 'top-scorers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#4169e1]" />
              <h3 className="text-sm font-bold text-slate-900">Golden Boot & Assist Race</h3>
            </div>
            <span className="text-xs text-slate-400">Regular Season 2026/27</span>
          </div>

          <div className="divide-y divide-slate-100">
            {currentLeague.topScorers.map((scorer) => (
              <div
                key={scorer.playerId}
                onClick={() => onOpenPlayer?.(scorer.playerId)}
                className="p-3.5 px-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-sm text-slate-400">
                    {scorer.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 hover:text-[#4169e1]">
                      {scorer.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <img src={scorer.teamLogo} alt={scorer.team} className="w-3.5 h-3.5 object-contain" />
                      <span>{scorer.team}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-right">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Matches</span>
                    <span className="font-semibold text-slate-700">{scorer.matches}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Assists</span>
                    <span className="font-semibold text-slate-700">{scorer.assists}</span>
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    <span className="text-[10px] text-blue-600 block font-semibold">Goals</span>
                    <span className="font-black text-base text-[#4169e1]">{scorer.goals}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. League Statistics View */}
      {activeSubTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block font-medium">Avg Goals / Match</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {currentLeague.stats.avgGoalsPerMatch}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">High scoring league</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block font-medium">Home Win Rate</span>
            <span className="text-2xl font-black text-[#4169e1] mt-1 block">
              {currentLeague.stats.homeWinPercentage}%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Strong home advantage</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block font-medium">Away Win Rate</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">
              {currentLeague.stats.awayWinPercentage}%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Tough travel conditions</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block font-medium">Both Teams To Score</span>
            <span className="text-2xl font-black text-purple-600 mt-1 block">
              {currentLeague.stats.bttsRate}%
            </span>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">High BTTS reliability</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block font-medium">Clean Sheet Rate</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {currentLeague.stats.cleanSheetsRate}%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Defensive solidity</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block font-medium">Draw Rate</span>
            <span className="text-2xl font-black text-amber-500 mt-1 block">
              {currentLeague.stats.drawPercentage}%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Balanced competitiveness</span>
          </div>
        </div>
      )}

      {/* 6. Teams Directory in League */}
      {activeSubTab === 'teams' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentLeague.standings.map((t) => (
            <div
              key={t.teamId}
              onClick={() => onOpenTeam?.(t.teamId)}
              className="bg-white rounded-xl border border-slate-200 hover:border-[#4169e1] p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <img src={t.logo} alt={t.team} className="w-10 h-10 object-contain p-1 rounded-lg bg-slate-50 border border-slate-100" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#4169e1] transition-colors">
                    {t.team}
                  </h4>
                  <span className="text-[11px] text-slate-400">Rank #{t.rank} · {t.points} pts</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#4169e1] transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
