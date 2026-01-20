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
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MessageCard } from '../components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { Message } from '../contracts/MessageBoard';
import { MessageEdit, formatTimestamp, formatAddress } from '../utils/helpers';

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
      isEdited: false,
      editCount: 0,
    },
    {
      id: 2,
      content: 'This is a secure, blockchain-based messaging system.',
      sender: '0x1234567890abcdef1234567890abcdef12345678',
      timestamp: Date.now() / 1000 - 1800,
      roomId,
      isPrivate: false,
      isEdited: false,
      editCount: 0,
    },
    {
      id: 3,
      content: 'All messages are immutable and tamper-proof!',
      sender: user?.walletAddress || user?.email || '0xUser',
      timestamp: Date.now() / 1000 - 900,
      roomId,
      isPrivate: false,
      isEdited: true,
      editCount: 1,
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
    navigation.setOptions({ 
      headerShown: false,
    });
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
      isEdited: false,
      editCount: 0,
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
          editCount: (msg.editCount || 0) + 1,
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
        <MessageCard
          message={item}
          variant={isMine ? 'sent' : 'received'}
          showSender={!isMine}
        />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.roomInfo}>
            <View style={styles.roomIconContainer}>
              <Text style={styles.roomIcon}>💬</Text>
            </View>
            <View>
              <Text style={styles.roomTitle}>{roomName}</Text>
              <View style={styles.statusBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <View style={styles.chatBackground}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        {editingMessageId && (
          <View style={styles.editingBanner}>
            <View style={styles.editingInfo}>
              <Text style={styles.editingIcon}>✏️</Text>
              <Text style={styles.editingText}>Editing message</Text>
            </View>
            <TouchableOpacity 
              onPress={() => {
                setEditingMessageId(null);
                setInputText('');
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachIcon}>+</Text>
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.inputPlaceholder}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={editingMessageId ? handleSaveEdit : handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>
              {editingMessageId ? '✓' : '➤'}
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
  
  // Custom Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderDark,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  backIcon: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  roomIcon: {
    fontSize: 20,
  },
  roomTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.online,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
  },
  
  // Chat Background
  chatBackground: {
    flex: 1,
    backgroundColor: theme.colors.chatBackground,
  },
  messagesList: {
    paddingVertical: theme.spacing.md,
  },
  
  // Input Container
  inputContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderDark,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.lg : theme.spacing.sm,
  },
  editingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundTertiary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderDark,
  },
  editingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  editingIcon: {
    fontSize: theme.typography.fontSize.md,
  },
  editingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  cancelButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  attachIcon: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.backgroundTertiary,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: 'center',
  },
  input: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.regular,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    paddingVertical: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.backgroundTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 18,
    color: theme.colors.textOnPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
