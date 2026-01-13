import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Web3Provider } from './src/context/Web3Context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <Web3Provider>
        <AppNavigator />
        <StatusBar style="light" />
      </Web3Provider>
    </SafeAreaProvider>
  );
}
