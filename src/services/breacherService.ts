// Breacher Auth and Database integration service
export const BASE_AUTH = "https://storage.breacher.name.ng/U6op8Nr462Z46tBgxa2COUnja5z1/x-premium/auth";
export const BASE_DB = "https://storage.breacher.name.ng/U6op8Nr462Z46tBgxa2COUnja5z1/x-premium";

export interface BreacherUser {
  id?: string;
  uid?: string;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface UserProfileData {
  uid: string;
  name: string;
  email: string;
  balance: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  currency?: string;
  onboarded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 1. REGISTER
export async function breacherRegister(email: string, password: string, name: string) {
  const res = await fetch(`${BASE_AUTH}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Registration failed");
  }
  return data.user as BreacherUser;
}

// 2. LOGIN
export async function breacherLogin(email: string, password: string) {
  const res = await fetch(`${BASE_AUTH}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Login failed");
  }
  return data.user as BreacherUser;
}

// 3. LOGOUT
export async function breacherLogout() {
  await fetch(`${BASE_AUTH}/logout`, {
    method: "POST",
    credentials: "include"
  });
}

// 4. CHECK AUTH SESSION (/me)
export async function breacherGetMe(): Promise<BreacherUser | null> {
  try {
    const res = await fetch(`${BASE_AUTH}/me`, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      return (data.user || data) as BreacherUser;
    }
    return null;
  } catch {
    return null;
  }
}

// 5. DATABASE OPERATIONS
export async function saveUserProfile(profile: UserProfileData): Promise<void> {
  const cleanId = encodeURIComponent(profile.uid || profile.email.replace(/[@.]/g, '_'));
  
  await fetch(`${BASE_DB}/users/${cleanId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString()
    })
  });
}

export async function getUserProfile(uidOrEmail: string): Promise<UserProfileData | null> {
  const cleanId = encodeURIComponent(uidOrEmail.replace(/[@.]/g, '_'));
  
  try {
    // Try both without and with .json extension for compatibility with GitDB
    let res = await fetch(`${BASE_DB}/users/${cleanId}.json`);
    if (!res.ok) {
      res = await fetch(`${BASE_DB}/users/${cleanId}`);
    }
    
    if (res.ok) {
      const data = await res.json();
      return data as UserProfileData;
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateUserBalance(uidOrEmail: string, newBalance: number): Promise<void> {
  const cleanId = encodeURIComponent(uidOrEmail.replace(/[@.]/g, '_'));
  
  try {
    await fetch(`${BASE_DB}/users/${cleanId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        balance: newBalance,
        updatedAt: new Date().toISOString()
      })
    });
  } catch {
    // ignore
  }
}
