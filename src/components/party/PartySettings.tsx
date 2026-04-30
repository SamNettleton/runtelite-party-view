import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from '@mui/material';

interface PartySettingsProps {
  presets: string[];
  timerFormat: 'ticks' | 'mss';
  multiTabMode: boolean;
  updatePreset: (index: number, value: string) => void;
  setTimerFormat: (format: 'ticks' | 'mss') => void;
  setMultiTabMode: (enabled: boolean) => void;
  onClose: () => void;
}

export const PartySettings: React.FC<PartySettingsProps> = ({
  presets,
  timerFormat,
  multiTabMode,
  updatePreset,
  setTimerFormat,
  setMultiTabMode,
  onClose,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Settings</h3>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>Party Presets</p>
          <div style={styles.presetList}>
            {presets.map((p, i) => (
              <input
                key={i}
                style={styles.input}
                value={p}
                onChange={(e) => updatePreset(i, e.target.value)}
                placeholder={`Slot ${i + 1}`}
                maxLength={60}
              />
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>Overload Display</p>
          <div style={styles.selectWrapper}>
            <select
              style={styles.select}
              value={timerFormat}
              onChange={(e) => setTimerFormat(e.target.value as 'ticks' | 'mss')}
            >
              <option style={styles.option} value="ticks">
                Ticks
              </option>
              <option style={styles.option} value="mss">
                M:SS
              </option>
            </select>
            <ExpandMoreIcon style={styles.selectArrow} />
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.switchRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <p style={styles.sectionTitleNoMargin}>Allow Multiple Panels</p>
              <Tooltip
                title="When this setting is ON, clicking header items such as inventory and equipment tabs will open cards side by side rather than toggling between cards."
                arrow
                placement="top"
              >
                <InfoOutlinedIcon style={{ fontSize: '16px', color: '#94a3b8', cursor: 'help' }} />
              </Tooltip>
            </div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={multiTabMode}
                onChange={(e) => setMultiTabMode(e.target.checked)}
                style={styles.switchInput}
              />
              <span
                style={{
                  ...styles.slider,
                  backgroundColor: multiTabMode ? '#00e66b' : '#333',
                }}
              >
                <span
                  style={{
                    ...styles.sliderKnob,
                    transform: multiTabMode ? 'translateX(18px)' : 'translateX(0px)',
                  }}
                />
              </span>
            </label>
          </div>
        </div>

        <button style={styles.closeButton} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#14151c', // Matched to JoinScreen background
    padding: '24px',
    borderRadius: '12px',
    width: '320px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  title: { margin: '0 0 20px 0', color: '#fff', fontSize: '1.2rem' },
  section: { marginBottom: '24px' },
  sectionTitle: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  sectionTitleNoMargin: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    margin: 0,
    fontWeight: 'bold',
  },
  presetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    width: '100%',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: '6px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  selectWrapper: {
    position: 'relative',
    width: '100%',
  },
  select: {
    width: '100%',
    padding: '10px',
    paddingRight: '32px',
    background: '#1a1b23',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  },
  selectArrow: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none',
    fontSize: '20px',
  },
  option: {
    background: '#1a1b23',
    color: '#fff',
  },
  switchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '22px',
    cursor: 'pointer',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '34px',
    transition: '0.3s',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
  },
  sliderKnob: {
    height: '18px',
    width: '18px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: '0.3s',
  },
  closeButton: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    background: '#00e66b',
    color: 'black',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
