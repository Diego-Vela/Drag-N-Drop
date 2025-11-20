import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import type { DropZoneData, Unit, AssignmentObject, Customer, Location } from '../../types';
import { useNewData, useSound } from '../../contexts';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

interface ListObject {
  key: string,
  customer: Customer,
  location: Location,
  units: Unit[],
  isUnassigned: boolean;
}

export function useHomeScreen() {
  //#region Variables
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const { height, width } = useWindowDimensions();
  const { assignments, units, customers, locations, getAssignmentObjects, getUnassignedUnits } = useNewData();

  const [_, forceUpdate] = useState(0);
  const [listData, setListData] = useState<ListObject[]>([]);

  //#region useEffect Updates
  // Re-renders when dimensions change to keep UI fresh
  useEffect(() => {
    forceUpdate(n => n+1);
  }, [height, width])

  // Load Data for UI when the data changes
  useEffect(() => {
    const loadData = async () => {
      try {
        const assignments = await getAssignmentObjects();
        const unassignedUnits = getUnassignedUnits();
        setListData(buildListData(assignments, unassignedUnits));
      } catch (err) {
        console.error('Could not load assignmennts: ', err);
      }
    };
    loadData();
  }, [customers, locations, units, assignments]);

  //#region Data Handling and Functions
  // Function to rebuild listData
  function buildListData(assignments: AssignmentObject[], unassigned: Unit[]) {
    return [
      // Assigned zones
      ...assignments.map(({ customer, location, units }) => ({
        key: [
          customer?.name,
          location?.name,
          ...(units?.map(u => u.name) || [])
        ].filter(Boolean).join(' '),
        customer,
        location,
        units,
        isUnassigned: false,
      })),
      // Unassigned zone at the bottom
      {
        key: [
          'Unassigned',
          'Available Units',
          ...(unassigned?.map(u => u.name) || [])
        ].filter(Boolean).join(' '),
        customer: { id: 'Unassigned', name: 'Unassigned'},
        location: { id: 'unassigned', customer_id: 'Unassigned', name: 'Available Units' },
        units: unassigned,
        isUnassigned: true,
      },
    ];
  }

  const handleEditButton = () => {
    navigation.navigate('Edit');
  }

  return { listData, handleEditButton, };
}