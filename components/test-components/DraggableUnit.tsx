import React, { useRef } from 'react';
import { LayoutChangeEvent, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface DraggableUnitProps {
  label?: string;
  onMeasure: (id: string, layout: { x: number; y: number; width: number; height: number }) => void;
  size?: number;
  color?: string;
  isInDropZone?: boolean;
}

/**
 * A self-contained draggable box that remembers its last position.
 * - Uses Reanimated shared values for smooth, native movement.
 * - Stays where you drop it.
 */
export function DraggableUnit({
  label = 'Drag me',
  onMeasure,
  size = 120,
  color = '#8cc9ff',
  isInDropZone = false,
}: DraggableUnitProps) {
  // Persistent offset (where the unit should be at rest)
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const myRef = useRef(null);

  // Apply both offset + live translation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value + translateX.value },
      { translateY: offsetY.value + translateY.value },
    ],
  }));

    // Report layout to parent
    const handleLayout = (event: LayoutChangeEvent) => {
      const { x, y, width, height } = event.nativeEvent.layout;
      onMeasure(label, { x, y, width, height });
    };
  

  // Define gesture using new Gesture API
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      offsetX.value += translateX.value;
      offsetY.value += translateY.value;
      if (!isInDropZone) {
        offsetX.value = withSpring(offsetX.value - translateX.value);
        offsetY.value = withSpring(offsetY.value - translateY.value);
      }
      translateX.value = 0;
      translateY.value = 0;
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        className="rounded-2xl justify-center items-center shadow-business-lg"
        onLayout={handleLayout}
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            backgroundColor: color,
          },
        ]}
      >
        <Text className="text-white font-bold">{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}


