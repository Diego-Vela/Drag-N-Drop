import React from 'react';
import { Container, ScreenContent } from '../components/base';
import { DragManager, DropZoneData } from '../components/test-components';
import { useData, useTheme } from '../contexts';

const GroupName = 'Edit Dashboard';

export function EditScreen() {
  const { isDark } = useTheme();
  const { getGroupedAssignments, getUnassignedCustomerLocations } = useData();

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

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        {/* Search Bar Component Here */}
        {/* Decide whether to place flat list here or inside drag manager */}
        <DragManager isDark={isDark} data={combinedData}/>
      </ScreenContent>
    </Container>
  );
}

