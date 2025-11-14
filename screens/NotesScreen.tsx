import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Container, ScreenContent } from '../components';
import { useTheme } from '../contexts';

export function NotesScreen() {
  const { isDark } = useTheme();
  const [notes, setNotes] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const { unitId = 'Mock Unit', locationId = 'Mock Location' } = useLocalSearchParams();

  const tempCustomer = 'Mock Customer';


  const handleSaveButton = () => {
    setNotes(prevNotes => [...prevNotes, note]);
  }

  useEffect(() => {
    console.log(notes);
  }, [notes])

  return (
    <Container headerTitle="Assignment Notes">
      <ScreenContent title="Notes" path="screens/Notes.tsx">
        
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 mx-4 mt-4"
          >
            {/* Assignment Title */}
            <Text
              className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {`${unitId} / ${locationId}`}
            </Text>

            {/* Customer */}
            <View className="mb-6">
              <Text
                className={`text-base opacity-70 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Customer
              </Text>

              <Text
                className={`text-xl font-semibold ${
                  isDark ? 'text-dark-highlight-text' : 'text-blue-500'
                }`}
              >
                {`${tempCustomer}`}
              </Text>
            </View>

            {/* Notes Input */}
            <Text
              className={`text-base mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Notes
            </Text>

            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              placeholder="Write notes here..."
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              className={`
                w-full h-40 p-4 rounded-xl mb-4 border
                ${isDark 
                  ? 'bg-dark-surface/60 text-white border-gray-700'
                  : 'bg-white text-black border-gray-300'
                }
              `}
            />

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveButton}
              className={`
                w-full h-12 rounded-xl justify-center items-center
                ${isDark ? 'bg-yellow-700' : 'bg-blue-600'}
              `}
            >
              <Text className="text-white font-semibold text-lg">Save Notes</Text>
            </TouchableOpacity>

          </KeyboardAvoidingView>

      </ScreenContent>
    </Container>
  );
}
