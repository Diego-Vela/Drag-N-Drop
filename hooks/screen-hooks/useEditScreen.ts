// hooks/useEditScreen.ts
import { useState, useEffect } from 'react';
import type { DropZoneData } from '../../types';
import { useNewData } from '../../contexts';

export function useEditScreen() {
  const { getUnassignedUnits, getAssignmentObjects, prepareSaveAssignment, refetch } = useNewData();
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
        id: `${g.customer}/${g.location}`,
        label: g.location,
        sublabel: g.customer,
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
    } else {
      console.error('Assignments not saved');
    }
  };

  return { data, unassigned, handleSave };
}