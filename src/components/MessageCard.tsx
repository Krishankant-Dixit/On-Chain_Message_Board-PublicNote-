import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { Message } from '../utils/helpers';
import { formatAddress, formatTimestamp } from '../utils/helpers';

interface MessageCardProps {
  message: Message;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.address}>{formatAddress(message.sender)}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
      </View>
      <Text style={styles.content}>{message.content}</Text>
    </Card>
  );
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
