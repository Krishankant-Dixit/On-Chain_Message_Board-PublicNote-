import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { Card, Button } from '../components';

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { account, isConnected, disconnectWallet } = useWeb3();
  const { theme: materialTheme } = useTheme();

  const handleCopyAddress = () => {
    if (account) {
      Clipboard.setString(account);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              if (isConnected) {
                disconnectWallet();
              }
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: materialTheme.colors.background }]}>
        <Text style={[styles.errorText, { color: materialTheme.colors.textSecondary }]}>
          No user data available
        </Text>
      </View>
    );
  }

  const initials = getInitials(user.name);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: materialTheme.colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={[styles.avatarLarge, { backgroundColor: materialTheme.colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.userName, { color: materialTheme.colors.textPrimary }]}>
          {user.name}
        </Text>
        <Text style={[styles.userEmail, { color: materialTheme.colors.textSecondary }]}>
          {user.email || user.walletAddress}
        </Text>
        <View style={[styles.badge, { backgroundColor: `${materialTheme.colors.primary}20` }]}>
          <Text style={[styles.badgeText, { color: materialTheme.colors.primary }]}>
            {user.authMethod === 'email' ? '📧 Email' : '🔗 Wallet'}
          </Text>
        </View>
      </View>

      {/* Account Info */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
          Account Information
        </Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: materialTheme.colors.textSecondary }]}>
            User ID
          </Text>
          <Text style={[styles.infoValue, { color: materialTheme.colors.textPrimary }]}>
            {user.id.slice(0, 8)}...
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: materialTheme.colors.textSecondary }]}>
            Auth Method
          </Text>
          <Text style={[styles.infoValue, { color: materialTheme.colors.textPrimary }]}>
            {user.authMethod}
          </Text>
        </View>

        {user.companyId && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: materialTheme.colors.textSecondary }]}>
                Company ID
              </Text>
              <Text style={[styles.infoValue, { color: materialTheme.colors.textPrimary }]}>
                {user.companyId}
              </Text>
            </View>
          </>
        )}
      </Card>

      {/* Wallet Info */}
      {isConnected && account && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: materialTheme.colors.textPrimary }]}>
            Wallet Connection
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: materialTheme.colors.textSecondary }]}>
              Status
            </Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={[styles.statusText, { color: materialTheme.colors.success }]}>
                Connected
              </Text>
            </View>
          </View>
ouchableOpacity onPress={handleCopyAddress} style={styles.addressContainer}>
              <Text style={[styles.infoValue, { color: materialTheme.colors.textPrimary }]} numberOfLines={1}>
                {account.slice(0, 10)}...{account.slice(-8)}
              </Text>
              <Text style={styles.copyIcon}>📋</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: `${materialTheme.colors.primary}10` }]}
            onPress={handleCopyAddress}
          >
            <Text style={styles.copyIcon}>📋</Text>
            <Text style={[styles.copyButtonText, { color: materialTheme.colors.primary }]}>
              Copy Full Address
            </Text>
          </TouchableOpacitystyle={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: materialTheme.colors.textSecondary }]}>
              Address
            </Text>
            <Text style={[styles.infoValue, { color: materialTheme.colors.textPrimary }]} numberOfLines={1}>
              {account.slice(0, 10)}...{account.slice(-8)}
            </Text>
          </View>
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Edit Profile"
          onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
          variant="outline"
          size="large"
          fullWidth
        />
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          size="large"
          fullWidth
          style={styles.logoutButton}
        />
      </View>
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
  errorText: {
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.base,
    marginBottom: theme.spacing.md,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  // Sections
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.base,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: theme.spacing.xs,
  },
  copyIcon: {
    fontSize: 16,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  copyButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Actions
  actions: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
});
