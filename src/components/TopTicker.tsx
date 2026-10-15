import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Clock } from 'lucide-react';
import { Match } from '../types';
import { getDateDisplayLabel } from '../services/sofascoreApi';
import { findNextUpcomingMatch } from '../utils/matchUtils';
import { NextMatchWidget } from './NextMatchWidget';

interface TopTickerProps {
  dateOffset: number;
  onDateChange: (newOffset: number) => void;
  onSelectMatch: (match: Match) => void;
  liveMatches?: Match[];
}

export const TopTicker = ({
  dateOffset,
  onDateChange,
  onSelectMatch,
  liveMatches = []
}: TopTickerProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const nextMatchInfo = findNextUpcomingMatch(liveMatches);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="bg-[#2e50c4] text-white select-none border-b border-blue-400/20">
      <div className="max-w-[1540px] mx-auto px-4 h-11 flex items-center justify-between gap-3">
        {/* Date Selector */}
        <div className="flex items-center bg-[#2541a3] rounded-lg p-0.5 border border-blue-400/30 text-xs shrink-0">
          <button
            onClick={() => onDateChange(dateOffset - 1)}
            className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-bold text-xs px-2.5 min-w-[70px] text-center text-white">
            {getDateDisplayLabel(dateOffset)}
          </span>
          <button
            onClick={() => onDateChange(dateOffset + 1)}
            className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured NEXT MATCH Ticker Pill */}
        {nextMatchInfo && (
          <NextMatchWidget
            nextMatchOverride={nextMatchInfo}
            onSelectMatch={onSelectMatch}
            variant="pill"
          />
        )}

        {/* Live Match Cards Carousel */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {liveMatches.slice(0, 10).map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMatch(m)}
              className="flex items-center gap-2 px-3 py-1 bg-[#2541a3] hover:bg-[#1d3382] border border-blue-400/25 rounded-lg cursor-pointer transition-all shrink-0 text-xs group"
            >
              <div className="flex flex-col items-center justify-center min-w-[34px] text-[10px] leading-tight">
                <span className="text-white font-bold leading-none">{m.time}</span>
                <span className="text-white/60 text-[8px] font-medium leading-none mt-0.5">{m.day || 'Today'}</span>
                <span
                  className={`font-black uppercase text-[8.5px] mt-0.5 ${
                    m.status === 'LIVE'
                      ? 'text-rose-400 animate-pulse'
                      : m.status === 'FT'
                      ? 'text-slate-300'
                      : 'text-blue-200'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <div className="w-[1px] h-6 bg-blue-400/30" />

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <img src={m.homeFlag} alt={m.homeTeam} className="w-3.5 h-2.5 object-cover rounded-2xs" />
                  <span className="font-medium text-white/95 max-w-[90px] truncate text-[11px]">
                    {m.homeTeam}
                  </span>
                  <span className="font-black text-white ml-auto text-[11px] pl-1">
                    {m.homeScore ?? 0}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <img src={m.awayFlag} alt={m.awayTeam} className="w-3.5 h-2.5 object-cover rounded-2xs" />
                  <span className="font-medium text-white/95 max-w-[90px] truncate text-[11px]">
                    {m.awayTeam}
                  </span>
                  <span className="font-black text-white ml-auto text-[11px] pl-1">
                    {m.awayScore ?? 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Refresh Button */}
        <button
          onClick={handleRefresh}
          className="p-1.5 bg-[#2541a3] hover:bg-[#1d3382] border border-blue-400/30 text-white rounded-lg transition-all cursor-pointer shrink-0"
          title="Refresh Live Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
