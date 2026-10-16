import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BreacherUser,
  UserProfileData,
  breacherGetMe,
  breacherLogin,
  breacherRegister,
  breacherLogout,
  getUserProfile,
  saveUserProfile
} from '../services/breacherService';

interface AuthContextType {
  user: BreacherUser | null;
  profile: UserProfileData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<BreacherUser>;
  completeOnboarding: (data: { bankName: string; accountNumber: string; accountName: string }) => Promise<void>;
  logout: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  pendingAction: (() => void) | null;
  requireAuth: (callback: () => void) => boolean;
  depositFunds: (amount: number) => Promise<void>;
  deductFunds: (amount: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'onekickx_cached_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<BreacherUser | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const userIdentifier = user?.uid || user?.id || user?.email || 'guest';
  const profileKey = `onekickx_profile_${userIdentifier}`;

  // Load session on startup
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      try {
        const cachedUserStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          if (isMounted) setUser(cachedUser);
          const cachedId = cachedUser.uid || cachedUser.id || cachedUser.email || 'guest';
          const cachedProfStr = localStorage.getItem(`onekickx_profile_${cachedId}`);
          if (cachedProfStr) {
            const cachedProf = JSON.parse(cachedProfStr);
            if (isMounted) setProfile(cachedProf);
          }
        }
      } catch {
        // ignore
      }

      try {
        const liveUser = await breacherGetMe();
        if (isMounted) {
          if (liveUser) {
            setUser(liveUser);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(liveUser));
            
            const liveId = liveUser.uid || liveUser.id || liveUser.email;
            const pKey = `onekickx_profile_${liveId}`;

            // Fetch user profile from Breacher DB
            const dbProfile = await getUserProfile(liveId);
            if (dbProfile) {
              const verifiedProf: UserProfileData = {
                ...dbProfile,
                balance: typeof dbProfile.balance === 'number' ? dbProfile.balance : 0
              };
              setProfile(verifiedProf);
              localStorage.setItem(pKey, JSON.stringify(verifiedProf));
            } else {
              // Default profile with genuine 0 balance and empty history
              const defaultProf: UserProfileData = {
                uid: liveId,
                name: liveUser.name || 'Football Fan',
                email: liveUser.email,
                balance: 0,
                currency: 'USD',
                onboarded: false
              };
              setProfile(defaultProf);
              localStorage.setItem(pKey, JSON.stringify(defaultProf));
              saveUserProfile(defaultProf).catch(() => {});
            }
          }
        }
      } catch {
        // network error / unauthenticated
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedUser = await breacherLogin(email, password);
      setUser(loggedUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(loggedUser));

      const loggedId = loggedUser.uid || loggedUser.id || loggedUser.email;
      const pKey = `onekickx_profile_${loggedId}`;

      let dbProfile = await getUserProfile(loggedId);
      if (!dbProfile) {
        dbProfile = {
          uid: loggedId,
          name: loggedUser.name || email.split('@')[0],
          email: loggedUser.email,
          balance: 0,
          currency: 'USD',
          onboarded: false
        };
        await saveUserProfile(dbProfile);
      } else {
        dbProfile = {
          ...dbProfile,
          balance: typeof dbProfile.balance === 'number' ? dbProfile.balance : 0
        };
      }
      setProfile(dbProfile);
      localStorage.setItem(pKey, JSON.stringify(dbProfile));
      setShowAuthModal(false);

      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<BreacherUser> => {
    setLoading(true);
    try {
      const newUser = await breacherRegister(email, password, name);
      setUser(newUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));

      const newId = newUser.uid || newUser.id || newUser.email;
      const pKey = `onekickx_profile_${newId}`;

      const initialProfile: UserProfileData = {
        uid: newId,
        name: name || newUser.name || email.split('@')[0],
        email: newUser.email,
        balance: 0,
        currency: 'USD',
        onboarded: false,
        createdAt: new Date().toISOString()
      };

      setProfile(initialProfile);
      localStorage.setItem(pKey, JSON.stringify(initialProfile));
      await saveUserProfile(initialProfile);

      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (data: { bankName: string; accountNumber: string; accountName: string }) => {
    if (!profile) return;
    const updated: UserProfileData = {
      ...profile,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      onboarded: true,
      updatedAt: new Date().toISOString()
    };

    setProfile(updated);
    localStorage.setItem(profileKey, JSON.stringify(updated));
    await saveUserProfile(updated);
    setShowAuthModal(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const logout = async () => {
    try {
      await breacherLogout();
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const requireAuth = (callback: () => void): boolean => {
    if (user && profile?.onboarded) {
      callback();
      return true;
    }
    setPendingAction(() => callback);
    setShowAuthModal(true);
    return false;
  };

  const depositFunds = async (amount: number) => {
    const baseProfile: UserProfileData = profile || {
      uid: user?.id || user?.uid || user?.email || 'guest',
      name: user?.name || 'ONEKICKX Player',
      email: user?.email || 'player@onekickx.com',
      balance: 0,
      currency: 'USD',
      onboarded: true
    };
    const newBal = +(Number(baseProfile.balance || 0) + Number(amount)).toFixed(2);
    const updated: UserProfileData = {
      ...baseProfile,
      balance: newBal,
      onboarded: true,
      updatedAt: new Date().toISOString()
    };
    setProfile(updated);
    localStorage.setItem(profileKey, JSON.stringify(updated));
    await saveUserProfile(updated).catch(() => {});
  };

  const deductFunds = async (amount: number): Promise<boolean> => {
    if (!profile) return false;
    const currentBal = Number(profile.balance || 0);
    if (currentBal < amount) return false;
    const newBal = +(currentBal - Number(amount)).toFixed(2);
    const updated: UserProfileData = {
      ...profile,
      balance: newBal,
      updatedAt: new Date().toISOString()
    };
    setProfile(updated);
    localStorage.setItem(profileKey, JSON.stringify(updated));
    await saveUserProfile(updated).catch(() => {});
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        completeOnboarding,
        logout,
        showAuthModal,
        setShowAuthModal,
        pendingAction,
        requireAuth,
        depositFunds,
        deductFunds
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
