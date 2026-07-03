const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const authSessionKey = "expense_tracker_session";

export function getStoredSession() {
  try {
    const session = JSON.parse(localStorage.getItem(authSessionKey) ?? "null");

    if (!session?.token || !session?.expiresAt || session.expiresAt <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function getAuthToken() {
  const session = getStoredSession();
  return session?.token ?? "";
}

export function getUserId() {
  const session = getStoredSession();
  return session?.user?.id ?? "";
}

function buildApiPath(path) {
  const userId = getUserId();
  if (!userId) {
    return `/api${path}`;
  }
  // If path doesn't start with /users/, add the userId
  if (!path.startsWith("/users/")) {
    return `/api/users/${userId}${path}`;
  }
  return `/api${path}`;
}

async function request(path, options = {}) {
  const { requireAuth = true, ...fetchOptions } = options;
  const token = requireAuth ? getAuthToken() : "";
  const fullPath = buildApiPath(path);
  
  const headers = {
    ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers ?? {}),
  };

  console.log(`[API] ${fetchOptions.method || 'GET'} ${apiBaseUrl}${fullPath}`);

  const response = await fetch(`${apiBaseUrl}${fullPath}`, {
    headers,
    ...fetchOptions,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    console.error(`[API Error] ${response.status}:`, data);
    throw new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export function get(path, options) {
  return request(path, options);
}

export function post(path, body, options) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...(options ?? {}),
  });
}

export function put(path, body, options) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
    ...(options ?? {}),
  });
}

export function del(path, options) {
  return request(path, {
    method: "DELETE",
    ...(options ?? {}),
  });
}

export async function getOrDefault(path, fallback) {
  try {
    return await get(path);
  } catch (error) {
    console.error(`[API] Failed to fetch ${path}:`, error);
    return fallback;
  }
}
