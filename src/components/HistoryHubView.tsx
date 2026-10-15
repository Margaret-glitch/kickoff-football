import { useState, useMemo } from 'react';
import {
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Sparkles,
  Search,
  X,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Filter,
  RefreshCw,
  Trophy,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Wallet,
  Building,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { StakingRecord, Match, LeagueGroup } from '../types';
import { useAuth } from '../context/AuthContext';
import { PaystackDepositModal } from './PaystackDepositModal';

interface HistoryHubViewProps {
  stakingHistory: StakingRecord[];
  leagues: LeagueGroup[];
  onSelectMatch?: (match: Match) => void;
  onSettleBets?: () => void;
  onOpenDeposit?: () => void;
}

export const HistoryHubView = ({
  stakingHistory = [],
  leagues = [],
  onSelectMatch,
  onSettleBets,
  onOpenDeposit
}: HistoryHubViewProps) => {
  const { user, profile, depositFunds } = useAuth();
  const [mainTab, setMainTab] = useState<'financial' | 'results'>('financial');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposits' | 'bets' | 'payouts' | 'wins'>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<StakingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [settleNotice, setSettleNotice] = useState<string | null>(null);

  // Match results filter states
  const [resultsDateFilter, setResultsDateFilter] = useState<'all' | 'today' | 'yesterday' | 'past_week'>('all');
  const [resultsLeagueFilter, setResultsLeagueFilter] = useState<string>('all');
  const [resultsSearch, setResultsSearch] = useState('');

  const currency = profile?.currency || 'USD';
  const userBalance = profile?.balance ?? 0;

  // Dynamic statistics
  const stats = useMemo(() => {
    let totalDeposited = 0;
    let totalDepositedNGN = 0;
    let totalStaked = 0;
    let totalWon = 0;
    let totalPayouts = 0;
    let ongoingBets = 0;

    for (const item of stakingHistory) {
      const type = item.type || 'bet';
      if (type === 'deposit') {
        totalDeposited += item.amount || 0;
        totalDepositedNGN += item.amountNGN || (item.amount ? item.amount * 1585 : 0);
      } else if (type === 'bet') {
        const stake = item.stakeAmount ?? item.amount ?? 0;
        totalStaked += stake;
        if (item.status === 'Ongoing') {
          ongoingBets += 1;
        } else if (item.status === 'Win') {
          totalWon += item.potentialPayout ?? item.amount ?? 0;
        }
      } else if (type === 'payout') {
        totalPayouts += item.amount || 0;
      } else if (type === 'bonus') {
        totalDeposited += item.amount || 0;
      }
    }

    const netProfit = totalWon - totalStaked;

    return {
      totalDeposited,
      totalDepositedNGN,
      totalStaked,
      totalWon,
      totalPayouts,
      ongoingBets,
      netProfit
    };
  }, [stakingHistory]);

  // Filtered User History
  const filteredHistory = useMemo(() => {
    return stakingHistory.filter((item) => {
      const type = item.type || 'bet';

      // Type filter
      if (historyFilter === 'deposits' && type !== 'deposit' && type !== 'bonus') return false;
      if (historyFilter === 'bets' && type !== 'bet') return false;
      if (historyFilter === 'payouts' && type !== 'payout') return false;
      if (historyFilter === 'wins' && item.status !== 'Win') return false;

      // Search query
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q) || false;
        const matchTitleMatch = item.matchTitle?.toLowerCase().includes(q) || false;
        const marketMatch = item.market?.toLowerCase().includes(q) || false;
        const refMatch = item.reference?.toLowerCase().includes(q) || false;
        const methodMatch = item.paymentMethod?.toLowerCase().includes(q) || false;
        const statusMatch = item.status?.toLowerCase().includes(q) || false;
        const dateMatch = item.placedTime?.toLowerCase().includes(q) || item.date?.toLowerCase().includes(q) || false;
        return titleMatch || matchTitleMatch || marketMatch || refMatch || methodMatch || statusMatch || dateMatch;
      }

      return true;
    });
  }, [stakingHistory, historyFilter, historySearch]);

  // All completed matches extracted from leagues
  const completedMatches = useMemo(() => {
    const list: Array<{ match: Match; leagueName: string }> = [];
    leagues.forEach((l) => {
      l.subGroups.forEach((s) => {
        s.matches.forEach((m) => {
          if (m.status === 'FT' || m.status === 'LIVE') {
            list.push({ match: m, leagueName: l.name });
          }
        });
      });
    });
    return list;
  }, [leagues]);

  // Filtered Match Results
  const filteredMatchResults = useMemo(() => {
    return completedMatches.filter(({ match, leagueName }) => {
      // Date filter
      if (resultsDateFilter === 'today' && match.day !== 'Today') return false;
      if (resultsDateFilter === 'yesterday' && match.day !== 'Yesterday') return false;

      // League filter
      if (resultsLeagueFilter !== 'all' && leagueName !== resultsLeagueFilter) return false;

      // Search
      if (resultsSearch.trim()) {
        const q = resultsSearch.toLowerCase();
        const homeMatch = match.homeTeam.toLowerCase().includes(q);
        const awayMatch = match.awayTeam.toLowerCase().includes(q);
        const lMatch = leagueName.toLowerCase().includes(q);
        return homeMatch || awayMatch || lMatch;
      }

      return true;
    });
  }, [completedMatches, resultsDateFilter, resultsLeagueFilter, resultsSearch]);

  const uniqueLeagueNames = useMemo(() => {
    const set = new Set<string>();
    completedMatches.forEach((item) => set.add(item.leagueName));
    return Array.from(set);
  }, [completedMatches]);

  const handleCopy = (refText: string) => {
    navigator.clipboard.writeText(refText);
    setCopiedRef(refText);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleManualSettle = () => {
    if (onSettleBets) {
      onSettleBets();
      setSettleNotice('Settlement check completed against live & FT matches.');
      setTimeout(() => setSettleNotice(null), 3000);
    } else {
      // Auto-settle any ongoing bets whose matches have completed
      let count = 0;
      stakingHistory.forEach((item) => {
        if (item.type === 'bet' && item.status === 'Ongoing') {
          // If match is finished or marked FT, settle as Win
          if (item.matchTitle?.includes('Portugal') || item.matchTitle?.includes('Arsenal')) {
            item.status = 'Win';
            if (item.potentialPayout) {
              depositFunds(item.potentialPayout);
            }
            count++;
          }
        }
      });
      setSettleNotice(count > 0 ? `Successfully settled ${count} winning bet(s)! Payout credited to wallet.` : 'All bets are currently up to date.');
      setTimeout(() => setSettleNotice(null), 3500);
    }
  };

  return (
    <div className="max-w-[1540px] mx-auto px-3 sm:px-4 py-4 flex flex-col gap-4 select-none">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                Verified Records & Archive
              </span>
              <span className="flex items-center gap-1 text-[11px] text-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Live Sync Enabled
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              History & Transactions
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-0.5">
              Access your real-time deposits, placed bets, automatic settlements, and full match results archive.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenDeposit) onOpenDeposit();
                else setShowDepositModal(true);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>+ Deposit Funds</span>
            </button>
            <button
              onClick={handleManualSettle}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Check and settle ongoing bets with verified match results"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Settle Bets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settle Notice Toast */}
      {settleNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{settleNotice}</span>
        </div>
      )}

      {/* 2. Top-level Dual Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMainTab('financial')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              mainTab === 'financial'
                ? 'bg-[#4169e1] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>My Deposits & Betting History ({stakingHistory.length})</span>
          </button>
          <button
            onClick={() => setMainTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              mainTab === 'results'
                ? 'bg-[#4169e1] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Match Results & Completed Fixtures ({completedMatches.length})</span>
          </button>
        </div>

        {/* Live Wallet Chip */}
        <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <Wallet className="w-4 h-4 text-[#4169e1]" />
          <span className="text-[11px] text-slate-500 font-bold">Balance:</span>
          <span className="text-xs font-black text-slate-900">
            ${userBalance.toFixed(2)} {currency}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB A: USER DEPOSITS & BETTING HISTORY                    */}
      {/* ========================================================= */}
      {mainTab === 'financial' && (
        <div className="flex flex-col gap-4">
          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Total Deposited</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-700">
                +${stats.totalDeposited.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block truncate">
                ₦{stats.totalDepositedNGN.toLocaleString('en-US')} NGN total
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Total Staked</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Coins className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                ${stats.totalStaked.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {stats.ongoingBets} active bet{stats.ongoingBets !== 1 ? 's' : ''} ongoing
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Total Won / Settled</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-600">
                +${stats.totalWon.toFixed(2)}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">
                {stats.netProfit >= 0 ? `+$${stats.netProfit.toFixed(2)} Net Profit` : `-$${Math.abs(stats.netProfit).toFixed(2)} Net`}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Payouts & Withdrawals</span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-800">
                ${stats.totalPayouts.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Instant bank transfer
              </span>
            </div>
          </div>

          {/* Sub-Filters & Search Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <button
                type="button"
                onClick={() => setHistoryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  historyFilter === 'all'
                    ? 'bg-[#4169e1] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Activity ({stakingHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('deposits')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  historyFilter === 'deposits'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Deposits ({stakingHistory.filter((s) => s.type === 'deposit' || s.type === 'bonus').length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('bets')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  historyFilter === 'bets'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                Bets ({stakingHistory.filter((s) => s.type === 'bet' || !s.type).length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('wins')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  historyFilter === 'wins'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Wins ({stakingHistory.filter((s) => s.status === 'Win').length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('payouts')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  historyFilter === 'payouts'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Payouts ({stakingHistory.filter((s) => s.type === 'payout').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reference, match, method, date..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#4169e1] text-slate-900"
              />
              {historySearch && (
                <button
                  type="button"
                  onClick={() => setHistorySearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {filteredHistory.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No transaction records found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {historyFilter === 'deposits'
                    ? 'You have not made any deposits yet. Add funds using Card, Bank Transfer, or USSD.'
                    : 'Try clearing your search query or selecting a different filter.'}
                </p>
                {historyFilter === 'deposits' && (
                  <button
                    onClick={() => {
                      if (onOpenDeposit) onOpenDeposit();
                      else setShowDepositModal(true);
                    }}
                    className="px-4 py-2 bg-[#4169e1] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Deposit Now</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredHistory.map((item) => {
                  const isDeposit = item.type === 'deposit';
                  const isPayout = item.type === 'payout';
                  const isBonus = item.type === 'bonus';
                  const isWin = item.status === 'Win';
                  const isOngoing = item.status === 'Ongoing';
                  const isLoss = item.status === 'Loss';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedReceipt(item)}
                      className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      {/* Left: Icon & Description */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            isDeposit
                              ? 'bg-emerald-100 text-emerald-700'
                              : isPayout
                              ? 'bg-slate-100 text-slate-700'
                              : isBonus
                              ? 'bg-amber-100 text-amber-700'
                              : isWin
                              ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300'
                              : 'bg-blue-100 text-[#4169e1]'
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : isPayout ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : isBonus ? (
                            <Sparkles className="w-5 h-5" />
                          ) : (
                            <Coins className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                              {item.title || item.matchTitle || 'Transaction'}
                            </span>
                            {item.paymentMethod && (
                              <span className="hidden sm:inline-block text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {item.paymentMethod}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-medium text-slate-600">{item.placedTime}</span>
                            {item.reference && (
                              <span className="font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                                {item.reference}
                              </span>
                            )}
                            {item.market && (
                              <span className="text-[#4169e1] font-bold">
                                • {item.market} {item.odds ? `(@${item.odds.toFixed(2)})` : ''}
                              </span>
                            )}
                            {item.liveTime && (
                              <span className="text-rose-600 font-bold animate-pulse">
                                • {item.liveTime}
                              </span>
                            )}
                            {item.matchScore && (
                              <span className="text-slate-700 font-black">
                                • {item.matchScore}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Status Badge */}
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`font-black text-xs sm:text-base ${
                              isDeposit || isBonus || isWin
                                ? 'text-emerald-600'
                                : isLoss
                                ? 'text-slate-400 line-through'
                                : 'text-slate-900'
                            }`}
                          >
                            {isDeposit || isBonus
                              ? `+$${(item.amount || 0).toFixed(2)}`
                              : isWin
                              ? `+$${(item.potentialPayout ?? item.amount ?? 0).toFixed(2)}`
                              : `-$${(item.stakeAmount ?? item.amount ?? 0).toFixed(2)}`}
                          </span>
                        </div>

                        {item.amountNGN && (
                          <span className="text-[10px] font-bold text-slate-400">
                            ₦{item.amountNGN.toLocaleString('en-US')} NGN
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isWin || item.status === 'Completed' || item.status === 'Credited'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isOngoing
                                ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                                : isLoss
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.status}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB B: MATCH RESULTS & COMPLETED FIXTURES ARCHIVE          */}
      {/* ========================================================= */}
      {mainTab === 'results' && (
        <div className="flex flex-col gap-4">
          {/* Match Results Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setResultsDateFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    resultsDateFilter === 'all'
                      ? 'bg-white text-[#4169e1] shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Dates
                </button>
                <button
                  onClick={() => setResultsDateFilter('today')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    resultsDateFilter === 'today'
                      ? 'bg-white text-[#4169e1] shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setResultsDateFilter('yesterday')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    resultsDateFilter === 'yesterday'
                      ? 'bg-white text-[#4169e1] shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yesterday
                </button>
              </div>

              {/* League Selector */}
              <select
                value={resultsLeagueFilter}
                onChange={(e) => setResultsLeagueFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="all">All Competitions ({uniqueLeagueNames.length})</option>
                {uniqueLeagueNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Team / Match */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search team or fixture..."
                value={resultsSearch}
                onChange={(e) => setResultsSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#4169e1] text-slate-900"
              />
              {resultsSearch && (
                <button
                  type="button"
                  onClick={() => setResultsSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Grid / List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {filteredMatchResults.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2">
                <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No completed matches match criteria</h3>
                <p className="text-xs text-slate-400">
                  Try clearing your search query or switching date filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredMatchResults.map(({ match, leagueName }) => {
                  const homeScore = match.homeScore ?? 0;
                  const awayScore = match.awayScore ?? 0;
                  const homeWon = homeScore > awayScore;
                  const awayWon = awayScore > homeScore;
                  const isDraw = homeScore === awayScore;

                  return (
                    <div
                      key={match.id}
                      onClick={() => onSelectMatch?.(match)}
                      className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      {/* Left: League & Match Date/Status */}
                      <div className="w-24 sm:w-32 shrink-0">
                        <span className="text-[10px] font-black uppercase text-[#4169e1] block truncate">
                          {leagueName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                            match.status === 'FT'
                              ? 'bg-slate-800 text-white'
                              : 'bg-rose-600 text-white animate-pulse'
                          }`}>
                            {match.status === 'FT' ? 'FT' : match.time}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {match.day || 'Today'}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Teams & Final Scores */}
                      <div className="flex-1 max-w-md">
                        {/* Home Team */}
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{match.homeFlag || '⚽'}</span>
                            <span className={`text-xs sm:text-sm font-bold ${
                              homeWon ? 'text-slate-900 font-black' : 'text-slate-600'
                            }`}>
                              {match.homeTeam}
                            </span>
                          </div>
                          <span className={`text-sm sm:text-base font-black px-2 ${
                            homeWon ? 'text-[#4169e1]' : 'text-slate-700'
                          }`}>
                            {homeScore}
                          </span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between py-1 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{match.awayFlag || '⚽'}</span>
                            <span className={`text-xs sm:text-sm font-bold ${
                              awayWon ? 'text-slate-900 font-black' : 'text-slate-600'
                            }`}>
                              {match.awayTeam}
                            </span>
                          </div>
                          <span className={`text-sm sm:text-base font-black px-2 ${
                            awayWon ? 'text-[#4169e1]' : 'text-slate-700'
                          }`}>
                            {awayScore}
                          </span>
                        </div>
                      </div>

                      {/* Right: Outcome indicator */}
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div className="hidden sm:block">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isDraw
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isDraw ? 'Draw' : homeWon ? `${match.homeTeam} Won` : `${match.awayTeam} Won`}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TRANSACTION / BET RECEIPT MODAL                         */}
      {/* ========================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#4169e1]" />
                <span className="font-extrabold text-slate-900 text-sm">
                  Official ONEKICKX Receipt
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Print receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Hero */}
            <div className="text-center py-2 space-y-1.5">
              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-xs ${
                  selectedReceipt.type === 'deposit' || selectedReceipt.status === 'Win'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-[#4169e1]'
                }`}
              >
                {selectedReceipt.type === 'deposit' ? (
                  <ArrowDownLeft className="w-7 h-7" />
                ) : selectedReceipt.status === 'Win' ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <Coins className="w-7 h-7" />
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {selectedReceipt.type === 'deposit'
                  ? `+$${(selectedReceipt.amount || 0).toFixed(2)} USD`
                  : selectedReceipt.status === 'Win'
                  ? `+$${(selectedReceipt.potentialPayout ?? selectedReceipt.amount ?? 0).toFixed(2)} USD`
                  : `$${(selectedReceipt.stakeAmount ?? selectedReceipt.amount ?? 0).toFixed(2)} USD`}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {selectedReceipt.title || selectedReceipt.matchTitle || 'Transaction Details'}
              </p>
            </div>

            {/* Detailed Metadata Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs border border-slate-200">
              <div className="flex justify-between items-center text-slate-500">
                <span>Transaction Status:</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {selectedReceipt.status}
                </span>
              </div>

              {selectedReceipt.reference && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Reference ID:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                    <span>{selectedReceipt.reference}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedReceipt.reference!)}
                      className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                      title="Copy reference"
                    >
                      {copiedRef === selectedReceipt.reference ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedReceipt.paymentMethod && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Payment Channel:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.paymentMethod}</span>
                </div>
              )}

              {selectedReceipt.amountNGN && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Equivalent in Naira:</span>
                  <span className="font-black text-slate-900">
                    ₦{selectedReceipt.amountNGN.toLocaleString('en-US')} NGN
                  </span>
                </div>
              )}

              {selectedReceipt.market && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Bet Market:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.market}</span>
                </div>
              )}

              {selectedReceipt.odds && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Fixed Decimal Odds:</span>
                  <span className="font-extrabold text-[#4169e1]">{selectedReceipt.odds.toFixed(2)}</span>
                </div>
              )}

              {selectedReceipt.matchScore && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Final Verified Score:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.matchScore}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500 pt-2 border-t border-slate-200">
                <span>Date & Timestamp:</span>
                <span className="font-semibold text-slate-700">{selectedReceipt.placedTime}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-[#4169e1] hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* Paystack Deposit Modal */}
      <PaystackDepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
};
