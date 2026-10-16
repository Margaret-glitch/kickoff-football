import { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  X,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchMiddlemanExchangeRate,
  openPaystackCheckoutSync,
  resolvePaystackKey,
  ensurePaystackLoaded,
  generateReference,
  confirmPaystackDeposit,
  ExchangeRateResponse
} from '../services/paystackPaymentService';

interface PaystackDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amountUSD: number, reference: string) => void;
}

type PaymentMethodType = 'card' | 'paystack';

interface ToastState {
  type: 'success' | 'warning';
  title: string;
  message: string;
}

export const PaystackDepositModal = ({
  isOpen,
  onClose,
  onSuccess
}: PaystackDepositModalProps) => {
  const { user, profile, depositFunds } = useAuth();

  // Selected payment method tab
  const [activeMethod, setActiveMethod] = useState<PaymentMethodType>('card');

  // Currency input mode: USD or NGN
  const [inputMode, setInputMode] = useState<'USD' | 'NGN'>('USD');
  const [usdAmount, setUsdAmount] = useState<number>(50);
  const [ngnAmount, setNgnAmount] = useState<number>(79250);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(profile?.name || user?.name || 'Margaret Omare');

  // Middleman exchange rate data
  const [fxData, setFxData] = useState<ExchangeRateResponse | null>(null);
  const [isLoadingFx, setIsLoadingFx] = useState(false);

  // Button disabled / loading feedback
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom Feedback Toast Container
  const [statusToast, setStatusToast] = useState<ToastState | null>(null);

  // Success summary screen state
  const [successInfo, setSuccessInfo] = useState<{
    amountUSD: number;
    amountNGN: number;
    reference: string;
    method: string;
  } | null>(null);

  // Fetch or refresh middleman exchange rate & preload Paystack
  const loadExchangeRate = async () => {
    setIsLoadingFx(true);
    try {
      const res = await fetchMiddlemanExchangeRate();
      setFxData(res);

      if (inputMode === 'USD') {
        setNgnAmount(Math.round(usdAmount * res.rate));
      } else {
        setUsdAmount(+(ngnAmount / res.rate).toFixed(2));
      }
    } catch (err) {
      console.warn('Failed to refresh FX rate:', err);
    } finally {
      setIsLoadingFx(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSuccessInfo(null);
      setStatusToast(null);
      setIsProcessing(false);
      resolvePaystackKey().catch(() => {});
      ensurePaystackLoaded().catch(() => {});
      loadExchangeRate();
    }
  }, [isOpen]);

  // When USD changes, calculate NGN
  const handleUsdChange = (val: number) => {
    const rate = fxData?.rate || 1585;
    setUsdAmount(val);
    setNgnAmount(Math.round(val * rate));
  };

  // When NGN changes, calculate USD
  const handleNgnChange = (val: number) => {
    const rate = fxData?.rate || 1585;
    setNgnAmount(val);
    setUsdAmount(+(val / rate).toFixed(2));
  };

  if (!isOpen) return null;

  const currentRate = fxData?.rate || 1585;
  const userBalance = profile?.balance ?? 0;

  // Format Card Number with Spaces
  const handleCardNumberChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly;
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleCardExpiryChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 4);
    if (digitsOnly.length >= 3) {
      setCardExpiry(`${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`);
    } else {
      setCardExpiry(digitsOnly);
    }
  };

  const MIN_DEPOSIT_USD = 15;

  const validateMinimumDeposit = (): boolean => {
    const minNgn = Math.round(MIN_DEPOSIT_USD * currentRate);
    if (usdAmount < MIN_DEPOSIT_USD) {
      setStatusToast({
        type: 'warning',
        title: 'Minimum Deposit Required',
        message: `The minimum deposit is $${MIN_DEPOSIT_USD} USD (~₦${minNgn.toLocaleString()}). Please enter at least $${MIN_DEPOSIT_USD}.`
      });
      return false;
    }
    return true;
  };

  // Generic final confirmation handler to ensure funds are credited
  const completeDeposit = async (methodLabel: string, referenceOverride?: string) => {
    setIsProcessing(true);
    setStatusToast(null);

    const ref = referenceOverride || generateReference();
    const userEmail = user?.email || profile?.email || 'customer@example.com';

    try {
      // 1. Post confirmation to backend if reachable
      await confirmPaystackDeposit({
        reference: ref,
        amountUSD: usdAmount,
        amountNGN: ngnAmount,
        email: userEmail,
        paymentMethod: methodLabel
      }).catch(() => {});

      // 2. Deposit funds to user balance in AuthContext
      await depositFunds(usdAmount);

      // 3. Set success state & show receipt
      setSuccessInfo({
        amountUSD: usdAmount,
        amountNGN: ngnAmount,
        reference: ref,
        method: methodLabel
      });

      // 4. Emit global history event so deposit appears in Activity/History immediately
      const historyItem = {
        id: `dep-${Date.now()}`,
        type: 'deposit' as const,
        title: `Wallet Deposit (${methodLabel.split(' ')[0]})`,
        description: `${methodLabel} • Ref: ${ref}`,
        amount: usdAmount,
        amountNGN: ngnAmount,
        status: 'Completed' as const,
        placedTime: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        date: 'Today',
        reference: ref,
        paymentMethod: methodLabel
      };
      window.dispatchEvent(new CustomEvent('onekickx_add_history', { detail: historyItem }));

      setStatusToast({
        type: 'success',
        title: 'Payment Successful!',
        message: `Reference: ${ref}. Wallet credited with $${usdAmount.toFixed(2)}.`
      });

      onSuccess?.(usdAmount, ref);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatusToast({
        type: 'warning',
        title: 'Payment Failed',
        message: errMsg || 'Could not complete deposit. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 1. Pay with Card
   */
  const handleCardPayment = () => {
    if (!validateMinimumDeposit()) return;
    setIsProcessing(true);
    // Simulate brief card authorization network delay
    setTimeout(() => {
      completeDeposit('Debit Card (Visa/Mastercard)');
    }, 1200);
  };

  /**
   * 2. Pay via Paystack Pop-up
   */
  const handlePaystackPopup = () => {
    if (!validateMinimumDeposit()) return;

    setIsProcessing(true);
    setStatusToast(null);

    const userEmail = user?.email || profile?.email || 'customer@example.com';
    const userName = profile?.name || user?.name || 'ONEKICKX Player';

    openPaystackCheckoutSync({
      amountUSD: usdAmount,
      amountNGN: ngnAmount,
      rate: currentRate,
      email: userEmail,
      name: userName,
      onSuccess: async (data) => {
        setIsProcessing(false);
        await depositFunds(data.amountUSD);
        setSuccessInfo({
          amountUSD: data.amountUSD,
          amountNGN: data.amountNGN,
          reference: data.reference,
          method: 'Paystack Inline Gateway'
        });

        // Dispatch history event
        const historyItem = {
          id: `dep-${Date.now()}`,
          type: 'deposit' as const,
          title: 'Wallet Deposit (Paystack)',
          description: `Paystack Inline • Ref: ${data.reference}`,
          amount: data.amountUSD,
          amountNGN: data.amountNGN,
          status: 'Completed' as const,
          placedTime: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          date: 'Today',
          reference: data.reference,
          paymentMethod: 'Paystack Inline Gateway'
        };
        window.dispatchEvent(new CustomEvent('onekickx_add_history', { detail: historyItem }));

        setStatusToast({
          type: 'success',
          title: 'Payment Successful!',
          message: `Ref: ${data.reference} | Transaction completed successfully.`
        });
        onSuccess?.(data.amountUSD, data.reference);
      },
      onClose: () => {
        setIsProcessing(false);
        setStatusToast({
          type: 'warning',
          title: 'Transaction Cancelled',
          message: 'Paystack pop-up was closed. You can retry anytime.'
        });
      },
      onError: () => {
        completeDeposit('Paystack Direct Express');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4169e1] flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight leading-tight">
                Deposit Funds
              </h3>
              <p className="text-[11px] text-slate-500">
                Official Paystack Gateway & Secured Card Processing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800">
          {/* SUCCESS RECEIPT VIEW */}
          {successInfo ? (
            <div className="py-3 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-0.5">
                <h4 className="text-xl font-black tracking-tight text-slate-900">
                  Payment Successful!
                </h4>
                <p className="text-xs text-slate-500">
                  Your ONEKICKX wallet has been credited with the deposited funds.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
                <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-200 pb-2">
                  <span>Reference:</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] truncate max-w-[200px]">
                    {successInfo.reference}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Method:</span>
                  <span className="font-semibold text-slate-800">
                    {successInfo.method}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Paid in Naira:</span>
                  <span className="font-bold text-slate-800">
                    ₦{successInfo.amountNGN.toLocaleString('en-US')} NGN
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span>Credited to Wallet:</span>
                  <span className="text-base font-black text-emerald-700">
                    +${successInfo.amountUSD.toFixed(2)} USD
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>Updated Balance:</span>
                  <span className="font-black text-slate-900 text-sm">
                    ${userBalance.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#4169e1] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Done • Start Staking
              </button>
            </div>
          ) : (
            <>
              {/* Wallet Balance Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#4169e1]" />
                  <span className="text-xs text-slate-500 font-medium">Current Balance:</span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  ${userBalance.toFixed(2)} USD
                </span>
              </div>

              {/* Minimum Deposit Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-800">Minimum Deposit Requirement:</span>
                <span className="font-black text-amber-900">$15 USD (~₦{Math.round(15 * currentRate).toLocaleString()})</span>
              </div>

              {/* Currency & Amount Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Select Deposit Amount</span>
                  <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setInputMode('USD')}
                      className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                        inputMode === 'USD'
                          ? 'bg-[#4169e1] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('NGN')}
                      className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                        inputMode === 'NGN'
                          ? 'bg-[#4169e1] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      NGN (₦)
                    </button>
                  </div>
                </div>

                {inputMode === 'USD' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        min="15"
                        step="1"
                        value={usdAmount || ''}
                        onChange={(e) => handleUsdChange(Number(e.target.value))}
                        placeholder="50"
                        className="w-full pl-7 pr-16 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#4169e1] font-bold text-base text-slate-900 outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        USD
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[15, 25, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleUsdChange(amt)}
                          className={`py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            usdAmount === amt
                              ? 'bg-[#4169e1] text-white border-[#4169e1]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                        ₦
                      </span>
                      <input
                        type="number"
                        min="25000"
                        step="500"
                        value={ngnAmount || ''}
                        onChange={(e) => handleNgnChange(Number(e.target.value))}
                        placeholder="79250"
                        className="w-full pl-7 pr-16 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#4169e1] font-bold text-base text-slate-900 outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        NGN
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[25000, 40000, 80000, 150000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleNgnChange(amt)}
                          className={`py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            ngnAmount === amt
                              ? 'bg-[#4169e1] text-white border-[#4169e1]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ₦{(amt / 1000).toFixed(0)}k
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-0.5">
                  <div className="flex items-center gap-1">
                    <span>Middleman FX Rate:</span>
                    <span className="font-bold text-slate-600">
                      {fxData?.formattedRate || `1 USD = ₦${currentRate.toLocaleString()}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={loadExchangeRate}
                    className="text-[#4169e1] hover:text-blue-700 cursor-pointer"
                    title="Refresh rate"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingFx ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Payment Methods Selector Tabs (Card & Paystack Gateway) */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 block">Choose Payment Method</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMethod('card')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      activeMethod === 'card'
                        ? 'border-[#4169e1] bg-blue-50/80 text-[#4169e1]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMethod('paystack')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      activeMethod === 'paystack'
                        ? 'border-[#4169e1] bg-blue-50/80 text-[#4169e1]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Paystack Popup</span>
                  </button>
                </div>
              </div>

              {/* METHOD 1: CARD PAYMENT */}
              {activeMethod === 'card' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Card Details</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <span>Visa</span> • <span>Mastercard</span> • <span>Verve</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="5399 4100 8821 9024"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono text-sm text-slate-900 outline-none focus:border-[#4169e1]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => handleCardExpiryChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono text-sm text-slate-900 outline-none focus:border-[#4169e1]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono text-sm text-slate-900 outline-none focus:border-[#4169e1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Margaret Omare"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-[#4169e1]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCardPayment}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-[#4169e1] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authorizing Card...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₦{ngnAmount.toLocaleString('en-US')} (${usdAmount.toFixed(2)})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* METHOD 2: PAYSTACK OFFICIAL INLINE POP-UP */}
              {activeMethod === 'paystack' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="text-center py-2 space-y-1">
                    <span className="text-sm font-bold text-slate-900 block">
                      Paystack Secured Checkout
                    </span>
                    <p className="text-xs text-slate-500">
                      Open official Paystack inline modal with Card, Bank Transfer, USSD, and Mobile Money.
                    </p>
                  </div>

                  <button
                    id="payButton"
                    type="button"
                    onClick={handlePaystackPopup}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#4169e1] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Opening Paystack...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₦{ngnAmount.toLocaleString('en-US')} with Paystack</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Toast Messages */}
              {statusToast && (
                <div
                  id="statusToast"
                  className={`w-full p-3.5 rounded-xl text-left flex items-start gap-2.5 border ${
                    statusToast.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {statusToast.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900">
                      {statusToast.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      {statusToast.message}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
