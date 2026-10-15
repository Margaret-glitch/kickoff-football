import { useState, useMemo } from 'react';
import { Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowLeft, Clock } from 'lucide-react';
import { LeagueGroup, Match } from '../types';
import { TOP_COMPETITIONS, COUNTRY_LEAGUES } from '../data/sportsData';
import { getDateDisplayLabel, fetchUniqueTournamentsForCategory } from '../services/sofascoreApi';
import { findNextUpcomingMatch } from '../utils/matchUtils';
import { NextMatchWidget } from './NextMatchWidget';

interface LeftMatchesListProps {
  leagues: LeagueGroup[];
  selectedMatchId: string;
  onSelectMatch: (match: Match) => void;
  onToggleFavorite: (matchId: string) => void;
  searchFilter?: string;
  onQuickStake?: (selection: { matchTitle: string; market: string; odds: number }) => void;
  dateOffset?: number;
  onDateChange?: (newOffset: number) => void;
}

export const LeftMatchesList = ({
  leagues,
  selectedMatchId,
  onSelectMatch,
  onToggleFavorite,
  searchFilter = '',
  onQuickStake,
  dateOffset = 0,
  onDateChange
}: LeftMatchesListProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'favourites' | 'competitions'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'finished' | 'upcoming'>('all');
  const [showOdds, setShowOdds] = useState(false);
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});
  
  // Competitions tab states
  const [selectedCompetitionFilter, setSelectedCompetitionFilter] = useState<string | null>(null);
  const [favoriteCompetitions, setFavoriteCompetitions] = useState<Record<string, boolean>>({});
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [liveCountryTournaments, setLiveCountryTournaments] = useState<Record<string, Array<{ id: number; name: string }>>>({});

  const countryIdMap: Record<string, number> = {
    ng: 1132,
    world: 1466,
    'gb-eng': 1,
    es: 32,
    de: 30,
    it: 31,
    fr: 7,
    br: 13,
    eu: 1465
  };

  const toggleLeague = (leagueId: string) => {
    setExpandedLeagues((prev) => ({
      ...prev,
      [leagueId]: prev[leagueId] !== undefined ? !prev[leagueId] : false
    }));
  };

  const toggleCountry = async (countryCode: string) => {
    const isCurrentlyExpanded = expandedCountries[countryCode];
    setExpandedCountries((prev) => ({
      ...prev,
      [countryCode]: !prev[countryCode]
    }));

    if (!isCurrentlyExpanded && !liveCountryTournaments[countryCode]) {
      const catId = countryIdMap[countryCode];
      if (catId) {
        const tours = await fetchUniqueTournamentsForCategory(catId);
        if (tours && tours.length > 0) {
          setLiveCountryTournaments((prev) => ({
            ...prev,
            [countryCode]: tours.map((t) => ({ id: t.id, name: t.name }))
          }));
        }
      }
    }
  };

  const toggleFavoriteComp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteCompetitions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalMatchesCount = leagues.reduce(
    (acc, league) =>
      acc + league.subGroups.reduce((subAcc, sub) => subAcc + sub.matches.length, 0),
    0
  );

  const liveMatchesCount = leagues.reduce(
    (acc, league) =>
      acc +
      league.subGroups.reduce(
        (subAcc, sub) => subAcc + sub.matches.filter((m) => m.status === 'LIVE').length,
        0
      ),
    0
  );

  const allMatchesList = useMemo(
    () => leagues.flatMap((l) => l.subGroups.flatMap((s) => s.matches)),
    [leagues]
  );

  const nextMatchInfo = useMemo(
    () => findNextUpcomingMatch(allMatchesList, leagues),
    [allMatchesList, leagues]
  );

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col select-none">
      {/* 1. Header Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 px-3 pt-2 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 capitalize transition-colors relative cursor-pointer ${
              activeTab === 'all'
                ? 'text-[#4169e1] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4169e1]'
                : 'hover:text-slate-800'
            }`}
          >
            All matches
          </button>

          <button
            onClick={() => setActiveTab('favourites')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 transition-colors relative cursor-pointer ${
              activeTab === 'favourites'
                ? 'text-[#4169e1] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4169e1]'
                : 'hover:text-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Favourites</span>
          </button>

          <button
            onClick={() => setActiveTab('competitions')}
            className={`pb-2.5 px-3 capitalize transition-colors relative cursor-pointer ${
              activeTab === 'competitions'
                ? 'text-[#4169e1] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4169e1]'
                : 'hover:text-slate-800'
            }`}
          >
            Competitions
          </button>
        </div>

        {/* Odds Toggle */}
        <div className="flex items-center gap-2 pb-2">
          <span className="text-[11px] font-semibold text-slate-500">Odds</span>
          <button
            onClick={() => setShowOdds(!showOdds)}
            className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
              showOdds ? 'bg-[#4169e1]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white shadow-xs transform transition-transform ${
                showOdds ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Sub-Bar: Live Filter & Date Navigation */}
      {activeTab !== 'competitions' && (
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50/60">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#4169e1] text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'live' ? 'all' : 'live')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                statusFilter === 'live'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-white text-rose-600 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Live ({liveMatchesCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'finished' ? 'all' : 'finished')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'finished'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Finished
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'upcoming'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Upcoming
            </button>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-1 text-slate-600 font-semibold text-xs">
            <button
              onClick={() => onDateChange?.(dateOffset - 1)}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-[#4169e1] text-[11px] min-w-[50px] text-center">
              {getDateDisplayLabel(dateOffset)}
            </span>
            <button
              onClick={() => onDateChange?.(dateOffset + 1)}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. TAB: COMPETITIONS */}
      {activeTab === 'competitions' && (
        <div className="p-3 flex flex-col gap-4">
          {/* Top competitions */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-2.5 px-0.5">
              Top competitions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TOP_COMPETITIONS.map((comp) => {
                const isFav = favoriteCompetitions[comp.id] ?? comp.isFavorite;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompetitionFilter(comp.name)}
                    className="relative flex flex-col items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#4169e1] transition-all cursor-pointer min-h-[104px] group"
                  >
                    <button
                      onClick={(e) => toggleFavoriteComp(comp.id, e)}
                      className="absolute top-2 right-2 p-0.5 text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                      title="Add to favourites"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'text-amber-400 fill-amber-400' : 'text-slate-300 group-hover:text-slate-400'
                        }`}
                      />
                    </button>

                    <div className="w-11 h-11 flex items-center justify-center my-auto">
                      <img
                        src={comp.badgeUrl}
                        alt={comp.name}
                        className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <span className="text-[11px] font-bold text-slate-800 text-center leading-tight line-clamp-2 min-h-[26px] flex items-center justify-center mt-1">
                      {comp.displayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leagues Accordion List */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-2 px-0.5">
              Leagues
            </h3>

            <div className="divide-y divide-slate-100">
              {COUNTRY_LEAGUES.map((country) => {
                const isExpanded = expandedCountries[country.countryCode] ?? false;
                return (
                  <div key={country.countryCode} className="py-0.5">
                    <div
                      onClick={() => toggleCountry(country.countryCode)}
                      className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={country.flagUrl}
                          alt={country.countryName}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          className="w-5 h-4 object-cover rounded-xs shadow-2xs"
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {country.countryName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-slate-400">
                          {country.matchCount}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pl-8 pr-2 pb-1.5 pt-0.5 flex flex-col gap-1">
                        {(liveCountryTournaments[country.countryCode] || country.leagues).map((subL) => (
                          <div
                            key={subL.id}
                            onClick={() => setSelectedCompetitionFilter(subL.name)}
                            className="flex items-center justify-between py-1.5 px-2 hover:bg-blue-50 rounded-md text-xs text-slate-700 hover:text-[#4169e1] cursor-pointer transition-colors"
                          >
                            <span className="font-medium text-[11px] truncate">{subL.name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full shrink-0 ml-1">
                              {'matchCount' in subL ? String((subL as { matchCount?: number }).matchCount) : 'Live'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Banner */}
      {selectedCompetitionFilter && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-blue-50 border-b border-blue-200 text-xs">
          <div className="flex items-center gap-2 text-[#4169e1] font-bold">
            <button
              onClick={() => setSelectedCompetitionFilter(null)}
              className="p-1 hover:bg-blue-100 rounded-md cursor-pointer transition-colors"
              title="Back to all competitions"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span>Showing: {selectedCompetitionFilter}</span>
          </div>
          <button
            onClick={() => setSelectedCompetitionFilter(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            Clear
          </button>
        </div>
      )}

      {/* 4. Matches List */}
      {activeTab !== 'competitions' && (
        <div className="divide-y divide-slate-100 max-h-[750px] overflow-y-auto no-scrollbar">
          {/* Next Match Highlight Banner */}
          {nextMatchInfo && !searchFilter && (
            <div className="p-2 sm:p-2.5 bg-slate-50/50 border-b border-slate-200">
              <NextMatchWidget
                nextMatchOverride={nextMatchInfo}
                onSelectMatch={onSelectMatch}
                onSelectOdds={onQuickStake}
                variant="banner"
              />
            </div>
          )}

          {leagues.map((league) => {
            const isLeagueExpanded = expandedLeagues[league.id] !== false;

            return (
              <div key={league.id} className="flex flex-col">
                {/* League Header Row */}
                <div
                  onClick={() => toggleLeague(league.id)}
                  className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border-b border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {league.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">{league.region}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                      {league.matchCount}
                    </span>
                    {isLeagueExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Sub-groups & Matches */}
                {isLeagueExpanded && (
                  <div className="divide-y divide-slate-100">
                    {league.subGroups.map((subGroup, sIdx) => {
                      const filteredMatches = subGroup.matches.filter((m) => {
                        if (activeTab === 'favourites' && !m.isFavorite) return false;
                        if (searchFilter) {
                          const q = searchFilter.toLowerCase();
                          if (!m.homeTeam.toLowerCase().includes(q) && !m.awayTeam.toLowerCase().includes(q)) return false;
                        }
                        if (selectedCompetitionFilter) {
                          if (!league.name.toLowerCase().includes(selectedCompetitionFilter.toLowerCase())) return false;
                        }
                        if (statusFilter === 'live') return m.status === 'LIVE';
                        if (statusFilter === 'finished') return m.status === 'FT';
                        if (statusFilter === 'upcoming') return m.status === 'UPCOMING';
                        return true;
                      });

                      if (filteredMatches.length === 0) return null;

                      return (
                        <div key={sIdx}>
                          {subGroup.title && (
                            <div className="px-3.5 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {subGroup.title}
                            </div>
                          )}

                          <div className="divide-y divide-slate-100">
                            {filteredMatches.map((m) => {
                              const isSelected = m.id === selectedMatchId;
                              const isNextMatch = nextMatchInfo?.match.id === m.id;
                              const odds = m.odds || { home: 1.5, draw: 3.5, away: 4.2 };

                              return (
                                <div
                                  key={m.id}
                                  onClick={() => onSelectMatch(m)}
                                  className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-blue-50/80 border-l-4 border-l-[#4169e1]'
                                      : isNextMatch
                                      ? 'bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-400'
                                      : 'hover:bg-slate-50/80'
                                  }`}
                                >
                                  {/* Time / Day / Status Column */}
                                  <div className="text-center min-w-[58px] pr-2 flex flex-col items-center justify-center shrink-0">
                                    <div className="text-[11px] font-bold text-slate-800 leading-tight">{m.time}</div>
                                    <div className="text-[9px] font-medium text-slate-500 leading-tight mt-0.5">
                                      {m.day || 'Today'}
                                    </div>
                                    {isNextMatch ? (
                                      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-wider mt-1">
                                        <Clock className="w-2 h-2 animate-pulse" />
                                        <span>NEXT</span>
                                      </div>
                                    ) : (
                                      <div
                                        className={`text-[8.5px] font-bold uppercase tracking-wider mt-0.5 ${
                                          m.status === 'LIVE'
                                            ? 'text-rose-600 animate-pulse font-black'
                                            : m.status === 'FT'
                                            ? 'text-slate-400'
                                            : 'text-blue-600'
                                        }`}
                                      >
                                        {m.status}
                                      </div>
                                    )}
                                  </div>

                                  {/* Teams & Scores Column */}
                                  <div className="flex-1 px-2 flex flex-col gap-1">
                                    {/* Home Team */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={m.homeFlag}
                                          alt={m.homeTeam}
                                          className="w-4 h-3 object-cover rounded-xs"
                                        />
                                        <span className="text-xs font-semibold text-slate-900">
                                          {m.homeTeam}
                                        </span>
                                      </div>
                                      <span className="font-bold text-xs text-slate-900">
                                        {m.homeScore ?? 0}
                                      </span>
                                    </div>

                                    {/* Away Team */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={m.awayFlag}
                                          alt={m.awayTeam}
                                          className="w-4 h-3 object-cover rounded-xs"
                                        />
                                        <span className="text-xs font-semibold text-slate-900">
                                          {m.awayTeam}
                                        </span>
                                      </div>
                                      <span className="font-bold text-xs text-slate-900">
                                        {m.awayScore ?? 0}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Quick Odds / Favorite Star */}
                                  <div className="flex items-center gap-2 pl-2">
                                    {showOdds && (
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onQuickStake?.({
                                              matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
                                              market: `${m.homeTeam} to Win`,
                                              odds: odds.home
                                            });
                                          }}
                                          className="px-1.5 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-[10px] font-bold text-slate-800 cursor-pointer"
                                        >
                                          {odds.home.toFixed(2)}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onQuickStake?.({
                                              matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
                                              market: 'Draw',
                                              odds: odds.draw
                                            });
                                          }}
                                          className="px-1.5 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-[10px] font-bold text-slate-800 cursor-pointer"
                                        >
                                          {odds.draw.toFixed(2)}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onQuickStake?.({
                                              matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
                                              market: `${m.awayTeam} to Win`,
                                              odds: odds.away
                                            });
                                          }}
                                          className="px-1.5 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-[10px] font-bold text-slate-800 cursor-pointer"
                                        >
                                          {odds.away.toFixed(2)}
                                        </button>
                                      </div>
                                    )}

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(m.id);
                                      }}
                                      className="p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                                      title="Add to favourites"
                                    >
                                      <Star
                                        className={`w-4 h-4 ${
                                          m.isFavorite
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-300 hover:text-slate-400'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
