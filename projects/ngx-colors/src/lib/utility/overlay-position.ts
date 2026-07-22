export interface OverlayTriggerRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface OverlaySize {
  width: number;
  height: number;
}

export interface OverlayPosition {
  top: number;
  left: number;
}

/**
 * Computes where to place the overlay panel relative to its trigger so it
 * stays inside the viewport instead of running off-screen:
 *  - Horizontally: aligned to the trigger's left edge, clamped so the panel
 *    never overflows the right (or left) edge of the viewport.
 *  - Vertically: opens below the trigger by default, flips above it when
 *    there isn't enough room below but there is above, and otherwise clamps
 *    to the viewport as a last resort (panel taller than the viewport).
 */
export function computeOverlayPosition(
  trigger: OverlayTriggerRect,
  panel: OverlaySize,
  viewport: OverlaySize,
): OverlayPosition {
  return {
    top: clampVertical(trigger, panel, viewport),
    left: clampHorizontal(trigger, panel, viewport),
  };
}

function clampHorizontal(
  trigger: OverlayTriggerRect,
  panel: OverlaySize,
  viewport: OverlaySize,
): number {
  const maxLeft = Math.max(viewport.width - panel.width, 0);
  return Math.min(Math.max(trigger.left, 0), maxLeft);
}

function clampVertical(
  trigger: OverlayTriggerRect,
  panel: OverlaySize,
  viewport: OverlaySize,
): number {
  const spaceBelow = viewport.height - trigger.bottom;
  const spaceAbove = trigger.top;
  const fitsBelow = panel.height <= spaceBelow;
  const fitsAbove = panel.height <= spaceAbove;

  if (fitsBelow || !fitsAbove) {
    // Either it fits below (the common case), or it fits nowhere - in which
    // case anchoring below and clamping to the viewport is the least-bad
    // option.
    return Math.min(trigger.bottom, Math.max(viewport.height - panel.height, 0));
  }
  // Doesn't fit below but does fit above: flip it.
  return Math.max(trigger.top - panel.height, 0);
}
