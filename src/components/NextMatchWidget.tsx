import { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight, TrendingUp, Bell } from 'lucide-react';
import { Match, LeagueGroup } from '../types';
import { findNextUpcomingMatch, getTimeUntilKickoff, NextMatchInfo } from '../utils/matchUtils';

interface NextMatchWidgetProps {
  matches?: Match[];
  leagues?: LeagueGroup[];
  nextMatchOverride?: NextMatchInfo | null;
  onSelectMatch: (match: Match) => void;
  onSelectOdds?: (selection: { matchTitle: string; market: string; odds: number }) => void;
  variant?: 'banner' | 'card' | 'compact' | 'pill';
  className?: string;
}

export const NextMatchWidget = ({
  matches = [],
  leagues = [],
  nextMatchOverride,
  onSelectMatch,
  onSelectOdds,
  variant = 'banner',
  className = ''
}: NextMatchWidgetProps) => {
  const [nextInfo, setNextInfo] = useState<NextMatchInfo | null>(() => {
    return nextMatchOverride || findNextUpcomingMatch(matches, leagues);
  });
  const [reminderSet, setReminderSet] = useState(false);

  // Sync when override updates
  useEffect(() => {
    if (nextMatchOverride) {
      setNextInfo(nextMatchOverride);
    }
  }, [nextMatchOverride]);

  // Live countdown timer that updates every second safely without infinite loops
  useEffect(() => {
    const interval = setInterval(() => {
      setNextInfo((prev) => {
        if (!prev) return prev;
        const { formattedCountdown, hours, minutes, seconds } = getTimeUntilKickoff(
          prev.kickoffTime
        );
        return {
          ...prev,
          countdownText: formattedCountdown,
          hoursRemaining: hours,
          minutesRemaining: minutes,
          secondsRemaining: seconds,
          isStartingSoon: hours === 0 && minutes < 30
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!nextInfo) {
    return null;
  }

  const { match, leagueName, kickoffTime, day, countdownText, isStartingSoon } = nextInfo;
  const matchDay = day || match.day || 'Today';

  // PILL VARIANT (For Top Ticker / Header Bars with glassmorphic transparency)
  if (variant === 'pill') {
    return (
      <div
        onClick={() => onSelectMatch(match)}
        className={`flex items-center gap-2 px-3 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 rounded-lg cursor-pointer transition-all text-xs shrink-0 select-none ${className}`}
        title={`Next Match: ${match.homeTeam} vs ${match.awayTeam} • ${matchDay} at ${kickoffTime}`}
      >
        <span className="flex items-center gap-1 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
          <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>NEXT:</span>
        </span>
        <span className="font-bold text-white text-[11px] truncate max-w-[150px]">
          {match.homeTeam} vs {match.awayTeam}
        </span>
        <span className="bg-amber-400/90 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
          {kickoffTime}
        </span>
        <span className="text-[10px] text-blue-100 hidden sm:inline font-medium">
          {matchDay} ({countdownText})
        </span>
      </div>
    );
  }

  // COMPACT VARIANT (For Mobile or Sidebar with glassmorphic styling)
  if (variant === 'compact') {
    return (
      <div
        onClick={() => onSelectMatch(match)}
        className={`backdrop-blur-md bg-white/80 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-white/10 p-3.5 hover:border-[#4169e1] transition-all cursor-pointer select-none ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wide">
              <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Next Match</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
              {leagueName}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#4169e1] font-bold text-xs bg-blue-50/80 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-200/60">
            <span>{kickoffTime}</span>
            <span className="text-[10px] text-slate-500 font-medium">({matchDay})</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 my-1.5">
          {/* Home */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img
              src={match.homeFlag}
              alt={match.homeTeam}
              className="w-5 h-4 object-cover rounded-xs shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {match.homeTeam}
            </span>
          </div>

          <span className="text-[11px] font-bold text-slate-400 px-1">VS</span>

          {/* Away */}
          <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate text-right">
              {match.awayTeam}
            </span>
            <img
              src={match.awayFlag}
              alt={match.awayTeam}
              className="w-5 h-4 object-cover rounded-xs shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Starts in:</span>
            <strong className="text-slate-800 dark:text-slate-200 font-bold">{countdownText}</strong>
          </span>
          <span className="text-[#4169e1] font-bold flex items-center gap-0.5 hover:underline">
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  }

  // BANNER VARIANT (Transparent Glassmorphic Hero Banner - No dark theme, no box shadows)
  return (
    <div
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/40 text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/15 p-4 sm:p-4.5 transition-all select-none ${className}`}
    >
      {/* Top Header: Next Match & Competition + Date & Time with Live Countdown */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/25 border border-amber-400/40 text-amber-800 dark:text-amber-300 font-black text-[10px] uppercase tracking-wider">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>NEXT MATCH</span>
          </span>
          <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold">
            {leagueName}
          </span>
        </div>

        {/* Kickoff Day & Time with Live Countdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/15 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#4169e1]" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Kickoff:</span>
            <span className="font-extrabold text-[#4169e1] dark:text-blue-400 text-xs tracking-wide">
              {matchDay} • {kickoffTime}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${
              isStartingSoon
                ? 'bg-rose-50 border-rose-300/80 text-rose-700 dark:bg-rose-950/30 dark:border-rose-400/30 dark:text-rose-300'
                : 'bg-emerald-50 border-emerald-300/80 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-400/30 dark:text-emerald-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Starts in: {countdownText}</span>
          </div>
        </div>
      </div>

      {/* Main Teams Matchup Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-1">
        {/* Teams and Logos */}
        <div
          onClick={() => onSelectMatch(match)}
          className="sm:col-span-8 flex items-center justify-between sm:justify-start gap-4 sm:gap-6 cursor-pointer group"
        >
          {/* Home Team */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-initial">
            <img
              src={match.homeFlag}
              alt={match.homeTeam}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl bg-slate-100/80 dark:bg-white/10 p-1 border border-slate-200 dark:border-white/20 group-hover:scale-105 transition-transform shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#4169e1] transition-colors truncate">
                {match.homeTeam}
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Home</span>
            </div>
          </div>

          {/* VS Center with Kickoff Time & Day */}
          <div className="flex flex-col items-center justify-center px-2 shrink-0">
            <span className="text-xs sm:text-sm font-black text-slate-400 dark:text-slate-500 tracking-wider">
              VS
            </span>
            <span className="text-[10px] text-[#4169e1] dark:text-blue-400 font-bold mt-0.5">
              {kickoffTime}
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
              {matchDay}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-initial justify-end sm:justify-start">
            <div className="min-w-0 text-right sm:text-left">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#4169e1] transition-colors truncate">
                {match.awayTeam}
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Away</span>
            </div>
            <img
              src={match.awayFlag}
              alt={match.awayTeam}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl bg-slate-100/80 dark:bg-white/10 p-1 border border-slate-200 dark:border-white/20 group-hover:scale-105 transition-transform shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Action Buttons & Odds */}
        <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/80 dark:border-white/10">
          {/* Quick Odds */}
          {match.odds && (
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOdds?.({
                    matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
                    market: '1 (Home Win)',
                    odds: match.odds!.home
                  });
                }}
                className="px-2 py-1 rounded-lg bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 font-bold text-slate-800 dark:text-white transition-all cursor-pointer text-center"
                title={`Bet on ${match.homeTeam}`}
              >
                <span className="text-[9px] text-[#4169e1] dark:text-blue-400 block">1</span>
                <span>{match.odds.home.toFixed(2)}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOdds?.({
                    matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
                    market: 'X (Draw)',
                    odds: match.odds!.draw
                  });
                }}
                className="px-2 py-1 rounded-lg bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 font-bold text-slate-800 dark:text-white transition-all cursor-pointer text-center"
                title="Bet on Draw"
              >
                <span className="text-[9px] text-[#4169e1] dark:text-blue-400 block">X</span>
                <span>{match.odds.draw.toFixed(2)}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOdds?.({
                    matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
                    market: '2 (Away Win)',
                    odds: match.odds!.away
                  });
                }}
                className="px-2 py-1 rounded-lg bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 font-bold text-slate-800 dark:text-white transition-all cursor-pointer text-center"
                title={`Bet on ${match.awayTeam}`}
              >
                <span className="text-[9px] text-[#4169e1] dark:text-blue-400 block">2</span>
                <span>{match.odds.away.toFixed(2)}</span>
              </button>
            </div>
          )}

          {/* View Match Button */}
          <button
            onClick={() => onSelectMatch(match)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4169e1] hover:bg-blue-600 font-bold text-xs text-white transition-all cursor-pointer ml-auto sm:ml-0"
          >
            <span>Match Centre</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
