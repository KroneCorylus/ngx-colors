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

export type ForcedPosition = 'top' | 'bottom';

export type OverlayDirection = 'ltr' | 'rtl';

/**
 * Computes where to place the overlay panel relative to its trigger so it
 * stays inside the viewport instead of running off-screen:
 *  - Horizontally: aligned to the trigger's leading edge (left edge in LTR,
 *    right edge in RTL), clamped so the panel never overflows either side of
 *    the viewport.
 *  - Vertically: opens below the trigger by default, flips above it when
 *    there isn't enough room below but there is above, and otherwise clamps
 *    to the viewport as a last resort (panel taller than the viewport).
 */
export function computeOverlayPosition(
  trigger: OverlayTriggerRect,
  panel: OverlaySize,
  viewport: OverlaySize,
  forcedPosition?: ForcedPosition,
  direction: OverlayDirection = 'ltr',
): OverlayPosition {
  return {
    top: clampVertical(trigger, panel, viewport, forcedPosition),
    left: clampHorizontal(trigger, panel, viewport, direction),
  };
}

function clampHorizontal(
  trigger: OverlayTriggerRect,
  panel: OverlaySize,
  viewport: OverlaySize,
  direction: OverlayDirection,
): number {
  const maxLeft = Math.max(viewport.width - panel.width, 0);
  const preferredLeft =
    direction === 'rtl' ? trigger.right - panel.width : trigger.left;
  return Math.min(Math.max(preferredLeft, 0), maxLeft);
}

function clampVertical(
  trigger: OverlayTriggerRect,
  panel: OverlaySize,
  viewport: OverlaySize,
  forcedPosition?: ForcedPosition,
): number {
  if (forcedPosition === 'bottom') {
    return trigger.bottom;
  }
  if (forcedPosition === 'top') {
    return trigger.top - panel.height;
  }

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
