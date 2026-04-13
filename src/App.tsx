import { useState } from 'react';
import { PlayerState } from '@/types';
import { useRuneLiteParty } from '@/hooks/useRuneLiteParty';
import { getQtyColor } from '@/utils/itemHelpers';
import './index.css';
import { PlayerCard } from '@/components/PlayerCard';

function App() {
  const [partyPassphrase, setPartyPassphrase] = useState('');
  const [activePartyId, setActivePartyId] = useState<string | null>(null);
  const { players, connected, error, localMemberId } = useRuneLiteParty(activePartyId);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (partyPassphrase.trim()) {
      setActivePartyId(partyPassphrase.trim());
    }
  };

  const handleDisconnect = () => {
    setActivePartyId(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>RuneLite Party View</h1>
        <p>Monitor your party's inventory and stats in real-time</p>
      </header>

      {!activePartyId ? (
        <form className="join-panel" onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Enter Party Passphrase"
            value={partyPassphrase}
            onChange={(e) => setPartyPassphrase(e.target.value)}
            required
          />
          <button type="submit">Join Party</button>
        </form>
      ) : (
        <div className="dashboard">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <div>
              <span className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
                {connected ? 'Connected' : 'Connecting...'}
              </span>
              <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>
                Party: <strong>{activePartyId}</strong>
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Disconnect
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div style={styles.playersGrid}>
            {Object.values(players).length === 0 && connected && !error && (
              <p style={{ color: 'var(--text-muted)' }}>Waiting for players to sync...</p>
            )}

            {Object.entries(players)
              .filter(([memberId]) => memberId !== localMemberId)
              .map(([memberId, player]) => (
                <PlayerCard key={memberId} memberId={memberId} player={player} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

const styles: Record<string, React.CSSProperties> = {
  playersGrid: {
    display: 'grid',
    // This allows cards to sit side-by-side if there's room
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
    alignItems: 'start',
    width: '100%',
  },
};
