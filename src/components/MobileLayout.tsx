import { useState } from 'react';
import {
  Clock,
  Search,
  Shield,
  Star,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  ArrowLeft,
  ChevronUp,
  X,
  Receipt
} from 'lucide-react';
import { LeagueGroup, Match, StakingRecord } from '../types';
import { getDateDisplayLabel } from '../services/sofascoreApi';
import { CenterMatchDetails } from './CenterMatchDetails';
import { ProfileView } from './ProfileView';
import { HistoryHubView } from './HistoryHubView';
import { MobileAuthBottomSheet } from './MobileAuthBottomSheet';
import { useAuth } from '../context/AuthContext';
import { findNextUpcomingMatch } from '../utils/matchUtils';
import { NextMatchWidget } from './NextMatchWidget';
import { PaystackDepositModal } from './PaystackDepositModal';

interface MobileLayoutProps {
  leagues: LeagueGroup[];
  selectedMatch: Match | null;
  onSelectMatch: (match: Match) => void;
  onBackToList: () => void;
  dateOffset: number;
  onDateChange: (offset: number) => void;
  onToggleFavorite: (id: string) => void;
  onSelectOdds: (selection: { matchId: string; matchTitle: string; market: string; odds: number }) => void;
  onAddStake?: (newStake: Omit<StakingRecord, 'id'>) => void;
  stakingHistory?: StakingRecord[];
}

export const MobileLayout = ({
  leagues,
  selectedMatch,
  onSelectMatch,
  onBackToList,
  dateOffset,
  onDateChange,
  onToggleFavorite,
  onSelectOdds,
  onAddStake,
  stakingHistory = []
}: MobileLayoutProps) => {
  const { user, profile } = useAuth();

  const [activeBottomNav, setActiveBottomNav] = useState<'matches' | 'search' | 'history' | 'fantasy' | 'favourites' | 'profile'>('matches');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'finished' | 'upcoming'>('all');
  const [showOdds, setShowOdds] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile bottom sheet auth state
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const [pendingMobileAction, setPendingMobileAction] = useState<(() => void) | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const totalMatchesCount = leagues.reduce(
    (acc, l) => acc + l.subGroups.reduce((subAcc, s) => subAcc + s.matches.length, 0),
    0
  );

  const liveMatchesCount = leagues.reduce(
    (acc, l) => acc + l.subGroups.reduce((subAcc, s) => subAcc + s.matches.filter((m) => m.status === 'LIVE').length, 0),
    0
  );

  const allMatchesList = leagues.flatMap((l) => l.subGroups.flatMap((s) => s.matches));
  const nextMatchInfo = findNextUpcomingMatch(allMatchesList, leagues);

  const handleMatchClick = (m: Match) => {
    onSelectMatch(m);
    setIsViewingDetails(true);
  };

  const handleBack = () => {
    setIsViewingDetails(false);
    onBackToList();
  };

  const executeOrAuth = (action: () => void) => {
    if (user && profile?.onboarded) {
      action();
    } else {
      setPendingMobileAction(() => action);
      setShowMobileAuth(true);
    }
  };

  const handleProfileTabClick = () => {
    setActiveBottomNav('profile');
    setIsViewingDetails(false);
  };

  const handleOddsSelectWithAuth = (selection: { matchTitle: string; market: string; odds: number }) => {
    executeOrAuth(() => {
      onSelectOdds({ ...selection, matchId: selectedMatch?.id || '' });
    });
  };

  const handleAuthSuccess = () => {
    setShowMobileAuth(false);
    if (pendingMobileAction) {
      pendingMobileAction();
      setPendingMobileAction(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f3f8] text-slate-800 pb-16 select-none">
      {/* 1. Mobile & Tablet Top Brand Bar */}
      <header className="bg-white text-slate-900 px-3.5 py-2.5 border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* ONEKICKX Logo */}
            <div
              onClick={() => {
                setActiveBottomNav('matches');
                setIsViewingDetails(false);
              }}
              className="flex items-center gap-2 font-black text-lg tracking-wider cursor-pointer uppercase"
            >
              <div className="w-7 h-7 rounded-lg bg-white overflow-hidden flex items-center justify-center p-0.5 border border-white/20 shadow-xs">
                <img
                  src="/onekickx-logo.png"
                  alt="ONEKICKX"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/onekickx-logo.jpg';
                  }}
                />
              </div>
              <span>ONEKICKX</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>+ Deposit</span>
            </button>
            <button
              onClick={handleProfileTabClick}
              className="bg-white text-[#4169e1] text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs hover:bg-slate-100 cursor-pointer border border-slate-200"
            >
              {user ? `$${(profile?.balance ?? 0).toFixed(2)}` : 'Wallet'}
            </button>
            <button className="text-slate-700 hover:text-amber-500 p-1 cursor-pointer">
              <Zap className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Football Only Bar */}
      {activeBottomNav === 'matches' && !isViewingDetails && (
        <div className="bg-[#3557c7] text-white px-3 py-1.5 flex items-center justify-between border-t border-blue-400/20 sticky top-11 z-20 text-xs">
          <span className="font-bold flex items-center gap-1.5">
            <span>⚽</span>
            <span>Football LiveScore</span>
          </span>
          <span className="text-[11px] text-blue-200">
            {totalMatchesCount} matches today
          </span>
        </div>
      )}

      {/* 3. Date Navigation & Odds Toggle Bar */}
      {activeBottomNav === 'matches' && !isViewingDetails && (
        <div className="bg-white px-3 py-2 border-b border-slate-200 flex items-center justify-between">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-full px-2 py-0.5 text-xs text-slate-700 bg-slate-50">
            <button
              onClick={() => onDateChange(dateOffset - 1)}
              className="text-slate-400 hover:text-slate-900 p-0.5 cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-xs px-2 text-[#4169e1] min-w-[55px] text-center">
              {getDateDisplayLabel(dateOffset)}
            </span>
            <button
              onClick={() => onDateChange(dateOffset + 1)}
              className="text-slate-400 hover:text-slate-900 p-0.5 cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Odds Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Odds</span>
            <button
              onClick={() => setShowOdds(!showOdds)}
              className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                showOdds ? 'bg-[#4169e1]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transform transition-transform ${
                  showOdds ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* 4. Filter Pills */}
      {activeBottomNav === 'matches' && !isViewingDetails && (
        <div className="bg-white px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#4169e1] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'live' ? 'all' : 'live')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'live'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Live ({liveMatchesCount})
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'finished' ? 'all' : 'finished')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'finished'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Finished
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'upcoming'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upcoming
          </button>
        </div>
      )}

      {/* 5. MAIN CONTENT */}
      {/* ROUTE A: HISTORY VIEW */}
      {activeBottomNav === 'history' ? (
        <div className="p-2">
          <HistoryHubView
            stakingHistory={stakingHistory}
            leagues={leagues}
            onSelectMatch={handleMatchClick}
            onOpenDeposit={() => setShowDepositModal(true)}
          />
        </div>
      ) : activeBottomNav === 'profile' ? (
        /* ROUTE B: PROFILE VIEW */
        <div className="p-2">
          <ProfileView stakingHistory={stakingHistory} />
        </div>
      ) : activeBottomNav === 'search' ? (
        /* ROUTE B: SEARCH VIEW */
        <div className="p-3 flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search team, match or league..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-[#4169e1]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Popular Matches'}
          </div>

          <div className="flex flex-col gap-2">
            {leagues
              .flatMap((l) => l.subGroups.flatMap((s) => s.matches))
              .filter((m) =>
                searchQuery
                  ? m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .slice(0, 8)
              .map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleMatchClick(m)}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:border-[#4169e1]"
                >
                  <div className="flex items-center gap-2">
                    <img src={m.homeFlag} alt={m.homeTeam} className="w-4 h-3 object-cover rounded-xs" />
                    <span className="font-bold text-xs text-slate-900">{m.homeTeam}</span>
                    <span className="text-slate-400 text-xs">vs</span>
                    <img src={m.awayFlag} alt={m.awayTeam} className="w-4 h-3 object-cover rounded-xs" />
                    <span className="font-bold text-xs text-slate-900">{m.awayTeam}</span>
                  </div>
                  <span className="text-xs font-bold text-[#4169e1]">{m.status}</span>
                </div>
              ))}
          </div>
        </div>
      ) : activeBottomNav === 'favourites' ? (
        /* ROUTE C: FAVOURITES VIEW */
        <div className="p-3 flex flex-col gap-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            My Favourites
          </h3>
          <div className="flex flex-col gap-2">
            {leagues
              .flatMap((l) => l.subGroups.flatMap((s) => s.matches))
              .filter((m) => m.isFavorite)
              .map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleMatchClick(m)}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img src={m.homeFlag} alt={m.homeTeam} className="w-4 h-3 object-cover rounded-xs" />
                    <span className="font-bold text-xs text-slate-900">{m.homeTeam}</span>
                    <span className="font-bold text-slate-700 text-xs">{m.homeScore ?? 0} - {m.awayScore ?? 0}</span>
                    <img src={m.awayFlag} alt={m.awayTeam} className="w-4 h-3 object-cover rounded-xs" />
                    <span className="font-bold text-xs text-slate-900">{m.awayTeam}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(m.id);
                    }}
                    className="text-amber-400 p-1"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ) : isViewingDetails && selectedMatch ? (
        /* ROUTE D: MATCH DETAILS VIEW */
        <div className="p-2.5 flex flex-col gap-2">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-[#4169e1] bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-blue-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Matches</span>
          </button>

          <CenterMatchDetails
            currentMatch={selectedMatch}
            onSelectOdds={handleOddsSelectWithAuth}
            onAddStake={onAddStake}
          />
        </div>
      ) : (
        /* ROUTE E: MATCHES LIST */
        <div className="p-2.5 flex flex-col gap-2.5">
          {/* Prominent Next Match Banner */}
          {nextMatchInfo && (
            <NextMatchWidget
              nextMatchOverride={nextMatchInfo}
              onSelectMatch={handleMatchClick}
              onSelectOdds={handleOddsSelectWithAuth}
              variant="banner"
            />
          )}

          {leagues.map((league) => (
            <div key={league.id} className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/80 overflow-hidden">
              {/* Tournament Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏆</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{league.name}</h4>
                    <span className="text-[10px] text-slate-400">{league.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                    {league.matchCount}
                  </span>
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Sub-groups */}
              <div className="divide-y divide-slate-100">
                {league.subGroups.map((sub, sIdx) => {
                  const filteredMatches = sub.matches.filter((m) => {
                    if (statusFilter === 'finished') return m.status === 'FT';
                    if (statusFilter === 'live') return m.status === 'LIVE';
                    if (statusFilter === 'upcoming') return m.status === 'UPCOMING';
                    return true;
                  });

                  if (filteredMatches.length === 0) return null;

                  return (
                    <div key={sIdx}>
                      <div className="px-3.5 py-1.5 bg-slate-50/70 text-[11px] font-bold text-slate-700">
                        {sub.title}
                      </div>

                      <div className="divide-y divide-slate-100">
                        {filteredMatches.map((m) => {
                          const isNextMatch = nextMatchInfo?.match.id === m.id;

                          return (
                            <div
                              key={m.id}
                              onClick={() => handleMatchClick(m)}
                              className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                                isNextMatch
                                  ? 'bg-amber-50/50 hover:bg-amber-50/80 border-l-4 border-l-amber-400'
                                  : 'hover:bg-blue-50/50'
                              }`}
                            >
                              {/* Time / Day / Status */}
                              <div className="text-center min-w-[56px] flex flex-col items-center justify-center shrink-0">
                                <div className="text-[11px] font-bold text-slate-800 leading-tight">{m.time}</div>
                                <div className="text-[9px] font-medium text-slate-500 leading-tight mt-0.5">
                                  {m.day || 'Today'}
                                </div>
                                {isNextMatch ? (
                                  <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-wider mt-0.5">
                                    <Clock className="w-2 h-2 animate-pulse" />
                                    <span>NEXT</span>
                                  </div>
                                ) : (
                                  <div
                                    className={`text-[9px] font-black uppercase mt-0.5 ${
                                      m.status === 'LIVE' ? 'text-rose-600 animate-pulse' : 'text-slate-400'
                                    }`}
                                  >
                                    {m.status}
                                  </div>
                                )}
                              </div>

                            {/* Teams & Scores */}
                            <div className="flex-1 px-2.5 flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img src={m.homeFlag} alt={m.homeTeam} className="w-4 h-3 object-cover rounded-xs" />
                                  <span className="text-xs font-semibold text-slate-900">{m.homeTeam}</span>
                                </div>
                                <span className="font-bold text-xs text-slate-900">{m.homeScore ?? 0}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img src={m.awayFlag} alt={m.awayTeam} className="w-4 h-3 object-cover rounded-xs" />
                                  <span className="text-xs font-semibold text-slate-900">{m.awayTeam}</span>
                                </div>
                                <span className="font-bold text-xs text-slate-900">{m.awayScore ?? 0}</span>
                              </div>
                            </div>

                            {/* Favorite Star */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(m.id);
                              }}
                              className="p-1 text-slate-300 hover:text-amber-400 cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${m.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                            </button>
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around h-14 z-40 shadow-md">
        <button
          onClick={() => {
            setActiveBottomNav('matches');
            setIsViewingDetails(false);
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeBottomNav === 'matches' ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px]">Matches</span>
        </button>

        <button
          onClick={() => {
            setActiveBottomNav('search');
            setIsViewingDetails(false);
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeBottomNav === 'search' ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={() => {
            setActiveBottomNav('history');
            setIsViewingDetails(false);
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeBottomNav === 'history' ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span className="text-[10px]">History</span>
        </button>

        <button
          onClick={() => {
            setActiveBottomNav('favourites');
            setIsViewingDetails(false);
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeBottomNav === 'favourites' ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Star className="w-4 h-4" />
          <span className="text-[10px]">Favourites</span>
        </button>

        <button
          onClick={handleProfileTabClick}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeBottomNav === 'profile' ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* 7. Mobile Glassmorphic White Bottom Sheet for Auth */}
      <MobileAuthBottomSheet
        isOpen={showMobileAuth}
        onClose={handleAuthSuccess}
      />

      {/* 8. Paystack Deposit Modal on Mobile */}
      <PaystackDepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
};
