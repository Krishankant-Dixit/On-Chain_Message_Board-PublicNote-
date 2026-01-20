import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { 
  PostMessageScreen, 
  LoginScreen, 
  ChatRoomsScreen, 
  ChatRoomScreen, 
  ProfileScreen,
  SettingsScreen 
} from '../screens';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../theme';

// Tab navigation types
export type TabParamList = {
  Chats: undefined;
  Post: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Stack navigation types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  ChatRoom: { roomId: string; roomName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom Tabs Navigator
const MainTabs: React.FC = () => {
  const { theme: materialTheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: materialTheme.colors.surface,
          borderTopColor: materialTheme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: materialTheme.colors.primary,
        tabBarInactiveTintColor: materialTheme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatRoomsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: focused ? 26 : 24 }}>💬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostMessageScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: focused ? 26 : 24 }}>✏️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: focused ? 26 : 24 }}>👤</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: focused ? 26 : 24 }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme: materialTheme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: materialTheme.colors.background }]}>
        <ActivityIndicator size="large" color={materialTheme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: materialTheme.colors.primary,
          background: materialTheme.colors.background,
          card: materialTheme.colors.surface,
          text: materialTheme.colors.textPrimary,
          border: materialTheme.colors.border,
          notification: materialTheme.colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: materialTheme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
