import { useState } from 'react';
import { Search, User, Bell, Star, Tv, Play, Newspaper, Sparkles, BarChart2, Flame, Trophy, Calendar, HelpCircle, LogIn, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MainHeaderProps {
  onSearchChange?: (val: string) => void;
  activeNavTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
  onOpenWelcome?: () => void;
  unreadNotificationsCount?: number;
  liveMatchCount?: number;
}

export const MainHeader = ({
  onSearchChange,
  activeNavTab = 'home',
  onTabChange,
  onOpenProfile,
  onOpenNotifications,
  onOpenSearch,
  onOpenWelcome,
  unreadNotificationsCount = 2,
  liveMatchCount = 4
}: MainHeaderProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearchChange?.(val);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    {
      id: 'live-football',
      label: 'Live',
      badge: liveMatchCount > 0 ? `${liveMatchCount}` : undefined,
      isLive: true
    },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'history', label: 'History & Results', icon: Receipt },
    { id: 'leagues', label: 'Leagues', icon: Trophy },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'predictions', label: 'Predictions', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'where-to-watch', label: 'Where to Watch', icon: Tv },
    { id: 'watch', label: 'Watch', icon: Play },
    { id: 'favourites', label: 'Favorites', icon: Star }
  ];

  return (
    <header className="bg-[#4169e1] text-white select-none sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1540px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand & Main Navigation */}
        <div className="flex items-center gap-4 lg:gap-5 overflow-x-auto scrollbar-none py-1">
          {/* ONEKICKX Logo */}
          <div
            onClick={() => {
              onTabChange?.('home');
              navigate('/');
            }}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center shadow-xs p-0.5 border border-white/20">
              <img
                src="/onekickx-logo.png"
                alt="ONEKICKX"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/onekickx-logo.jpg';
                }}
              />
            </div>
            <span className="text-xl font-black tracking-wider text-white uppercase">ONEKICKX</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const isActive = activeNavTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange?.(item.id);
                    if (item.id === 'home' || item.id === 'matches') {
                      navigate('/');
                    } else if (item.id === 'history') {
                      navigate('/history');
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#4169e1] shadow-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  )}
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search, Notifications & Profile Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search Trigger */}
          <div
            onClick={onOpenSearch}
            className="flex items-center w-40 md:w-56 h-9 px-3 rounded-full bg-[#3557c7] border border-blue-300/30 text-white placeholder-blue-200/70 hover:bg-[#2b4bb8] cursor-pointer transition-all"
          >
            <Search className="w-4 h-4 text-blue-200 mr-2 shrink-0" />
            <span className="w-full text-xs text-blue-100/70 truncate">
              {searchValue || 'Search ONEKICKX...'}
            </span>
            <span className="text-[10px] font-semibold text-blue-100 bg-[#2541a3] px-1.5 py-0.5 rounded shrink-0">
              CtrlK
            </span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="Notifications & Match Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse ring-2 ring-[#4169e1]" />
            )}
          </button>

          {/* Tour / App Guide button */}
          <button
            onClick={onOpenWelcome}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="ONEKICKX Overview & Features"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile / Account / Sign In */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-[#2541a3] border border-blue-300/40 text-white hover:ring-2 hover:ring-white/60 transition-all cursor-pointer text-xs font-bold"
              title="User Account, Preferences & Security"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline truncate max-w-[80px]">
                {profile?.name?.split(' ')[0] || 'Player'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer"
              title="Sign In or Sign Up"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
