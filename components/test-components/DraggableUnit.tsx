import React, { useRef } from 'react';
import { LayoutChangeEvent, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  SharedValue
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface DraggableUnitProps {
  label?: string;
  onMeasure: (id: string, layout: { x: number; y: number; width: number; height: number }) => void;
  onDragEnd?: (id: string, position: { x: number; y: number }) => void; // NEW
  size?: number;
  isDark?: boolean;
  isInDropZone?: boolean;
  isInDropZoneShared?: SharedValue<boolean>;
}

/**
 * A self-contained draggable box that remembers its last position.
 * - Uses Reanimated shared values for smooth, native movement.
 * - Stays where you drop it.
 */
export function DraggableUnit({
  label = 'Drag me',
  onMeasure,
  onDragEnd,
  size = 60,
  isDark = false,
  isInDropZone = false,
  isInDropZoneShared,
}: DraggableUnitProps) {
  // Persistent offset (where the unit should be at rest)
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const unitRef = useRef<Animated.View>(null);

  const getMiddlePoint = () => {
    if (unitRef.current) {
      unitRef.current.measure(
        (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          const middleX = pageX + width / 2;
          const middleY = pageY + height / 2;
          console.log('Middle Point X:', middleX);
          console.log('Middle Point Y:', middleY);

          // Send to DragManager
          if (onDragEnd) {
            onDragEnd(label, { x: middleX, y: middleY });
          }
        }
      );
    }
  };

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
      //console.log(`Dropped at: ${offsetX.value}, ${offsetY.value}`);
      runOnJS(getMiddlePoint)();
      /*if (!isInDropZoneShared?.value) {
        offsetX.value = withSpring(offsetX.value - translateX.value);
        offsetY.value = withSpring(offsetY.value - translateY.value);
      }*/
      translateX.value = 0;
      translateY.value = 0;
    }
  
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        ref={unitRef}
        className={`px-4 py-6 rounded-lg border-2 ${
                isDark 
                  ? 'bg-dark-warning/20 border-dark-highlight-accent' 
                  : 'bg-light-highlight border-light-highlight-accent'
              }`}
        onLayout={handleLayout}
        style={[
          animatedStyle,
          {
            width: size,
            height: size
          },
        ]}
      >
        <Text className={`font-semibold text-sm text-left ${ isDark ? 'text-dark-highlight-text' : 'text-light-highlight-text'}`}>
          {'Unit A'}
        </Text>
        <TouchableOpacity className='bg-white h-5 w-12 mt-4' onPress={getMiddlePoint}/>
      </Animated.View>
    </GestureDetector>
  );
}


