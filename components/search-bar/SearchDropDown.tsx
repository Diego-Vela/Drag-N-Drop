// Base Imports
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, Animated } from 'react-native';
// Utility Imports
import { getSearchResultIcon, getSearchResultTypeColor } from '../../utils/searchResultUtils';
import { SearchDropDownProps } from '../../hooks/search-bar-hooks/types';

export function SearchDropDown({
  searchResults,
  showDropdown,
  slideAnimation,
  onSelectResult,
  isDark
}: SearchDropDownProps) {

  const getResultIcon = (type: string) => {
    return getSearchResultIcon(type);
  };

  if (!showDropdown) return null;
  
  return (
    <Animated.View
      style={{
        height: slideAnimation,
        overflow: searchResults.length > 0 ? 'visible' : 'hidden',
        marginBottom: 0,
        zIndex: 1000,
        elevation: 10,
      }}
    >
      <View className={`mt-1 rounded-lg border ${
        isDark ? 'bg-dark-surface border-dark-border'
        : 'bg-white border-light-border/30'
      }`}
      style={{
        height: '100%',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 1000,
        paddingTop: 0,
        paddingBottom: 4, 
        overflow: 'hidden', 
      }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1}}
        >
          {searchResults.map((result,index) => {
            const isLastItem = index === searchResults.length - 1;
            return (
              <TouchableOpacity
                key={result.id}
                onPress={() => onSelectResult(result)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  paddingBottom: 8,
                  borderBottomWidth: isLastItem ? 0 : 1, // No border on last item
                  borderBottomColor: isDark ? '#374151' : '#E5E7EB',
                  minHeight: 60, // Ensure consistent height per item
                }}
              >
                <Text style={{ marginRight: 12, fontSize: 18 }}>{getResultIcon(result.type)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontWeight: '600', 
                    fontSize: 14,
                    color: isDark ? '#F9FAFB' : '#111827'
                  }}>
                    {result.primary}
                  </Text>
                  {result.secondary && (
                    <Text style={{ 
                      fontSize: 12, 
                      marginTop: 4,
                      color: isDark ? '#9CA3AF' : '#6B7280'
                    }}>
                      {result.secondary}
                    </Text>
                  )}
                  {result.unit && (
                    <Text style={{ 
                      fontSize: 12, 
                      marginTop: 4,
                      color: isDark ? '#FCD34D' : '#D97706'
                    }}>
                      Units: {result.unit}
                    </Text>
                  )}
                </View>
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  backgroundColor: getSearchResultTypeColor(result.type, isDark).bg
                }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    color: getSearchResultTypeColor(result.type, isDark).text
                  }}>
                    {result.type}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Animated.View>
  )

}