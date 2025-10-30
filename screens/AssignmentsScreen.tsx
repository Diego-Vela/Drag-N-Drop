import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Container, ScreenContent } from '../components/base';
import { useData, useTheme } from '../contexts';

export function AssignmentsScreen() {
  const { isDark } = useTheme();
  const { getGroupedAssignments } = useData();
  const assignments = getGroupedAssignments();

  const bgColor = isDark ? 'bg-dark-surface' : 'bg-light-surface';
  const textPrimary = isDark ? 'text-dark-primary' : 'text-light-primary';
  const textSecondary = isDark ? 'text-dark-secondary' : 'text-light-secondary';
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border';

  return (
    <Container headerTitle="Assignments">
      <ScreenContent title="Assignments" path="screens/AssignmentsScreen.tsx">
        <View className={`flex-1 w-full ${bgColor} px-4 py-2 rounded-lg`}>
          <FlatList
            data={assignments}
            keyExtractor={(item, index) =>
              `${item.customerName}-${item.locationName}-${index}`
            }
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View
                className={`p-4 mb-3 rounded-xl border ${borderColor} bg-opacity-80 shadow-business`}
              >
                <Text className={`text-lg font-semibold ${textPrimary}`}>
                  {item.locationName}
                </Text>
                <Text className={`text-sm ${textSecondary}`}>
                  {item.customerName}
                </Text>
              </View>
            )}
          />
        </View>
      </ScreenContent>
    </Container>
  );
}
