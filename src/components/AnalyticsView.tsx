import { useState } from 'react';
import { BarChart2, TrendingUp, Activity, PieChart, ShieldAlert, Target } from 'lucide-react';
import { LEAGUES_DATA } from '../data/extendedFootballData';

export const AnalyticsView = () => {
  const [selectedLeague, setSelectedLeague] = useState<string>('premier-league');

  const league = LEAGUES_DATA[selectedLeague] || LEAGUES_DATA['premier-league'];

  // Simulated 15-minute goal interval distribution
  const goalIntervals = [
    { interval: "0' - 15'", percentage: 12, label: 'Early Kickoff' },
    { interval: "16' - 30'", percentage: 16, label: 'Mid-First Half' },
    { interval: "31' - 45+'", percentage: 22, label: 'Late First Half' },
    { interval: "46' - 60'", percentage: 14, label: 'Early Second Half' },
    { interval: "61' - 75'", percentage: 17, label: 'Mid-Second Half' },
    { interval: "76' - 90+'", percentage: 29, label: 'Clutch / Late Goals' }
  ];

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">ONEKICKX Football Analytics</h1>
            <p className="text-xs text-slate-500">
              Deep statistical models: goal interval timing, home/away splits, and performance trajectories
            </p>
          </div>
        </div>

        {/* League Selector */}
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4169e1]"
        >
          <option value="premier-league">Premier League</option>
          <option value="la-liga">LaLiga</option>
          <option value="champions-league">UEFA Champions League</option>
          <option value="mls">Major League Soccer</option>
          <option value="african-competitions">CAF Champions League & NPFL</option>
        </select>
      </div>

      {/* 1. Macro League Benchmark KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
            Expected Goals (xG) / Match
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {league.stats.avgGoalsPerMatch}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            +0.18 vs continental median
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
            Both Teams To Score (BTTS)
          </span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">
            {league.stats.bttsRate}%
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
            54 out of 100 matches
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
            Clean Sheet Rate
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {league.stats.cleanSheetsRate}%
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
            Top tier defensive security
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
            Home Dominance Index
          </span>
          <span className="text-2xl font-black text-[#4169e1] mt-1 block">
            {league.stats.homeWinPercentage}%
          </span>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
            Higher than away (29%)
          </span>
        </div>
      </div>

      {/* 2. Goal Scoring Distribution by 15-Min Intervals */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Goal Interval Distribution (When Goals Happen)</h3>
            <p className="text-xs text-slate-400">Aggregated match timing over regular 90 minutes</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            Season 2026/27
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {goalIntervals.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="w-24 text-slate-900 font-bold">{item.interval}</span>
                <span className="text-slate-400 text-[11px]">{item.label}</span>
                <span className="w-12 text-right font-black text-indigo-600">{item.percentage}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  style={{ width: `${item.percentage * 2.8}%` }}
                  className={`rounded-full transition-all duration-500 ${
                    item.percentage > 25
                      ? 'bg-rose-500'
                      : item.percentage > 18
                      ? 'bg-indigo-600'
                      : 'bg-[#4169e1]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 italic pt-1">
          * Noticeable surge in the final 15 minutes (76'-90+') due to tactical risk-taking, fatigue, and injury-time extra pressure.
        </p>
      </div>

      {/* 3. Team Form Matrix Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Team Form & Points Trajectory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3 text-center">Last 5 Matches</th>
                <th className="py-2.5 px-3 text-center">Home Points / Game</th>
                <th className="py-2.5 px-3 text-center">Away Points / Game</th>
                <th className="py-2.5 px-3 text-center">Momentum Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {league.standings.slice(0, 5).map((team) => (
                <tr key={team.teamId} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <img src={team.logo} alt={team.team} className="w-4 h-4 object-contain" />
                    <span>{team.team}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {team.form.map((res, i) => (
                        <span
                          key={i}
                          className={`w-3.5 h-3.5 rounded text-[8px] font-bold text-white flex items-center justify-center ${
                            res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {(2.2 + (team.rank % 3) * 0.2).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {(1.6 + (team.rank % 2) * 0.3).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Surging Form
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
