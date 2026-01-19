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
        { text: 'Cancel', onPress: () => {} },
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
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Alert.alert(
            'Message Details',
            `From: ${item.sender}\nContent: ${item.content}\nEdited: ${item.isEdited ? 'Yes' : 'No'}`
          );
        }}
      >
        <MessageCard
          message={{
            ...item,
            sender: formatAddress(item.sender),
            sentimentIcon: getSentimentIcon(item.sentiment),
          }}
        />
      </TouchableOpacity>
    );
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>🔗 On-Chain Message Board</Text>
          <Text style={styles.subtitle}>
            Blockchain-powered secure communication for your team
          </Text>

          <View style={styles.featureContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⛓️</Text>
              <Text style={styles.featureText}>Decentralized</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>Immutable</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>AI-Powered</Text>
            </View>
          </View>

          <Button
            title="Connect Wallet"
            onPress={handleConnect}
            size="large"
            style={styles.connectButton}
          />

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink('https://remix.ethereum.org')}
          >
            <Text style={styles.linkText}>📝 Deploy Contract on Remix IDE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink('https://metamask.io')}
          >
            <Text style={styles.linkText}>🦊 Install MetaMask Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            Network: {account ? formatAddress(account) : 'Not connected'}
          </Text>
        </View>
        <Button
          title="Post"
          onPress={handlePostMessage}
          size="small"
          style={styles.postButton}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>📭 No messages yet</Text>
          <Button
            title="Post First Message"
            onPress={handlePostMessage}
            size="medium"
            style={styles.actionButton}
          />
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Refresh"
          onPress={onRefresh}
          variant="secondary"
          size="small"
          style={styles.footerButton}
        />
        <Button
          title="Disconnect"
          onPress={handleDisconnect}
          variant="secondary"
          size="small"
          style={styles.footerButton}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  postButton: {
    paddingHorizontal: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.lg,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    marginTop: theme.spacing.md,
  },
  welcomeContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },
  connectButton: {
    marginBottom: theme.spacing.md,
  },
  linkButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
