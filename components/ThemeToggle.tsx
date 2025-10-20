// components/ThemeToggle.tsx
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle = () => {
  const { isDark, setTheme } = useTheme();
  const progress = useSharedValue(isDark ? 1 : 0);

  // Animate when theme changes
  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: 10 });
  }, [isDark]);

  // Sun slides down when going dark
  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(progress.value * 50) }],
    opacity: withTiming(1 - progress.value),
    position: "absolute",
    top: 0,
    left: 0,
  }));

  // Moon slides up when going dark
  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(-50 + progress.value * 50) }],
    opacity: withTiming(progress.value),
    position: "absolute",
    top: 0,
    left: 0,
  }));

  const handlePress = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ position: "relative", width: 32, height: 32, justifyContent: "center", alignItems: "center" }}>
        <Animated.View style={[sunStyle, { justifyContent: "center", alignItems: "center", width: 32, height: 32 }]}>
          <Ionicons name="sunny" size={32} color="#fbbf24" />
        </Animated.View>
        <Animated.View style={[moonStyle, { justifyContent: "center", alignItems: "center", width: 32, height: 32 }]}>
          <Ionicons name="moon" size={32} color="#60a5fa" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};
