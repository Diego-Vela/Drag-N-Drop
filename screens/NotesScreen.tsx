import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Container, ScreenContent } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Unit, Location, Customer } from '../contexts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type RootStackParamList = {
  NotesScreen: {
    unit: Unit;
    location: Location;
    customer: Customer;
  };
  // Add other screens if needed
};

type NotesScreenProps = NativeStackScreenProps<RootStackParamList, 'NotesScreen'>;

export function NotesScreen({ route, navigation }: NotesScreenProps) {
  const { isDark } = useTheme();

  const [notes, setNotes] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const { unit, location, customer } = route.params;

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
    console.log(`My Notes: ${notes}`);
  }, [notes])

  return (
    <Container headerTitle={`${location.name} - ${unit.name}`}>
      <ScreenContent title="Notes" path="screens/Notes.tsx">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 mx-4 mt-4"
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-4"
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? 'rgba(202, 138, 4, 0.8)' : 'rgba(59, 130, 246, 0.8)'} 
            />
            <Text className={`ml-2 text-lg ${isDark ? 'text-dark-highlight-text/80' : 'text-blue-500/80'}`}>
              Back
            </Text>
          </TouchableOpacity>

          {/* Informational Section */}
          <View className="mb-6 gap-3">
            <Text
              className={`text-bold text-lg opacity-80 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Customer
            </Text>

            <Text
              className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-500'
              }`}
            >
              {`${customer.name}`}
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
