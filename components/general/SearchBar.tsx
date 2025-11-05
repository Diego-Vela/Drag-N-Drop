import React from 'react';
import { View, TextInput } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  query?: string;
  onSearchChange: (text: string) => void;
  isDark?: boolean;
}

export function SearchBar({
  placeholder = 'Search...',
  query = '',
  onSearchChange,
  isDark = false,
}: SearchBarProps) {

  // Styling variables
  const containerBg = isDark ? 'bg-[#1F2937]' : 'bg-[#F9FAFB]';   // dark: slate-800, light: gray-50
  const borderColor  = isDark ? 'border-[#374151]' : 'border-[#E5E7EB]'; // dark: gray-700, light: gray-200
  const textColor    = isDark ? 'text-gray-100' : 'text-gray-800';
  const placeholderColor = isDark ? '#9CA3AF' : '#6B7280';        // gray-400 / gray-500

  return (
    <View
      className={`flex-row h-full items-center my-2 justify-between rounded-xl shadow-sm border border-black ${containerBg} ${borderColor} opacity-90`}
    >
      <TextInput
        className={`flex-1 px-3 py-1 text-base ${textColor}`}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={query}
        onChangeText={onSearchChange}
      />
    </View>
  );
}
