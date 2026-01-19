import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button, Input, Card } from '../components';
import { theme } from '../theme';
import { useWeb3, formatAddress } from '../context/Web3Context';
import { MAX_MESSAGE_LENGTH, NETWORK_NAMES } from '../utils/constants';
import {
  analyzeMessageSafety,
  generateSmartSuggestions,
  extractTopics,
} from '../services/geminiService';

type PostMessageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PostMessage'
>;

interface PostMessageScreenProps {
  navigation: PostMessageScreenNavigationProp;
}

interface SafetyResult {
  isSafe: boolean;
  category?: string;
  recommendation: string;
}

export const PostMessageScreen: React.FC<PostMessageScreenProps> = ({
  navigation,
}) => {
  const { account, chainId, postMessage } = useWeb3();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [safetyResult, setSafetyResult] = useState<SafetyResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;
  const networkName = chainId ? NETWORK_NAMES[chainId] || 'Unknown' : 'Ethereum';
  const isValid = message.trim().length > 0 && remainingChars >= 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (message.trim() && message.length > 10) {
        analyzeMessageWithAI();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [message]);

  const analyzeMessageWithAI = async () => {
    setAnalyzing(true);
    try {
      const safety = await analyzeMessageSafety(message);
      setSafetyResult(safety);

      const newSuggestions = await generateSmartSuggestions(
        message,
        'professional business communication'
      );
      setSuggestions(newSuggestions);

      const newTopics = await extractTopics(message);
      setTopics(newTopics);
    } catch (error) {
      console.warn('AI analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePost = async () => {
    if (!isValid) {
      Alert.alert('Error', 'Please enter a valid message');
      return;
    }

    if (safetyResult && !safetyResult.isSafe) {
      Alert.alert(
        'Content Warning',
        `Your message may be inappropriate (${safetyResult.category}). Do you want to post anyway?`,
        [
          { text: 'Cancel', onPress: () => {} },
          {
            text: 'Post Anyway',
            onPress: () => postToBlockchain(),
          },
        ]
      );
      return;
    }

    postToBlockchain();
  };

  const postToBlockchain = async () => {
    setLoading(true);
    try {
      const txHash = await postMessage(message);
      
      Alert.alert(
        'Success ✓',
        `Message posted to blockchain!\nTx: ${txHash.slice(0, 10)}...`,
        [
          {
            text: 'OK',
            onPress: () => {
              setMessage('');
              setSafetyResult(null);
              setSuggestions([]);
              setTopics([]);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error posting message:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to post message'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSafetyIndicator = () => {
    if (!safetyResult) return null;

    const icon = safetyResult.isSafe ? '✓' : '⚠️';
    const color = safetyResult.isSafe ? theme.colors.success : theme.colors.error;

    return (
      <View style={[styles.safetyCard, { borderLeftColor: color }]}>
        <Text style={[styles.safetyText, { color }]}>
          {icon} {safetyResult.recommendation}
        </Text>
      </View>
    );
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;

    return (
      <Card style={styles.suggestionsCard}>
        <Text style={styles.suggestionsTitle}>💡 Smart Suggestions</Text>
        {suggestions.map((suggestion, index) => (
          <View key={index} style={styles.suggestionItem}>
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </View>
        ))}
      </Card>
    );
  };

  const renderTopics = () => {
    if (topics.length === 0) return null;

    return (
      <View style={styles.topicsContainer}>
        <Text style={styles.topicsLabel}>Topics Detected:</Text>
        <View style={styles.topicsList}>
          {topics.map((topic, index) => (
            <View key={index} style={styles.topicTag}>
              <Text style={styles.topicText}>#{topic}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Post Message</Text>
          <Text style={styles.subtitle}>Share your thoughts on-chain</Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>From:</Text>
            <Text style={styles.infoValue}>
              {account ? formatAddress(account) : 'Not connected'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network:</Text>
            <Text style={styles.infoValue}>{networkName}</Text>
          </View>
        </Card>

        <View style={styles.inputContainer}>
          <Input
            label="Message"
            placeholder="What's on your mind?"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            maxLength={MAX_MESSAGE_LENGTH}
            style={styles.textArea}
            containerStyle={styles.inputWrapper}
          />
          <View style={styles.charCountContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={[
                  styles.charCount,
                  remainingChars < 0 && styles.charCountError,
                ]}
              >
                {remainingChars} characters remaining
              </Text>
              {analyzing && (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                  style={{ marginLeft: theme.spacing.md }}
                />
              )}
            </View>
          </View>
        </View>

        {renderSafetyIndicator()}
        {renderTopics()}
        {renderSuggestions()}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipsText}>
            • AI analyzes content for safety and appropriateness{'\n'}
            • Topics are extracted automatically{'\n'}
            • Suggestions appear while you type{'\n'}
            • Messages stored permanently on blockchain
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.cancelButton}
          />
          <Button
            title={loading ? 'Posting...' : 'Post Message'}
            onPress={handlePost}
            disabled={!isValid || loading || analyzing}
            style={styles.postButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputWrapper: {
    marginBottom: theme.spacing.xs,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  charCount: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  charCountError: {
    color: theme.colors.error,
  },
  safetyCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: theme.spacing.md,
  },
  safetyText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },
  topicsContainer: {
    marginBottom: theme.spacing.lg,
  },
  topicsLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  topicTag: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  topicText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
  },
  suggestionsCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
  },
  suggestionsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  suggestionItem: {
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  tipsCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  tipsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tipsText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  postButton: {
    flex: 1,
  },
});
