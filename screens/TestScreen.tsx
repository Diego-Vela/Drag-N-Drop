import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,   // Hook that lets us bind shared values (like x/y) to styles in real-time
  useSharedValue,     // Stores values that can change without causing React re-renders
  withSpring,         // Adds smooth, spring-like motion when values change
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Container, ScreenContent } from '../components/base';
import { useTheme } from '../contexts';

export function TestScreen() {
  const { isDark } = useTheme();

  /**
   * ─────────────────────────────────────────────
   *  1. Shared values for tracking position
   * ─────────────────────────────────────────────
   * These hold the current drag position (translateX/Y)
   * and the accumulated offset (so we remember where the
   * box was dropped last time).
   */
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  /**
   * ─────────────────────────────────────────────
   *  2. Animated style (applied to the box)
   * ─────────────────────────────────────────────
   * This connects the shared values to the box's position.
   * Whenever `translateX` or `translateY` change, the
   * Animated.View moves instantly — no re-render needed.
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  /**
   * ─────────────────────────────────────────────
   *  3. Gesture event: while dragging
   * ─────────────────────────────────────────────
   * The PanGestureHandler continuously sends `translationX`
   * and `translationY` values as the finger moves.
   *
   * We add these translations to the last stored offset so
   * the box continues from its last resting position.
   */

  // Create a pan gesture using the Gesture API
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX + offsetX.value;
      translateY.value = event.translationY + offsetY.value;
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      translateX.value = withSpring(offsetX.value);
      translateY.value = withSpring(offsetY.value);
    });

  /**
   * ─────────────────────────────────────────────
   *  5. Render
   * ─────────────────────────────────────────────
   * `Container` and `ScreenContent` are just your app’s
   * layout components. Inside, we center the box and
   * wrap it with a `PanGestureHandler` so it can respond
   * to drags.
   */
  return (
    <Container headerTitle="Test">
      <ScreenContent title="Test" path="screens/TestScreen.tsx">
        <View className="flex-1 justify-center items-center">
          {/* GestureDetector wraps the draggable element */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.box,
                animatedStyle,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#8cc9ff',
                },
              ]}
            />
          </GestureDetector>
        </View>
      </ScreenContent>
    </Container>
  );
}

/**
 * ─────────────────────────────────────────────
 *  6. Styles
 * ─────────────────────────────────────────────
 * This is a regular static StyleSheet. The shadow properties
 * give the box some depth, and the width/height define its size.
 */
const styles = StyleSheet.create({
  box: {
    width: 300,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
