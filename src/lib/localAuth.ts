export type AppUser = {
  email: string;
  passwordHash: string;
  credits: number;
  token?: string;
};

const USERS_KEY = "app_users";
const SESSION_KEY = "app_session_email";

function safeBtoa(str: string) {
  try {
    return btoa(str);
  } catch {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

function hashPassword(email: string, password: string) {
  return safeBtoa(`${email}:${password}`);
}

function getUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as AppUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AppUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSessionEmail(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionEmail(email: string) {
  localStorage.setItem(SESSION_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function findUserByEmail(email: string): AppUser | null {
  const users = getUsers();
  return users.find((u) => u.email === email) ?? null;
}

export function getCurrentUser(): AppUser | null {
  const email = getSessionEmail();
  if (!email) return null;
  return findUserByEmail(email);
}

export function upsertUser(user: AppUser) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === user.email);
  if (idx >= 0) users[idx] = user; else users.push(user);
  saveUsers(users);
}

export function signUp(email: string, password: string): { ok: boolean; error?: string } {
  const exists = findUserByEmail(email);
  if (exists) return { ok: false, error: "User already exists" };
  const newUser: AppUser = {
    email,
    passwordHash: hashPassword(email, password),
    credits: 0,
  };
  upsertUser(newUser);
  setSessionEmail(email);
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, error: "User not found" };
  if (user.passwordHash !== hashPassword(email, password)) {
    return { ok: false, error: "Invalid credentials" };
  }
  setSessionEmail(email);
  return { ok: true };
}

export function logout() {
  clearSession();
}

export function addCredits(amount: number): { ok: boolean; error?: string; credits?: number } {
  const user = getCurrentUser();
  if (!user) return { ok: false, error: "Not logged in" };
  const add = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  user.credits = (user.credits || 0) + add;
  upsertUser(user);
  return { ok: true, credits: user.credits };
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateToken(): { ok: boolean; token?: string; error?: string } {
  const user = getCurrentUser();
  if (!user) return { ok: false, error: "Not logged in" };
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = `ext_${bytesToHex(bytes)}`;
  user.token = token;
  upsertUser(user);
  return { ok: true, token };
}
