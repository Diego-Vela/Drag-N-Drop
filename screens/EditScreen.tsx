import React, { useState, useEffect, useMemo } from 'react';
import { Container, ScreenContent, DragManager } from '../components';
import type { DropZoneData } from '../types';
import { useTheme, useNewData, Assignment } from '../contexts';

const GroupName = 'Sugma Dashboard';

export function EditScreen() {
  const { isDark } = useTheme();
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
      //console.log('Completed');
      refetch();
    } else {
      console.error('Assignments not saved');
    }
  }

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        <DragManager isDark={isDark} data={data}  deadZoneMembers={unassigned} saveData={handleSave}/>
      </ScreenContent>
    </Container>
  );
}

