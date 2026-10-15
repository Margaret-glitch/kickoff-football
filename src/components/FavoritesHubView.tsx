import { useState } from 'react';
import { Star, Heart, Trophy, Users, Shield, ArrowRight } from 'lucide-react';
import { Match } from '../types';
import { TEAMS_DATA, PLAYERS_DATA, LEAGUES_DATA } from '../data/extendedFootballData';

interface FavoritesHubViewProps {
  favoriteMatches: Match[];
  onSelectMatch: (match: Match) => void;
  onOpenTeam?: (teamId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  onToggleFavoriteMatch?: (matchId: string) => void;
}

export const FavoritesHubView = ({
  favoriteMatches,
  onSelectMatch,
  onOpenTeam,
  onOpenPlayer,
  onToggleFavoriteMatch
}: FavoritesHubViewProps) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'teams' | 'players' | 'leagues'>('matches');

  // Sample followed teams and players (persisted / interactive)
  const [followedTeams, setFollowedTeams] = useState<string[]>(['arsenal', 'barcelona', 'inter-miami']);
  const [followedPlayers, setFollowedPlayers] = useState<string[]>(['saka', 'messi', 'yamal']);
  const [followedLeagues, setFollowedLeagues] = useState<string[]>(['premier-league', 'la-liga', 'mls']);

  const unfollowTeam = (teamId: string) => {
    setFollowedTeams((prev) => prev.filter((id) => id !== teamId));
  };

  const unfollowPlayer = (playerId: string) => {
    setFollowedPlayers((prev) => prev.filter((id) => id !== playerId));
  };

  const unfollowLeague = (leagueId: string) => {
    setFollowedLeagues((prev) => prev.filter((id) => id !== leagueId));
  };

  return (
    <div className="space-y-5 pb-12 select-none">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">My Favorites Center</h1>
            <p className="text-xs text-slate-500">
              Personalized tracker for your favorite teams, players, leagues, and pinned matches
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'matches' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Matches ({favoriteMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'teams' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Teams ({followedTeams.length})
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'players' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Players ({followedPlayers.length})
          </button>
          <button
            onClick={() => setActiveTab('leagues')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'leagues' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Leagues ({followedLeagues.length})
          </button>
        </div>
      </div>

      {/* 1. Favorite Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          {favoriteMatches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No Pinned Matches Yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Click the star icon on any match card across ONEKICKX to pin it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favoriteMatches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMatch(m)}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#4169e1] transition-all cursor-pointer shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      {m.status === 'LIVE' ? `${m.time} LIVE` : m.time}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavoriteMatch?.(m.id);
                      }}
                      className="text-amber-500 hover:text-slate-300 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <img src={m.homeFlag} alt={m.homeTeam} className="w-4 h-4 object-contain rounded-xs" />
                        <span>{m.homeTeam}</span>
                      </div>
                      <span className="text-sm">{m.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <img src={m.awayFlag} alt={m.awayTeam} className="w-4 h-4 object-contain rounded-xs" />
                        <span>{m.awayTeam}</span>
                      </div>
                      <span className="text-sm">{m.awayScore ?? '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Favorite Teams Tab */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {followedTeams.map((teamId) => {
            const team = TEAMS_DATA[teamId];
            if (!team) return null;

            return (
              <div
                key={team.id}
                onClick={() => onOpenTeam?.(team.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-[#4169e1] transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <img src={team.logo} alt={team.name} className="w-12 h-12 object-contain" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unfollowTeam(team.id);
                    }}
                    className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Unfollow team"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#4169e1] transition-colors">
                    {team.name}
                  </h3>
                  <span className="text-xs text-slate-400">{team.league} · Rank #{team.leagueRank}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Form:</span>
                    {team.form.map((f, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded text-[8px] font-bold text-white flex items-center justify-center ${
                          f === 'W' ? 'bg-emerald-500' : f === 'D' ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <span className="font-bold text-slate-700">{team.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Favorite Players Tab */}
      {activeTab === 'players' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {followedPlayers.map((playerId) => {
            const player = PLAYERS_DATA[playerId];
            if (!player) return null;

            return (
              <div
                key={player.id}
                onClick={() => onOpenPlayer?.(player.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-[#4169e1] transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unfollowPlayer(player.id);
                    }}
                    className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Unfollow player"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#4169e1] transition-colors">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <img src={player.teamLogo} alt={player.team} className="w-3.5 h-3.5 object-contain" />
                    <span>{player.team} · #{player.number}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Goals</span>
                    <span className="font-black text-slate-900">{player.seasonStats.goals}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assists</span>
                    <span className="font-black text-slate-900">{player.seasonStats.assists}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                    <span className="font-black text-emerald-600">{player.seasonStats.rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Favorite Leagues Tab */}
      {activeTab === 'leagues' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {followedLeagues.map((leagueId) => {
            const league = LEAGUES_DATA[leagueId];
            if (!league) return null;

            return (
              <div
                key={league.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-[#4169e1] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <img src={league.logo} alt={league.name} className="w-10 h-10 object-contain p-1 bg-slate-50 rounded-lg border border-slate-100" />
                  <button
                    onClick={() => unfollowLeague(league.id)}
                    className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{league.name}</h3>
                  <span className="text-xs text-slate-400">{league.country} · {league.season}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Leader: {league.standings[0]?.team}</span>
                  <span className="font-bold text-blue-600">{league.standings[0]?.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
