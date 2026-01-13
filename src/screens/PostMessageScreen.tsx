import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button, Input, Card } from '../components';
import { theme } from '../theme';
import { useWeb3 } from '../context/Web3Context';

type PostMessageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PostMessage'
>;

interface PostMessageScreenProps {
  navigation: PostMessageScreenNavigationProp;
}

export const PostMessageScreen: React.FC<PostMessageScreenProps> = ({
  navigation,
}) => {
  const { account } = useWeb3();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const maxLength = 280;
  const remainingChars = maxLength - message.length;

  const handlePost = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (message.length > maxLength) {
      Alert.alert('Error', `Message must be ${maxLength} characters or less`);
      return;
    }

    setLoading(true);
    try {
      // Simulate posting to blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Your message has been posted to the blockchain!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error posting message:', error);
      Alert.alert('Error', 'Failed to post message');
    } finally {
      setLoading(false);
    }
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
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network:</Text>
            <Text style={styles.infoValue}>Ethereum</Text>
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
            maxLength={maxLength}
            style={styles.textArea}
            containerStyle={styles.inputWrapper}
          />
          <View style={styles.charCountContainer}>
            <Text
              style={[
                styles.charCount,
                remainingChars < 0 && styles.charCountError,
              ]}
            >
              {remainingChars} characters remaining
            </Text>
          </View>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipsText}>
            • Keep messages concise and meaningful{'\n'}
            • Messages are permanently stored on-chain{'\n'}
            • Gas fees apply for posting messages{'\n'}
            • Be respectful and follow community guidelines
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
            title="Post Message"
            onPress={handlePost}
            loading={loading}
            disabled={!message.trim() || remainingChars < 0}
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
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
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
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
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
  },
  charCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  charCountError: {
    color: theme.colors.error,
  },
  tipsCard: {
    backgroundColor: theme.colors.backgroundTertiary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  tipsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tipsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
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
