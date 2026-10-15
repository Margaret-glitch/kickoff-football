import { useState } from 'react';
import { Tv, Globe, ExternalLink, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';
import { BROADCAST_GUIDE } from '../data/extendedFootballData';

export const WhereToWatchView = () => {
  const [selectedCountry, setSelectedCountry] = useState<'US' | 'GB' | 'NG' | 'CA' | 'ES' | 'GLOBAL'>('US');

  const countryOptions = [
    { code: 'US', label: 'United States', flag: '🇺🇸' },
    { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
    { code: 'NG', label: 'Nigeria & Sub-Saharan Africa', flag: '🇳🇬' },
    { code: 'CA', label: 'Canada', flag: '🇨🇦' },
    { code: 'ES', label: 'Spain & Europe', flag: '🇪🇸' },
    { code: 'GLOBAL', label: 'Worldwide & Free Streams', flag: '🌍' }
  ];

  return (
    <div className="space-y-5 pb-12 select-none">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4169e1]">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Official Where to Watch Guide</h1>
            <p className="text-xs text-slate-500">
              Authorized broadcast channels, legal streaming services, and local kickoff times
            </p>
          </div>
        </div>

        <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Authorized Rights & Official Sources</span>
        </span>
      </div>

      {/* Country Selector Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {countryOptions.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setSelectedCountry(opt.code as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCountry === opt.code
                ? 'bg-[#4169e1] text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{opt.flag}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Broadcast Matches Listing */}
      <div className="space-y-4">
        {BROADCAST_GUIDE.map((match) => {
          // Find country broadcast or fallback to global/first
          const broadcastInfo = match.countries.find((c) => c.countryCode === selectedCountry) || match.countries[0];

          return (
            <div
              key={match.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-[#4169e1] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Match Details */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {match.league} · {match.kickoffTime}
                </span>
                <h3 className="text-base font-black text-slate-900">{match.matchTitle}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <span>Region: {broadcastInfo.countryName}</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700">{broadcastInfo.platformType}</span>
                </div>
              </div>

              {/* Broadcaster & Direct Official Link */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{broadcastInfo.broadcaster}</span>
                    {broadcastInfo.isFree ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        FREE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Sub Required
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Verified Rights Holder
                  </span>
                </div>

                <a
                  href={broadcastInfo.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#4169e1] hover:bg-[#3557c7] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <span>Watch Stream</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
