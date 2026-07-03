import { post } from "./apiClient";

const SESSION_KEY = "expense_tracker_session";
const SESSION_DURATION_MS = 100 * 24 * 60 * 60 * 1000;

function createSession(payload, email) {
  return {
    email,
    token: payload?.token ?? payload?.accessToken ?? payload?.access_token ?? "",
    user: payload?.user ?? null,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
}

export async function loginUser(credentials) {
  const data = (await post("/login", credentials, { requireAuth: false })) ?? {};
  const session = createSession(data, credentials.email);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("auth-session-updated"));
  return session;
}

export function getStoredSession() {
  const storedSession = localStorage.getItem(SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const session = JSON.parse(storedSession);

    if (!session?.expiresAt || session.expiresAt <= Date.now()) {
      clearStoredSession();
      return null;
    }

    return session;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function getAuthToken() {
  return getStoredSession()?.token ?? "";
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("auth-session-updated"));
}
