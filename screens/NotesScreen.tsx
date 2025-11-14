import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Container, ScreenContent } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';

export function NotesScreen() {
  const { isDark } = useTheme();

  const [notes, setNotes] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const { unitId = 'Mock Unit', locationId = 'Mock Location', customerId = 'Mock Customer' } = useLocalSearchParams();

  const handleSaveButton = () => {
    const trimmedNote = note.trim();
    if (!trimmedNote) return;
    setNotes(prevNotes => [...prevNotes, trimmedNote]);
    setNote('');
  }
  
  const handleDeleteButton = (item: string, idx: number) => {
    console.log(`The element selected is: ${item}, index: ${idx}`);
    setNotes(prevNotes => prevNotes.filter((_, i) => i !== idx));
  }

  useEffect(() => {
    console.log(notes);
  }, [notes])

  return (
    <Container headerTitle={`${unitId} / ${locationId}`}>
      <ScreenContent title="Notes" path="screens/Notes.tsx">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 mx-4 mt-4"
        >
          {/* Informational Section */}
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
              {`${customerId}`}
            </Text>
          </View>





          {/* Notes Section*/}
          <Text className={`text-base mb-2 ${ isDark ? 'text-white' : 'text-gray-900' }`}>
            Notes
          </Text>

          <View style={{ flex: 1 }}>
            <FlatList
              data={notes}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item, index }) => (
                <View className="mb-2 p-3 rounded-lg flex-row items-center justify-between" style={{ backgroundColor: isDark ? '#222' : '#f3f3f3' }}>
                  <Text className={isDark ? 'text-white' : 'text-gray-900'}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteButton(item, index)}
                    className="ml-2 w-8 h-8 rounded-full bg-red-500 justify-center items-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              ListFooterComponent={
                <>
                  <TextInput
                    value={note}
                    onChangeText={setNote}
                    multiline
                    placeholder="Add note..."
                    placeholderTextColor={isDark ? '#aaa' : '#666'}
                    className={`
                      w-full h-40 p-4 rounded-xl mb-4 border
                      ${isDark 
                        ? 'bg-dark-surface/60 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                      }
                    `}
                  />
                  <TouchableOpacity
                    onPress={handleSaveButton}
                    className={`
                      w-full h-12 rounded-xl justify-center items-center
                      ${isDark ? 'bg-yellow-700' : 'bg-blue-600'}
                    `}
                  >
                    <Text className="text-white font-semibold text-lg">Save Notes</Text>
                  </TouchableOpacity>
                </>
              }
              contentContainerStyle={{ paddingBottom: 24 }}
              style={{ flex: 1 }}
            />
          </View>
        </KeyboardAvoidingView>
      </ScreenContent>
    </Container>
  );
}
