import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip } from '@mui/material';
import { ConnectionStatus } from '@/types';

interface PartyTopBarProps {
  status: ConnectionStatus;
  partyId: string | null;
  onDisconnect: () => void;
  onOpenSettings: () => void;
}

export const PartyTopBar: React.FC<PartyTopBarProps> = ({
  status,
  partyId,
  onDisconnect,
  onOpenSettings,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return { label: 'Connected', color: '#00e66b' }; // Theme green
      case 'reconnecting':
        return { label: 'Reconnecting...', color: '#0b90f5' }; // Blue waiting
      case 'connecting':
        return { label: 'Connecting...', color: '#94a3b8' }; // Gray
      default:
        return { label: 'Disconnected', color: '#ef4444' }; // Red
    }
  };

  const config = getStatusConfig();

  return (
    <div style={styles.topBar}>
      <div style={styles.statusGroup}>
        {partyId ? (
          <>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: `${config.color}20`,
                color: config.color,
                border: `1px solid ${config.color}40`,
              }}
            >
              {config.label}
            </span>
            <span style={styles.partyInfo}>
              Party: <strong style={{ marginLeft: '6px' }}>{partyId}</strong>
            </span>
          </>
        ) : (
          <span style={styles.brandText}>RuneLite Party Viewer</span>
        )}
      </div>

      <div style={styles.buttonGroup}>
        {partyId && (
          <Tooltip title="Leave Party">
            <button onClick={onDisconnect} style={styles.disconnectIconBtn}>
              <LogoutIcon style={{ fontSize: '24px' }} />
            </button>
          </Tooltip>
        )}

        <Tooltip title="Settings">
          <button onClick={onOpenSettings} style={styles.settingsBtn}>
            <SettingsIcon style={{ fontSize: '24px' }} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  statusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connected: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
  },
  disconnected: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },
  partyInfo: {
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
  brandText: {
    color: '#00e66b',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  settingsBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    opacity: 0.8,
    transition: 'all 0.2s',
  },
  disconnectIconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    opacity: 0.8,
    transition: 'all 0.2s',
  },
  disconnectBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
