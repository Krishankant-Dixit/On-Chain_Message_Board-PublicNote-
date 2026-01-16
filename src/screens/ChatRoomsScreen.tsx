import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button, Card } from '../components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { ChatRoom } from '../utils/helpers';

type ChatRoomsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatRooms'>;

interface ChatRoomsScreenProps {
  navigation: ChatRoomsScreenNavigationProp;
}

export const ChatRoomsScreen: React.FC<ChatRoomsScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Demo rooms for UI demonstration
  const demoRooms: ChatRoom[] = [
    {
      id: 'room_1',
      name: 'General',
      type: 'public',
      description: 'Open discussion for everyone',
      members: ['user1', 'user2', 'user3'],
      createdBy: 'admin',
      createdAt: Date.now() / 1000 - 86400 * 30,
      avatar: '💬',
    },
    {
      id: 'room_2',
      name: 'Engineering Team',
      type: 'company',
      description: 'Engineering department discussions',
      companyId: 'company_1',
      members: ['user1', 'user4', 'user5'],
      createdBy: 'manager',
      createdAt: Date.now() / 1000 - 86400 * 15,
      avatar: '👨‍💻',
    },
    {
      id: 'room_3',
      name: 'Project Alpha',
      type: 'private',
      description: 'Private project discussions',
      members: ['user1', 'user2'],
      createdBy: 'user1',
      createdAt: Date.now() / 1000 - 86400 * 7,
      avatar: '🔒',
    },
    {
      id: 'room_4',
      name: 'Marketing',
      type: 'company',
      description: 'Marketing team collaboration',
      companyId: 'company_1',
      members: ['user1', 'user6', 'user7'],
      createdBy: 'marketing_lead',
      createdAt: Date.now() / 1000 - 86400 * 20,
      avatar: '📢',
    },
  ];

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      // Simulate loading rooms from blockchain/backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRooms(demoRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      Alert.alert('Error', 'Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRooms();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const getRoomTypeIcon = (type: ChatRoom['type']) => {
    switch (type) {
      case 'public':
        return '🌐';
      case 'private':
        return '🔒';
      case 'company':
        return '🏢';
      default:
        return '💬';
    }
  };

  const renderRoomItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatRoom', { roomId: item.id, roomName: item.name })}
    >
      <Card style={styles.roomCard}>
        <View style={styles.roomHeader}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomAvatar}>{item.avatar || getRoomTypeIcon(item.type)}</Text>
            <View style={styles.roomDetails}>
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomDescription}>{item.description}</Text>
            </View>
          </View>
          <View style={styles.roomMeta}>
            <Text style={styles.roomType}>{item.type}</Text>
            <Text style={styles.memberCount}>{item.members.length} members</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chat Rooms</Text>
          <Text style={styles.headerSubtitle}>
            {user?.name || 'User'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Private</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Company</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chat rooms yet</Text>
            <Text style={styles.emptySubtext}>Create your first room to get started!</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          title="Create Room"
          onPress={() => navigation.navigate('CreateRoom')}
          size="large"
          style={styles.createButton}
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
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  logoutButton: {
    padding: theme.spacing.sm,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundTertiary,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filterTextActive: {
    color: theme.colors.text,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl * 2,
  },
  roomCard: {
    marginBottom: theme.spacing.md,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomAvatar: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  roomDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  roomMeta: {
    alignItems: 'flex-end',
  },
  roomType: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  memberCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  createButton: {
    width: '100%',
  },
});
