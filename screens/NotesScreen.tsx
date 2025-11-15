import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Container, ScreenContent } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Unit, Location, Customer, Note, useNewData } from '../contexts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type RootStackParamList = {
  NotesScreen: {
    unit: Unit;
    location: Location;
    customer: Customer;
  };
};

type NotesScreenProps = NativeStackScreenProps<RootStackParamList, 'NotesScreen'>;

export function NotesScreen({ route, navigation }: NotesScreenProps) {
  const { isDark } = useTheme();
  const { addNote, getNotes, deleteNote } = useNewData();

  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState('');

  const { unit, location, customer } = route.params;

  useEffect(() => {
    const fetchNotes = async () => {
      const elements = await getNotes(unit.id, location.id);
      setNotes(elements);
    };
    fetchNotes();
  }, [])

  const handleSaveButton = async () => {
    const trimmedNote = note.trim();
    if (!trimmedNote){
      setNote('');
      return;
    } 

    const newNote = await addNote(unit.id, location.id, trimmedNote);
    if (newNote) {
      setNotes(prev => [...prev, newNote]);
      setNote('');
    }
    
  }
  
  const handleDeleteButton = async (item: Note, idx: number) => {
    console.log(`The element selected is: ${item.note}, index: ${idx}`);
    if (await deleteNote(item.id)) {
      setNotes(prev => prev.filter((_, i) => i !== idx));
    }
  }

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
                <View className={`
                  mb-4 p-3 rounded-lg flex-row items-center justify-between 
                  ${isDark 
                    ? 'bg-dark-surface/60 boder-gray-700' 
                    : 'bg-white border-gray-300'}`} 
                >
                  <Text className={`w-[90%] ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.note}</Text>
                  <View className={`w-[10%] items-center justify-center`}>
                    <TouchableOpacity
                      onPress={() => handleDeleteButton(item, index)}
                      className={`
                        ml-2 w-8 h-8 rounded-full justify-center items-center
                        ${isDark 
                          ? 'bg-red-800/80'
                          : 'bg-red-500'
                        }
                        `}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
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
                      w-full p-4 rounded-xl mb-4 border
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
