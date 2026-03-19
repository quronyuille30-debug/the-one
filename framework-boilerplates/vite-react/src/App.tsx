import { useMemo, useState } from 'react';

type EAItem = {
  id: number;
  name: string;
  type: string;
  pair: string;
  timeframe: string;
  status: string;
  risk: string;
};

type TradeItem = {
  id: number;
  symbol: string;
  side: string;
  lot: string;
  pnl: string;
  ea: string;
};

function App() {
  const [connected, setConnected] = useState(false);
  const [server, setServer] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [selectedEA, setSelectedEA] = useState<number | null>(null);
  const [configuredEA, setConfiguredEA] = useState<number | null>(null);
  const [message, setMessage] = useState('Tap any button to test the app flow.');
  const [showSettings, setShowSettings] = useState(false);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [drawdownCap, setDrawdownCap] = useState(2);
  const [newsFilter, setNewsFilter] = useState(true);
  const [trades, setTrades] = useState<TradeItem[]>([
    { id: 1, symbol: 'XAUUSD', side: 'BUY', lot: '0.10', pnl: '+$42.80', ea: 'Gold Scalper EA' },
    { id: 2, symbol: 'EURUSD', side: 'SELL', lot: '0.05', pnl: '+$11.20', ea: 'London Breakout EA' },
    { id: 3, symbol: 'US30', side: 'BUY', lot: '0.03', pnl: '-$6.40', ea: 'SMC Sniper EA' }
  ]);

  const eas: EAItem[] = [
    { id: 1, name: 'Gold Scalper EA', type: 'Scalping', pair: 'XAUUSD', timeframe: 'M1 / M5', status: 'Ready', risk: '1%' },
    { id: 2, name: 'Supply & Demand EA', type: 'S&D', pair: 'EURUSD / GBPUSD', timeframe: 'M5 / H1', status: 'Ready', risk: '1%' },
    { id: 3, name: 'London Breakout EA', type: 'Session', pair: 'EURUSD / GBPUSD', timeframe: 'M15', status: 'Active', risk: '0.5%' },
    { id: 4, name: 'SMC Sniper EA', type: 'Smart Money', pair: 'XAUUSD / US30', timeframe: 'M5 / M15', status: 'Paused', risk: '1%' },
    { id: 5, name: 'Trend Rider EA', type: 'Trend', pair: 'USDJPY / GBPUSD', timeframe: 'M15 / H1', status: 'Ready', risk: '0.5%' },
    { id: 6, name: 'News Filter Guard', type: 'Protection', pair: 'All Symbols', timeframe: 'All', status: 'Installed', risk: '-' }
  ];

  const selectedEAData = useMemo(
    () => eas.find((ea) => ea.id === selectedEA) || null,
    [selectedEA]
  );

  const statCard = (label: string, value: string, sub: string) => (
    <div className="rounded-2xl bg-white/15 p-3 text-center">
      <div className="text-xs text-white/80">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
      <div className="text-[11px] text-white/70 mt-1">{sub}</div>
    </div>
  );

  const statusClass = (status: string) => {
    if (status === 'Active' || status === 'Ready' || status === 'Installed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Paused') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-700';
  };

  const handleConnect = () => {
    if (!server || !login || !password) {
      setMessage('Enter broker server, MT5 login, and password/API key first.');
      return;
    }
    setConnected(true);
    setMessage(`Connected to ${server} as ${login}.`);
  };

  const handleUseEA = (ea: EAItem) => {
    if (!connected) {
      setMessage(`Connect your MT5 account before activating ${ea.name}.`);
      return;
    }
    setSelectedEA(ea.id);
    setMessage(`${ea.name} selected. You can now review settings or deploy it.`);
  };

  const handleOpenSettings = (ea: EAItem) => {
    setSelectedEA(ea.id);
    setShowSettings(true);
    setMessage(`Editing ${ea.name} settings.`);
  };

  const handleSaveSettings = () => {
    setConfiguredEA(selectedEA);
    setShowSettings(false);
    setMessage('Settings saved. Risk controls updated in the app preview.');
  };

  const handleCloseTrade = (id: number) => {
    const trade = trades.find((t) => t.id === id);
    setTrades((prev) => prev.filter((t) => t.id !== id));
    setMessage(trade ? `${trade.symbol} trade closed.` : 'Trade closed.');
  };

  const handleCloseAll = () => {
    setTrades([]);
    setMessage('All open trades closed.');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl">
        <header className="px-5 pt-6 pb-5 bg-slate-900 text-white sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300">MT5 EA Hub</p>
              <h1 className="text-3xl font-bold mt-2">iPhone Web App</h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold shadow-sm">EA</div>
          </div>
          <p className="text-sm text-slate-300 mt-4">
            Open this in Safari on iPhone, tap Share, then Add to Home Screen.
          </p>
        </header>

        <main className="p-5 space-y-5">
          <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-5 shadow-sm">
            <p className="text-sm text-blue-100">All your bots and trades in one dashboard</p>
            <h2 className="text-2xl font-bold mt-2 leading-tight">Connect MT5, browse EAs, and control trades from your phone</h2>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {statCard('Bots', String(eas.length), configuredEA ? '1 configured' : 'installed')}
              {statCard('Trades', String(trades.length), 'open now')}
              {statCard('P/L', '+$47', connected ? 'account linked' : 'demo mode')}
            </div>
          </section>

          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">App status</div>
            <div className="mt-1">{message}</div>
          </section>

          <section className="rounded-3xl border p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Connect MT5</h3>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                {connected ? 'Connected' : 'Browser App'}
              </span>
            </div>
            <div className="space-y-3">
              <input value={server} onChange={(e) => setServer(e.target.value)} className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none" placeholder="Broker server" />
              <input value={login} onChange={(e) => setLogin(e.target.value)} className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none" placeholder="MT5 login" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none" type="password" placeholder="Password / API key" />
              <button onClick={handleConnect} className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold">Connect Account</button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              This preview now reacts to clicks. Real MT5 execution would be added with a backend bridge later.
            </p>
          </section>

          <section className="rounded-3xl border p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">EA Marketplace</h3>
              <button onClick={() => setMessage('Browse all tapped. Add search and category filters next.')} className="text-sm font-semibold text-blue-600">Browse all</button>
            </div>
            <div className="space-y-3">
              {eas.map((ea) => (
                <div key={ea.id} className={`rounded-2xl border bg-slate-50 p-4 ${selectedEA === ea.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold">{ea.name}</div>
                      <div className="text-sm text-slate-500 mt-1">{ea.type} • {ea.pair}</div>
                      <div className="text-xs text-slate-500 mt-1">TF: {ea.timeframe}</div>
                      <div className="text-xs text-slate-500">Risk: {ea.risk}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(ea.status)}`}>
                      {ea.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={() => handleUseEA(ea)} className="rounded-xl bg-slate-900 text-white py-2 text-sm font-semibold">Use EA</button>
                    <button onClick={() => handleOpenSettings(ea)} className="rounded-xl border bg-white py-2 text-sm font-semibold">Settings</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {showSettings && selectedEAData && (
            <section className="rounded-3xl border p-4 bg-white">
              <h3 className="text-lg font-bold mb-3">{selectedEAData.name} Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Risk per trade: {riskPerTrade}%</label>
                  <input type="range" min="1" max="5" value={riskPerTrade} onChange={(e) => setRiskPerTrade(Number(e.target.value))} className="w-full mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Daily drawdown cap: {drawdownCap}%</label>
                  <input type="range" min="1" max="10" value={drawdownCap} onChange={(e) => setDrawdownCap(Number(e.target.value))} className="w-full mt-2" />
                </div>
                <button onClick={handleSaveSettings} className="w-full rounded-2xl bg-blue-600 text-white py-3 font-semibold">Save Settings</button>
              </div>
            </section>
          )}

          <section className="rounded-3xl border p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Open Trades</h3>
              <button onClick={handleCloseAll} className="text-sm font-semibold text-red-600">Close all</button>
            </div>
            <div className="space-y-3">
              {trades.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-500">No open trades right now.</div>
              ) : (
                trades.map((trade) => (
                  <div key={trade.id} className="rounded-2xl border p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold">{trade.symbol} • {trade.side}</div>
                      <div className="text-xs text-slate-500 mt-1">{trade.ea}</div>
                      <div className="text-xs text-slate-500">Lot size: {trade.lot}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{trade.pnl}</div>
                      <button onClick={() => handleCloseTrade(trade.id)} className="mt-2 rounded-xl border px-3 py-1.5 text-xs font-semibold bg-white">Close</button>
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
                <div className="flex justify-between text-sm mb-2">
                  <span>Risk per trade</span>
                  <span className="font-semibold">{riskPerTrade}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-3 rounded-full bg-slate-900" style={{ width: `${riskPerTrade * 20}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily drawdown cap</span>
                  <span className="font-semibold">{drawdownCap}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-3 rounded-full bg-slate-900" style={{ width: `${drawdownCap * 10}%` }}></div>
                </div>
              </div>
              <button onClick={() => { setNewsFilter((v) => !v); setMessage(`News filter ${!newsFilter ? 'enabled' : 'disabled'}.`); }} className="w-full rounded-2xl border bg-white p-4 flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold">News filter</div>
                  <div className="text-xs text-slate-500">Pause around high-impact events</div>
                </div>
                <div className={`w-12 h-7 rounded-full relative ${newsFilter ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${newsFilter ? 'right-1' : 'left-1'}`}></div>
                </div>
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-lg font-bold text-amber-900 mb-3">How to use this like an app on iPhone</h3>
            <div className="space-y-2 text-sm text-amber-900">
              <p>1. Open your live Vercel link in Safari</p>
              <p>2. Tap Share</p>
              <p>3. Tap Add to Home Screen</p>
              <p>4. Open it from your iPhone like an app</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
