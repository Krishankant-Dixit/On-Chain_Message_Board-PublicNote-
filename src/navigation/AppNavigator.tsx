import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { HomeScreen, PostMessageScreen, LoginScreen, ChatRoomsScreen, ChatRoomScreen, CreateRoomScreen } from '../screens';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

// Centralized navigation types
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  PostMessage: undefined;
  ChatRooms: undefined;
  ChatRoom: { roomId: string; roomName: string };
  CreateRoom: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
        initialRouteName={isAuthenticated ? 'ChatRooms' : 'Login'}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="ChatRooms" component={ChatRoomsScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
            <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PostMessage" component={PostMessageScreen} />
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
    backgroundColor: theme.colors.background,
  },
});
