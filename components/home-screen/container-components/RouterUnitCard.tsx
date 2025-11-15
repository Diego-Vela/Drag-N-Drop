import { Unit, Customer, Location } from '../../../contexts';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useNewData } from '../../../contexts';

interface RouterUnitCardProps {
  unit: Unit;
  isUnassigned: boolean;
  isDark: boolean;
  customer: Customer;
  location: Location;
}

type RootStackParamList = {
  NotesScreen: {
    unit: Unit;
    location: Location;
    customer: Customer;
  };
};

export function RouterUnitCard({ unit, isUnassigned, isDark, customer, location }: RouterUnitCardProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  console.log(`unitID: ${unit.id}, locationID: ${location.id}, customerID: ${customer.id}`);

  const handleRouterPress = () => {
    navigation.navigate('NotesScreen', {
      unit: unit,
      location: location,
      customer: customer,
    });
  };

  return (
    <TouchableOpacity
      className={`px-4 py-6 rounded-lg  ${
        isUnassigned
          ? `border-2 border-dashed ${
              isDark 
                ? 'bg-dark-background border-dark-border' 
                : 'bg-neutral-100 border-neutral-400'
            }`
          : `border-2 ${
              isDark 
                ? 'bg-dark-warning/20 border-dark-highlight-accent' 
                : 'bg-light-highlight border-light-highlight-accent'
            }`
      }`}
      onPress={handleRouterPress}
    >
      <Text className={`font-semibold text-sm ${
        isUnassigned 
          ? `text-left ${isDark ? 'text-dark-secondary' : 'text-neutral-600'}`
          : isDark ? 'text-dark-highlight-text' : 'text-light-highlight-text'
      }`}>
        {unit.name}
      </Text>
    </TouchableOpacity>
  );
}