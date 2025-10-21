// Animation and UI related utilities

/**
 * Calculate dropdown height based on item count and constraints
 */
export function calculateDropdownHeight(
  itemCount: number, 
  maxHeight: number = 240,
  itemHeight: number = 60
): number {
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
}

/**
 * Common animation durations
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  MEDIUM: 300,
  SLOW: 500,
  DROPDOWN_SHOW: 300,
  DROPDOWN_HIDE: 250
} as const;

/**
 * Common animation easing curves
 */
export const ANIMATION_EASING = {
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  LINEAR: 'linear'
} as const;