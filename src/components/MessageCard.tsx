import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { Message } from '../contracts/MessageBoard';
import { formatAddress, formatTimestamp } from '../utils/helpers';

interface MessageCardProps {
  message: Message;
  onPress?: () => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onPress }) => {
  const content = (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.address}>{formatAddress(message.sender)}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
      </View>
      <Text style={styles.content}>{message.content}</Text>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  address: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  timestamp: {
    color: theme.colors.textTertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  content: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
});
