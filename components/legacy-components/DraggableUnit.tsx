/* Legacy Code
import React, { forwardRef, useImperativeHandle } from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import { Unit } from './Unit';
import { useDraggableUnit } from '../../hooks';
import type { UnitRef, DraggableUnitProps } from'../../types';

export const DraggableUnit = forwardRef<UnitRef, DraggableUnitProps>(
  ({ label = 'Drag me', onDragEnd, isDark = false }, ref) => {
    const {
      pan,
      animatedStyle,
      unitRef,
      shouldReset,
      resetPosition,
    } = useDraggableUnit(label, onDragEnd);

    useImperativeHandle(ref, () => ({
      shouldReset,
      resetPosition,
    }));

    return (
      <GestureDetector gesture={pan}>
        <Unit
          label={label}
          isDark={isDark}
          animatedStyle={animatedStyle}
          unitRef={unitRef}
        />
      </GestureDetector>
    );
  }
);
*/
