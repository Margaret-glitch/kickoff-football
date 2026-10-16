import { useState, useMemo } from 'react';
import {
  User,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  LogOut,
  Sparkles,
  Search,
  Copy,
  Check,
  Receipt
} from 'lucide-react';
import { StakingRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from './AuthForm';
import { PaystackDepositModal } from './PaystackDepositModal';

interface ProfileViewProps {
  stakingHistory?: StakingRecord[];
  onClose?: () => void;
  isModal?: boolean;
}

interface PayoutAccount {
  id: string;
  type: 'bank' | 'crypto' | 'card';
  title: string;
  detail: string;
  isDefault: boolean;
}

export const ProfileView = ({
  stakingHistory = [],
  onClose,
  isModal = false
}: ProfileViewProps) => {
  const { user, profile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'history' | 'security'>('overview');
  const [currency, setCurrency] = useState(profile?.currency || 'USD');
  const [dailyLimit, setDailyLimit] = useState(2500);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // History filtering & search
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposits' | 'bets' | 'payouts'>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<StakingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Dynamic statistics calculations
  const stats = useMemo(() => {
    let totalDeposited = 0;
    let totalWon = 0;
    let activeStakes = 0;
    let totalStaked = 0;
    let totalPayouts = 0;

    for (const item of stakingHistory) {
      const type = item.type || 'bet';
      if (type === 'deposit') {
        totalDeposited += item.amount || 0;
      } else if (type === 'bet') {
        const stake = item.stakeAmount ?? item.amount ?? 0;
        totalStaked += stake;
        if (item.status === 'Ongoing') {
          activeStakes += stake;
        } else if (item.status === 'Win') {
          totalWon += item.potentialPayout ?? item.amount ?? 0;
        }
      } else if (type === 'payout') {
        totalPayouts += item.amount || 0;
      } else if (type === 'bonus') {
        totalDeposited += item.amount || 0;
      }
    }

    return {
      totalDeposited,
      totalWon,
      activeStakes,
      totalStaked,
      totalPayouts
    };
  }, [stakingHistory]);

  const handleCopy = (refText: string) => {
    navigator.clipboard.writeText(refText);
    setCopiedRef(refText);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  // Filtered history list
  const filteredHistory = useMemo(() => {
    return stakingHistory.filter((item) => {
      const type = item.type || 'bet';

      // Type filter
      if (historyFilter === 'deposits' && type !== 'deposit' && type !== 'bonus') return false;
      if (historyFilter === 'bets' && type !== 'bet') return false;
      if (historyFilter === 'payouts' && type !== 'payout') return false;

      // Search query
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q) || false;
        const matchTitleMatch = item.matchTitle?.toLowerCase().includes(q) || false;
        const marketMatch = item.market?.toLowerCase().includes(q) || false;
        const refMatch = item.reference?.toLowerCase().includes(q) || false;
        const methodMatch = item.paymentMethod?.toLowerCase().includes(q) || false;
        const statusMatch = item.status?.toLowerCase().includes(q) || false;
        return titleMatch || matchTitleMatch || marketMatch || refMatch || methodMatch || statusMatch;
      }

      return true;
    });
  }, [stakingHistory, historyFilter, historySearch]);

  const [showInlineAuth, setShowInlineAuth] = useState(false);

  // Base payout accounts including the user's Breacher onboarded bank details
  const initialPayouts: PayoutAccount[] = [
    {
      id: 'pa-user-primary',
      type: 'bank',
      title: profile?.bankName ? `${profile.bankName} (Primary)` : 'Access Bank (Auto-Settlement)',
      detail: profile?.accountNumber
        ? `•••• ${profile.accountNumber.slice(-4)} (${profile.accountName || user?.name || 'Account Holder'})`
        : '•••• 7102 (Default Payout Account)',
      isDefault: true
    }
  ];

  const payoutAccountsList: PayoutAccount[] = initialPayouts;
  const userBalance = profile?.balance ?? 0;

  return (
    <div className={`flex flex-col gap-4 text-slate-800 select-none ${isModal ? 'p-4' : 'p-2 sm:p-3'}`}>
      {/* Top Header Card */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#4169e1] text-white flex items-center justify-center font-black text-xl shadow-xs">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900">
                {profile?.name || user?.name || 'ONEKICKX Player'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                user
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-blue-100 text-[#4169e1] border-blue-200'
              }`}>
                {user ? 'Verified' : 'Player Mode'}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {profile?.email || user?.email || 'Active Wallet Session'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-400 transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowInlineAuth(!showInlineAuth)}
              className="px-2.5 py-1.5 bg-[#4169e1] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{showInlineAuth ? 'Close Auth' : 'Sign In'}</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Guest Account Sign-in Promo Banner */}
      {!user && showInlineAuth && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm animate-in fade-in">
          <AuthForm
            title="Sign in or Create Account"
            onSuccess={() => setShowInlineAuth(false)}
          />
        </div>
      )}


      {/* Available Balance Summary */}
      <div className="py-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Total Available Balance
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Instant Withdrawal Ready
          </span>
        </div>

        <div className="text-3xl font-black tracking-tight text-slate-900">
          ${userBalance.toFixed(2)} <span className="text-sm font-bold text-slate-400">{currency}</span>
        </div>

        {/* Dynamic 3-Column Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
          <div className="flex flex-col p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <CreditCard className="w-3 h-3 text-[#4169e1]" />
              <span>Deposited</span>
            </div>
            <span className="font-extrabold text-slate-900 text-sm">
              ${stats.totalDeposited.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mb-0.5">
              <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
              <span>Total Won</span>
            </div>
            <span className="font-extrabold text-emerald-700 text-sm">
              +${stats.totalWon.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Coins className="w-3 h-3 text-amber-500" />
              <span>In-Play</span>
            </div>
            <span className="font-extrabold text-slate-900 text-sm">
              ${stats.activeStakes.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Instant Deposit Button */}
        <button
          onClick={() => setShowDepositModal(true)}
          className="w-full mt-1 py-2.5 px-4 bg-[#4169e1] hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Deposit Funds (Card, Bank Transfer, USSD)</span>
        </button>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-white text-[#4169e1] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'history' ? 'bg-white text-[#4169e1] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          History & Deposits ({stakingHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'payouts' ? 'bg-white text-[#4169e1] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Payouts
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'security' ? 'bg-white text-[#4169e1] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Limits
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-3 text-xs">
          {/* Default Payout Method */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Primary Payout Method</span>
              <button
                onClick={() => setActiveTab('payouts')}
                className="text-[#4169e1] font-bold text-[11px] hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>
            {payoutAccountsList.find((a) => a.isDefault) ? (
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <Building className="w-5 h-5 text-[#4169e1]" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900 block truncate">
                    {payoutAccountsList.find((a) => a.isDefault)?.title}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {payoutAccountsList.find((a) => a.isDefault)?.detail}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('payouts')}
                className="p-3 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400 hover:text-slate-600 hover:border-slate-300 font-medium cursor-pointer"
              >
                + Add Bank Account for Payouts
              </button>
            )}
          </div>

          {/* Quick Recent Activity Teaser */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Recent Activity</span>
              <button
                onClick={() => setActiveTab('history')}
                className="text-[#4169e1] font-bold text-[11px] hover:underline cursor-pointer"
              >
                View All ({stakingHistory.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {stakingHistory.slice(0, 3).map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === 'deposit'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.type === 'payout'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.type === 'deposit' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : item.type === 'payout' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <Coins className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block truncate max-w-[140px] sm:max-w-[200px]">
                        {item.matchTitle || item.title || 'Transaction'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.placedTime}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-black block ${
                      item.type === 'deposit' || item.status === 'Win'
                        ? 'text-emerald-600'
                        : 'text-slate-900'
                    }`}>
                      {item.type === 'deposit'
                        ? `+$${(item.amount || 0).toFixed(2)}`
                        : `$${(item.stakeAmount ?? item.amount ?? 0).toFixed(2)}`}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-1 py-0.2 rounded ${
                      item.status === 'Win' || item.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Ongoing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RICH COMPLETE HISTORY & DEPOSITS */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-3 text-xs">
          {/* Top Sub-Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setHistoryFilter('all')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                historyFilter === 'all'
                  ? 'bg-[#4169e1] text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Activity ({stakingHistory.length})
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('deposits')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                historyFilter === 'deposits'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Deposits ({stakingHistory.filter((s) => s.type === 'deposit' || s.type === 'bonus').length})
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('bets')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                historyFilter === 'bets'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Bets ({stakingHistory.filter((s) => s.type === 'bet' || !s.type).length})
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('payouts')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                historyFilter === 'payouts'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Payouts ({stakingHistory.filter((s) => s.type === 'payout').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by reference, match, payment method or status..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#4169e1] text-slate-900"
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

          {/* History List */}
          <div className="flex flex-col divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-2xs">
            {filteredHistory.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">No records found</p>
                <p className="text-[11px] text-slate-400">
                  {historyFilter === 'deposits'
                    ? 'No deposits recorded yet. Top up your wallet using Card, Transfer or USSD.'
                    : 'Try clearing your search filter.'}
                </p>
                {historyFilter === 'deposits' && (
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="mt-2 px-4 py-1.5 bg-[#4169e1] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Deposit Funds Now
                  </button>
                )}
              </div>
            ) : (
              filteredHistory.map((item) => {
                const isDeposit = item.type === 'deposit';
                const isPayout = item.type === 'payout';
                const isBonus = item.type === 'bonus';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReceipt(item)}
                    className="py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    {/* Icon + Main Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isDeposit
                          ? 'bg-emerald-100 text-emerald-700'
                          : isPayout
                          ? 'bg-slate-100 text-slate-700'
                          : isBonus
                          ? 'bg-amber-100 text-amber-700'
                          : item.status === 'Win'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-[#4169e1]'
                      }`}>
                        {isDeposit ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : isPayout ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : isBonus ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <Coins className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate block text-xs">
                            {item.matchTitle || item.title || 'Transaction'}
                          </span>
                          {item.paymentMethod && (
                            <span className="hidden sm:inline-block text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {item.paymentMethod.split(' ')[0]}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{item.placedTime}</span>
                          {item.reference && (
                            <span className="font-mono text-slate-500 bg-slate-100 px-1 rounded truncate max-w-[100px]">
                              {item.reference}
                            </span>
                          )}
                          {item.market && <span>• {item.market}</span>}
                          {item.liveTime && <span className="text-rose-500 font-bold">• {item.liveTime}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Amount & Status Badge */}
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className={`font-black text-xs sm:text-sm ${
                          isDeposit || isBonus || item.status === 'Win'
                            ? 'text-emerald-600'
                            : 'text-slate-900'
                        }`}>
                          {isDeposit || isBonus
                            ? `+$${(item.amount || 0).toFixed(2)}`
                            : item.status === 'Win'
                            ? `+$${(item.potentialPayout ?? item.amount ?? 0).toFixed(2)}`
                            : `-$${(item.stakeAmount ?? item.amount ?? 0).toFixed(2)}`}
                        </span>
                      </div>

                      {item.amountNGN && (
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          ₦{item.amountNGN.toLocaleString('en-US')}
                        </span>
                      )}

                      <span className={`inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        item.status === 'Win' || item.status === 'Completed' || item.status === 'Credited'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Ongoing'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Loss'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Configured Payout Methods</span>
            <button
              onClick={() => setShowAddPayoutModal(true)}
              className="flex items-center gap-1 text-[#4169e1] font-bold hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Account</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {payoutAccountsList.map((acc) => (
              <div
                key={acc.id}
                className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#4169e1] flex items-center justify-center font-bold">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{acc.title}</span>
                      {acc.isDefault && (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">{acc.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-slate-700 text-xs flex flex-col gap-1">
            <span className="font-bold text-[#4169e1]">Instant Settlement Guarantee</span>
            <p className="text-[11px] text-slate-600">
              Approved winnings are credited to your destination bank account or card within seconds.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: LIMITS & PREFERENCES */}
      {activeTab === 'security' && (
        <div className="flex flex-col gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-3">
            <span className="font-bold text-slate-900">Preferences & Localization</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1 font-medium">Country / Region</label>
                <select
                  defaultValue="Nigeria"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 text-xs"
                >
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="Kenya">🇰🇪 Kenya</option>
                  <option value="South Africa">🇿🇦 South Africa</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1 font-medium">Display Language</label>
                <select
                  defaultValue="English"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 text-xs"
                >
                  <option value="English">English</option>
                  <option value="Español">Español</option>
                  <option value="Français">Français</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Wallet Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                <option value="USD">USD ($)</option>
                <option value="NGN">NGN (₦)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2.5">
            <span className="font-bold text-slate-900">Responsible Gaming Limits</span>
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Daily Staking Limit</span>
                <span className="font-bold text-slate-900">${dailyLimit}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full accent-[#4169e1]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#4169e1]" />
                <span className="font-bold text-slate-900">Transaction Receipt</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                selectedReceipt.type === 'deposit' || selectedReceipt.status === 'Win'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-blue-100 text-[#4169e1]'
              }`}>
                {selectedReceipt.type === 'deposit' ? (
                  <ArrowDownLeft className="w-6 h-6" />
                ) : selectedReceipt.status === 'Win' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Coins className="w-6 h-6" />
                )}
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {selectedReceipt.type === 'deposit'
                  ? `+$${(selectedReceipt.amount || 0).toFixed(2)} USD`
                  : selectedReceipt.status === 'Win'
                  ? `+$${(selectedReceipt.potentialPayout ?? selectedReceipt.amount ?? 0).toFixed(2)} USD`
                  : `$${(selectedReceipt.stakeAmount ?? selectedReceipt.amount ?? 0).toFixed(2)} USD`}
              </h4>
              <p className="text-xs text-slate-500">
                {selectedReceipt.title || selectedReceipt.matchTitle || 'Transaction Details'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs border border-slate-200">
              <div className="flex justify-between items-center text-slate-500">
                <span>Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedReceipt.status}
                </span>
              </div>

              {selectedReceipt.reference && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Reference:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                    <span>{selectedReceipt.reference}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedReceipt.reference!)}
                      className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                      title="Copy reference"
                    >
                      {copiedRef === selectedReceipt.reference ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedReceipt.paymentMethod && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Method:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.paymentMethod}</span>
                </div>
              )}

              {selectedReceipt.amountNGN && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Amount in Naira:</span>
                  <span className="font-bold text-slate-800">
                    ₦{selectedReceipt.amountNGN.toLocaleString('en-US')} NGN
                  </span>
                </div>
              )}

              {selectedReceipt.market && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Market:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.market}</span>
                </div>
              )}

              {selectedReceipt.odds && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Odds:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.odds.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200">
                <span>Date & Time:</span>
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
