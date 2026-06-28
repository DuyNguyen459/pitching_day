import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface HealthResponse {
  status: string;
  database: string;
  redis: string;
}

interface EventData {
  eventId: string;
  eventName: string;
  startTime: string;
  endTime: string;
  accessCode: string;
}

interface SessionData {
  token: string;
  participantId: string;
  event: EventData;
}

const BACKEND_API_URL = 'http://localhost:3000';
const REALTIME_WS_URL = 'http://localhost:3001';

export function App() {
  // Navigation & View states
  const [view, setView] = useState<'entry' | 'home'>('entry');
  const [accessCode, setAccessCode] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [session, setSession] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Health and realtime states
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Parse path on load to see if we have /event/:code
  useEffect(() => {
    // Check if there is an active session in sessionStorage
    const savedSession = sessionStorage.getItem('eventSession');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession) as SessionData;
        setSession(parsed);
        setView('home');
        // If they are on a different page, push /event/participation
        if (window.location.pathname !== '/event/participation') {
          window.history.pushState(null, '', '/event/participation');
        }
      } catch (e) {
        sessionStorage.removeItem('eventSession');
      }
    } else {
      const path = window.location.pathname;
      const match = path.match(/^\/event\/([^/]+)$/);
      if (match && match[1] && match[1] !== 'participation') {
        setAccessCode(match[1]);
      }
    }

    // Handle browser back/forward navigation
    const handlePopState = () => {
      const saved = sessionStorage.getItem('eventSession');
      if (saved) {
        setSession(JSON.parse(saved));
        setView('home');
      } else {
        setSession(null);
        setView('entry');
        const path = window.location.pathname;
        const match = path.match(/^\/event\/([^/]+)$/);
        if (match && match[1] && match[1] !== 'participation') {
          setAccessCode(match[1]);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Backend Health Checks & Realtime subscription
  useEffect(() => {
    fetch(`${BACKEND_API_URL}/api/v1/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error('Failed to fetch health status:', err));

    const socket: Socket = io(REALTIME_WS_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle Event Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError('Vui lòng nhập Access Code.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const url = new URL(`${BACKEND_API_URL}/api/events/${encodeURIComponent(accessCode.trim())}/auth`);
      if (deviceId.trim()) {
        url.searchParams.append('device_id', deviceId.trim());
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Xác thực thất bại.');
      }

      // Save session
      const sessionData = data as SessionData;
      sessionStorage.setItem('eventSession', JSON.stringify(sessionData));
      setSession(sessionData);
      setView('home');
      
      // Update browser URL to Event Home Screen (SCR-005)
      window.history.pushState(null, '', '/event/participation');
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout/Disconnect
  const handleLogout = () => {
    sessionStorage.removeItem('eventSession');
    setSession(null);
    setView('entry');
    setAccessCode('');
    setDeviceId('');
    window.history.pushState(null, '', '/');
  };

  return (
    <main className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Pitching Day</h1>
        <div className="status-badge-container">
          <span className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
            Realtime: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </header>

      {/* Main View Area */}
      {view === 'entry' ? (
        <div className="auth-card">
          <div className="logo-container">⚡</div>
          <h2>QR Access Portal</h2>
          <p className="subtitle">Enter access code or scan QR code to enter the Pitching Day event</p>

          {error && (
            <div className="error-container">
              <span className="error-icon">!</span>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="accessCodeInput">Event Access Code</label>
              <div className="input-wrapper">
                <input
                  id="accessCodeInput"
                  type="text"
                  className="input-field"
                  placeholder="e.g. DEMO123"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="deviceIdInput">Participant Nickname / Device ID (Optional)</label>
              <div className="input-wrapper">
                <input
                  id="deviceIdInput"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Developer John"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="loader-spinner"></span> : 'Connect & Enter Event'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          {/* Event HUD */}
          {session && (
            <div className="hud-card">
              <div className="hud-info">
                <div className="hud-event-name">{session.event.eventName}</div>
                <div className="hud-event-time">
                  Start: {new Date(session.event.startTime).toLocaleString()} | End: {new Date(session.event.endTime).toLocaleString()}
                </div>
              </div>
              <div className="hud-meta">
                <span className="hud-badge">PID: {session.participantId.substring(0, 8)}...</span>
                <button className="btn-secondary" onClick={handleLogout}>Disconnect</button>
              </div>
            </div>
          )}

          {/* SCR-005 Main Dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Component 1: Q&A */}
            <section className="app-section">
              <h2>Q&A Session (SCR-005)</h2>
              <div className="health-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="questionInput">Ask a Question</label>
                  <textarea
                    id="questionInput"
                    className="input-field"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    placeholder="Type your question for the startups..."
                  ></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" style={{ accentColor: '#8b5cf6' }} /> Post anonymously
                  </label>
                  <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>Submit</button>
                </div>
              </div>
            </section>

            {/* Component 2: Voting */}
            <section className="app-section">
              <h2>Cast Your Vote (SCR-005)</h2>
              <div className="placeholder-section">
                <h3>Live Startup Directory</h3>
                <p>Voting lists and active pitch projects will appear here during the live session.</p>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Diagnostics HUD at bottom */}
      <section className="app-section" style={{ marginTop: '4rem', opacity: 0.7 }}>
        <h2 style={{ fontSize: '1rem', color: '#64748b' }}>System Diagnostics</h2>
        {health ? (
          <div className="health-card" style={{ padding: '1rem', display: 'flex', gap: '2rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Backend: <span className="status-ok">{health.status}</span></p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Database: <span className="status-ok">{health.database}</span></p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Cache: <span className="status-ok">{health.redis}</span></p>
          </div>
        ) : (
          <p className="loading-text" style={{ fontSize: '0.85rem' }}>Diagnostics loading...</p>
        )}
      </section>
    </main>
  );
}
