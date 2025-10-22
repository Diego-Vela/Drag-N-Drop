// Base Imports
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
// Component Imports
import { Container } from '../components/Container';
import { ScreenContent } from '../components/ScreenContent';
import { AssignmentContainer } from '../components/home-screen/AssignmentContainer';
import { SearchBar } from '../components/SearchBar';
// Hook Imports
import { useSearch } from '../hooks/search-bar-hooks';
// Other
import testData from '../test-files/test-data.json';

export function HomeScreen() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  // Initialize data once
  useEffect(() => {
    setPairs(testData['customer-location-pairs']);
    setUnits(testData.units);
    setAssignments(testData.assignments);
  }, []);

  // Get search functions (these will be moved to SearchBar later)
  const {
    performSearch,
    getFilteredAssignments,
    getAssignedUnits,
    getAllItems
  } = useSearch({ pairs, units, assignments });

  // Memoize filtered data computation to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    const { filteredPairs, filteredUnits } = getFilteredAssignments(currentSearchQuery);
    const assignedUnits = assignments.map(([unit]) => unit);
    const unassignedUnits = filteredUnits.filter((u: string) => !assignedUnits.includes(u));
    return { filteredPairs, filteredUnits, unassignedUnits };
  }, [getFilteredAssignments, currentSearchQuery, assignments]);

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

  // Stable callbacks to prevent infinite loops when moved to SearchBar
  const handleSearchResults = useCallback((results: any) => {
    // Handle search results if needed for additional functionality
  }, []);

  const handleSelectResult = useCallback((result: any) => {
    // Handle selection - could scroll to item, highlight, etc.
    setCurrentSearchQuery(result.primary);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setCurrentSearchQuery(query);
    return performSearch(query);
  }, [performSearch]);

  const handleShowAll = useCallback(() => {
    return getAllItems();
  }, [getAllItems]);

  const handleClearQuery = useCallback(() => {
    // Reset to master view when search is cleared
    setCurrentSearchQuery('');
  }, []);

  return (
    <Container headerTitle="{Organization Name}">
      <ScreenContent title="Dashboard" path="screens/HomeScreen.tsx">
        {/* Search Bar */}
        <SearchBar
          onSearchResults={handleSearchResults}
          onSelectResult={handleSelectResult}
          onSearch={handleSearch}
          onShowAll={handleShowAll}
          onClearQuery={handleClearQuery}
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
            units={filteredData.unassignedUnits}
            isUnassigned={true}
          />

        </ScrollView>
      </ScreenContent>
    </Container>
  );
}
