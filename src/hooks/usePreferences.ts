import { useLocalStorage } from './useLocalStorage';
import { UserPreferences } from '@/types';
import { useEffect } from 'react';

// Detect user's operating system
const detectOS = (): UserPreferences['operatingSystem'] => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('mac')) return 'mac';
  if (userAgent.includes('linux')) return 'linux';
  return 'windows';
};

const initialPreferences: UserPreferences = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  fontSize: 'medium',
  sidebarCollapsed: false,
  operatingSystem: detectOS(),
};

export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'gitkraken-guide-preferences',
    initialPreferences
  );

  // Apply dark mode class to document
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  const toggleDarkMode = () => {
    setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setFontSize = (fontSize: UserPreferences['fontSize']) => {
    setPreferences(prev => ({ ...prev, fontSize }));
  };

  const toggleSidebar = () => {
    setPreferences(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const setOperatingSystem = (operatingSystem: UserPreferences['operatingSystem']) => {
    setPreferences(prev => ({ ...prev, operatingSystem }));
  };

  return {
    preferences,
    toggleDarkMode,
    setFontSize,
    toggleSidebar,
    setOperatingSystem,
  };
}
