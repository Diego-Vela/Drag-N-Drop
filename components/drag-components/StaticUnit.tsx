import React, { forwardRef, useImperativeHandle } from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import { Unit } from './Unit';
import { useDraggableUnit } from '../../hooks';
import type { UnitRef, DraggableUnitProps } from'../../types';

export const StaticUnit = forwardRef<UnitRef, DraggableUnitProps>(
  ({ label = 'Drag me', onDragEnd, isDark = false }, ref) => {
    const {
      pan,
    } = useDraggableUnit(label, onDragEnd);

    return (
      <GestureDetector gesture={pan}>
        <Unit
          label={label}
          isDark={isDark}
        />
      </GestureDetector>
    );
  }
);
