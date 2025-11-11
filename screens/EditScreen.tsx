import React, { useState, useEffect, useMemo } from 'react';
import { Container, ScreenContent, DragManager } from '../components';
import type { DropZoneData } from '../types';
import { useData, useTheme, useNewData } from '../contexts';

const GroupName = 'Sugma Dashboard';

export function EditScreen() {
  const { isDark } = useTheme();
  const { getUnassignedUnits, getAssignmentObjects } = useNewData();

  const [data, setData] = useState<DropZoneData[]>([]);
  const [unassigned, setUnassigned] = useState<DropZoneData>({
    id: 'Unassigned',
    label: 'Unassigned',
    sublabel: 'Unassigned',
    units: [],
  });

  const memoizedData = useMemo(() => data, [data]);
  const memoizedUnassigned = useMemo(() => unassigned, [unassigned]);

  useEffect(() => {
    const loadAssignments = async () => {
      const assignmentObjects = await getAssignmentObjects();
      const zoneData: DropZoneData[] = assignmentObjects.map((g) => ({
        id: `${g.customer}/${g.location}`,
        label: g.customer,
        sublabel: g.location,
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

    console.log(getUnassignedUnits());
    loadAssignments();
  }, [getAssignmentObjects, getUnassignedUnits]);

  const handleSave = (data: any) => {
    console.log(data);
  }

  console.log(memoizedUnassigned);

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        <DragManager isDark={isDark} data={memoizedData}  deadZoneMembers={memoizedUnassigned}/>
      </ScreenContent>
    </Container>
  );
}

