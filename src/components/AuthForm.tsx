import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  onSuccess?: () => void;
  title?: string;
  initialMode?: 'login' | 'register' | 'onboarding';
}

export const AuthForm = ({
  onSuccess,
  title,
  initialMode
}: AuthFormProps) => {
  const { user, profile, login, register, completeOnboarding } = useAuth();

  // If user is registered but not onboarded, default to onboarding
  const startMode = initialMode || (user && !profile?.onboarded ? 'onboarding' : 'login');
  const [mode, setMode] = useState<'login' | 'register' | 'onboarding'>(startMode);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Onboarding payout details
  const [bankName, setBankName] = useState(profile?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(profile?.accountNumber || '');
  const [accountName, setAccountName] = useState(profile?.accountName || user?.name || '');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onSuccess?.();
      } else if (mode === 'register') {
        await register(email, password, name);
        // Staggered step: Transition immediately to onboarding step to capture payout bank
        setMode('onboarding');
      } else if (mode === 'onboarding') {
        if (!bankName || !accountNumber || !accountName) {
          throw new Error('Please enter all payout account details');
        }
        await completeOnboarding({ bankName, accountNumber, accountName });
        onSuccess?.();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full select-none">
      {/* Header title */}
      <div className="mb-4 text-center">
        <h3 className="text-base font-bold text-slate-900">
          {title ||
            (mode === 'login'
              ? 'Sign in to ONEKICKX'
              : mode === 'register'
              ? 'Create your ONEKICKX account'
              : 'Add payout bank details')}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {mode === 'login'
            ? 'Sign in to access your wallet and place stakes'
            : mode === 'register'
            ? 'Get started with an instant $0 starting balance'
            : 'Enter your payout account for withdrawals'}
        </p>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'register' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4169e1]"
            />
          </div>
        )}

        {(mode === 'login' || mode === 'register') && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4169e1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-9 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4169e1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        {mode === 'onboarding' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Payout Bank Name</label>
              <input
                type="text"
                required
                placeholder="e.g. First Bank of Nigeria / Chase / Barclays"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4169e1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Account Number / IBAN</label>
              <input
                type="text"
                required
                placeholder="e.g. 0123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4169e1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Account Holder Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Johnson"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4169e1]"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 bg-[#4169e1] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-60"
        >
          {loading
            ? 'Processing...'
            : mode === 'login'
            ? 'Sign In'
            : mode === 'register'
            ? 'Continue to Payout Setup'
            : 'Complete & Save Account'}
        </button>
      </form>

      {/* Switch between signin and signup */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
        {mode === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('register');
              }}
              className="text-[#4169e1] font-bold hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        ) : mode === 'register' ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('login');
              }}
              className="text-[#4169e1] font-bold hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
};
