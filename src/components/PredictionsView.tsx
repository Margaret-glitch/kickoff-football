import { Sparkles, Info, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { MATCH_PREDICTIONS } from '../data/extendedFootballData';

interface PredictionsViewProps {
  onOpenMatch?: (matchId: string) => void;
}

export const PredictionsView = ({ onOpenMatch }: PredictionsViewProps) => {
  return (
    <div className="space-y-5 pb-12 select-none">
      {/* Header Banner with Disclaimer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">Statistical Football Predictions</h1>
              <p className="text-xs text-slate-500">
                Mathematical win probabilities, predicted scorelines, Over/Under & BTTS models
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
            Powered by Quant xG & Historical Form Models
          </span>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Analytical Disclaimer:</strong> All predictions, percentages, and projected scorelines are calculated via statistical historical datasets, expected goals (xG), and form trends. They represent mathematical probabilities, <strong>not guaranteed outcomes</strong>. Please use responsibly.
          </p>
        </div>
      </div>

      {/* Predictions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MATCH_PREDICTIONS.map((pred) => (
          <div
            key={pred.matchId}
            onClick={() => onOpenMatch?.(pred.matchId)}
            className="bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-5 shadow-2xs transition-all cursor-pointer space-y-4"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {pred.league}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-0.5">{pred.matchTitle}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Model Projection</span>
                <span className="text-sm font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100 inline-block mt-0.5">
                  {pred.predictedScore}
                </span>
              </div>
            </div>

            {/* Win Probability Segment Bar */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                Win Probabilities
              </span>
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="text-[#4169e1]">Home: {pred.homeProb}%</span>
                <span className="text-amber-600">Draw: {pred.drawProb}%</span>
                <span className="text-rose-600">Away: {pred.awayProb}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                <div style={{ width: `${pred.homeProb}%` }} className="bg-[#4169e1]" />
                <div style={{ width: `${pred.drawProb}%` }} className="bg-amber-400" />
                <div style={{ width: `${pred.awayProb}%` }} className="bg-rose-500" />
              </div>
            </div>

            {/* Secondary Statistical Projections: Over/Under & BTTS */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Over / Under 2.5 Goals
                </span>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-700">Over: {pred.over25Prob}%</span>
                  <span className="text-slate-500">Under: {pred.under25Prob}%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Both Teams To Score (BTTS)
                </span>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-purple-700">Yes: {pred.bttsYesProb}%</span>
                  <span className="text-slate-500">No: {pred.bttsNoProb}%</span>
                </div>
              </div>
            </div>

            {/* Key Data Insights Bullet Points */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Algorithmic Key Signals
              </span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {pred.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#4169e1] font-bold">·</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
