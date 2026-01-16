import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button, Input, Card } from '../components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { loginWithEmail, loginWithWallet } = useAuth();
  const { connectWallet, account } = useWeb3();
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      // Navigation is handled by App.tsx based on auth state
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setLoading(true);
    try {
      const walletAddress = await connectWallet();
      await loginWithWallet(walletAddress);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!loginMethod) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Company Message Board</Text>
          <Text style={styles.subtitle}>
            Secure, blockchain-powered communication for your team
          </Text>

          <View style={styles.featureContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>Encrypted</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🏢</Text>
              <Text style={styles.featureText}>Company-Wide</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⛓️</Text>
              <Text style={styles.featureText}>Blockchain</Text>
            </View>
          </View>

          <Text style={styles.methodTitle}>Choose Login Method</Text>

          <Button
            title="Login with Email"
            onPress={() => setLoginMethod('email')}
            size="large"
            style={styles.methodButton}
          />

          <Button
            title="Connect Wallet"
            onPress={() => setLoginMethod('wallet')}
            variant="secondary"
            size="large"
            style={styles.methodButton}
          />

          <Text style={styles.infoText}>
            New here? Your account will be created automatically on first login.
          </Text>
        </View>
      </View>
    );
  }

  if (loginMethod === 'email') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setLoginMethod(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.formTitle}>Email Login</Text>
          <Text style={styles.formSubtitle}>
            Enter your credentials to access your account
          </Text>

          <Card style={styles.formCard}>
            <Input
              label="Email"
              placeholder="your.email@company.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.inputContainer}
            />

            <Button
              title="Login"
              onPress={handleEmailLogin}
              loading={loading}
              size="large"
              style={styles.loginButton}
            />
          </Card>

          <Text style={styles.securityNote}>
            🔐 Your credentials are encrypted and secure
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.walletContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setLoginMethod(null)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.formTitle}>Wallet Login</Text>
        <Text style={styles.formSubtitle}>
          Connect your blockchain wallet to get started
        </Text>

        <Card style={styles.walletCard}>
          <Text style={styles.walletIcon}>👛</Text>
          <Text style={styles.walletText}>
            Click the button below to connect your Web3 wallet
          </Text>

          <Button
            title="Connect Wallet"
            onPress={handleWalletLogin}
            loading={loading}
            size="large"
            style={styles.connectButton}
          />

          <Text style={styles.walletInfo}>
            Supported wallets: MetaMask, Trust Wallet, WalletConnect
          </Text>
        </Card>

        <Text style={styles.securityNote}>
          🔐 Your wallet connection is secure and encrypted
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  welcomeContainer: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl * 2,
  },
  walletContainer: {
    flex: 1,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl * 2,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.xxl,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  methodTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  methodButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  backButton: {
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  formSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  walletCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  walletIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  walletText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  connectButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  walletInfo: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  securityNote: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
