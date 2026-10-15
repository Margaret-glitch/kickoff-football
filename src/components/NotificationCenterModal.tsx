import { useState } from 'react';
import { Bell, X, Check, Volume2, ShieldCheck, Settings } from 'lucide-react';
import { INITIAL_NOTIFICATIONS, AppNotification } from '../data/extendedFootballData';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMatch?: (matchId: string) => void;
}

export const NotificationCenterModal = ({
  isOpen,
  onClose,
  onOpenMatch
}: NotificationCenterModalProps) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Browser Push Notifications Status
  const [pushStatus, setPushStatus] = useState<string>(() => {
    return typeof Notification !== 'undefined' ? Notification.permission : 'default';
  });

  // Notification Preferences
  const [prefs, setPrefs] = useState({
    matchStarting: true,
    goals: true,
    redCards: true,
    fullTime: true,
    betSettlements: true,
    deposits: true,
    teamNews: true,
    breakingNews: true,
    sound: true
  });

  const requestPushPermission = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const perm = await Notification.requestPermission();
        setPushStatus(perm);
        if (perm === 'granted') {
          new Notification('ONEKICKX Alerts Active ⚽', {
            body: 'You will now receive instant push alerts for goals, full-time results, and bet settlements.',
            icon: '/onekickx-logo.png'
          });
        }
      } catch (e) {
        console.warn('Push notification error:', e);
      }
    }
  };

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Modal Header */}
        <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4169e1]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">ONEKICKX Alerts & Notifications</h2>
              <span className="text-[11px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'alerts' ? 'settings' : 'alerts')}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alerts Feed */}
        {activeTab === 'alerts' ? (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {unreadCount > 0 && (
              <div className="p-2 flex justify-end">
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-[#4169e1] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.matchId) {
                    onClose();
                    onOpenMatch?.(n.matchId);
                  }
                }}
                className={`p-3.5 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                  n.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/60'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  n.isRead ? 'bg-transparent' : 'bg-[#4169e1]'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-slate-900 truncate pr-2">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Notification Settings Toggles */
          <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* System Push Notification Permission Card */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Browser Push Notifications
                </span>
                <span className="text-[11px] text-slate-500">
                  {pushStatus === 'granted'
                    ? 'Push alerts enabled even when tab is idle.'
                    : 'Receive real-time goal & settlement popups on this device.'}
                </span>
              </div>
              <button
                type="button"
                onClick={requestPushPermission}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pushStatus === 'granted'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#4169e1] hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {pushStatus === 'granted' ? 'Enabled ✓' : 'Enable Push'}
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-900">Custom Alert Preferences</h3>
            <p className="text-xs text-slate-500">
              Control when ONEKICKX notifies you on desktop and mobile.
            </p>

            <div className="space-y-2.5 pt-1">
              {[
                { key: 'matchStarting', label: 'Match Kickoff Starting (15m before)' },
                { key: 'goals', label: 'Live Goals & VAR Confirmations' },
                { key: 'redCards', label: 'Red Cards & Key Penalties' },
                { key: 'fullTime', label: 'Full-Time Match Results & Final Scores' },
                { key: 'betSettlements', label: 'Bet Status & Automatic Win Settlements' },
                { key: 'deposits', label: 'Wallet Deposits & Successful Payments' },
                { key: 'teamNews', label: 'Favorite Team Lineups & Squad News' },
                { key: 'breakingNews', label: 'Breaking News & Major Transfers' },
                { key: 'sound', label: 'In-App Audio Sound Chimes' }
              ].map((item) => {
                const isEnabled = prefs[item.key as keyof typeof prefs];
                return (
                  <div
                    key={item.key}
                    onClick={() => togglePref(item.key as keyof typeof prefs)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <div className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
                      isEnabled ? 'bg-[#4169e1]' : 'bg-slate-300'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                        isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
