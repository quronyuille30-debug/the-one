import { useState } from "react";

function App() {
  const [connected, setConnected] = useState(false);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>MT5 EA Dashboard</h1>

      <button
        onClick={() => setConnected(true)}
        style={{
          padding: 10,
          background: "green",
          color: "white",
          border: "none",
          borderRadius: 5,
        }}
      >
        Connect MT5
      </button>

      {connected && (
        <div style={{ marginTop: 20 }}>
          <h2>EAs</h2>

          <button style={{ margin: 5 }}>Run Gold EA</button>
          <button style={{ margin: 5 }}>Run Forex EA</button>
          <button style={{ margin: 5 }}>Run Scalper EA</button>
        </div>
      )}
    </div>
  );
}

export default App;
