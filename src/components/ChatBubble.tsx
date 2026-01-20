import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { formatTimestamp } from '../utils/helpers';

interface ChatBubbleProps {
  /**
   * Message content text
   */
  message: string;
  /**
   * Message type - determines styling and alignment
   */
  variant: 'sent' | 'received';
  /**
   * Unix timestamp of message
   */
  timestamp?: number;
  /**
   * Whether message has been edited
   */
  isEdited?: boolean;
  /**
   * Sender address or name (for received messages)
   */
  sender?: string;
  /**
   * Whether to show timestamp
   */
  showTimestamp?: boolean;
  /**
   * Whether to show edited badge
   */
  showEdited?: boolean;
  /**
   * Custom styles
   */
  style?: ViewStyle;
  /**
   * Whether this is the last message in a group
   */
  isLastInGroup?: boolean;
  /**
   * Whether messages should be grouped (reduced spacing)
   */
  grouped?: boolean;
}

/**
 * ChatBubble Component
 * Google Chat-like message bubble for conversations
 * Supports sent/received variants with proper styling
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  variant,
  timestamp,
  isEdited = false,
  sender,
  showTimestamp = true,
  showEdited = true,
  style,
  isLastInGroup = true,
  grouped = false,
}) => {
  const isSent = variant === 'sent';
  
  return (
    <View
      style={[
        styles.container,
        isSent ? styles.sentContainer : styles.receivedContainer,
        grouped && !isLastInGroup && styles.groupedContainer,
        style,
      ]}
    >
      {/* Avatar for received messages */}
      {!isSent && (
        <View style={[styles.avatar, isLastInGroup && styles.avatarVisible]}>
          {isLastInGroup && (
            <Text style={styles.avatarText}>
              {sender ? sender.slice(0, 2).toUpperCase() : '👤'}
            </Text>
          )}
        </View>
      )}

      {/* Message bubble */}
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
          grouped && !isLastInGroup && styles.groupedBubble,
        ]}
      >
        {/* Sender name for received messages */}
        {!isSent && sender && (
          <Text style={styles.senderName} numberOfLines={1}>
            {sender}
          </Text>
        )}

        {/* Message content */}
        <Text
          style={[
            styles.messageText,
            isSent && styles.sentMessageText,
            !isSent && styles.receivedMessageText,
          ]}
        >
          {message}
        </Text>

        {/* Footer with timestamp and edited badge */}
        {(showTimestamp || showEdited) && (
          <View style={styles.footer}>
            {showTimestamp && timestamp && (
              <Text style={[styles.timestamp, isSent && styles.sentTimestamp]}>
                {formatTimestamp(timestamp)}
              </Text>
            )}

            {showEdited && isEdited && (
              <Text style={[styles.editedBadge, isSent && styles.sentEditedBadge]}>
                {showTimestamp && timestamp ? ' • Edited' : 'Edited'}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Avatar placeholder for sent messages (to maintain alignment) */}
      {isSent && <View style={styles.avatarPlaceholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  groupedContainer: {
    marginBottom: 0,
  },

  // Avatar styles
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  avatarVisible: {
    opacity: 1,
  },
  avatarText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },

  // Bubble styles
  bubble: {
    maxWidth: '75%',
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sentBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  receivedBubble: {
    backgroundColor: theme.colors.primaryLight,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  groupedBubble: {
    borderRadius: theme.borderRadius.lg,
    marginBottom: 0,
  },

  // Sender name (for received messages)
  senderName: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs / 2,
    marginTop: -theme.spacing.xs / 2,
  },

  // Message text
  messageText: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * 1.4,
    fontWeight: theme.typography.fontWeight.regular,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: theme.colors.textOnPrimary,
  },

  // Footer (timestamp + edited)
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs / 2,
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.textSecondary,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  editedBadge: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.textSecondary,
  },
  sentEditedBadge: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
