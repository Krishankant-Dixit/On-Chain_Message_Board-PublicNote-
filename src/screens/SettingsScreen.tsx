import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components';

type SettingsScreenNavigationProp = NativeStackNavigationProp<any, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme: materialTheme, isDarkMode, toggleTheme } = useTheme();
  const [isClearingCache, setIsClearingCache] = useState(false);

  const handleThemeToggle = async () => {
    await toggleTheme();
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all locally stored data except your theme preference. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearingCache(true);
              
              // Get all keys
              const keys = await AsyncStorage.getAllKeys();
              
              // Filter out theme preference key to preserve it
              const keysToRemove = keys.filter(key => key !== '@theme_preference');
              
              // Remove all keys except theme
              if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
              }
              
              setIsClearingCache(false);
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              setIsClearingCache(false);
              Alert.alert('Error', 'Failed to clear cache');
              console.error('Clear cache error:', error);
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    onPress: () => void,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: materialTheme.colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.settingDescription, { color: materialTheme.colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
      {rightComponent || (
        <Text style={[styles.chevron, { color: materialTheme.colors.textSecondary }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: materialTheme.colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: materialTheme.colors.textPrimary }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: materialTheme.colors.textSecondary }]}>
          Manage your app preferences
        </Text>
      </View>

      {/* Appearance */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
          Appearance
        </Text>
        
        {renderSettingItem(
          '🌙',
          'Dark Mode',
          isDarkMode ? 'Switch to light theme' : 'Switch to dark theme',
          handleThemeToggle,
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={isDarkMode ? theme.colors.primaryLight : theme.colors.background}
          />
        )}
      </Card>

      {/* Storage */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
          Storage
        </Text>
        
        {renderSettingItem(
          '🗑️',
          'Clear Cache',
          'Remove locally stored data',
          handleClearCache,
          isClearingCache ? (
            <ActivityIndicator size="small" color={materialTheme.colors.primary} />
          ) : undefined
        )}
      </Card>

      {/* Blockchain */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
          Blockchain
        </Text>
        
        {renderSettingItem(
          '🔗',
          'Network',
          'Manage blockchain network settings',
          () => Alert.alert('Network Settings', 'Network configuration coming soon!')
        )}

        <View style={[styles.divider, { backgroundColor: materialTheme.colors.border }]} />

        {renderSettingItem(
          '⛽',
          'Gas Settings',
          'Configure transaction gas preferences',
          () => Alert.alert('Gas Settings', 'Gas configuration coming soon!')
        )}
      </Card>

      {/* Notifications */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
          Notifications
        </Text>
        
        {renderSettingItem(
          '🔔',
          'Push Notifications',
          'Receive notifications for new messages',
          () => Alert.alert('Notifications', 'Notification settings coming soon!')
        )}

        <View style={[styles.divider, { backgroundColor: materialTheme.colors.border }]} />

        {renderSettingItem(
          '📧',
          'Email Notifications',
          'Get email updates for important events',
          () => Alert.alert('Email', 'Email notification settings coming soon!')
        )}
      </Card>

      {/* Privacy & Security */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
          Privacy & Security
        </Text>
        
        {renderSettingItem(
          '🔒',
          'Privacy Settings',
          'Control your data and privacy',
          () => Alert.alert('Privacy', 'Privacy settings coming soon!')
        )}

        <View style={[styles.divider, { backgroundColor: materialTheme.colors.border }]} />

        {renderSettingItem(
          '🔑',
          'Security',
          'Manage security and authentication',
          () => Alert.alert('Security', 'Security settings coming soon!')
        )}
      </Card>

      {/* About */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
          About
        </Text>
        
        {renderSettingItem(
          'ℹ️',
          'App Version',
          'Version 1.0.0',
          () => Alert.alert('App Info', 'PublicNote v1.0.0\nBlockchain Message Board')
        )}

        <View style={[styles.divider, { backgroundColor: materialTheme.colors.border }]} />

        {renderSettingItem(
          '📖',
          'Terms & Conditions',
          'View terms and conditions',
          () => Alert.alert('Terms', 'Terms and conditions coming soon!')
        )}

        <View style={[styles.divider, { backgroundColor: materialTheme.colors.border }]} />

        {renderSettingItem(
          '🛡️',
          'Privacy Policy',
          'View privacy policy',
          () => Alert.alert('Privacy Policy', 'Privacy policy coming soon!')
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Header
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
  },

  // Sections
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: theme.typography.fontSize.sm,
  },
  chevron: {
    fontSize: 24,
    marginLeft: theme.spacing.sm,
  },
  divider: {
    height: 1,
  },
});
