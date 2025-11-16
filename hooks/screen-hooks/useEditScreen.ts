// hooks/useEditScreen.ts
import { useState, useEffect } from 'react';
import type { DropZoneData } from '../../types';
import { useNewData } from '../../contexts';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { playSound } from 'utils';

export function useEditScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { getUnassignedUnits, getAssignmentObjects, prepareSaveAssignment, refetch, cleanupNotes } = useNewData();
  const [data, setData] = useState<DropZoneData[]>([]);
  const [unassigned, setUnassigned] = useState<DropZoneData>({
    id: 'Unassigned',
    label: 'Unassigned',
    sublabel: 'Unassigned',
    units: [],
  });


  useEffect(() => {
    const loadAssignments = async () => {
      const assignmentObjects = await getAssignmentObjects();
      const zoneData: DropZoneData[] = assignmentObjects.map((g) => ({
        id: `${g.customer.name}/${g.location.name}`,
        label: g.location.name,
        sublabel: g.customer.name,
        units: g.units.map((u) => u.name),
      }));

      const unassignedUnits: DropZoneData = {
        id: "Unassigned",
        label: "Unassigned",
        sublabel: "Unassigned",
        units: getUnassignedUnits().map((u) => u.name),
      };
      setData(zoneData);
      setUnassigned(unassignedUnits);
    };
    loadAssignments();
  }, [getAssignmentObjects, getUnassignedUnits]);

  const handleSave = async (data: DropZoneData[]) => {
    if (await prepareSaveAssignment(data)) {
      refetch();
      await cleanupNotes();
      playSound('wow');
    } else {
      console.error('Assignments not saved');
    }
  };

  const cancelEdit = () => {
    navigation.goBack();
  }

  return { data, unassigned, handleSave, cancelEdit };
}