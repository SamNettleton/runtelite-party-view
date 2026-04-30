import { useState, useEffect } from 'react';
import { useRuneLiteParty } from '@/hooks/useRuneLiteParty';
import { JoinScreen } from '@/components/party/JoinScreen';
import { PartyTopBar } from '@/components/party/PartyTopBar';
import { HiddenPlayersList } from '@/components/party/HiddenPlayersList';
import { PlayerGrid } from '@/components/party/PlayerGrid';
import { PartySettings } from '@/components/party/PartySettings';
import { initItemDatabase } from '@/utils/itemResolver';
import { useSettings } from './hooks/useSettings';
import './index.css';

function App() {
  useEffect(() => {
    initItemDatabase();
  }, []);

  const settings = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [activePartyId, setActivePartyId] = useState<string | null>(null);
  const [hiddenPlayers, setHiddenPlayers] = useState<Set<string>>(new Set());

  const { players, status, error } = useRuneLiteParty(activePartyId);

  const handleJoin = (id: string) => {
    const sanitizedId = id.trim().toLowerCase().replace(/\s+/g, '-');
    setActivePartyId(sanitizedId);
  };

  const toggleHidePlayer = (id: string) => {
    setHiddenPlayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const hasPlayers = Object.values(players).some(
    (p) => !p.member.name?.toLowerCase().includes('observer') && p.member.name !== 'Loading...'
  );

  return (
    <div style={styles.appContainer}>
      <PartyTopBar
        status={status}
        partyId={activePartyId}
        onDisconnect={() => setActivePartyId(null)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Global Settings Modal */}
      {showSettings && <PartySettings {...settings} onClose={() => setShowSettings(false)} />}

      {!activePartyId ? (
        <div style={styles.centeredContent}>
          <JoinScreen
            onJoin={handleJoin}
            presets={settings.presets.filter((p: string) => p !== '')}
          />
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {/* Hidden Players management */}
          <HiddenPlayersList
            hiddenIds={hiddenPlayers}
            players={players}
            onUnhide={toggleHidePlayer}
          />

          {error && <div style={styles.errorMessage}>{error}</div>}

          {!hasPlayers && (status === 'connecting' || status === 'connected') && !error ? (
            <div>
              <p style={styles.waitingMessage}>Waiting for players to sync...</p>
              <p style={styles.waitingMessage}>
                Leave and rejoin the party in game to trigger a sync.
              </p>
            </div>
          ) : (
            <PlayerGrid
              players={players}
              hiddenIds={hiddenPlayers}
              multiTabMode={settings.multiTabMode}
              timerFormat={settings.timerFormat}
              onHidePlayer={toggleHidePlayer}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    maxWidth: '95vw',
    margin: '0 auto',
    padding: '1rem',
    position: 'relative',
  },
  settingsFixedBtn: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#64748b',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '6px',
  },
  waitingMessage: {
    color: '#94a3b8',
    textAlign: 'center',
    width: '100%',
    marginTop: '2rem',
  },
};
