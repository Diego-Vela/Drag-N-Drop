// Base Imports
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
// Third-party Imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import { vars } from 'nativewind';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const systemTheme = useColorScheme();
  
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const colorScheme = isDark ? 'dark' : 'light';

  // Load saved theme on app start
  useEffect(() => {
    loadTheme();
  }, []);

  // Update NativeWind's color scheme
  useEffect(() => {
    vars({ colorScheme: colorScheme });
  }, [colorScheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};