import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { Web3Provider } from './src/context/Web3Context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Web3Provider>
          <AppNavigator />
          <StatusBar style="light" />
        </Web3Provider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
