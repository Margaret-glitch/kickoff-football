import { DynamicMatchDetail } from '../data/matchDetailsGenerator';

interface PlayerOfTheMatchCardProps {
  playerData: DynamicMatchDetail['playerOfTheMatch'];
}

export const PlayerOfTheMatchCard = ({ playerData }: PlayerOfTheMatchCardProps) => {
  const getInitials = (name: string) => {
    const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name.slice(0, 2) || 'P').toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex flex-col gap-3 select-none">
      <h4 className="text-xs font-bold text-slate-900 text-center">
        Player of the match
      </h4>

      {/* Side-by-side Header Split (Flat background, no gradients) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
        {/* Left: Rating */}
        <div className="flex flex-col items-center text-center pr-2 border-r border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            ONEKICKX Rating
          </span>
          <div className="relative mb-1">
            <div className="w-12 h-12 rounded-full bg-[#4169e1] text-white flex items-center justify-center font-bold text-sm ring-2 ring-[#00c5d4] shadow-xs">
              {getInitials(playerData.name)}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-[#00c5d4] text-white p-0.5 rounded-full text-[9px] shadow-xs">
              ★
            </span>
          </div>
          <span className="text-xs font-bold text-slate-900 mt-1">{playerData.name}</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
            <img src={playerData.teamFlag} alt={playerData.team} className="w-3 h-2 object-cover rounded-2xs" />
            <span>{playerData.team}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#00c5d4] text-white font-bold text-xs shadow-xs">
            {playerData.rating.toFixed(1)}
          </span>
        </div>

        {/* Right: Fan Pick */}
        <div className="flex flex-col items-center text-center pl-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Fan Pick
          </span>
          <div className="relative mb-1">
            <div className="w-12 h-12 rounded-full bg-[#4169e1] text-white flex items-center justify-center font-bold text-sm ring-2 ring-blue-400 shadow-xs">
              {getInitials(playerData.name)}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full text-[9px] shadow-xs">
              ❤
            </span>
          </div>
          <span className="text-xs font-bold text-slate-900 mt-1">{playerData.name}</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
            <img src={playerData.teamFlag} alt={playerData.team} className="w-3 h-2 object-cover rounded-2xs" />
            <span>{playerData.team}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-900 font-bold text-xs">
              {playerData.fanPickPct}%
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">{playerData.fanVotes}</span>
          </div>
        </div>
      </div>

      {/* Top 3 Rankings Rows below */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        {/* Ratings Column */}
        <div className="flex flex-col gap-1.5">
          {playerData.topRatings.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-1.5 truncate">
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#00c5d4] text-white">
                  {p.rating.toFixed(1)}
                </span>
                <img src={p.teamFlag} alt="flag" className="w-3.5 h-2.5 object-cover rounded-2xs" />
                <span className="text-[11px] font-semibold text-slate-800 truncate">{p.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fan Pick Column */}
        <div className="flex flex-col gap-1.5">
          {playerData.topFans.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-1.5 truncate">
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                  {p.pct}%
                </span>
                <img src={p.teamFlag} alt="flag" className="w-3.5 h-2.5 object-cover rounded-2xs" />
                <span className="text-[11px] font-semibold text-slate-800 truncate">{p.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
