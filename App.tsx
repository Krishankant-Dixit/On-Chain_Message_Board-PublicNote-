import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { Web3Provider } from './src/context/Web3Context';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeGemini } from './src/services/geminiService';

export default function App() {
  useEffect(() => {
    // Initialize Gemini AI service on app start
    const geminiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (geminiKey) {
      initializeGemini(geminiKey);
      console.log('✓ Gemini AI initialized');
    } else {
      console.warn('⚠ Gemini API key not configured');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme="dark">
        <AuthProvider>
          <Web3Provider>
            <AppNavigator />
            <StatusBar style="light" />
          </Web3Provider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
