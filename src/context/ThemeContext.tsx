import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, type Theme as MaterialTheme } from '../theme/theme';

/**
 * Theme Context for managing light/dark theme
 * Persists theme preference using AsyncStorage
 */

interface ThemeContextType {
  theme: MaterialTheme;
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (themeName: 'light' | 'dark') => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark';
}

const THEME_STORAGE_KEY = '@theme_preference';

/**
 * Theme Provider Component
 * Manages theme state and persistence
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'dark' 
}) => {
  const [theme, setThemeState] = useState<MaterialTheme>(
    initialTheme === 'light' ? lightTheme : darkTheme
  );
  const [isDarkMode, setIsDarkMode] = useState(initialTheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load saved theme preference from AsyncStorage
   */
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const themeName = savedTheme as 'light' | 'dark';
        setThemeState(themeName === 'light' ? lightTheme : darkTheme);
        setIsDarkMode(themeName === 'dark');
        console.log(`✓ Theme loaded: ${themeName}`);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Use default dark theme on error
      setThemeState(darkTheme);
      setIsDarkMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = async () => {
    try {
      const newThemeName: 'light' | 'dark' = isDarkMode ? 'light' : 'dark';
      const newTheme = newThemeName === 'light' ? lightTheme : darkTheme;
      
      setThemeState(newTheme);
      setIsDarkMode(newThemeName === 'dark');
      
      // Persist preference
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeName);
      console.log(`✓ Theme toggled to: ${newThemeName}`);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  /**
   * Set theme to a specific value
   */
  const setTheme = async (themeName: 'light' | 'dark') => {
    try {
      const newTheme = themeName === 'light' ? lightTheme : darkTheme;
      
      setThemeState(newTheme);
      setIsDarkMode(themeName === 'dark');
      
      // Persist preference
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
      console.log(`✓ Theme set to: ${themeName}`);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
