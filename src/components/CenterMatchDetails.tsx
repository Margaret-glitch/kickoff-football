import { useState, useEffect, useMemo } from 'react';
import {
  Star,
  MessageSquare,
  X,
  Check,
  AlertCircle,
  ArrowRight,
  Wallet,
  CreditCard,
  Clock
} from 'lucide-react';
import { Match, StakingRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { PaystackDepositModal } from './PaystackDepositModal';
import { getTimeUntilKickoff } from '../utils/matchUtils';
import {
  fetchEventOdds,
  fetchLiveEventDetails,
  LiveMarketGroup,
  LiveEventDetailsBundle
} from '../services/sofascoreApi';
import { generateDynamicMatchDetails, DynamicMatchDetail, MatchPlayer, MatchEvent, MatchSubstitution } from '../data/matchDetailsGenerator';
import { SoccerPitchLineup } from './SoccerPitchLineup';
import { MatchMomentumChart } from './MatchMomentumChart';
import { PlayerOfTheMatchCard } from './PlayerOfTheMatchCard';
import { MatchEventsTimeline } from './MatchEventsTimeline';

interface CenterMatchDetailsProps {
  currentMatch?: Match | null;
  allMatches?: Match[];
  onSelectOdds?: (selection: { matchId: string; matchTitle: string; market: string; odds: number }) => void;
  onAddStake?: (record: Omit<StakingRecord, 'id'>) => void;
  onNavigateMatch?: (match: Match) => void;
  onOpenTeam?: (teamId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  initialTab?: 'overview' | 'lineups' | 'statistics' | 'commentary';
  onTabChange?: (tab: 'overview' | 'lineups' | 'statistics' | 'commentary') => void;
}

export const CenterMatchDetails = ({
  currentMatch,
  onSelectOdds,
  onAddStake,
  onOpenTeam,
  onOpenPlayer,
  initialTab = 'overview',
  onTabChange
}: CenterMatchDetailsProps) => {
  const { user, profile, deductFunds, requireAuth } = useAuth();
  const userBalance = profile?.balance ?? 0;

  const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'statistics' | 'commentary'>(initialTab);
  const [liveOdds, setLiveOdds] = useState<{ home: number; draw: number; away: number } | null>(null);
  const [liveMarkets, setLiveMarkets] = useState<LiveMarketGroup[]>([]);
  const [showAdditionalOdds, setShowAdditionalOdds] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [liveBundle, setLiveBundle] = useState<LiveEventDetailsBundle | null>(null);

  // Inline Quick Stake state in Odds Area
  const [selectedOdd, setSelectedOdd] = useState<{
    market: string;
    odds: number;
    label?: string;
  } | null>(null);
  const [stakeAmountInput, setStakeAmountInput] = useState<string>('15');
  const [isSubmittingStake, setIsSubmittingStake] = useState(false);
  const [stakeSuccess, setStakeSuccess] = useState<{
    message: string;
    potentialReturn: number;
    stakeAmount: number;
  } | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: 'overview' | 'lineups' | 'statistics' | 'commentary') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Default fixture if none passed
  const activeMatch: Match = currentMatch || {
    id: '15534059',
    time: '11:45',
    status: 'FT',
    homeTeam: 'Germany',
    homeFlag: 'https://flagcdn.com/w40/de.png',
    homeScore: 2,
    awayTeam: 'Serbia',
    awayFlag: 'https://flagcdn.com/w40/rs.png',
    awayScore: 0,
    odds: { home: 1.18, draw: 7.00, away: 15.0 }
  };

  // Base details structure
  const baseDetails: DynamicMatchDetail = useMemo(
    () => generateDynamicMatchDetails(activeMatch),
    [activeMatch]
  );

  const [kickoffCountdown, setKickoffCountdown] = useState<string>(() =>
    activeMatch.status === 'UPCOMING'
      ? getTimeUntilKickoff(activeMatch.time).formattedCountdown
      : ''
  );

  useEffect(() => {
    if (activeMatch.status !== 'UPCOMING') return;
    
    const interval = setInterval(() => {
      setKickoffCountdown(() => getTimeUntilKickoff(activeMatch.time).formattedCountdown);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeMatch.status, activeMatch.time]);

  // Fetch live event bundle
  useEffect(() => {
    let isMounted = true;
    const loadLiveData = async () => {
      if (!activeMatch.id) return;
      
      const [bundle, oddsData] = await Promise.all([
        fetchLiveEventDetails(activeMatch.id),
        fetchEventOdds(activeMatch.id)
      ]);

      if (isMounted) {
        if (bundle) {
          setLiveBundle(bundle);
        }
        if (oddsData) {
          setLiveOdds({
            home: oddsData.home,
            draw: oddsData.draw,
            away: oddsData.away
          });
          if (oddsData.markets) {
            setLiveMarkets(oddsData.markets.slice(0, 6));
          }
        }
      }
    };

    loadLiveData();
    return () => {
      isMounted = false;
    };
  }, [activeMatch.id]);

  // Construct final details
  const details: DynamicMatchDetail = useMemo(() => {
    const finalDetails = { ...baseDetails };

    // 1. Momentum Graph
    if (liveBundle?.graph?.graphPoints && liveBundle.graph.graphPoints.length > 0) {
      finalDetails.momentum = liveBundle.graph.graphPoints.map((gp) => ({
        minute: gp.minute,
        value: gp.value,
        isGoal: false
      }));
    }

    // 2. Incidents / Events
    if (liveBundle?.incidents?.incidents && liveBundle.incidents.incidents.length > 0) {
      const realEvents: MatchEvent[] = [];
      const realSubs: MatchSubstitution[] = [];
      const realScorers: { name: string; minute: number; team: 'home' | 'away' }[] = [];

      for (const inc of liveBundle.incidents.incidents) {
        if (inc.incidentType === 'goal') {
          const scorerName = inc.player?.name || 'Goal';
          const assistName = inc.assist1?.name ? `Assist: ${inc.assist1.name}` : undefined;
          const isHomeTeam = inc.isHome ?? true;
          realEvents.push({
            minute: inc.time,
            type: 'goal',
            team: isHomeTeam ? 'home' : 'away',
            text: `Goal: ${scorerName}`,
            detail: assistName,
            score: inc.homeScore !== undefined && inc.awayScore !== undefined ? `${inc.homeScore} - ${inc.awayScore}` : undefined
          });
          realScorers.push({
            name: scorerName,
            minute: inc.time,
            team: isHomeTeam ? 'home' : 'away'
          });
        } else if (inc.incidentType === 'card') {
          realEvents.push({
            minute: inc.time,
            type: 'card',
            team: inc.isHome ? 'home' : 'away',
            text: `${inc.incidentClass === 'red' ? 'Red' : 'Yellow'} Card: ${inc.player?.name || 'Player'}`
          });
        } else if (inc.incidentType === 'substitution') {
          if (inc.playerIn && inc.playerOut) {
            realEvents.push({
              minute: inc.time,
              type: 'substitution',
              team: inc.isHome ? 'home' : 'away',
              text: `${inc.playerIn.name} in for ${inc.playerOut.name}`
            });
            realSubs.push({
              minute: inc.time,
              team: inc.isHome ? 'home' : 'away',
              playerIn: {
                name: inc.playerIn.name,
                number: parseInt(inc.playerIn.jerseyNumber || '10', 10) || 10,
                rating: 6.7,
                avatarUrl: ''
              },
              playerOut: {
                name: inc.playerOut.name,
                number: parseInt(inc.playerOut.jerseyNumber || '11', 10) || 11
              }
            });
          }
        }
      }

      if (realEvents.length > 0) finalDetails.events = realEvents;
      if (realSubs.length > 0) finalDetails.substitutions = realSubs;
      if (realScorers.length > 0) finalDetails.goalScorers = realScorers;
    }

    // 3. Lineups
    if (liveBundle?.lineups?.home?.players && liveBundle.lineups.home.players.length > 0) {
      finalDetails.homeFormation = liveBundle.lineups.home.formation || finalDetails.homeFormation;
      finalDetails.awayFormation = liveBundle.lineups.away?.formation || finalDetails.awayFormation;

      const startingHome = liveBundle.lineups.home.players.filter((p) => !p.substitute);
      const benchHome = liveBundle.lineups.home.players.filter((p) => p.substitute);

      if (startingHome.length >= 11) {
        finalDetails.homeLineup = startingHome.slice(0, 11).map((p, idx) => ({
          id: `shp-${p.player.id || idx}`,
          name: p.player.name,
          shortName: p.player.shortName || p.player.name,
          number: parseInt(p.player.jerseyNumber || String(idx + 1), 10) || idx + 1,
          position: (p.player.position === 'G' ? 'GK' : p.player.position === 'D' ? 'DEF' : p.player.position === 'M' ? 'MID' : 'ATT') as 'GK' | 'DEF' | 'MID' | 'ATT',
          rating: p.statistics?.rating || +(6.5 + (idx % 3) * 0.4).toFixed(1),
          avatarUrl: ''
        }));
      }

      if (benchHome.length > 0) {
        finalDetails.homeBench = benchHome.map((p, idx) => ({
          id: `bhp-${p.player.id || idx}`,
          name: p.player.name,
          shortName: p.player.shortName || p.player.name,
          number: parseInt(p.player.jerseyNumber || String(idx + 12), 10) || idx + 12,
          position: 'MID',
          rating: p.statistics?.rating || 6.5,
          avatarUrl: ''
        }));
      }
    }

    // 4. Statistics
    if (liveBundle?.statistics?.statistics && liveBundle.statistics.statistics.length > 0) {
      const matchOverview = liveBundle.statistics.statistics[0]?.groups?.find(
        (g) => g.groupName?.toLowerCase().includes('overview') || g.groupName?.toLowerCase().includes('all')
      );

      if (matchOverview?.statisticsItems) {
        for (const item of matchOverview.statisticsItems) {
          const name = item.name?.toLowerCase();
          const hVal = typeof item.home === 'string' ? parseFloat(item.home) : (item.home || 0);
          const aVal = typeof item.away === 'string' ? parseFloat(item.away) : (item.away || 0);

          if (name.includes('possession')) finalDetails.stats.possession = [hVal, aVal];
          else if (name.includes('expected goals')) finalDetails.stats.xG = [hVal, aVal];
          else if (name.includes('big chances')) finalDetails.stats.bigChances = [hVal, aVal];
          else if (name.includes('total shots')) finalDetails.stats.totalShots = [hVal, aVal];
          else if (name.includes('corner')) finalDetails.stats.corners = [hVal, aVal];
          else if (name.includes('fouls')) finalDetails.stats.fouls = [hVal, aVal];
          else if (name.includes('passes')) finalDetails.stats.passes = [hVal, aVal];
        }
      }
    }

    return finalDetails;
  }, [baseDetails, liveBundle]);

  const displayOdds = liveOdds || activeMatch.odds || { home: 1.18, draw: 7.00, away: 15.0 };

  const parsedStake = Number(stakeAmountInput) || 0;
  const isBelowMin = parsedStake < 15;
  const isExceedingBalance = parsedStake > userBalance;
  const potentialCashOut = selectedOdd ? +(parsedStake * selectedOdd.odds).toFixed(2) : 0;
  const estimatedProfit = selectedOdd ? +(potentialCashOut - parsedStake).toFixed(2) : 0;

  const handleOddsClick = (market: string, odds: number, label?: string) => {
    // If clicking same odd that is currently selected, toggle it off
    if (selectedOdd?.market === market && selectedOdd?.odds === odds) {
      setSelectedOdd(null);
      return;
    }

    setSelectedOdd({ market, odds, label });
    setStakeSuccess(null);
    setStakeAmountInput('15');

    onSelectOdds?.({
      matchId: activeMatch.id,
      matchTitle: `${activeMatch.homeTeam} vs ${activeMatch.awayTeam}`,
      market,
      odds
    });
  };

  const handlePlaceInlineStake = async () => {
    if (!selectedOdd || parsedStake < 15 || parsedStake > userBalance) return;

    const executeStake = async () => {
      setIsSubmittingStake(true);
      try {
        const success = await deductFunds(parsedStake);
        if (!success) {
          setIsSubmittingStake(false);
          return;
        }

        const potentialReturn = +(parsedStake * selectedOdd.odds).toFixed(2);
        onAddStake?.({
          matchTitle: `${activeMatch.homeTeam} vs ${activeMatch.awayTeam}`,
          market: selectedOdd.market,
          stakeAmount: parsedStake,
          odds: selectedOdd.odds,
          potentialPayout: potentialReturn,
          status: 'Ongoing',
          placedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        setStakeSuccess({
          message: 'Stake Placed Successfully!',
          potentialReturn,
          stakeAmount: parsedStake
        });
      } finally {
        setIsSubmittingStake(false);
      }
    };

    if (requireAuth) {
      requireAuth(executeStake);
    } else {
      await executeStake();
    }
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* 1. Breadcrumb Bar */}
      <div className="px-1 text-[11px] text-slate-500 font-medium flex items-center gap-1 truncate">
        <span className="text-[#4169e1] hover:underline cursor-pointer">Football</span>
        <span>▸</span>
        <span className="text-[#4169e1] hover:underline cursor-pointer">Europe</span>
        <span>▸</span>
        <span className="text-[#4169e1] hover:underline cursor-pointer">UEFA Nations League</span>
        <span>▸</span>
        <span className="truncate">
          {activeMatch.homeTeam} vs {activeMatch.awayTeam} live score, H2H results, standings and prediction
        </span>
      </div>

      {/* 2. Main Match Scoreboard Header Card (Flat border, no gradients) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        {/* Date / Time */}
        <div className="text-center mb-3">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {details.dateStr}
          </span>
        </div>

        {/* Teams & Score Row */}
        <div className="flex items-center justify-between px-2">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-slate-300 hover:text-amber-400 p-1 cursor-pointer transition-colors"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
            <div
              onClick={() => {
                const teamId = activeMatch.homeTeam.toLowerCase().replace(/[^a-z0-9]/g, '-');
                onOpenTeam?.(teamId);
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <img
                src={activeMatch.homeFlag}
                alt={activeMatch.homeTeam}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs group-hover:scale-105 transition-transform"
              />
              <span className="text-xs font-bold text-slate-900 mt-1.5 text-center group-hover:text-[#4169e1] transition-colors">
                {activeMatch.homeTeam}
              </span>
            </div>
          </div>

          {/* Score & Status */}
          <div className="flex flex-col items-center px-4 sm:px-6">
            {activeMatch.status === 'UPCOMING' ? (
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl font-black text-[#4169e1] tracking-tight flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span>{activeMatch.time}</span>
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  {activeMatch.day || 'Today'}
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Kickoff: {activeMatch.day || 'Today'} • {activeMatch.time} · Starts in {kickoffCountdown}</span>
                </span>
              </div>
            ) : (
              <>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {activeMatch.homeScore ?? 0} <span className="text-slate-400">-</span> {activeMatch.awayScore ?? 0}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  {activeMatch.day || 'Today'} • {activeMatch.time}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${
                  activeMatch.status === 'LIVE' ? 'text-rose-600 animate-pulse' : 'text-slate-500'
                }`}>
                  {activeMatch.status === 'FT' ? 'Finished' : activeMatch.status}
                </span>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 justify-start">
            <div
              onClick={() => {
                const teamId = activeMatch.awayTeam.toLowerCase().replace(/[^a-z0-9]/g, '-');
                onOpenTeam?.(teamId);
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <img
                src={activeMatch.awayFlag}
                alt={activeMatch.awayTeam}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs group-hover:scale-105 transition-transform"
              />
              <span className="text-xs font-bold text-slate-900 mt-1.5 text-center group-hover:text-[#4169e1] transition-colors">
                {activeMatch.awayTeam}
              </span>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-slate-300 hover:text-amber-400 p-1 cursor-pointer transition-colors"
            >
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Goal Scorers list directly below score */}
        {details.goalScorers.length > 0 && (
          <div className="flex flex-col items-center gap-1 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            {details.goalScorers.map((g, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-800">{g.name} {g.minute}&apos;</span>
                <span className="text-xs">⚽</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Tabs (Overview, Lineups, Statistics, Commentary) */}
        <div className="flex items-center justify-around mt-4 pt-2 border-t border-slate-100 text-xs">
          {(['overview', 'lineups', 'statistics', 'commentary'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`py-2 px-3 font-bold capitalize transition-all relative cursor-pointer ${
                activeTab === tab
                  ? 'text-[#4169e1] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-[#4169e1]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      {/* TAB A: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-3">
          {/* Full-time Odds Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-900">Full-time</span>
              <span className="text-[10px] font-black bg-[#174e2d] text-[#e8c043] px-2 py-0.5 rounded tracking-wider uppercase">
                BETWINNER
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleOddsClick(`${activeMatch.homeTeam} to Win`, displayOdds.home, '1')}
                className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all border ${
                  selectedOdd?.market === `${activeMatch.homeTeam} to Win` && selectedOdd?.odds === displayOdds.home
                    ? 'bg-blue-50 border-[#4169e1] ring-2 ring-[#4169e1]/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-blue-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={selectedOdd?.market === `${activeMatch.homeTeam} to Win` ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-semibold'}>1</span>
                <div className="flex items-center gap-1">
                  <span className="font-black text-slate-900">{displayOdds.home.toFixed(2)}</span>
                  <span className="text-[9px] text-rose-500 font-bold">▼</span>
                </div>
              </button>

              <button
                onClick={() => handleOddsClick('Draw', displayOdds.draw, 'X')}
                className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all border ${
                  selectedOdd?.market === 'Draw' && selectedOdd?.odds === displayOdds.draw
                    ? 'bg-blue-50 border-[#4169e1] ring-2 ring-[#4169e1]/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-blue-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={selectedOdd?.market === 'Draw' ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-semibold'}>X</span>
                <div className="flex items-center gap-1">
                  <span className="font-black text-slate-900">{displayOdds.draw.toFixed(2)}</span>
                  <span className="text-[9px] text-emerald-500 font-bold">▲</span>
                </div>
              </button>

              <button
                onClick={() => handleOddsClick(`${activeMatch.awayTeam} to Win`, displayOdds.away, '2')}
                className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all border ${
                  selectedOdd?.market === `${activeMatch.awayTeam} to Win` && selectedOdd?.odds === displayOdds.away
                    ? 'bg-blue-50 border-[#4169e1] ring-2 ring-[#4169e1]/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-blue-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={selectedOdd?.market === `${activeMatch.awayTeam} to Win` ? 'text-[#4169e1] font-bold' : 'text-slate-500 font-semibold'}>2</span>
                <div className="flex items-center gap-1">
                  <span className="font-black text-slate-900">{displayOdds.away.toFixed(2)}</span>
                  <span className="text-[9px] text-emerald-500 font-bold">▲</span>
                </div>
              </button>
            </div>

            {/* Inline Quick Stake Panel - Smoothly grows in when an odd is clicked */}
            {selectedOdd && (
              <div className="mt-3 pt-3 border-t border-slate-100 transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
                  {/* Selected Odd Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 font-medium text-[11px] uppercase tracking-wider">Stake on:</span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {selectedOdd.market}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-[#4169e1] text-white text-[11px] font-black">
                        Odds {selectedOdd.odds.toFixed(2)}
                      </span>
                      <button
                        onClick={() => setSelectedOdd(null)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
                        title="Close stake"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {stakeSuccess ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold">{stakeSuccess.message}</p>
                          <p className="text-[11px] text-emerald-700">
                            Supposed Cash Out: ${stakeSuccess.potentialReturn.toFixed(2)} USD
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setStakeSuccess(null)}
                        className="text-emerald-700 text-xs font-bold underline cursor-pointer"
                      >
                        New Stake
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Stake Amount Input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <label>Stake Amount</label>
                          <span className="text-[11px] font-semibold text-slate-500">Min: $15.00</span>
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            min="15"
                            step="1"
                            value={stakeAmountInput}
                            onChange={(e) => setStakeAmountInput(e.target.value)}
                            placeholder="15"
                            className={`w-full pl-7 pr-16 py-2.5 rounded-xl border bg-white font-bold text-sm text-slate-900 outline-none transition-colors ${
                              isExceedingBalance || isBelowMin
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400'
                                : 'border-slate-300 focus:border-[#4169e1] focus:ring-1 focus:ring-[#4169e1]'
                            }`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            USD
                          </span>
                        </div>

                        {/* Quick Preset Chips */}
                        <div className="grid grid-cols-5 gap-1.5 pt-1">
                          {[15, 25, 50, 100].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setStakeAmountInput(String(preset))}
                              disabled={preset > userBalance || userBalance < 15}
                              className={`py-1 rounded-lg text-xs font-bold transition-all border ${
                                Number(stakeAmountInput) === preset
                                  ? 'bg-[#4169e1] text-white border-[#4169e1]'
                                  : preset > userBalance || userBalance < 15
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer'
                              }`}
                            >
                              ${preset}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setStakeAmountInput(String(Math.floor(userBalance)))}
                            disabled={userBalance < 15}
                            className="py-1 rounded-lg text-xs font-bold transition-all border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Max
                          </button>
                        </div>
                      </div>

                      {/* User Balance - Below the input */}
                      <div className="flex items-center justify-between text-xs py-1 border-t border-slate-200/70">
                        <span className="text-slate-500 font-medium">
                          Your Available Balance:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">
                            ${userBalance.toFixed(2)} USD
                          </span>
                          {userBalance < 15 && (
                            <button
                              type="button"
                              onClick={() => setShowDepositModal(true)}
                              className="text-[11px] font-bold text-[#4169e1] hover:underline cursor-pointer"
                            >
                              Deposit
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Validation Warnings */}
                      {isBelowMin && (
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Minimum stake allowed is $15.00 USD.</span>
                        </div>
                      )}

                      {isExceedingBalance && !isBelowMin && (
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Stake cannot exceed your available balance (${userBalance.toFixed(2)} USD).</span>
                        </div>
                      )}

                      {/* Preview of Supposed Cash Out */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                        <div>
                          <span className="text-slate-500 block text-[11px] font-medium">
                            Supposed Cash Out (If Win)
                          </span>
                          <span className="text-base font-black text-emerald-700">
                            ${potentialCashOut.toFixed(2)} USD
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-500 block text-[11px] font-medium">
                            Net Profit
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            +${estimatedProfit > 0 ? estimatedProfit.toFixed(2) : '0.00'} USD
                          </span>
                        </div>
                      </div>

                      {/* Action Button: Place Stake or Deposit */}
                      {userBalance < 15 ? (
                        <button
                          type="button"
                          onClick={() => setShowDepositModal(true)}
                          className="w-full py-2.5 px-4 bg-[#4169e1] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Deposit Funds to Stake (Balance: ${userBalance.toFixed(2)})</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePlaceInlineStake}
                          disabled={isBelowMin || isExceedingBalance || isSubmittingStake}
                          className="w-full py-2.5 px-4 bg-[#4169e1] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <span>
                            {isSubmittingStake
                              ? 'Placing Stake...'
                              : isBelowMin
                              ? 'Minimum Stake is $15.00'
                              : isExceedingBalance
                              ? `Cannot Exceed Balance ($${userBalance.toFixed(2)})`
                              : `Place $${(parsedStake || 15).toFixed(2)} Stake`}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Additional Odds Toggle */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 text-center">
              <button
                onClick={() => setShowAdditionalOdds(!showAdditionalOdds)}
                className="text-xs font-semibold text-[#4169e1] hover:underline cursor-pointer"
              >
                {showAdditionalOdds ? 'Hide additional odds' : 'Additional odds ▾'}
              </button>

              {showAdditionalOdds && liveMarkets.length > 0 && (
                <div className="mt-2.5 flex flex-col gap-2 text-left">
                  {liveMarkets.map((market, mIdx) => (
                    <div key={mIdx} className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-800 block mb-1.5">{market.marketName}</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {market.choices.map((c, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleOddsClick(`${market.marketName} - ${c.name}`, c.decimal, c.name)}
                            className={`px-2 py-1 rounded text-xs flex justify-between cursor-pointer border transition-colors ${
                              selectedOdd?.market === `${market.marketName} - ${c.name}` && selectedOdd?.odds === c.decimal
                                ? 'bg-blue-50 border-[#4169e1] ring-1 ring-[#4169e1]'
                                : 'bg-white hover:bg-blue-50 border-slate-200'
                            }`}
                          >
                            <span className="text-slate-600 truncate">{c.name}</span>
                            <span className="font-bold text-slate-900 ml-1">{c.decimal.toFixed(2)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Real Match Momentum Chart */}
          <MatchMomentumChart
            momentum={details.momentum}
            homeFlag={activeMatch.homeFlag}
            awayFlag={activeMatch.awayFlag}
            homeTeam={activeMatch.homeTeam}
            awayTeam={activeMatch.awayTeam}
          />

          {/* Real Player of the Match Card */}
          <PlayerOfTheMatchCard playerData={details.playerOfTheMatch} />

          {/* Stats Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col gap-2.5 select-none">
            <h4 className="text-xs font-bold text-slate-900 text-center">
              Stats
            </h4>

            {/* Ball possession */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[11px]">
                  {details.stats.possession[0]}%
                </span>
                <span className="text-slate-600 text-xs">Ball possession</span>
                <span className="px-2 py-0.5 rounded bg-[#4169e1] text-white text-[11px]">
                  {details.stats.possession[1]}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#4169e1] rounded-full overflow-hidden flex">
                <div style={{ width: `${details.stats.possession[0]}%` }} className="bg-emerald-500 h-full" />
              </div>
            </div>

            {/* Expected goals (xG) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-900">{details.stats.xG[0].toFixed(2)}</span>
                <span className="text-slate-600 text-[11px]">Expected goals (xG)</span>
                <span className="text-slate-900">{details.stats.xG[1].toFixed(2)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div style={{ width: `${(details.stats.xG[0] / (details.stats.xG[0] + details.stats.xG[1] || 1)) * 100}%` }} className="bg-emerald-500 h-full" />
              </div>
            </div>

            {/* Big chances */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-900">{details.stats.bigChances[0]}</span>
                <span className="text-slate-600 text-[11px]">Big chances</span>
                <span className="text-slate-900">{details.stats.bigChances[1]}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div style={{ width: `${(details.stats.bigChances[0] / (details.stats.bigChances[0] + details.stats.bigChances[1] || 1)) * 100}%` }} className="bg-emerald-500 h-full" />
              </div>
            </div>

            <button
              onClick={() => handleTabClick('statistics')}
              className="text-xs font-bold text-[#4169e1] hover:underline text-center pt-2 border-t border-slate-100 cursor-pointer"
            >
              View all statistics &gt;
            </button>
          </div>

          {/* Real Match Events Timeline */}
          <MatchEventsTimeline
            events={details.events}
            score={`${activeMatch.homeScore ?? 0} - ${activeMatch.awayScore ?? 0}`}
          />
        </div>
      )}

      {/* TAB B: LINEUPS */}
      {activeTab === 'lineups' && (
        <SoccerPitchLineup
          details={details}
          homeTeamName={activeMatch.homeTeam}
          awayTeamName={activeMatch.awayTeam}
          homeFlag={activeMatch.homeFlag}
          awayFlag={activeMatch.awayFlag}
        />
      )}

      {/* TAB C: STATISTICS */}
      {activeTab === 'statistics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3.5 select-none">
          <h4 className="text-xs font-bold text-slate-900 text-center pb-2 border-b border-slate-100">
            Full Match Statistics
          </h4>

          {[
            { label: 'Ball Possession', home: `${details.stats.possession[0]}%`, away: `${details.stats.possession[1]}%`, homeVal: details.stats.possession[0], awayVal: details.stats.possession[1] },
            { label: 'Expected Goals (xG)', home: details.stats.xG[0].toFixed(2), away: details.stats.xG[1].toFixed(2), homeVal: details.stats.xG[0], awayVal: details.stats.xG[1] },
            { label: 'Total Shots', home: details.stats.totalShots[0], away: details.stats.totalShots[1], homeVal: details.stats.totalShots[0], awayVal: details.stats.totalShots[1] },
            { label: 'Shots on Target', home: details.stats.shotsOnTarget[0], away: details.stats.shotsOnTarget[1], homeVal: details.stats.shotsOnTarget[0], awayVal: details.stats.shotsOnTarget[1] },
            { label: 'Big Chances', home: details.stats.bigChances[0], away: details.stats.bigChances[1], homeVal: details.stats.bigChances[0], awayVal: details.stats.bigChances[1] },
            { label: 'Corner Kicks', home: details.stats.corners[0], away: details.stats.corners[1], homeVal: details.stats.corners[0], awayVal: details.stats.corners[1] },
            { label: 'Fouls', home: details.stats.fouls[0], away: details.stats.fouls[1], homeVal: details.stats.fouls[0], awayVal: details.stats.fouls[1] },
            { label: 'Passes', home: details.stats.passes[0], away: details.stats.passes[1], homeVal: details.stats.passes[0], awayVal: details.stats.passes[1] },
            { label: 'Yellow Cards', home: details.stats.yellowCards[0], away: details.stats.yellowCards[1], homeVal: details.stats.yellowCards[0], awayVal: details.stats.yellowCards[1] }
          ].map((stat, i) => {
            const total = (Number(stat.homeVal) || 0) + (Number(stat.awayVal) || 0) || 1;
            const homePct = (Number(stat.homeVal) / total) * 100;
            return (
              <div key={i} className="flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900">{stat.home}</span>
                  <span className="text-slate-600 font-medium text-[11px]">{stat.label}</span>
                  <span className="text-slate-900">{stat.away}</span>
                </div>
                <div className="w-full h-1.5 bg-[#4169e1] rounded-full overflow-hidden flex">
                  <div style={{ width: `${homePct}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB D: COMMENTARY */}
      {activeTab === 'commentary' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3 select-none text-xs">
          <h4 className="font-bold text-slate-900 text-center pb-2 border-b border-slate-100 flex items-center justify-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#4169e1]" />
            Live Match Commentary
          </h4>

          <div className="flex flex-col divide-y divide-slate-100">
            {details.commentary.map((c, i) => (
              <div key={i} className="py-2.5 flex items-start gap-2.5">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[11px] min-w-[32px] text-center">
                  {c.minute}&apos;
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paystack Deposit Modal if user needs to top up */}
      <PaystackDepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
};
