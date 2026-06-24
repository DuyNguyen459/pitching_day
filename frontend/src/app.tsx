import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface HealthResponse {
  status: string;
  database: string;
  redis: string;
}

interface VoteMessage {
  pitchId: string;
  score: number;
}

const BACKEND_API_URL = 'http://localhost:3000';
const REALTIME_WS_URL = 'http://localhost:3001';

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [votes, setVotes] = useState<VoteMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Fetch backend health status
    fetch(`${BACKEND_API_URL}/api/v1/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error('Failed to fetch health status:', err));

    // Connect to Socket.io realtime service
    const socket: Socket = io(REALTIME_WS_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('vote-updates', (data: VoteMessage) => {
      setVotes((prevVotes) => [...prevVotes, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Pitching Day Dashboard</h1>
        <div className="status-badge-container">
          <span className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
            Realtime WS: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </header>

      <section className="app-section">
        <h2>Backend API & Database Status</h2>
        {health ? (
          <div className="health-card">
            <p><strong>System Status:</strong> <span className="status-ok">{health.status}</span></p>
            <p><strong>Database (PostgreSQL):</strong> <span className="status-ok">{health.database}</span></p>
            <p><strong>Cache (Redis):</strong> <span className="status-ok">{health.redis}</span></p>
          </div>
        ) : (
          <p className="loading-text">Loading backend health status...</p>
        )}
      </section>

      <section className="app-section">
        <h2>Live Pitch Evaluations & Votes</h2>
        <div className="votes-container">
          {votes.length === 0 ? (
            <p className="empty-text">No votes received yet. Waiting for realtime events...</p>
          ) : (
            <ul className="votes-list">
              {votes.map((vote, index) => (
                <li key={index} className="vote-item">
                  Pitch ID: <code>{vote.pitchId}</code> evaluated with <strong>{vote.score}</strong> points
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
