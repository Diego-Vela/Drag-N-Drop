import React from 'react';
import { Container, ScreenContent } from '../components/base';
import { DragManager } from '../components/test-components';

const GroupName = 'Edit Dashboard';

export function EditScreen() {

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        {/* Search Bar Component Here */}
        {/* Decide whether to place flat list here or inside drag manager */}
        <DragManager/>
      </ScreenContent>
    </Container>
  );
}

