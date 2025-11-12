import React, { useState, useEffect, useMemo } from 'react';
import { Container, ScreenContent, DragManager } from '../components';
import type { DropZoneData } from '../types';
import { useTheme, useNewData, Assignment } from '../contexts';
import { useEditScreen } from '../hooks';

const GroupName = 'Sugma Dashboard';

export function EditScreen() {
  const { isDark } = useTheme();
  const { data, unassigned, handleSave } = useEditScreen();

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        <DragManager isDark={isDark} data={data}  deadZoneMembers={unassigned} saveData={handleSave}/>
      </ScreenContent>
    </Container>
  );
}

