import React, { useState, useEffect, useMemo } from 'react';
import { Container, ScreenContent, DragManager } from '../components';
import type { DropZoneData } from '../types';
import { useTheme, useSound } from '../contexts';
import { useEditScreen } from '../hooks';

const GroupName = 'Edit Assignments';

export function EditScreen() {
  const { isDark } = useTheme();
  const { data, unassigned, handleSave, cancelEdit } = useEditScreen();

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        <DragManager isDark={isDark} data={data}  deadZoneMembers={unassigned} saveData={handleSave} cancelDrag={cancelEdit} />
      </ScreenContent>
    </Container>
  );
}

