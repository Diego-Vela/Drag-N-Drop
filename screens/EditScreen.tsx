import React from 'react';
import { Container, ScreenContent } from '../components/base';
import { DragManager } from '../components/test-components';

const GroupName = 'Edit Dashboard';

export function EditScreen() {

  return (
    <Container headerTitle={GroupName}>
      <ScreenContent title="Dashboard" path="screens/EditScreen.tsx">
        <DragManager/>
      </ScreenContent>
    </Container>
  );
}

