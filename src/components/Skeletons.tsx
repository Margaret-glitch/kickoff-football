export const MatchScoreboardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 animate-pulse select-none">
    {/* Date pill skeleton */}
    <div className="flex justify-center mb-3">
      <div className="h-5 w-32 bg-slate-200 rounded-full" />
    </div>

    {/* Teams & Score Row skeleton */}
    <div className="flex items-center justify-between px-4 my-2">
      {/* Home */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-14 h-14 rounded-full bg-slate-200" />
        <div className="h-4 w-20 bg-slate-200 rounded" />
      </div>

      {/* Score */}
      <div className="flex flex-col items-center gap-2 px-6">
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
        <div className="h-3 w-16 bg-slate-200 rounded" />
      </div>

      {/* Away */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-14 h-14 rounded-full bg-slate-200" />
        <div className="h-4 w-20 bg-slate-200 rounded" />
      </div>
    </div>

    {/* Tabs skeleton */}
    <div className="flex justify-around mt-6 pt-3 border-t border-slate-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 w-16 bg-slate-200 rounded" />
      ))}
    </div>
  </div>
);

export const SoccerPitchSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse select-none">
    <div className="h-9 bg-slate-200 rounded-xl" />
    <div className="h-[560px] bg-slate-300 rounded-2xl relative overflow-hidden flex flex-col justify-between p-6">
      {/* Top row */}
      <div className="flex justify-center">
        <div className="w-9 h-9 rounded-full bg-slate-400" />
      </div>
      {/* Def row */}
      <div className="flex justify-around">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-full bg-slate-400" />
        ))}
      </div>
      {/* Mid row */}
      <div className="flex justify-around">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-full bg-slate-400" />
        ))}
      </div>
      {/* Att row */}
      <div className="flex justify-center gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-full bg-slate-400" />
        ))}
      </div>
      {/* Bottom rows */}
      <div className="flex justify-center gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-full bg-slate-400" />
        ))}
      </div>
      <div className="flex justify-around">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-full bg-slate-400" />
        ))}
      </div>
      <div className="flex justify-center">
        <div className="w-9 h-9 rounded-full bg-slate-400" />
      </div>
    </div>
    <div className="h-16 bg-slate-200 rounded-xl" />
  </div>
);

export const MatchOverviewSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse select-none">
    {/* Odds card skeleton */}
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-slate-200 rounded" />
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-10 bg-slate-200 rounded-xl" />
      </div>
    </div>

    {/* Momentum skeleton */}
    <div className="bg-white rounded-xl border border-slate-200 p-4 h-28" />

    {/* Player of the match skeleton */}
    <div className="bg-white rounded-xl border border-slate-200 p-4 h-48" />

    {/* Stats skeleton */}
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
      <div className="h-4 w-16 bg-slate-200 rounded mx-auto" />
      <div className="h-3 bg-slate-200 rounded-full" />
      <div className="h-3 bg-slate-200 rounded-full" />
      <div className="h-3 bg-slate-200 rounded-full" />
    </div>
  </div>
);

export const MatchesListSkeleton = () => (
  <div className="flex flex-col gap-2.5 animate-pulse select-none">
    {Array.from({ length: 3 }).map((_, lIdx) => (
      <div key={lIdx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-3 flex flex-col gap-2.5">
        <div className="h-5 bg-slate-200 rounded w-1/2" />
        <div className="divide-y divide-slate-100 flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, mIdx) => (
            <div key={mIdx} className="pt-2 flex items-center justify-between">
              <div className="h-4 w-10 bg-slate-200 rounded" />
              <div className="flex-1 px-4 flex flex-col gap-1.5">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-3.5 bg-slate-200 rounded w-2/3" />
              </div>
              <div className="h-4 w-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
