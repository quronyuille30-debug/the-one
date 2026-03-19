import { useState } from "react";
import {
  closeAllTrades,
  closeTrade,
  connectMT5,
  getOpenTrades,
  saveEASettings,
  startEA,
} from "./services/api";

type Trade = {
  id: number;
  symbol: string;
  side: string;
  lot: string;
  pnl: string;
  ea: string;
  ticket?: number;
};

function App() {
  const [server, setServer] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Ready");
  const [connected, setConnected] = useState(false);
  const [selectedEA, setSelectedEA] = useState<string | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [drawdownCap, setDrawdownCap] = useState(2);
  const [newsFilter, setNewsFilter] = useState(true);

  const handleConnect = async () => {
    try {
      const result = await connectMT5({ server, login, password });
      setConnected(true);
      setMessage(result.message);
    } catch {
      setMessage("Connection failed");
    }
  };

  const handleUseEA = async (eaName: string, eaId: number) => {
    try {
      const result = await startEA({ eaId, eaName });
      setSelectedEA(eaName);
      setMessage(result.message);
    } catch {
      setSelectedEA(eaName);
      setMessage(`${eaName} selected`);
    }
  };

  const handleLoadTrades = async () => {
    try {
      const data = await getOpenTrades();
      setTrades(data);
      setMessage("Trades loaded");
    } catch {
      setMessage("Could not load trades");
    }
  };

  const handleCloseTrade = async (ticket?: number, id?: number) => {
    try {
      if (ticket) {
        await closeTrade(ticket);
      }
      setTrades((prev) => prev.filter((t) => t.id !== id));
      setMessage("Trade closed");
    } catch {
      setMessage("Could not close trade");
    }
  };

  const handleCloseAll = async () => {
    try {
      await closeAllTrades();
      setTrades([]);
      setMessage("All trades closed");
    } catch {
      setMessage("Could not close all trades");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await saveEASettings({
        eaId: 1,
        riskPerTrade,
        drawdownCap,
        newsFilter,
      });
      setMessage("Settings saved");
    } catch {
      setMessage("Could not save settings");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl">
        <header className="px-5 pt-6 pb-5 bg-slate-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300">
                MT5 EA Hub
              </p>
              <h1 className="text-3xl font-bold mt-2">iPhone Web App</h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold">
              EA
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-4">
            Open this in Safari on iPhone, tap Share, then Add to Home Screen.
          </p>
        </header>

        <main className="p-5 space-y-5">
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">App status</div>
            <div className="mt-1">{message}</div>
          </section>

          <section className="rounded-3xl border p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Connect MT5</h3>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  connected
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {connected ? "Connected" : "Not Connected"}
              </span>
            </div>

            <div className="space-y-3">
              <input
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                placeholder="Broker server"
              />
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                placeholder="MT5 login"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                type="password"
                placeholder="Password / API key"
              />
              <button
                onClick={handleConnect}
                className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold"
              >
                Connect Account
              </button>
            </div>
          </section>

          <section className="rounded-3xl border p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">EA Marketplace</h3>
              <button
                onClick={() => handleLoadTrades()}
                className="text-sm font-semibold text-blue-600"
              >
                Load Trades
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: 1, name: "Gold Scalper EA" },
                { id: 2, name: "Supply & Demand EA" },
                { id: 3, name: "London Breakout EA" },
              ].map((ea) => (
                <div
                  key={ea.id}
                  className={`rounded-2xl border bg-slate-50 p-4 ${
                    selectedEA === ea.name ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="font-bold">{ea.name}</div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => handleUseEA(ea.name, ea.id)}
                      className="rounded-xl bg-slate-900 text-white py-2 text-sm font-semibold"
                    >
                      Use EA
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="rounded-xl border bg-white py-2 text-sm font-semibold"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Open Trades</h3>
              <button
                onClick={handleCloseAll}
                className="text-sm font-semibold text-red-600"
              >
                Close all
              </button>
            </div>

            <div className="space-y-3">
              {trades.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-500">
                  No open trades right now.
                </div>
              ) : (
                trades.map((trade) => (
                  <div
                    key={trade.id}
                    className="rounded-2xl border p-4 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold">
                        {trade.symbol} • {trade.side}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {trade.ea}
                      </div>
                      <div className="text-xs text-slate-500">
                        Lot size: {trade.lot}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{trade.pnl}</div>
                      <button
                        onClick={() =>
                          handleCloseTrade(trade.ticket, trade.id)
                        }
                        className="mt-2 rounded-xl border px-3 py-1.5 text-xs font-semibold bg-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border p-4 bg-slate-50">
            <h3 className="text-lg font-bold mb-3">Risk Controls</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Risk per trade: {riskPerTrade}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={riskPerTrade}
                  onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Daily drawdown cap: {drawdownCap}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={drawdownCap}
                  onChange={(e) => setDrawdownCap(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <button
                onClick={() => setNewsFilter((v) => !v)}
                className="w-full rounded-2xl border bg-white p-4 flex items-center justify-between"
              >
                <div className="text-left">
                  <div className="font-semibold">News filter</div>
                  <div className="text-xs text-slate-500">
                    Pause around high-impact events
                  </div>
                </div>
                <div
                  className={`w-12 h-7 rounded-full relative ${
                    newsFilter ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                      newsFilter ? "right-1" : "left-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
