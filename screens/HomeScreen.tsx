// Base Imports
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
// Component Imports
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';
import { AssignmentContainer } from '../components/home-screen/AssignmentContainer';
import { SearchBar } from '../components/SearchBar';
// Hook Imports
// (Search hook now used internally by SearchBar)
// Other
import testData from '../test-files/test-data.json';

export function HomeScreen() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<{filteredPairs: any[], filteredUnits: string[]}>({ 
    filteredPairs: [], 
    filteredUnits: [] 
  });

  // Initialize data once
  useEffect(() => {
    const testPairs = testData['customer-location-pairs'];
    const testUnits = testData.units;
    const testAssignments = testData.assignments;
    
    setPairs(testPairs);
    setUnits(testUnits);
    setAssignments(testAssignments);
    
    // Initialize filtered data with all data
    setFilteredData({ 
      filteredPairs: testPairs, 
      filteredUnits: testUnits 
    });
  }, []);

  // Helper function to get assigned units for a pair ID
  const getAssignedUnits = useCallback((pairId: string): string[] => {
    return assignments
      .filter(([, id]) => id === pairId)
      .map(([unit]) => unit);
  }, [assignments]);

  // Stable callback for filtered data changes
  const handleFilteredDataChange = useCallback((data: {filteredPairs: any[], filteredUnits: string[]}) => {
    setFilteredData(data);
  }, []);

  // Memoize unassigned units calculation
  const unassignedUnits = useMemo(() => {
    const assignedUnits = assignments.map(([unit]) => unit);
    return filteredData.filteredUnits.filter((u: string) => !assignedUnits.includes(u));
  }, [filteredData.filteredUnits, assignments]);

  // Memoize processed pairs to avoid double getAssignedUnits calls
  const processedPairs = useMemo(() => {
    return filteredData.filteredPairs
      .map((pair: any) => {
        const [customer, location, id] = pair;
        const assigned = getAssignedUnits(id);
        return { customer, location, id, assigned };
      })
      .filter((item) => item.assigned.length > 0); // Only show pairs with assigned units
  }, [filteredData.filteredPairs, getAssignedUnits]);

  return (
    <Container headerTitle="{Organization Name}">
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">
        {/* Search Bar */}
        <SearchBar
          pairs={pairs}
          units={units}
          assignments={assignments}
          onFilteredDataChange={handleFilteredDataChange}
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
          {processedPairs.map((item) => (
            <AssignmentContainer
              key={item.id}
              title={item.customer}
              subtitle={item.location}
              units={item.assigned}
            />
          ))}

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
