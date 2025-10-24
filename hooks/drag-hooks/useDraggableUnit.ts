import { useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import type { UseDraggableUnitReturn } from '../../types';

export function useDraggableUnit(
  label: string,
  onDragEnd?: (id: string, position: { x: number; y: number }) => void
): UseDraggableUnitReturn {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const shouldReset = useSharedValue(false);
  const isDragging = useSharedValue(false);

  const unitRef = useRef<Animated.View>(null);

  // Utility: measure middle point on drop
  const getMiddlePoint = () => {
    if (unitRef.current) {
      unitRef.current.measure(
        (x, y, width, height, pageX, pageY) => {
          const middleX = pageX + width / 2;
          const middleY = pageY + height / 2;
          if (onDragEnd) {
            onDragEnd(label, { x: middleX, y: middleY });
          }
        }
      );
    }
  };

  // Handle reset
  useDerivedValue(() => {
    if (shouldReset.value) {
      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
      shouldReset.value = false;
    }
  });

  // Animated transform style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value + translateX.value },
      { translateY: offsetY.value + translateY.value },
    ],
    zIndex: isDragging.value ? 10 : 1,
    elevation: isDragging.value ? 10 : 0, // Android support
  }));

  // Gesture
  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onFinalize(() => {
      isDragging.value = false;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      offsetX.value += translateX.value;
      offsetY.value += translateY.value;
      runOnJS(getMiddlePoint)();
      translateX.value = 0;
      translateY.value = 0;
    });

  const resetPosition = () => {
    shouldReset.value = true;
  };

  return {
    unitRef,
    animatedStyle,
    pan,
    shouldReset,
    resetPosition,
  };
}