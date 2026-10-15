import { DynamicMatchDetail } from '../data/matchDetailsGenerator';

interface MatchMomentumChartProps {
  momentum: DynamicMatchDetail['momentum'];
  homeFlag: string;
  awayFlag: string;
  homeTeam: string;
  awayTeam: string;
}

export const MatchMomentumChart = ({
  momentum,
  homeFlag,
  awayFlag,
  homeTeam,
  awayTeam
}: MatchMomentumChartProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex flex-col gap-2.5 select-none">
      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
        <span>Match Momentum</span>
        <span className="text-[10px] text-slate-400 font-mono">&lt;/&gt;</span>
      </div>

      <div className="flex items-stretch gap-2.5 h-24">
        {/* Left Team Badges */}
        <div className="flex flex-col justify-between items-center py-1">
          <img
            src={homeFlag}
            alt={homeTeam}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
          />
          <img
            src={awayFlag}
            alt={awayTeam}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
          />
        </div>

        {/* Momentum Chart Area */}
        <div className="flex-1 relative bg-gradient-to-b from-emerald-50/50 via-slate-50 to-blue-50/50 rounded-lg border border-slate-200/70 p-1 flex items-center overflow-hidden">
          {/* Center Zero Line */}
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-300 pointer-events-none" />
          {/* Half-time Divider Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-400/60 pointer-events-none" />

          {/* Minute Bars */}
          <div className="w-full h-full flex items-center justify-between gap-[1px]">
            {momentum.map((m) => {
              const isHome = m.value >= 0;
              const heightPct = Math.min(100, Math.abs(m.value) * 1.2);

              return (
                <div
                  key={m.minute}
                  className="flex-1 h-full flex flex-col justify-center items-center relative group"
                >
                  {/* Goal Marker Pin */}
                  {m.isGoal && (
                    <div className="absolute -top-1 z-10 animate-bounce">
                      <span className="text-xs filter drop-shadow">⚽</span>
                    </div>
                  )}

                  {/* Positive (Home - Green) or Negative (Away - Blue) Bar */}
                  <div className="w-full h-1/2 flex items-end justify-center">
                    {isHome && (
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[3px] bg-emerald-500 rounded-t-xs transition-all"
                      />
                    )}
                  </div>
                  <div className="w-full h-1/2 flex items-start justify-center">
                    {!isHome && (
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[3px] bg-blue-600 rounded-b-xs transition-all"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
