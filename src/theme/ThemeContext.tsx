import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type AccentColor = 'indigo' | 'purple' | 'blue' | 'green' | 'rose' | 'amber';

interface ThemeContextProps {
  mode: ThemeMode;
  accentColor: AccentColor;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'dark',
  accentColor: 'indigo',
  toggleMode: () => {},
  setMode: () => {},
  setAccentColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize from local storage or default to dark mode
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as ThemeMode) || 'dark';
  });
  
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const savedColor = localStorage.getItem('accent-color');
    return (savedColor as AccentColor) || 'indigo';
  });
  
  // Apply theme when component mounts and when mode changes
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme-mode', mode);
  }, [mode]);
  
  // Apply accent color
  useEffect(() => {
    // Remove all accent colors
    document.documentElement.classList.remove(
      'accent-indigo', 
      'accent-purple', 
      'accent-blue', 
      'accent-green', 
      'accent-rose', 
      'accent-amber'
    );
    
    // Add selected accent color
    document.documentElement.classList.add(`accent-${accentColor}`);
    
    localStorage.setItem('accent-color', accentColor);
  }, [accentColor]);
  
  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeContext.Provider value={{ 
      mode, 
      accentColor, 
      toggleMode, 
      setMode, 
      setAccentColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility function to get accent color CSS variables
export const getAccentColorVariables = (accentColor: AccentColor) => {
  const colorMap = {
    indigo: {
      primary: 'rgb(79 70 229)', // indigo-600
      hover: 'rgb(67 56 202)', // indigo-700
      light: 'rgb(199 210 254)', // indigo-200
      dark: 'rgb(55 48 163)' // indigo-800
    },
    purple: {
      primary: 'rgb(147 51 234)', // purple-600
      hover: 'rgb(126 34 206)', // purple-700
      light: 'rgb(233 213 255)', // purple-200
      dark: 'rgb(107 33 168)' // purple-800
    },
    blue: {
      primary: 'rgb(37 99 235)', // blue-600
      hover: 'rgb(29 78 216)', // blue-700
      light: 'rgb(191 219 254)', // blue-200
      dark: 'rgb(30 64 175)' // blue-800
    },
    green: {
      primary: 'rgb(22 163 74)', // green-600
      hover: 'rgb(21 128 61)', // green-700
      light: 'rgb(187 247 208)', // green-200
      dark: 'rgb(22 101 52)' // green-800
    },
    rose: {
      primary: 'rgb(225 29 72)', // rose-600
      hover: 'rgb(190 18 60)', // rose-700
      light: 'rgb(254 205 211)', // rose-200
      dark: 'rgb(159 18 57)' // rose-800
    },
    amber: {
      primary: 'rgb(217 119 6)', // amber-600
      hover: 'rgb(180 83 9)', // amber-700
      light: 'rgb(253 230 138)', // amber-200
      dark: 'rgb(146 64 14)' // amber-800
    }
  };
  
  return colorMap[accentColor];
};

export default ThemeProvider; 