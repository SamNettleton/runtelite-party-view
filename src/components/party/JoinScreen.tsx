import { useState } from 'react';

interface JoinScreenProps {
  onJoin: (passphrase: string) => void;
  presets: string[];
}

export const JoinScreen: React.FC<JoinScreenProps> = ({ onJoin, presets }) => {
  const [passphrase, setPassphrase] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim()) {
      onJoin(passphrase.trim());
    }
  };

  const activePresets = presets.filter((p) => p && p.trim() !== '');

  return (
    <div style={styles.wrapper}>
      <form style={styles.joinPanel} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Party Passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          required
        />
        <button style={styles.joinButton} type="submit">
          Join Party
        </button>

        {activePresets.length > 0 && (
          <div style={styles.presetSection}>
            <div style={styles.divider}>
              <span style={styles.dividerText}>OR QUICK JOIN</span>
            </div>
            <div style={styles.presetGrid}>
              {activePresets.map((preset, index) => (
                <button key={index} onClick={() => onJoin(preset)} style={styles.presetButton}>
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    justifyContent: 'center',
  },
  joinPanel: {
    background: '#14151c',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxSizing: 'border-box',
  },
  input: {
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  joinButton: {
    padding: '0.75rem 1rem',
    background: '#00e66b',
    color: 'black',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
  },
  presetSection: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    lineHeight: '0.1em',
    margin: '10px 0 20px',
  },
  dividerText: {
    background: '#14151c',
    padding: '0 10px',
    color: '#64748b',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    letterSpacing: '0.05rem',
  },
  presetGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    width: '100%',
  },
  presetButton: {
    padding: '0.5rem 0.75rem',
    background: 'rgba(0, 230, 107, 0.1)',
    color: '#00e66b',
    border: '1px solid rgba(0, 230, 107, 0.3)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: '160px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'all 0.2s ease',
  },
};
