import { useState, useEffect } from 'react';
import { Search, X, Users, Trophy, Newspaper, ArrowRight, Star } from 'lucide-react';
import { TEAMS_DATA, PLAYERS_DATA, LEAGUES_DATA, NEWS_ARTICLES } from '../data/extendedFootballData';
import { Match } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onOpenTeam?: (teamId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SearchModal = ({
  isOpen,
  onClose,
  matches,
  onSelectMatch,
  onOpenTeam,
  onOpenPlayer,
  onNavigateTab
}: SearchModalProps) => {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search matches
  const matchedMatches = trimmed
    ? matches.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(trimmed) ||
          m.awayTeam.toLowerCase().includes(trimmed)
      )
    : matches.slice(0, 3);

  // Search teams
  const matchedTeams = Object.values(TEAMS_DATA).filter((t) =>
    !trimmed || t.name.toLowerCase().includes(trimmed) || t.country.toLowerCase().includes(trimmed)
  );

  // Search players
  const matchedPlayers = Object.values(PLAYERS_DATA).filter((p) =>
    !trimmed || p.name.toLowerCase().includes(trimmed) || p.team.toLowerCase().includes(trimmed)
  );

  // Search leagues
  const matchedLeagues = Object.values(LEAGUES_DATA).filter((l) =>
    !trimmed || l.name.toLowerCase().includes(trimmed) || l.country.toLowerCase().includes(trimmed)
  );

  // Search news
  const matchedNews = Object.values(NEWS_ARTICLES).filter((n) =>
    !trimmed || n.title.toLowerCase().includes(trimmed) || n.category.toLowerCase().includes(trimmed)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, players, matches, leagues, news..."
            className="w-full text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md bg-slate-100 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          {/* 1. Matches */}
          {matchedMatches.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Matches ({matchedMatches.length})
              </span>
              <div className="space-y-1.5">
                {matchedMatches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onClose();
                      onSelectMatch(m);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3 font-bold text-slate-900">
                      <span>{m.homeTeam} vs {m.awayTeam}</span>
                      <span className="text-[11px] font-semibold text-slate-400">· {m.time}</span>
                    </div>
                    <span className="text-xs font-bold text-[#4169e1]">Open Match</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Teams */}
          {matchedTeams.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Teams ({matchedTeams.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {matchedTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => {
                      onClose();
                      onOpenTeam?.(team.id);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center gap-2.5 cursor-pointer text-xs transition-colors"
                  >
                    <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" />
                    <div>
                      <h4 className="font-bold text-slate-900">{team.name}</h4>
                      <span className="text-[10px] text-slate-400">{team.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Players */}
          {matchedPlayers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Players ({matchedPlayers.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {matchedPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => {
                      onClose();
                      onOpenPlayer?.(player.id);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center gap-2.5 cursor-pointer text-xs transition-colors"
                  >
                    <img src={player.avatarUrl} alt={player.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-900">{player.name}</h4>
                      <span className="text-[10px] text-slate-400">{player.team} · #{player.number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Leagues */}
          {matchedLeagues.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Leagues ({matchedLeagues.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {matchedLeagues.map((league) => (
                  <div
                    key={league.id}
                    onClick={() => {
                      onClose();
                      onNavigateTab?.('leagues');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center gap-2.5 cursor-pointer text-xs transition-colors"
                  >
                    <img src={league.logo} alt={league.name} className="w-6 h-6 object-contain" />
                    <div>
                      <h4 className="font-bold text-slate-900">{league.name}</h4>
                      <span className="text-[10px] text-slate-400">{league.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. News */}
          {matchedNews.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                News ({matchedNews.length})
              </span>
              <div className="space-y-1.5">
                {matchedNews.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onClose();
                      onNavigateTab?.('news');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer text-xs transition-colors"
                  >
                    <h4 className="font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{n.source} · {n.publishedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
