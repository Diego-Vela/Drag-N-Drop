import { View, Text, ScrollView } from 'react-native'

// Horizontal scroller for all units
export function UnitScroller({ allUnits }: { allUnits: { id: string; name: string }[] }) {
  return (
    <View className='mt-4 mb-4 mr-4'>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 8 }}>
        {allUnits.map(unit => (
          <View
            key={unit.id} 
            className='min-w-[80px] items-center justify-center py-4 ml-2'
            style={{
              backgroundColor: '#e5e7eb',
              borderRadius: 12,
            }}
          >
            <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{unit.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}