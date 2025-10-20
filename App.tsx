import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { HomeScreen } from './screens/HomeScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { UnitsScreen } from './screens/UnitsScreen';
import { AssignmentsScreen } from './screens/AssignmentsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import './global.css';

const Tab = createBottomTabNavigator();



function TabNavigator() {
  const { isDark } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: isDark ? '#60a5fa' : '#3b82f6', // dark-accent : light-accent
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280', // dark-secondary : light-secondary
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff', // dark-surface : light-background
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#e5e7eb', // dark-border : light-border
          elevation: 10,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
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
              iconName = 'build-outline'; // truck-like icon
              break;
            case 'Assignments':
              iconName = 'document-text';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Units" component={UnitsScreen} />
      <Tab.Screen name="Assignments" component={AssignmentsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  )
}