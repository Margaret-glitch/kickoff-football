import { useState } from 'react';
import { TrendingDown, ArrowDownRight, Zap } from 'lucide-react';
import { Match } from '../types';

interface DroppingOddsViewProps {
  onSelectOdds?: (selection: { matchTitle: string; market: string; odds: number }) => void;
  onNavigateMatch?: (match: Match) => void;
}

interface DroppingOddItem {
  id: string;
  tournament: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  market: string;
  selection: string;
  initialOdds: number;
  currentOdds: number;
  dropPercent: number;
  time: string;
  bookmaker: string;
}

export const DroppingOddsView = ({
  onSelectOdds,
  onNavigateMatch
}: DroppingOddsViewProps) => {
  const [minDropFilter, setMinDropFilter] = useState<number>(10);
  const [selectedMarketType, setSelectedMarketType] = useState<string>('all');

  const droppingOddsList: DroppingOddItem[] = [
    {
      id: 'do-1',
      tournament: 'UEFA Nations League',
      homeTeam: 'Germany',
      homeFlag: 'https://flagcdn.com/w40/de.png',
      awayTeam: 'Serbia',
      awayFlag: 'https://flagcdn.com/w40/rs.png',
      market: 'Full-time (1X2)',
      selection: 'Germany to Win',
      initialOdds: 1.48,
      currentOdds: 1.18,
      dropPercent: 20.3,
      time: '11:45',
      bookmaker: 'BetWinner'
    },
    {
      id: 'do-2',
      tournament: 'UEFA Nations League',
      homeTeam: 'Denmark',
      homeFlag: 'https://flagcdn.com/w40/dk.png',
      awayTeam: 'Portugal',
      awayFlag: 'https://flagcdn.com/w40/pt.png',
      market: 'Full-time (1X2)',
      selection: 'Portugal to Win',
      initialOdds: 2.85,
      currentOdds: 2.15,
      dropPercent: 24.5,
      time: '11:45',
      bookmaker: 'BetWinner'
    },
    {
      id: 'do-3',
      tournament: 'Brasileirão Série B',
      homeTeam: 'Athletic Club',
      homeFlag: 'https://flagcdn.com/w40/br.png',
      awayTeam: 'Sport Recife',
      awayFlag: 'https://flagcdn.com/w40/br.png',
      market: 'Over/Under 2.5',
      selection: 'Over 2.5 Goals',
      initialOdds: 2.10,
      currentOdds: 1.62,
      dropPercent: 22.8,
      time: 'LIVE 54\'',
      bookmaker: '1xBet'
    },
    {
      id: 'do-4',
      tournament: 'EuroMatch NPFL',
      homeTeam: 'Enyimba',
      homeFlag: 'https://flagcdn.com/w40/ng.png',
      awayTeam: 'Remo Stars',
      awayFlag: 'https://flagcdn.com/w40/ng.png',
      market: 'Full-time (1X2)',
      selection: 'Enyimba to Win',
      initialOdds: 2.30,
      currentOdds: 1.70,
      dropPercent: 26.1,
      time: '16:00',
      bookmaker: 'BetWinner'
    },
    {
      id: 'do-5',
      tournament: 'CONCACAF Nations League',
      homeTeam: 'Dominican Republic',
      homeFlag: 'https://flagcdn.com/w40/do.png',
      awayTeam: 'Haiti',
      awayFlag: 'https://flagcdn.com/w40/ht.png',
      market: 'Both Teams to Score',
      selection: 'Yes (BTTS)',
      initialOdds: 1.95,
      currentOdds: 1.55,
      dropPercent: 20.5,
      time: 'LIVE 38\'',
      bookmaker: 'Bet365'
    },
    {
      id: 'do-6',
      tournament: 'UEFA Nations League',
      homeTeam: 'Greece',
      homeFlag: 'https://flagcdn.com/w40/gr.png',
      awayTeam: 'Netherlands',
      awayFlag: 'https://flagcdn.com/w40/nl.png',
      market: 'Full-time (1X2)',
      selection: 'Netherlands to Win',
      initialOdds: 2.20,
      currentOdds: 1.82,
      dropPercent: 17.2,
      time: '11:45',
      bookmaker: 'BetWinner'
    }
  ];

  const filtered = droppingOddsList.filter((item) => {
    if (item.dropPercent < minDropFilter) return false;
    if (selectedMarketType !== 'all' && !item.market.toLowerCase().includes(selectedMarketType)) return false;
    return true;
  });

  const handleSelectOdd = (item: DroppingOddItem) => {
    onSelectOdds?.({
      matchTitle: `${item.homeTeam} vs ${item.awayTeam}`,
      market: `${item.market}: ${item.selection}`,
      odds: item.currentOdds
    });
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Header Banner (Flat royalblue, no gradients) */}
      <div className="bg-[#4169e1] text-white p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            <div>
              <h2 className="text-base font-bold tracking-tight">Live Dropping Odds</h2>
              <p className="text-xs text-blue-100">
                Real-time market drops detected across top football matches
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white/20 rounded-full text-xs font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            Live Tracker
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-500 mr-1">Minimum drop:</span>
          {[10, 15, 20, 25].map((pct) => (
            <button
              key={pct}
              onClick={() => setMinDropFilter(pct)}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                minDropFilter === pct
                  ? 'bg-[#4169e1] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              &gt; {pct}%
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedMarketType('all')}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              selectedMarketType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Markets
          </button>
          <button
            onClick={() => setSelectedMarketType('1x2')}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              selectedMarketType === '1x2'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1X2
          </button>
          <button
            onClick={() => setSelectedMarketType('over')}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              selectedMarketType === 'over'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Totals
          </button>
        </div>
      </div>

      {/* Dropping Odds List */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:border-[#4169e1] transition-all flex flex-col gap-2.5"
          >
            {/* Top match header */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-600">{item.tournament}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">Today • {item.time}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {item.bookmaker}
                </span>
              </div>
            </div>

            {/* Teams row & Selection */}
            <div className="flex items-center justify-between">
              <div
                onClick={() =>
                  onNavigateMatch?.({
                    id: item.id.replace('do-', ''),
                    homeTeam: item.homeTeam,
                    homeFlag: item.homeFlag,
                    awayTeam: item.awayTeam,
                    awayFlag: item.awayFlag,
                    time: item.time,
                    status: 'FT'
                  })
                }
                className="flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity flex-1"
              >
                <div className="flex items-center gap-2">
                  <img src={item.homeFlag} alt={item.homeTeam} className="w-4 h-3 object-cover rounded-xs" />
                  <span className="font-bold text-slate-900 text-xs">{item.homeTeam}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={item.awayFlag} alt={item.awayTeam} className="w-4 h-3 object-cover rounded-xs" />
                  <span className="font-bold text-slate-900 text-xs">{item.awayTeam}</span>
                </div>
              </div>

              {/* Odds drop metric & Bet Button */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="line-through text-slate-400 font-semibold">{item.initialOdds.toFixed(2)}</span>
                    <span className="font-black text-rose-600 text-sm flex items-center">
                      <ArrowDownRight className="w-4 h-4" />
                      {item.currentOdds.toFixed(2)}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                    -{item.dropPercent.toFixed(1)}% Drop
                  </span>
                </div>

                <button
                  onClick={() => handleSelectOdd(item)}
                  className="px-3 py-2 bg-[#4169e1] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1"
                >
                  <span>Stake</span>
                  <span className="font-black">{item.currentOdds.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
