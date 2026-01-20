import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useWeb3, formatAddress } from '../context/Web3Context';
import { Button, MessageCard } from '../components';
import { theme } from '../theme';
import { Message } from '../contracts/MessageBoard';
import { analyzeSentiment } from '../services/geminiService';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface DisplayMessage extends Message {
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isConnected, account, connectWallet, disconnectWallet, getMessages } = useWeb3();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadMessages();
    }
  }, [isConnected]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const fetchedMessages = await getMessages(20, 0);
      const messagesWithSentiment = await Promise.all(
        fetchedMessages.map(async (msg) => {
          try {
            const sentimentResult = await analyzeSentiment(msg.content);
            return {
              ...msg,
              sentiment: sentimentResult.sentiment,
            };
          } catch (error) {
            return msg;
          }
        })
      );
      setMessages(messagesWithSentiment);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages from blockchain');
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
      Alert.alert('Success', '✓ Wallet connected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet. Check your RPC URL configuration.');
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet?',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          onPress: () => {
            disconnectWallet();
            Alert.alert('Disconnected', 'Wallet disconnected successfully.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open URL: ${url}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const handlePostMessage = () => {
    if (!isConnected) {
      Alert.alert('Wallet Required', 'Please connect your wallet first');
      return;
    }
    navigation.navigate('PostMessage');
  };

  const renderMessage = ({ item }: { item: DisplayMessage }) => {
    const getSentimentIcon = (sentiment?: string) => {
      switch (sentiment) {
        case 'positive':
          return '😊';
        case 'negative':
          return '😔';
        default:
          return '😐';
      }
    };

    return (
      <MessageCard
        message={{
          ...item,
          sender: item.sender,
          sentimentIcon: getSentimentIcon(item.sentiment),
        }}
        variant="list"
        onPress={() => {
          Alert.alert(
            'Message Details',
            `From: ${formatAddress(item.sender)}\nContent: ${item.content}\nEdited: ${item.isEdited ? 'Yes' : 'No'}`
          );
        }}
      />
    );
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>💬</Text>
            </View>
            <Text style={styles.title}>PublicNote</Text>
            <Text style={styles.subtitle}>
              Decentralized messaging powered by blockchain technology
            </Text>
          </View>

          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>⛓️</Text>
              </View>
              <Text style={styles.featureTitle}>Decentralized</Text>
              <Text style={styles.featureDescription}>No central authority</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🔒</Text>
              </View>
              <Text style={styles.featureTitle}>Immutable</Text>
              <Text style={styles.featureDescription}>Tamper-proof records</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🤖</Text>
              </View>
              <Text style={styles.featureTitle}>AI-Powered</Text>
              <Text style={styles.featureDescription}>Smart analysis</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>⚡</Text>
              </View>
              <Text style={styles.featureTitle}>Fast</Text>
              <Text style={styles.featureDescription}>Quick transactions</Text>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <Button
              title="Connect Wallet"
              onPress={handleConnect}
              size="large"
              variant="primary"
              fullWidth
              icon="🔗"
            />

            <View style={styles.linksContainer}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openLink('https://remix.ethereum.org')}
              >
                <Text style={styles.linkIcon}>📝</Text>
                <Text style={styles.linkText}>Deploy Contract</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openLink('https://metamask.io')}
              >
                <Text style={styles.linkIcon}>🦊</Text>
                <Text style={styles.linkText}>Get MetaMask</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <Text style={styles.headerIcon}>💬</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Messages</Text>
            <View style={styles.walletBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.walletAddress}>
                {account ? formatAddress(account) : 'Not connected'}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.composeButton}
          onPress={handlePostMessage}
        >
          <Text style={styles.composeIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
          </View>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyDescription}>
            Be the first to post a message on the blockchain
          </Text>
          <Button
            title="Post First Message"
            onPress={handlePostMessage}
            size="large"
            style={styles.actionButton}
          />
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}

      {isConnected && (
        <View style={styles.fab}>
          <TouchableOpacity 
            style={styles.fabButton}
            onPress={handlePostMessage}
            activeOpacity={0.8}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl + 20,
    paddingBottom: theme.spacing.xl,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
    paddingHorizontal: theme.spacing.md,
  },
  
  // Feature Grid
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xxl,
  },
  featureCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Action Container
  actionContainer: {
    marginTop: 'auto',
  },
  linksContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  linkButton: {
    flex: 1,
    backgroundColor: theme.colors.backgroundTertiary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linkIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginBottom: theme.spacing.xs,
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderDark,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.online,
    marginRight: theme.spacing.xs,
  },
  walletAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  composeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  composeIcon: {
    fontSize: 20,
  },
  
  // List Styles
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  
  // Center Container
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
  actionButton: {
    marginTop: theme.spacing.md,
  },
  
  // FAB (Floating Action Button)
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: theme.colors.textOnPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
