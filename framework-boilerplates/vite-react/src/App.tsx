import { useState } from 'react';
import api from './services/api';

function App() {
  const [message, setMessage] = useState('Not connected');

  const connect = async () => {
    const res = await api.connectMT5();
    setMessage(res.message);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>MT5 Web App</h1>

      <button onClick={connect}>
        Connect MT5
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;
