const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function connectMT5(payload: {
  server: string;
  login: string;
  password: string;
}) {
  return request<{ success: boolean; message: string }>("/api/connect-mt5", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAccountInfo() {
  return request<{
    balance: number;
    equity: number;
    freeMargin: number;
    connected: boolean;
  }>("/api/account-info");
}

export async function getOpenTrades() {
  return request<
    Array<{
      id: number;
      symbol: string;
      side: string;
      lot: string;
      pnl: string;
      ea: string;
      ticket?: number;
    }>
  >("/api/open-trades");
}

export async function closeTrade(ticket: number) {
  return request<{ success: boolean; message: string }>("/api/close-order", {
    method: "POST",
    body: JSON.stringify({ ticket }),
  });
}

export async function closeAllTrades() {
  return request<{ success: boolean; message: string }>("/api/close-all", {
    method: "POST",
  });
}

export async function startEA(payload: { eaId: number; eaName: string }) {
  return request<{ success: boolean; message: string }>("/api/ea/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveEASettings(payload: {
  eaId: number;
  riskPerTrade: number;
  drawdownCap: number;
  newsFilter: boolean;
}) {
  return request<{ success: boolean; message: string }>("/api/ea/settings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
