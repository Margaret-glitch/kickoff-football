import { useState } from 'react';
import {
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface WelcomeOnboardingScreenProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export const WelcomeOnboardingScreen = ({ onComplete, onClose }: WelcomeOnboardingScreenProps) => {
  const { login, register } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setErrorMsg('');
    if (authMode === 'signin') {
      setEmail('player@onekickx.com');
      setPassword('OneKickX2026!');
    } else {
      setName('Alex Morgan');
      setEmail('alex.morgan@onekickx.com');
      setPassword('OneKickX2026!');
      setConfirmPassword('OneKickX2026!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (authMode === 'signin') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, name.trim());
      }
      onComplete?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-[#4169e1]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-[#00c5d4]/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Responsive Card (Mobile, Tablet, Laptop, Desktop friendly) */}
      <div className="relative max-w-md w-full my-auto flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full bg-slate-900/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Close and explore ONEKICKX"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800/90 border border-white/20 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src="/onekickx-logo.png"
                  alt="ONEKICKX Official Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/onekickx-logo.jpg';
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase text-white drop-shadow-sm">
                ONEKICKX
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                Live Football Scores, Match Statistics, Odds & Real-Time Tracking
              </p>
            </div>
          </div>

          {/* Segmented Sign In vs Sign Up Tabs */}
          <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
                  ? 'bg-[#4169e1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-[#4169e1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Quick Demo Helper */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>{authMode === 'signin' ? 'Have an account?' : 'New to ONEKICKX?'}</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#38bdf8] hover:text-[#7dd3fc] font-semibold cursor-pointer transition-colors"
            >
              <span>Fill Demo Credentials</span>
            </button>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
            {authMode === 'signup' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169e1] focus:ring-1 focus:ring-[#4169e1]"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@onekickx.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169e1] focus:ring-1 focus:ring-[#4169e1]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169e1] focus:ring-1 focus:ring-[#4169e1]"
              />
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169e1] focus:ring-1 focus:ring-[#4169e1]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#4169e1] hover:bg-[#3557c7] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : authMode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to ONEKICKX</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create ONEKICKX Account</span>
                </>
              )}
            </button>
          </form>

          {/* Security Assurance footer (no guest link) */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted • Real-Time Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
