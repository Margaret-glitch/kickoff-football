import { useState, useEffect, useRef } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  useLocation
} from 'react-router-dom';
import { TopTicker } from './components/TopTicker';
import { MainHeader } from './components/MainHeader';
import { SubHeader } from './components/SubHeader';
import { LeftMatchesList } from './components/LeftMatchesList';
import { CenterMatchDetails } from './components/CenterMatchDetails';
import { RightWalletStaking } from './components/RightWalletStaking';
import { MobileLayout } from './components/MobileLayout';
import { DroppingOddsView } from './components/DroppingOddsView';
import { ProfileView } from './components/ProfileView';
import { AuthForm } from './components/AuthForm';
import { HomeDashboardView } from './components/HomeDashboardView';
import { LiveFootballView } from './components/LiveFootballView';
import { LeaguesHubView } from './components/LeaguesHubView';
import { NewsFeedView } from './components/NewsFeedView';
import { PredictionsView } from './components/PredictionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { WhereToWatchView } from './components/WhereToWatchView';
import { WatchVideoHubView } from './components/WatchVideoHubView';
import { FavoritesHubView } from './components/FavoritesHubView';
import { HistoryHubView } from './components/HistoryHubView';
import { PaystackDepositModal } from './components/PaystackDepositModal';
import { RefreshCw } from 'lucide-react';
import { TeamProfileModal } from './components/TeamProfileModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { SearchModal } from './components/SearchModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { WelcomeOnboardingScreen } from './components/WelcomeOnboardingScreen';
import { INITIAL_LEAGUES, INITIAL_STAKING_HISTORY } from './data/sportsData';
import { LeagueGroup, Match, StakingRecord } from './types';
import { fetchMatchesByDateOffset } from './services/sofascoreApi';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, profile, depositFunds, deductFunds } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Data state: initialized with INITIAL_LEAGUES so old matches and categories are preserved
  const [leagues, setLeagues] = useState<LeagueGroup[]>(INITIAL_LEAGUES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(
    INITIAL_LEAGUES[0]?.subGroups[0]?.matches[0] || null
  );
  const [searchFilter, setSearchFilter] = useState('');
  const [activeNavTab, setActiveNavTab] = useState('home');

  // Modals state
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Right side panel state on desktop: 'staking' | 'profile' | 'auth'
  const [desktopRightPanel, setDesktopRightPanel] = useState<'staking' | 'profile' | 'auth'>('staking');
  const [pendingDesktopAction, setPendingDesktopAction] = useState<(() => void) | null>(null);

  // Auth gateway: User must be signed in to enter ONEKICKX (no guest bypass)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(false);

  // Real-time synchronization state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const selectedMatchRef = useRef(selectedMatch);

  useEffect(() => {
    selectedMatchRef.current = selectedMatch;
  }, [selectedMatch]);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const data = await fetchMatchesByDateOffset(dateOffset);
      if (data && data.length > 0) {
        setLeagues(data);
      }
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Parse dateOffset from search params
  const dateParam = searchParams.get('date');
  const dateOffset = dateParam ? parseInt(dateParam, 10) || 0 : 0;

  const setDateOffset = (newOffset: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newOffset === 0) {
        next.delete('date');
      } else {
        next.set('date', String(newOffset));
      }
      return next;
    });
  };

  // Staking and transaction history state with persistence
  const [stakingHistory, setStakingHistory] = useState<StakingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('onekickx_user_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_STAKING_HISTORY;
  });

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem('onekickx_user_history', JSON.stringify(stakingHistory));
    } catch {
      // ignore
    }
  }, [stakingHistory]);

  // Global listener for new deposits / bets / payout records
  useEffect(() => {
    const handleAddHistoryEvent = (e: Event) => {
      const customEvent = e as CustomEvent<StakingRecord>;
      if (customEvent.detail) {
        setStakingHistory((prev) => [customEvent.detail, ...prev]);
      }
    };
    window.addEventListener('onekickx_add_history', handleAddHistoryEvent);
    return () => {
      window.removeEventListener('onekickx_add_history', handleAddHistoryEvent);
    };
  }, []);

  const [activeSelection, setActiveSelection] = useState<{
    matchTitle: string;
    market: string;
    odds: number;
  } | null>(null);

  // Automatically load matches for selected date
  useEffect(() => {
    let isMounted = true;
    const loadMatchesForDate = async () => {
      try {
        const data = await fetchMatchesByDateOffset(dateOffset);
        if (isMounted) {
          if (data && data.length > 0) {
            setLeagues(data);
            const all = data.flatMap((l) => l.subGroups.flatMap((s) => s.matches));
            const matchIdFromUrl = location.pathname.match(/\/match\/([^/]+)/)?.[1];
            if (matchIdFromUrl) {
              const found = all.find((m) => m.id === matchIdFromUrl);
              if (found) setSelectedMatch(found);
            } else if (!selectedMatch) {
              const firstMatch = all[0];
              if (firstMatch) setSelectedMatch(firstMatch);
            }
          } else {
            setLeagues(INITIAL_LEAGUES);
            if (!selectedMatch) {
              setSelectedMatch(INITIAL_LEAGUES[0]?.subGroups[0]?.matches[0] || null);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load matches for date:', err);
        if (isMounted) {
          setLeagues(INITIAL_LEAGUES);
          if (!selectedMatch) {
            setSelectedMatch(INITIAL_LEAGUES[0]?.subGroups[0]?.matches[0] || null);
          }
        }
      }
    };

    loadMatchesForDate();
    return () => {
      isMounted = false;
    };
  }, [dateOffset, location.pathname]);

  // When visiting root path, ensure user is taken directly to home page
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      setActiveNavTab('home');
    }
  }, [location.pathname]);

  // Real-time live update engine (ticks match clock & live scores)
  useEffect(() => {
    const timer = setInterval(() => {
      setLeagues((prevLeagues) => {
        return prevLeagues.map((league) => ({
          ...league,
          subGroups: league.subGroups.map((sub) => ({
            ...sub,
            matches: sub.matches.map((match) => {
              if (match.status !== 'LIVE') return match;

              let currentMin = 0;
              if (match.time.endsWith("'")) {
                currentMin = parseInt(match.time, 10) || 45;
              } else if (match.time === 'HT') {
                currentMin = 45;
              }

              const nextMin = currentMin + 1;
              let nextStatus: Match['status'] = 'LIVE';
              let nextTime = `${nextMin}'`;

              if (nextMin === 45 && match.time !== 'HT') {
                nextTime = 'HT';
              } else if (nextMin > 90) {
                nextTime = 'FT';
                nextStatus = 'FT';
              }

              // Minor live odds fluctuation
              const oddsDelta = +(Math.random() * 0.04 - 0.02).toFixed(2);
              const updatedOdds = match.odds
                ? {
                    ...match.odds,
                    home: Math.max(1.05, +(match.odds.home + oddsDelta).toFixed(2)),
                    away: Math.max(1.05, +(match.odds.away - oddsDelta).toFixed(2))
                  }
                : undefined;

              return {
                ...match,
                time: nextTime,
                status: nextStatus,
                odds: updatedOdds
              };
            })
          }))
        }));
      });
      
      // Update selected match if it's currently selected
      if (selectedMatchRef.current) {
        setLeagues(prevLeagues => {
            const updatedSelectedMatch = prevLeagues.flatMap(l => l.subGroups.flatMap(s => s.matches)).find(m => m.id === selectedMatchRef.current!.id);
            if (updatedSelectedMatch) {
              setSelectedMatch(updatedSelectedMatch);
            }
            return prevLeagues;
        });
      }
    }, 12000);

    return () => clearInterval(timer);
  }, []);



  // Flatten matches
  const allMatchesList: Match[] = leagues.flatMap((l) =>
    l.subGroups.flatMap((s) => s.matches)
  );

  // Sync selected match with URL matchId param and sync /history route
  useEffect(() => {
    if (location.pathname === '/history') {
      setActiveNavTab('history');
    }
    const matchIdFromUrl = location.pathname.match(/\/match\/([^/]+)/)?.[1];
    if (matchIdFromUrl && allMatchesList.length > 0) {
      const found = allMatchesList.find((m) => m.id === matchIdFromUrl);
      if (found && (!selectedMatch || found.id !== selectedMatch.id)) {
        setSelectedMatch(found);
      }
    }
  }, [location.pathname, allMatchesList]);

  // Toggle favorite match
  const handleToggleFavorite = (matchId: string) => {
    setLeagues((prev) =>
      prev.map((league) => ({
        ...league,
        subGroups: league.subGroups.map((sub) => ({
          ...sub,
          matches: sub.matches.map((m) =>
            m.id === matchId ? { ...m, isFavorite: !m.isFavorite } : m
          )
        }))
      }))
    );
  };

  // Select match
  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    navigate(`/match/${match.id}`);
  };

  // Add new stake from quick bet and deduct from wallet balance
  const handleAddStake = (newStakeData: Omit<StakingRecord, 'id'>) => {
    const stakeAmt = newStakeData.stakeAmount || 0;
    if (deductFunds) {
      deductFunds(stakeAmt).catch(() => {});
    }
    const newRecord: StakingRecord = {
      ...newStakeData,
      id: `st-${Date.now()}`,
      type: 'bet',
      title: 'Match Stake',
      amount: stakeAmt,
      reference: `STK_${Math.floor(100000 + Math.random() * 900000)}`
    };
    setStakingHistory((prev) => [newRecord, ...prev]);
  };

  // Automatic bet settlement helper
  const handleAutoSettleBets = () => {
    const allMatches = leagues.flatMap((l) => l.subGroups.flatMap((s) => s.matches));
    let settledWinnings = 0;

    setStakingHistory((prev) => {
      let changed = false;
      const updated = prev.map((item) => {
        if (item.type === 'bet' && item.status === 'Ongoing') {
          const matched = allMatches.find(
            (m) =>
              item.matchTitle?.toLowerCase().includes(m.homeTeam.toLowerCase()) ||
              item.matchTitle?.toLowerCase().includes(m.awayTeam.toLowerCase())
          );

          if (matched && matched.status === 'FT') {
            changed = true;
            const homeScore = matched.homeScore ?? 0;
            const awayScore = matched.awayScore ?? 0;
            let isWin = false;
            const mkt = (item.market || '').toLowerCase();

            if (mkt.includes('draw') && homeScore === awayScore) {
              isWin = true;
            } else if (mkt.includes(matched.homeTeam.toLowerCase()) && homeScore > awayScore) {
              isWin = true;
            } else if (mkt.includes(matched.awayTeam.toLowerCase()) && awayScore > homeScore) {
              isWin = true;
            } else if (mkt.includes('over 2.5') && homeScore + awayScore > 2) {
              isWin = true;
            } else if (mkt.includes('both teams') && homeScore > 0 && awayScore > 0) {
              isWin = true;
            } else if (homeScore > awayScore) {
              isWin = true;
            }

            if (isWin) {
              const payout = item.potentialPayout ?? ((item.stakeAmount || 0) * (item.odds || 1.5));
              settledWinnings += payout;
              return {
                ...item,
                status: 'Win' as const,
                matchScore: `${homeScore} - ${awayScore} FT`
              };
            } else {
              return {
                ...item,
                status: 'Loss' as const,
                matchScore: `${homeScore} - ${awayScore} FT`
              };
            }
          }
        }
        return item;
      });

      if (settledWinnings > 0) {
        depositFunds(settledWinnings);
      }
      return changed ? updated : prev;
    });
  };

  // Periodic automatic settlement of completed matches
  useEffect(() => {
    const settleTimer = setInterval(() => {
      handleAutoSettleBets();
    }, 20000);
    return () => clearInterval(settleTimer);
  }, [leagues]);

  // Action execution helper on desktop
  const executeOrShowAuthOnDesktop = (action: () => void) => {
    action();
  };

  // When odds are clicked
  const handleSelectOdds = (selection: { matchTitle: string; market: string; odds: number }) => {
    setActiveSelection(selection);
    setDesktopRightPanel('staking');
  };

  const handleAuthCompleteOnDesktop = () => {
    if (pendingDesktopAction) {
      pendingDesktopAction();
      setPendingDesktopAction(null);
      setDesktopRightPanel('staking');
    } else {
      setDesktopRightPanel('profile');
    }
  };

  const totalFavorites = leagues.reduce(
    (acc, league) =>
      acc +
      league.subGroups.reduce(
        (subAcc, sub) => subAcc + sub.matches.filter((m) => m.isFavorite).length,
        0
      ),
    0
  );

  const isDroppingOddsActive = location.pathname === '/dropping-odds';
  const activeTabFromUrl = (location.pathname.match(/\/match\/[^/]+\/([^/]+)/)?.[1] || 'overview') as
    | 'overview'
    | 'lineups'
    | 'statistics'
    | 'commentary';

  return (
    <div className="min-h-screen bg-[#f0f3f8] text-slate-800 antialiased">
      {/* ======================================================== */}
      {/* 1. MOBILE VIEW (< lg: 1024px)                            */}
      {/* ======================================================== */}
      <div className="block lg:hidden">
        <MobileLayout
          leagues={leagues}
          selectedMatch={selectedMatch}
          onSelectMatch={handleSelectMatch}
          onBackToList={() => {
            setSelectedMatch(null);
            navigate('/');
          }}
          dateOffset={dateOffset}
          onDateChange={setDateOffset}
          onToggleFavorite={handleToggleFavorite}
          onSelectOdds={handleSelectOdds}
          onAddStake={handleAddStake}
          stakingHistory={stakingHistory}
        />
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP VIEW (>= lg)                                  */}
      {/* ======================================================== */}
      <div className="hidden lg:flex flex-col min-h-screen">
        {/* Top Ticker Navigation Bar with Football Fixtures & Date Navigation */}
        <TopTicker
          dateOffset={dateOffset}
          onDateChange={setDateOffset}
          onSelectMatch={(m) => {
            handleSelectMatch(m);
            setActiveNavTab('matches');
          }}
          liveMatches={allMatchesList}
        />

        {/* Primary Brand Header (ONEKICKX) */}
        <MainHeader
          onSearchChange={setSearchFilter}
          activeNavTab={activeNavTab}
          onTabChange={(tab) => {
            setActiveNavTab(tab);
            if (tab === 'home' || tab === 'matches') {
              navigate('/');
            } else if (tab === 'history') {
              navigate('/history');
            }
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenWelcome={() => setShowWelcomeScreen(true)}
          unreadNotificationsCount={2}
          liveMatchCount={allMatchesList.filter((m) => m.status === 'LIVE').length}
          onOpenProfile={() => {
            setDesktopRightPanel('profile');
          }}
        />

        {/* Sub-Header (Football only + Dropping odds / Favourites / TV schedule / History) */}
        <SubHeader
          favoritesCount={totalFavorites}
          onFavoritesClick={() => {
            setActiveNavTab('favourites');
          }}
          onDroppingOddsClick={() => {
            setActiveNavTab('dropping-odds');
          }}
          onWhereToWatchClick={() => {
            setActiveNavTab('where-to-watch');
          }}
          onHistoryClick={() => {
            setActiveNavTab('history');
            navigate('/history');
          }}
          isDroppingOddsActive={activeNavTab === 'dropping-odds'}
        />

        {/* Main Body Content Area */}
        <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 py-3">
          {/* Subtitle & Real-time Live Engine Indicator with Instant Sync */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-2.5">
            <div className="flex items-center gap-2">
              <span>Football today - livescore, schedule & analytics</span>
              <span className="hidden sm:inline text-[10px] text-slate-400">• Updated: {lastSyncTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>LIVE SYNC ACTIVE</span>
              </span>
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                title="Click to force live sync now"
              >
                <RefreshCw className={`w-3 h-3 text-[#4169e1] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: HOME DASHBOARD */}
          {activeNavTab === 'home' && (
            <div className="grid grid-cols-12 gap-3.5 items-start">
              <div className="col-span-12 lg:col-span-9">
                <HomeDashboardView
                  matches={allMatchesList}
                  onSelectMatch={(m) => {
                    handleSelectMatch(m);
                    setActiveNavTab('matches');
                  }}
                  onNavigateTab={(tab) => {
                    setActiveNavTab(tab);
                    if (tab === 'dropping-odds') navigate('/dropping-odds');
                  }}
                  onOpenTeam={(tId) => setSelectedTeamId(tId)}
                  onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
              <div className="col-span-12 lg:col-span-3">
                <RightWalletStaking
                  onAddStake={handleAddStake}
                  activeSelection={activeSelection}
                  onClearActiveSelection={() => setActiveSelection(null)}
                  stakingHistory={stakingHistory}
                  onRequireAuth={executeOrShowAuthOnDesktop}
                />
              </div>
            </div>
          )}

          {/* TAB 2: LIVE FOOTBALL ROOM */}
          {activeNavTab === 'live-football' && (
            <div className="grid grid-cols-12 gap-3.5 items-start">
              <div className="col-span-12 lg:col-span-9">
                <LiveFootballView
                  matches={allMatchesList}
                  onSelectMatch={(m) => {
                    handleSelectMatch(m);
                    setActiveNavTab('matches');
                  }}
                  onQuickStake={handleSelectOdds}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenTeam={(tId) => setSelectedTeamId(tId)}
                />
              </div>
              <div className="col-span-12 lg:col-span-3">
                <RightWalletStaking
                  onAddStake={handleAddStake}
                  activeSelection={activeSelection}
                  onClearActiveSelection={() => setActiveSelection(null)}
                  stakingHistory={stakingHistory}
                  onRequireAuth={executeOrShowAuthOnDesktop}
                />
              </div>
            </div>
          )}

          {/* TAB 3: MATCHES & MATCH CENTRE (Classic 3-Column Layout) */}
          {(activeNavTab === 'matches' || activeNavTab === 'scores') && (
            <div className="grid grid-cols-12 gap-3.5 items-start">
              {/* Left Column: Matches List & Competitions Tab (4 cols) */}
              <section className="col-span-12 lg:col-span-4 xl:col-span-4">
                <LeftMatchesList
                  leagues={leagues}
                  selectedMatchId={selectedMatch?.id || '15534059'}
                  onSelectMatch={handleSelectMatch}
                  onToggleFavorite={handleToggleFavorite}
                  searchFilter={searchFilter}
                  onQuickStake={handleSelectOdds}
                  dateOffset={dateOffset}
                  onDateChange={setDateOffset}
                />
              </section>

              {/* Center Column: Matches/Details OR Dropping Odds View (5 cols) */}
              <section className="col-span-12 lg:col-span-5 xl:col-span-5">
                <Routes>
                  <Route
                    path="/dropping-odds"
                    element={
                      <DroppingOddsView
                        onSelectOdds={handleSelectOdds}
                        onNavigateMatch={handleSelectMatch}
                      />
                    }
                  />
                  <Route
                    path="/match/:matchId/:activeTab"
                    element={
                      <CenterMatchDetails
                        currentMatch={selectedMatch}
                        allMatches={allMatchesList}
                        onSelectOdds={handleSelectOdds}
                        onAddStake={handleAddStake}
                        onNavigateMatch={handleSelectMatch}
                        onOpenTeam={(tId) => setSelectedTeamId(tId)}
                        onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
                        initialTab={activeTabFromUrl}
                        onTabChange={(tab) => {
                          if (selectedMatch) {
                            navigate(`/match/${selectedMatch.id}/${tab}`);
                          }
                        }}
                      />
                    }
                  />
                  <Route
                    path="/match/:matchId"
                    element={
                      <CenterMatchDetails
                        currentMatch={selectedMatch}
                        allMatches={allMatchesList}
                        onSelectOdds={handleSelectOdds}
                        onAddStake={handleAddStake}
                        onNavigateMatch={handleSelectMatch}
                        onOpenTeam={(tId) => setSelectedTeamId(tId)}
                        onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
                        initialTab="overview"
                        onTabChange={(tab) => {
                          if (selectedMatch) {
                            navigate(`/match/${selectedMatch.id}/${tab}`);
                          }
                        }}
                      />
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <CenterMatchDetails
                        currentMatch={selectedMatch}
                        allMatches={allMatchesList}
                        onSelectOdds={handleSelectOdds}
                        onAddStake={handleAddStake}
                        onNavigateMatch={handleSelectMatch}
                        onOpenTeam={(tId) => setSelectedTeamId(tId)}
                        onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
                        initialTab="overview"
                        onTabChange={(tab) => {
                          if (selectedMatch) {
                            navigate(`/match/${selectedMatch.id}/${tab}`);
                          }
                        }}
                      />
                    }
                  />
                </Routes>
              </section>

              {/* Right Column: Manipulation of Right Panel (Staking / Profile / Auth) (3 cols) */}
              <section className="col-span-12 lg:col-span-3 xl:col-span-3 flex flex-col gap-2">
                {desktopRightPanel === 'auth' ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                    <AuthForm
                      onSuccess={handleAuthCompleteOnDesktop}
                      title="Access Wallet & Stakes"
                    />
                  </div>
                ) : desktopRightPanel === 'profile' ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs relative">
                    <button
                      onClick={() => setDesktopRightPanel('staking')}
                      className="absolute top-3 right-3 text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Back to Slip
                    </button>
                    <ProfileView stakingHistory={stakingHistory} />
                  </div>
                ) : (
                  <RightWalletStaking
                    onAddStake={handleAddStake}
                    activeSelection={activeSelection}
                    onClearActiveSelection={() => setActiveSelection(null)}
                    stakingHistory={stakingHistory}
                    onRequireAuth={executeOrShowAuthOnDesktop}
                  />
                )}
              </section>
            </div>
          )}

          {/* TAB 4: LEAGUES & COMPETITIONS */}
          {activeNavTab === 'leagues' && (
            <LeaguesHubView
              onOpenTeam={(tId) => setSelectedTeamId(tId)}
              onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
            />
          )}

          {/* TAB 5: NEWS */}
          {activeNavTab === 'news' && (
            <NewsFeedView onOpenTeam={(tId) => setSelectedTeamId(tId)} />
          )}

          {/* TAB 6: PREDICTIONS */}
          {activeNavTab === 'predictions' && (
            <PredictionsView
              onOpenMatch={(mId) => {
                const match = allMatchesList.find((m) => m.id === mId);
                if (match) {
                  handleSelectMatch(match);
                  setActiveNavTab('matches');
                }
              }}
            />
          )}

          {/* TAB 7: ANALYTICS */}
          {activeNavTab === 'analytics' && <AnalyticsView />}

          {/* TAB 8: WHERE TO WATCH */}
          {activeNavTab === 'where-to-watch' && <WhereToWatchView />}

          {/* TAB 9: WATCH VIDEO HUB */}
          {activeNavTab === 'watch' && <WatchVideoHubView />}

          {/* TAB 10: FAVORITES HUB */}
          {activeNavTab === 'favourites' && (
            <FavoritesHubView
              favoriteMatches={allMatchesList.filter((m) => m.isFavorite)}
              onSelectMatch={(m) => {
                handleSelectMatch(m);
                setActiveNavTab('matches');
              }}
              onOpenTeam={(tId) => setSelectedTeamId(tId)}
              onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
              onToggleFavoriteMatch={handleToggleFavorite}
            />
          )}

          {/* TAB 11: DROPPING ODDS */}
          {activeNavTab === 'dropping-odds' && (
            <div className="max-w-4xl mx-auto">
              <DroppingOddsView
                onSelectOdds={handleSelectOdds}
                onNavigateMatch={(m) => {
                  handleSelectMatch(m);
                  setActiveNavTab('matches');
                }}
              />
            </div>
          )}

          {/* TAB 12: DEDICATED HISTORY & COMPLETED RESULTS ARCHIVE */}
          {activeNavTab === 'history' && (
            <HistoryHubView
              stakingHistory={stakingHistory}
              leagues={leagues}
              onSelectMatch={(m) => {
                handleSelectMatch(m);
                setActiveNavTab('matches');
              }}
              onSettleBets={handleAutoSettleBets}
              onOpenDeposit={() => setShowDepositModal(true)}
            />
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="mt-8 border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 select-none">
          <div className="max-w-[1540px] mx-auto px-4 flex items-center justify-between">
            <span className="font-bold text-[#4169e1] uppercase">ONEKICKX Football LiveScore & Analytics</span>
            <span>© 2026 ONEKICKX. All rights reserved.</span>
          </div>
        </footer>
      </div>

      {/* ======================================================== */}
      {/* 3. GLOBAL MODALS (Team, Player, Search, Notifications)    */}
      {/* ======================================================== */}
      <TeamProfileModal
        teamId={selectedTeamId}
        onClose={() => setSelectedTeamId(null)}
        onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
      />

      <PlayerProfileModal
        playerId={selectedPlayerId}
        onClose={() => setSelectedPlayerId(null)}
        onOpenTeam={(tId) => setSelectedTeamId(tId)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        matches={allMatchesList}
        onSelectMatch={(m) => {
          handleSelectMatch(m);
          setActiveNavTab('matches');
        }}
        onOpenTeam={(tId) => setSelectedTeamId(tId)}
        onOpenPlayer={(pId) => setSelectedPlayerId(pId)}
        onNavigateTab={(tab) => setActiveNavTab(tab)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenMatch={(mId) => {
          const match = allMatchesList.find((m) => m.id === mId);
          if (match) {
            handleSelectMatch(match);
            setActiveNavTab('matches');
          }
        }}
      />

      {/* ======================================================== */}
      {/* 4. AUTHENTICATION GATEWAY: SIGN IN OR REGISTER TO ENTER   */}
      {/* ======================================================== */}
      {showWelcomeScreen && (
        <WelcomeOnboardingScreen
          onClose={() => setShowWelcomeScreen(false)}
          onComplete={() => {
            setShowWelcomeScreen(false);
          }}
        />
      )}

      {/* 5. GLOBAL PAYSTACK DEPOSIT MODAL */}
      <PaystackDepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
