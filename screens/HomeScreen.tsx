// Base Imports
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
// Component Imports
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';
import { AssignmentContainer } from '../components/home-screen/AssignmentContainer';
import { SearchBar } from '../components/SearchBar';
// Hook Imports
import { useSearch } from '../hooks/useSearch';
// Other
import testData from '../test-files/test-data.json';

export function HomeScreen() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const {
    performSearch,
    getFilteredAssignments,
    getAssignedUnits,
    getAllItems
  } = useSearch({ pairs, units, assignments });

  useEffect(() => {
    setPairs(testData['customer-location-pairs']);
    setUnits(testData.units);
    setAssignments(testData.assignments);
  }, []);

  // Find unassigned units based on current search
  const { filteredPairs, filteredUnits } = getFilteredAssignments(currentSearchQuery);
  const assignedUnits = assignments.map(([unit]) => unit);
  const unassignedUnits = filteredUnits.filter((u) => !assignedUnits.includes(u));

  return (
    <Container headerTitle="{Organization Name}">
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">
        {/* Search Bar */}
        <SearchBar
          onSearchResults={(results) => {
            // Handle search results if needed for additional functionality
          }}
          onSelectResult={(result) => {
            // Handle selection - could scroll to item, highlight, etc.
            setCurrentSearchQuery(result.primary);
          }}
          onSearch={(query) => {
            setCurrentSearchQuery(query);
            return performSearch(query);
          }}
          onShowAll={() => {
            return getAllItems();
          }}
          onClearQuery={() => {
            // Reset to master view when search is cleared
            setCurrentSearchQuery('');
          }}
        />
        <ScrollView 
          style={{ flex: 1, backgroundColor: 'transparent' }} 
          className="px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled={true}
          contentContainerStyle={{ 
            paddingBottom: 60, // Extra bottom padding
            overflow: 'visible' // Allow content to overflow
          }}
          showsVerticalScrollIndicator={false}
        >
          

          
          {/* Customer-location pairs - only show those with assigned units */}
          {filteredPairs
            .filter((pair) => {
              const [, , id] = pair;
              const assigned = getAssignedUnits(id);
              return assigned.length > 0; // Only show pairs with assigned units
            })
            .map((pair) => {
              const [customer, location, id] = pair;
              const assigned = getAssignedUnits(id);
              
              return (
                <AssignmentContainer
                  key={id}
                  title={customer}
                  subtitle={location}
                  units={assigned}
                />
              );
            })}

          {/* Unassigned Section */}
          <AssignmentContainer
            title="Unassigned"
            subtitle="Available Units"
            units={unassignedUnits}
            isUnassigned={true}
          />

        </ScrollView>
      </ScreenContent>
    </Container>
  );
}
