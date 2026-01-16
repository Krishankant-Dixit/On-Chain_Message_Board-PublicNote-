import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Card } from '../components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { Message, formatTimestamp, formatAddress } from '../utils/helpers';

type ChatRoomScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatRoom'>;
type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

interface ChatRoomScreenProps {
  navigation: ChatRoomScreenNavigationProp;
  route: ChatRoomScreenRouteProp;
}

export const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ navigation, route }) => {
  const { roomId, roomName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

  // Demo messages
  const demoMessages: Message[] = [
    {
      id: 1,
      content: 'Welcome to the chat room!',
      sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      timestamp: Date.now() / 1000 - 3600,
      roomId,
      isPrivate: false,
    },
    {
      id: 2,
      content: 'This is a secure, blockchain-based messaging system.',
      sender: '0x1234567890abcdef1234567890abcdef12345678',
      timestamp: Date.now() / 1000 - 1800,
      roomId,
      isPrivate: false,
    },
    {
      id: 3,
      content: 'All messages are immutable and tamper-proof!',
      sender: user?.walletAddress || user?.email || '0xUser',
      timestamp: Date.now() / 1000 - 900,
      roomId,
      isPrivate: false,
      isEdited: true,
      editHistory: [
        {
          oldContent: 'All messages are stored on blockchain',
          newContent: 'All messages are immutable and tamper-proof!',
          editedAt: Date.now() / 1000 - 600,
          blockchainHash: '0xabc123...',
        },
      ],
    },
  ];

  useEffect(() => {
    navigation.setOptions({ title: roomName });
    loadMessages();
  }, [roomId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(demoMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      content: inputText,
      sender: user?.walletAddress || user?.email || '0xUser',
      timestamp: Date.now() / 1000,
      roomId,
      isPrivate: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate blockchain transaction
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleEdit = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setInputText(message.content);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !inputText.trim()) return;

    const updatedMessages = messages.map(msg => {
      if (msg.id === editingMessageId) {
        const editHistory = msg.editHistory || [];
        editHistory.push({
          oldContent: msg.content,
          newContent: inputText,
          editedAt: Date.now() / 1000,
          blockchainHash: `0x${Math.random().toString(36).slice(2, 11)}`,
        });

        return {
          ...msg,
          content: inputText,
          isEdited: true,
          editHistory,
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
    setInputText('');
    setEditingMessageId(null);

    Alert.alert('Success', 'Message edited! Edit history stored on blockchain.');
  };

  const showEditHistory = (message: Message) => {
    if (!message.editHistory || message.editHistory.length === 0) {
      Alert.alert('No Edits', 'This message has not been edited.');
      return;
    }

    const historyText = message.editHistory
      .map((edit, index) => 
        `Edit ${index + 1} (${formatTimestamp(edit.editedAt)}):\n` +
        `Old: "${edit.oldContent}"\n` +
        `New: "${edit.newContent}"\n` +
        `Hash: ${edit.blockchainHash?.slice(0, 10)}...`
      )
      .join('\n\n');

    Alert.alert('Edit History', historyText);
  };

  const isMyMessage = (sender: string) => {
    return sender === user?.walletAddress || sender === user?.email;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = isMyMessage(item.sender);

    return (
      <TouchableOpacity
        onLongPress={() => {
          if (isMine) {
            Alert.alert(
              'Message Options',
              'What would you like to do?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit Message', onPress: () => handleEdit(item.id) },
                ...(item.isEdited ? [{ text: 'View Edit History', onPress: () => showEditHistory(item) }] : []),
              ]
            );
          } else if (item.isEdited) {
            showEditHistory(item);
          }
        }}
      >
        <View style={[styles.messageContainer, isMine && styles.myMessageContainer]}>
          <Card style={[styles.messageCard, isMine && styles.myMessageCard]}>
            {!isMine && (
              <Text style={styles.senderText}>{formatAddress(item.sender)}</Text>
            )}
            <Text style={[styles.messageText, isMine && styles.myMessageText]}>
              {item.content}
            </Text>
            <View style={styles.messageFooter}>
              <Text style={[styles.timestampText, isMine && styles.myTimestampText]}>
                {formatTimestamp(item.timestamp)}
              </Text>
              {item.isEdited && (
                <Text style={[styles.editedText, isMine && styles.myEditedText]}>
                  • Edited
                </Text>
              )}
            </View>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.roomTitle}>{roomName}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        {editingMessageId && (
          <View style={styles.editingBanner}>
            <Text style={styles.editingText}>Editing message...</Text>
            <TouchableOpacity onPress={() => {
              setEditingMessageId(null);
              setInputText('');
            }}>
              <Text style={styles.cancelEditText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={editingMessageId ? handleSaveEdit : handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>
              {editingMessageId ? '✓' : '→'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  roomTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  placeholder: {
    width: 60,
  },
  messagesList: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  messageCard: {
    maxWidth: '80%',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  myMessageCard: {
    backgroundColor: theme.colors.primary,
  },
  senderText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
    marginBottom: theme.spacing.xs,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  myTimestampText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  editedText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    marginLeft: theme.spacing.xs,
    fontStyle: 'italic',
  },
  myEditedText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.backgroundTertiary,
  },
  editingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundTertiary,
  },
  editingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  cancelEditText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.backgroundTertiary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.backgroundTertiary,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.bold,
  },
});
