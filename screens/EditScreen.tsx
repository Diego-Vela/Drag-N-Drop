import React from 'react';
import { Container, ScreenContent } from '../components/base';
import { DragManager, DropZoneData } from '../components/drag-components';
import { useData, useTheme } from '../contexts';

const GroupName = 'Edit Dashboard';

export function EditScreen() {
  const { isDark } = useTheme();
  const { getGroupedAssignments, getUnassignedCustomerLocations, getUnassignedUnits } = useData();

  const grouped = getGroupedAssignments();
  const emptyGrouped = getUnassignedCustomerLocations();

  const assignmentData = grouped.map((g, i) => ({
    id: `${g.customerName}/${g.locationName}`,
    label: g.customerName,
    sublabel: g.locationName,
    units: g.units.map(u => u.name),
  }));

  const emptyZoneData = emptyGrouped.map((g, i) => ({
    id: `${g.customerName}/${g.locationName}`,
    label: g.customerName,
    sublabel: g.locationName,
    units: [],
  }));

  const combinedData: DropZoneData[] = [...assignmentData, ...emptyZoneData];

  const unassignedUnits: DropZoneData = {
    id: 'Unassigned',
    label: 'Unassigned',
    sublabel: 'Unassigned',
    units: getUnassignedUnits().map(u=>u.name),
  }

  const testUnassigned: DropZoneData = {
    id: 'Unassigned',
    label: 'Unassigned',
    sublabel: 'Unassigned',
    units: ['Unit AA'],
  }

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        {/* Search Bar Component Here */}
        {/* Decide whether to place flat list here or inside drag manager */}
        <DragManager isDark={isDark} data={combinedData}  deadZoneMembers={testUnassigned}/*deadZoneMembers={unassignedUnits}*//>
      </ScreenContent>
    </Container>
  );
}

