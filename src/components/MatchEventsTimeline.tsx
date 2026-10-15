import { DynamicMatchDetail } from '../data/matchDetailsGenerator';

interface MatchEventsTimelineProps {
  events: DynamicMatchDetail['events'];
  score: string;
}

export const MatchEventsTimeline = ({ events, score }: MatchEventsTimelineProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex flex-col gap-2.5 select-none text-xs">
      <div className="text-center pb-2 border-b border-slate-100">
        <span className="font-extrabold text-slate-800 text-xs tracking-wider">
          FT {score}
        </span>
        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
          Additional time 2&apos;
        </div>
      </div>

      <div className="flex flex-col divide-y divide-slate-100/90">
        {events.map((ev, idx) => {
          if (ev.type === 'halftime') {
            return (
              <div key={idx} className="py-2 text-center text-[11px] font-bold text-slate-500 bg-slate-50/60 rounded my-1">
                {ev.text}
              </div>
            );
          }

          if (ev.type === 'goal') {
            return (
              <div
                key={idx}
                className="py-2.5 flex items-center justify-between bg-emerald-50/30 px-2 rounded-lg my-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs min-w-[24px]">
                    {ev.minute}&apos;
                  </span>
                  <span className="text-sm">⚽</span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-black flex items-center gap-1">
                    ▶ {ev.score}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {ev.text.replace('Goal: ', '')}
                    </span>
                    {ev.detail && (
                      <span className="text-[10px] text-slate-500 block">
                        {ev.detail}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          if (ev.type === 'card') {
            return (
              <div key={idx} className="py-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 text-xs min-w-[24px]">
                    {ev.minute}&apos;
                  </span>
                  <span className="text-xs">🟨</span>
                  <span className="text-slate-800 text-xs">{ev.text}</span>
                </div>
              </div>
            );
          }

          if (ev.type === 'substitution') {
            return (
              <div key={idx} className="py-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 text-xs min-w-[24px]">
                    {ev.minute}&apos;
                  </span>
                  <span className="text-emerald-500 font-bold text-xs">⇄</span>
                  <span className="text-slate-700 text-xs">{ev.text}</span>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
