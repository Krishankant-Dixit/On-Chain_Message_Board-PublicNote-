import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Message } from '../contracts/MessageBoard';
import { formatAddress, formatTimestamp } from '../utils/helpers';

interface MessageCardProps {
  message: Message & { sentimentIcon?: string };
  onPress?: () => void;
  variant?: 'sent' | 'received' | 'list';
  showSender?: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({ 
  message, 
  onPress,
  variant = 'list',
  showSender = true,
}) => {
  const content = (
    <View 
      style={[
        styles.messageContainer,
        variant === 'sent' && styles.sentContainer,
        variant === 'received' && styles.receivedContainer,
        variant === 'list' && styles.listContainer,
      ]}
    >
      {showSender && variant !== 'sent' && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {message.sender.slice(2, 4).toUpperCase()}
            </Text>
          </View>
        </View>
      )}
      
      <View style={[
        styles.bubble,
        variant === 'sent' && styles.sentBubble,
        variant === 'received' && styles.receivedBubble,
        variant === 'list' && styles.listBubble,
      ]}>
        {showSender && variant !== 'sent' && (
          <Text style={styles.senderName}>{formatAddress(message.sender)}</Text>
        )}
        
        <Text style={[
          styles.content,
          variant === 'sent' && styles.sentContent,
        ]}>
          {message.content}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[
            styles.timestamp,
            variant === 'sent' && styles.sentTimestamp,
          ]}>
            {formatTimestamp(message.timestamp)}
          </Text>
          
          {message.isEdited && (
            <Text style={[
              styles.editedBadge,
              variant === 'sent' && styles.sentEditedBadge,
            ]}>
              • Edited
            </Text>
          )}
          
          {message.sentimentIcon && variant === 'list' && (
            <Text style={styles.sentimentIcon}>{message.sentimentIcon}</Text>
          )}
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.touchable}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: theme.spacing.sm,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  listContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sentBubble: {
    backgroundColor: theme.colors.messageSent,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: theme.colors.messageReceived,
    borderBottomLeftRadius: 4,
  },
  listBubble: {
    backgroundColor: theme.colors.card,
    maxWidth: '100%',
    flex: 1,
  },
  senderName: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  content: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  sentContent: {
    color: theme.colors.textOnPrimary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  timestamp: {
    color: theme.colors.textTertiary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  editedBadge: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  sentEditedBadge: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sentimentIcon: {
    fontSize: theme.typography.fontSize.md,
    marginLeft: 'auto',
  },
});
