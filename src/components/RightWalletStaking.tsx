import { useState } from 'react';
import {
  Wallet,
  Coins,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowDownLeft,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StakingRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { PaystackDepositModal } from './PaystackDepositModal';

interface RightWalletStakingProps {
  stakingHistory?: StakingRecord[];
  onAddStake?: (stake: Omit<StakingRecord, 'id'>) => void;
  activeSelection?: {
    matchTitle: string;
    market: string;
    odds: number;
  } | null;
  onClearActiveSelection?: () => void;
  onRequireAuth?: (action: () => void) => void;
}

export const RightWalletStaking = ({
  stakingHistory = [],
  onAddStake,
  activeSelection,
  onClearActiveSelection,
  onRequireAuth
}: RightWalletStakingProps) => {
  const navigate = useNavigate();
  const { user, profile, requireAuth } = useAuth();

  const [activeTab, setActiveTab] = useState<'betslip' | 'history'>('betslip');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'bets' | 'deposits'>('all');
  const [stakeAmount, setStakeAmount] = useState<number>(50);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const userBalance = profile?.balance ?? 0;
  const currency = profile?.currency || 'USD';

  // Fallback demo selection if none clicked yet
  const selection = activeSelection || {
    matchTitle: 'Germany vs Serbia',
    market: 'Germany to Win (1X2)',
    odds: 1.18
  };

  const potentialReturn = +(stakeAmount * selection.odds).toFixed(2);
  const totalProfit = +(potentialReturn - stakeAmount).toFixed(2);

  const handlePlaceBet = () => {
    if (stakeAmount <= 0) return;

    const executeBet = () => {
      onAddStake?.({
        matchTitle: selection.matchTitle,
        market: selection.market,
        stakeAmount,
        odds: selection.odds,
        potentialPayout: potentialReturn,
        status: 'Ongoing',
        placedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClearActiveSelection?.();
      }, 2000);
    };

    if (onRequireAuth) {
      onRequireAuth(executeBet);
    } else {
      requireAuth(executeBet);
    }
  };

  const handleDepositClick = () => {
    setShowDepositModal(true);
  };

  const handlePayoutClick = () => {
    const execute = () => {
      // triggered when authenticated
    };
    if (onRequireAuth) {
      onRequireAuth(execute);
    } else {
      requireAuth(execute);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 select-none">
      {/* 1. Wallet Balance Header (Flat royal blue, zero gradients) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4169e1] text-white flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Wallet
              </span>
              <span className="text-base font-black text-slate-900">
                ${userBalance.toFixed(2)}{' '}
                <span className="text-xs text-slate-400">{currency}</span>
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {user ? 'Verified' : 'Player'}
          </span>
        </div>

        {/* Quick action buttons (Gated with auth) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleDepositClick}
            className="py-2 px-3 bg-[#4169e1] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </button>
          <button
            onClick={handlePayoutClick}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Payout</span>
          </button>
        </div>
      </div>

      {/* 2. Betting Slip & Live Staking Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-3">
        {/* Tab switch */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('betslip')}
              className={`pb-1 cursor-pointer transition-colors ${
                activeTab === 'betslip' ? 'text-[#4169e1] border-b-2 border-[#4169e1]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Live Betslip
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-1 cursor-pointer transition-colors ${
                activeTab === 'history' ? 'text-[#4169e1] border-b-2 border-[#4169e1]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Activity ({stakingHistory.length})
            </button>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Single</span>
        </div>

        {activeTab === 'betslip' ? (
          <div className="flex flex-col gap-3">
            {/* Active match selection card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5 relative">
              {activeSelection && (
                <button
                  onClick={onClearActiveSelection}
                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 cursor-pointer"
                  title="Remove selection"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {selection.matchTitle}
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{selection.market}</span>
                <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-100 text-emerald-800">
                  {selection.odds.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Stake Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Stake Amount</span>
                <span>Min: $15.00</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="15"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(0, Number(e.target.value)))}
                  className={`w-full pl-7 pr-3 py-2 bg-slate-50 border rounded-xl font-bold text-xs text-slate-900 focus:bg-white focus:outline-none ${
                    user && (stakeAmount > userBalance || stakeAmount < 15)
                      ? 'border-rose-400 focus:ring-1 focus:ring-rose-400'
                      : 'border-slate-200 focus:ring-2 focus:ring-[#4169e1]'
                  }`}
                />
              </div>

              {/* Quick stake pills */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[15, 50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setStakeAmount(amt)}
                    disabled={user ? amt > userBalance : false}
                    className={`py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      stakeAmount === amt
                        ? 'bg-[#4169e1] text-white'
                        : user && amt > userBalance
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    +${amt}
                  </button>
                ))}
              </div>

              {user && stakeAmount > userBalance && (
                <span className="text-[11px] text-rose-600 font-bold">
                  Exceeds balance (${userBalance.toFixed(2)})
                </span>
              )}
              {stakeAmount < 15 && (
                <span className="text-[11px] text-rose-600 font-bold">
                  Minimum stake is $15.00
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Est. Profit</span>
                <span className="text-emerald-700 font-bold">+${totalProfit}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm">
                <span>Total Return</span>
                <span className="text-[#4169e1] font-black">${potentialReturn}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePlaceBet}
              disabled={isSuccess || stakeAmount < 15 || (user ? stakeAmount > userBalance : false)}
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                isSuccess
                  ? 'bg-emerald-600'
                  : 'bg-[#4169e1] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Stake Confirmed!</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Place Stake (${stakeAmount})</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setHistoryFilter('all')}
                className={`flex-1 py-1 rounded transition-all cursor-pointer ${
                  historyFilter === 'all'
                    ? 'bg-white text-[#4169e1] shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({stakingHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('deposits')}
                className={`flex-1 py-1 rounded transition-all cursor-pointer ${
                  historyFilter === 'deposits'
                    ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Deposits ({stakingHistory.filter((s) => s.type === 'deposit').length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('bets')}
                className={`flex-1 py-1 rounded transition-all cursor-pointer ${
                  historyFilter === 'bets'
                    ? 'bg-white text-[#4169e1] shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bets ({stakingHistory.filter((s) => s.type === 'bet' || !s.type).length})
              </button>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 max-h-[320px] overflow-y-auto no-scrollbar text-xs">
              {stakingHistory.filter((item) => {
                if (historyFilter === 'deposits') return item.type === 'deposit';
                if (historyFilter === 'bets') return item.type === 'bet' || !item.type;
                return true;
              }).length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  {historyFilter === 'deposits'
                    ? 'No deposit transactions yet'
                    : 'No active stakes found'}
                </div>
              ) : (
                stakingHistory
                  .filter((item) => {
                    if (historyFilter === 'deposits') return item.type === 'deposit';
                    if (historyFilter === 'bets') return item.type === 'bet' || !item.type;
                    return true;
                  })
                  .map((item) => {
                    if (item.type === 'deposit') {
                      return (
                        <div key={item.id} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block truncate max-w-[130px]">
                                {item.title || 'Wallet Deposit'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.paymentMethod || 'Deposit'} • {item.placedTime}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-600 block">
                              +${(item.amount || 0).toFixed(2)}
                            </span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.status || 'Completed'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    if (item.type === 'payout') {
                      return (
                        <div key={item.id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[130px]">
                              {item.title || 'Payout'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {item.placedTime}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 block">
                              -${(item.amount || 0).toFixed(2)}
                            </span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {item.status || 'Processed'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Default: Staking bet item
                    return (
                      <div key={item.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                            {item.matchTitle || item.title || 'Match Stake'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {item.market || 'Match Winner'} {item.odds ? `• Odds: ${item.odds.toFixed(2)}` : ''}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-slate-900 block">
                            ${(item.stakeAmount ?? item.amount ?? 0).toFixed(2)}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              item.status === 'Win'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'Loss'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Recent Activity</span>
              <button
                type="button"
                onClick={() => navigate('/history')}
                className="text-[11px] font-bold text-[#4169e1] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Full History & Receipts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Safety Notice */}
      <div className="p-3 bg-slate-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-[#4169e1] shrink-0" />
        <span className="text-[11px] leading-snug">
          100% Encrypted & instant payout processing on ONEKICKX.
        </span>
      </div>

      {/* Paystack Payment Gateway Modal with Middleman FX */}
      <PaystackDepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
};
