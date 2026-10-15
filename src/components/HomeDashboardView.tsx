import { Flame, Play, TrendingUp, Calendar, ArrowRight, Star, ShieldCheck, Newspaper, Tv, Sparkles, BarChart2 } from 'lucide-react';
import { Match } from '../types';
import { NEWS_ARTICLES, MATCH_PREDICTIONS, WATCH_VIDEOS, BROADCAST_GUIDE } from '../data/extendedFootballData';
import { NextMatchWidget } from './NextMatchWidget';

interface HomeDashboardViewProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onNavigateTab: (tab: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  onOpenTeam?: (teamId: string) => void;
  onToggleFavorite?: (matchId: string) => void;
}

export const HomeDashboardView = ({
  matches,
  onSelectMatch,
  onNavigateTab,
  onOpenPlayer,
  onOpenTeam,
  onToggleFavorite
}: HomeDashboardViewProps) => {
  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');
  const finishedMatches = matches.filter((m) => m.status === 'FT');
  const featuredMatch = liveMatches[0] || matches[0];

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Hero Spotlight: Featured Live / Marquee Match */}
      {featuredMatch && (
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white p-5 md:p-6 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Featured {featuredMatch.status === 'LIVE' ? 'Live Match' : 'Matchday Clash'}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-bold text-[#4169e1] dark:text-blue-400">
                {featuredMatch.day || 'Today'} • {featuredMatch.time}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite?.(featuredMatch.id)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  featuredMatch.isFavorite
                    ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Favorite match"
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => onNavigateTab('where-to-watch')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5 text-blue-500" />
                <span>Watch Guide</span>
              </button>
            </div>
          </div>

          {/* Teams & Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-2">
            {/* Home Team */}
            <div
              onClick={() => onOpenTeam?.('arsenal')}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <img
                src={featuredMatch.homeFlag}
                alt={featuredMatch.homeTeam}
                className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform"
              />
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white group-hover:text-[#4169e1] transition-colors">
                  {featuredMatch.homeTeam}
                </h3>
                <span className="text-xs text-slate-500">Home · Leader</span>
              </div>
            </div>

            {/* Score Center */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {featuredMatch.homeScore ?? 0}
                </span>
                <span className="text-xl md:text-2xl font-light text-slate-400">-</span>
                <span className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {featuredMatch.awayScore ?? 0}
                </span>
              </div>
              <span className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                {featuredMatch.status === 'LIVE' ? `${featuredMatch.time} In-Play` : `${featuredMatch.day || 'Today'} • ${featuredMatch.time}`}
              </span>

              {featuredMatch.odds && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-300">
                    1: {featuredMatch.odds.home.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300">
                    X: {featuredMatch.odds.draw.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-300">
                    2: {featuredMatch.odds.away.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div
              onClick={() => onOpenTeam?.('chelsea')}
              className="flex items-center justify-end gap-4 cursor-pointer group text-right"
            >
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white group-hover:text-[#4169e1] transition-colors">
                  {featuredMatch.awayTeam}
                </h3>
                <span className="text-xs text-slate-500">Away · Contender</span>
              </div>
              <img
                src={featuredMatch.awayFlag}
                alt={featuredMatch.awayTeam}
                className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Match Centre with Live Timeline, Lineups, & Advanced Stats
            </span>
            <button
              onClick={() => onSelectMatch(featuredMatch)}
              className="flex items-center gap-1.5 font-bold text-[#4169e1] hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
            >
              <span>Open Match Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Next Upcoming Match Highlight */}
      <NextMatchWidget
        matches={matches}
        onSelectMatch={onSelectMatch}
        variant="banner"
      />

      {/* 2. Quick Navigation Shortcut Bar (Anti-Slop Clean Text Tabs) */}
      <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2 border-b border-slate-200">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onNavigateTab('live-football')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Live Football ({liveMatches.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('matches')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => onNavigateTab('leagues')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            <span>Standings</span>
          </button>
          <button
            onClick={() => onNavigateTab('predictions')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Predictions</span>
          </button>
          <button
            onClick={() => onNavigateTab('analytics')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => onNavigateTab('where-to-watch')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5 text-blue-600" />
            <span>Where to Watch</span>
          </button>
          <button
            onClick={() => onNavigateTab('watch')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-slate-500" />
            <span>Watch Highlights</span>
          </button>
          <button
            onClick={() => onNavigateTab('news')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Newspaper className="w-3.5 h-3.5 text-slate-500" />
            <span>News</span>
          </button>
        </div>
      </div>

      {/* 3. Live & Trending Matches Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Live & Trending Matches
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('live-football')}
            className="text-xs font-bold text-[#4169e1] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All In-Play</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {matches.slice(0, 6).map((match) => (
            <div
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#4169e1] transition-all cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between text-xs mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {match.day || 'Today'}
                  </span>
                  {match.status === 'LIVE' ? (
                    <span className="flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      {match.time}
                    </span>
                  ) : match.status === 'UPCOMING' ? (
                    <span className="font-bold text-[#4169e1] bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                      {match.time}
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {match.time}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.(match.id);
                  }}
                  className={`cursor-pointer ${match.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'}`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Match Teams & Score */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 truncate">
                    <img src={match.homeFlag} alt={match.homeTeam} className="w-4 h-4 object-contain rounded-xs shrink-0" />
                    <span className="truncate">{match.homeTeam}</span>
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 ml-2">
                    {match.homeScore ?? (match.status === 'UPCOMING' ? '-' : 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 truncate">
                    <img src={match.awayFlag} alt={match.awayTeam} className="w-4 h-4 object-contain rounded-xs shrink-0" />
                    <span className="truncate">{match.awayTeam}</span>
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 ml-2">
                    {match.awayScore ?? (match.status === 'UPCOMING' ? '-' : 0)}
                  </span>
                </div>
              </div>

              {match.odds && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  <div className="bg-slate-50 hover:bg-blue-50 py-1 rounded text-slate-700 font-semibold border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">1</span>
                    {match.odds.home.toFixed(2)}
                  </div>
                  <div className="bg-slate-50 hover:bg-blue-50 py-1 rounded text-slate-700 font-semibold border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">X</span>
                    {match.odds.draw.toFixed(2)}
                  </div>
                  <div className="bg-slate-50 hover:bg-blue-50 py-1 rounded text-slate-700 font-semibold border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">2</span>
                    {match.odds.away.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two-Column Layout: Predictions Spotlight & Video Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Statistical Predictions Spotlight */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Statistical Predictions & Insights
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('predictions')}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>All Predictions</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {MATCH_PREDICTIONS.slice(0, 2).map((pred) => (
              <div
                key={pred.matchId}
                className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{pred.matchTitle}</span>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Predicted: {pred.predictedScore}
                  </span>
                </div>

                {/* Win Probabilities Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                    <span>Home {pred.homeProb}%</span>
                    <span>Draw {pred.drawProb}%</span>
                    <span>Away {pred.awayProb}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden flex">
                    <div style={{ width: `${pred.homeProb}%` }} className="bg-[#4169e1]" />
                    <div style={{ width: `${pred.drawProb}%` }} className="bg-amber-400" />
                    <div style={{ width: `${pred.awayProb}%` }} className="bg-rose-500" />
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Key Signal:</span>
                  <span className="truncate">{pred.keyInsights[0]}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[10px] text-slate-400 italic">
            * Statistical probabilistic calculations from historical xG and form models. Not guaranteed outcomes.
          </p>
        </div>

        {/* Right Column (5 cols): Watch Video Strip */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Watch Football
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('watch')}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Video Hub</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {WATCH_VIDEOS.slice(0, 2).map((vid) => (
              <div
                key={vid.id}
                onClick={() => onNavigateTab('watch')}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                    {vid.duration}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {vid.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span>{vid.category}</span>
                    <span>·</span>
                    <span>{vid.publishedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Latest Breaking News Feed */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#4169e1]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Breaking Football News
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('news')}
            className="text-xs font-bold text-[#4169e1] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All News</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NEWS_ARTICLES.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigateTab('news')}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#4169e1] transition-all cursor-pointer flex flex-col shadow-2xs group"
            >
              <div className="h-36 overflow-hidden relative">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#4169e1] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {article.category}
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#4169e1] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">{article.source}</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
