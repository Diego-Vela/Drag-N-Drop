// Base Imports
import React from 'react';
import { useWindowDimensions } from 'react-native';

// Third-party Imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Unit, Location, Customer } from './contexts';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screen Imports
import { HomeScreen, CustomersScreen, UnitsScreen, SettingsScreen, EditScreen, NotesScreen } from './screens';

// Context Imports
import { ThemeProvider, NewDataProvider, SoundProvider } from './contexts';
import { useTheme } from './contexts'

// Styles
import './global.css';

const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Tabs: undefined;
  Edit: undefined;
  NotesScreen: {
    unit: Unit;
    location: Location;
    customer: Customer;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  const { isDark } = useTheme();
  const { height, width } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDark ? '#60a5fa' : '#ffffff',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#93c5fd',
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#1e3a8a',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#1e40af',
          elevation: 10,
          height: 70,
          paddingTop: 8,
          display: height > width ? undefined : 'none', 
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Customers':
              iconName = 'people';
              break;
            case 'Units':
              iconName = 'build-outline';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            case 'Edit':
              iconName = 'create-outline';
              break;
            default:
              iconName = 'document-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Units" component={UnitsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <ThemeProvider>
        <SoundProvider>
          <NewDataProvider>

              <NavigationContainer>
                <Stack.Navigator>

                  <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
                  <Stack.Screen 
                    name="NotesScreen" 
                    component={NotesScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Edit"
                    component={EditScreen}
                    options={{ headerShown: false }}
                  />

                </Stack.Navigator>
              </NavigationContainer>

          </NewDataProvider>
        </SoundProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
