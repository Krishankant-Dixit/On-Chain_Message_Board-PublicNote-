import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⛓️</Text>
      <Text style={styles.subtitle}>On-Chain Message Board</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
  },
  loader: {
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
