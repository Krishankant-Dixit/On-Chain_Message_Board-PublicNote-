import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useWeb3 } from '../context/Web3Context';
import { Button, MessageCard } from '../components';
import { theme } from '../theme';
import { Message } from '../utils/helpers';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isConnected, account, connectWallet, disconnectWallet } = useWeb3();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Demo messages for UI demonstration
  const demoMessages: Message[] = [
    {
      id: 1,
      content: 'Welcome to the On-Chain Message Board! This is a decentralized platform for sharing thoughts.',
      sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      timestamp: Date.now() / 1000 - 3600,
    },
    {
      id: 2,
      content: 'Building on blockchain is the future! Excited to be part of this community.',
      sender: '0x1234567890abcdef1234567890abcdef12345678',
      timestamp: Date.now() / 1000 - 7200,
    },
    {
      id: 3,
      content: 'Just deployed my first smart contract. This technology is amazing! 🚀',
      sender: '0xabcdef1234567890abcdef1234567890abcdef12',
      timestamp: Date.now() / 1000 - 86400,
    },
  ];

  useEffect(() => {
    if (isConnected) {
      loadMessages();
    }
  }, [isConnected]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      // Simulate loading messages from blockchain
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(demoMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
      Alert.alert('Success', 'Wallet connected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet');
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>On-Chain Message Board</Text>
          <Text style={styles.subtitle}>
            Connect your wallet to read and post messages on the blockchain
          </Text>
          
          <View style={styles.featureContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔗</Text>
              <Text style={styles.featureText}>Decentralized</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔐</Text>
              <Text style={styles.featureText}>Secure</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>On-Chain</Text>
            </View>
          </View>

          <Button
            title="Connect Wallet"
            onPress={handleConnect}
            size="large"
            style={styles.connectButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Message Board</Text>
          <Text style={styles.headerSubtitle}>
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </Text>
        </View>
        <TouchableOpacity onPress={disconnectWallet} style={styles.disconnectButton}>
          <Text style={styles.disconnectText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageCard message={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Be the first to post!</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          title="Post Message"
          onPress={() => navigation.navigate('PostMessage')}
          size="large"
          style={styles.postButton}
        />
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
  connectButton: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  disconnectButton: {
    padding: theme.spacing.sm,
  },
  disconnectText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl * 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  postButton: {
    width: '100%',
  },
});
