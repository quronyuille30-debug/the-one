import { useState } from 'react';
import api from './services/api';

function App() {
  const [message, setMessage] = useState('Not connected');

  const handleConnect = async () => {
    try {
      const result = await api.connectMT5();
      setMessage(result.message);
    } catch (error) {
      setMessage('Connection failed');
      console.error(error);
    }
  };

  const handleStatus = async () => {
    try {
      const result = await api.getStatus();
      setMessage(`System status: ${result.status}`);
    } catch (error) {
      setMessage('Status check failed');
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '10px' }}>MT5 Trading Dashboard</h1>
        <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
          Frontend test app for MT5 connection
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={handleConnect}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: '#22c55e',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Connect MT5
          </button>

          <button
            onClick={handleStatus}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Check Status
          </button>
        </div>

        <div
          style={{
            background: '#0f172a',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid #334155',
          }}
        >
          <strong>Message:</strong>
          <p style={{ marginBottom: 0 }}>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
