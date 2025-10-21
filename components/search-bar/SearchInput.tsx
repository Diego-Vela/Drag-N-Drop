import { SearchInputProps } from '../../utils/types';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';

export function SearchInput({ 
  value,
  onChangeText,
  onFocus,
  onClear,
  placeholder = "Search units, locations, or customers...",
  isDark,
}: SearchInputProps ) {
  return (
    <View className={`flex-row items-center px-4 py-3 rounded-lg border ${
      isDark
        ? 'bg-dark-surface border-dark-border'
        : 'bg-white border-light-border/30'
    }`}>
      <Text className='mr-3 text-lg'>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        className={`flex-1 text-base ${
          isDark ? 'text-dark-primary' : 'text-light-primary'
        }`}
        style={{ outlineStyle: 'none'} as any}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} className="ml-2 p-1">
          <Text className={`text-lg ${
            isDark ? 'text-dark-secondary' : 'text-light-secondary'
          }`}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}