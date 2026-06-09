/**
 * Calculates the next index in a circular list.
 */
export function getNextIndex(currentIndex: number, totalItems: number): number {
  if (totalItems <= 0) return 0;
  return (currentIndex + 1) % totalItems;
}

/**
 * Calculates the previous index in a circular list.
 */
export function getPrevIndex(currentIndex: number, totalItems: number): number {
  if (totalItems <= 0) return 0;
  return (currentIndex - 1 + totalItems) % totalItems;
}

/**
 * Determines swipe direction based on touch horizontal movement.
 * Returns 'prev' for left-to-right swipe (showing previous item),
 * 'next' for right-to-left swipe (showing next item),
 * or null if below threshold.
 */
export function getSwipeDirection(
  startX: number,
  endX: number,
  threshold = 50,
): "prev" | "next" | null {
  const swipeDistance = endX - startX;
  if (Math.abs(swipeDistance) > threshold) {
    return swipeDistance > 0 ? "prev" : "next";
  }
  return null;
}
