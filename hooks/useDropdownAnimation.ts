import { useRef } from 'react';
import { Animated } from 'react-native';

export function useDropdownAnimation() {
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const calculateDropdownHeight = (itemCount: number, maxHeight: number = 240) => {
    const itemHeight = 60;
    const containerTopPadding = 4; 
    const containerBottomPadding = 8; 
    const marginTop = 4; 
    const borderWidth = 1; 
    const extraBuffer = 6; 
    const animatedContainerMargin = 8; 
    
    return Math.min(
      (itemCount * itemHeight) + containerTopPadding + containerBottomPadding + marginTop + borderWidth + extraBuffer + animatedContainerMargin, 
      maxHeight
    );
  };

  const showDropdown = (itemCount: number, duration: number = 300) => {
    const calculatedHeight = calculateDropdownHeight(itemCount);
    
    Animated.timing(slideAnimation, {
      toValue: calculatedHeight,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const hideDropdown = (duration: number = 250, onComplete?: () => void) => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start(onComplete);
  };

  return {
    slideAnimation,
    showDropdown,
    hideDropdown,
    calculateDropdownHeight
  };
}