import { useState, useEffect } from 'react';

const SETTINGS_KEY = 'party_app_settings';

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      presets: ['', '', '', '', ''],
      timerFormat: 'ticks',
      multiTabMode: true,
    };

    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return defaultSettings;

    try {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updatePreset = (index: number, value: string) => {
    const newPresets = [...settings.presets];
    newPresets[index] = value;
    setSettings({ ...settings, presets: newPresets });
  };

  const setTimerFormat = (format: 'ticks' | 'mss') =>
    setSettings({ ...settings, timerFormat: format });

  const setMultiTabMode = (enabled: boolean) => setSettings({ ...settings, multiTabMode: enabled });

  return { ...settings, updatePreset, setTimerFormat, setMultiTabMode };
};
