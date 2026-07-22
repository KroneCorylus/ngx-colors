import {
  computeOverlayPosition,
  OverlayTriggerRect,
} from './overlay-position';

const VIEWPORT = { width: 1024, height: 768 };
const PANEL = { width: 250, height: 300 };

function trigger(partial: Partial<OverlayTriggerRect>): OverlayTriggerRect {
  return { top: 0, left: 0, right: 0, bottom: 0, ...partial };
}

describe('computeOverlayPosition', () => {
  describe('horizontal placement', () => {
    it('aligns to the trigger left edge when there is enough room', () => {
      const result = computeOverlayPosition(
        trigger({ left: 100, right: 150, top: 0, bottom: 20 }),
        PANEL,
        VIEWPORT,
      );
      expect(result.left).toBe(100);
    });

    it('clamps to the right edge of the viewport when it would overflow', () => {
      // trigger sits near the right edge; left-aligning the panel here would
      // push it past viewport width (1024).
      const result = computeOverlayPosition(
        trigger({ left: 950, right: 1000, top: 0, bottom: 20 }),
        PANEL,
        VIEWPORT,
      );
      expect(result.left).toBe(VIEWPORT.width - PANEL.width);
      expect(result.left + PANEL.width).toBeLessThanOrEqual(VIEWPORT.width);
    });

    it('clamps to 0 rather than going negative when the panel is wider than the viewport', () => {
      const result = computeOverlayPosition(
        trigger({ left: 950, right: 1000, top: 0, bottom: 20 }),
        { width: 2000, height: 300 },
        VIEWPORT,
      );
      expect(result.left).toBe(0);
    });

    it('never places the panel left of the viewport even if the trigger is scrolled off-screen', () => {
      const result = computeOverlayPosition(
        trigger({ left: -400, right: -350, top: 0, bottom: 20 }),
        PANEL,
        VIEWPORT,
      );
      expect(result.left).toBe(0);
    });
  });

  describe('horizontal placement in RTL', () => {
    it('aligns to the trigger right edge when there is enough room', () => {
      const result = computeOverlayPosition(
        trigger({ left: 700, right: 750, top: 0, bottom: 20 }),
        PANEL,
        VIEWPORT,
        undefined,
        'rtl',
      );
      expect(result.left).toBe(750 - PANEL.width);
      expect(result.left + PANEL.width).toBe(750);
    });

    it('clamps to the left edge of the viewport when it would overflow', () => {
      const result = computeOverlayPosition(
        trigger({ left: 10, right: 60, top: 0, bottom: 20 }),
        PANEL,
        VIEWPORT,
        undefined,
        'rtl',
      );
      expect(result.left).toBe(0);
    });

    it('never places the panel past the right viewport edge even for off-screen triggers', () => {
      const result = computeOverlayPosition(
        trigger({ left: 1400, right: 1450, top: 0, bottom: 20 }),
        PANEL,
        VIEWPORT,
        undefined,
        'rtl',
      );
      expect(result.left).toBe(VIEWPORT.width - PANEL.width);
    });
  });

  describe('vertical placement', () => {
    it('opens below the trigger when there is enough room', () => {
      const result = computeOverlayPosition(
        trigger({ top: 100, bottom: 120, left: 0, right: 50 }),
        PANEL,
        VIEWPORT,
      );
      expect(result.top).toBe(120);
    });

    it('flips above the trigger when there is no room below but there is above', () => {
      // Trigger near the bottom of a 768px viewport: 300px panel will not
      // fit in the remaining space below (768 - 700 = 68px), but there's
      // plenty of room above (700px).
      const result = computeOverlayPosition(
        trigger({ top: 700, bottom: 720, left: 0, right: 50 }),
        PANEL,
        VIEWPORT,
      );
      expect(result.top).toBe(700 - PANEL.height);
      expect(result.top + PANEL.height).toBeLessThanOrEqual(720);
    });

    it('falls back to clamping against the viewport bottom when it fits neither above nor below', () => {
      // A trigger in the vertical middle of a short viewport with a panel
      // taller than either available space.
      const result = computeOverlayPosition(
        trigger({ top: 200, bottom: 220, left: 0, right: 50 }),
        { width: 250, height: 500 },
        { width: 1024, height: 400 },
      );
      expect(result.top).toBe(0);
    });

    it('never returns a negative top', () => {
      const result = computeOverlayPosition(
        trigger({ top: 10, bottom: 30, left: 0, right: 50 }),
        { width: 250, height: 900 },
        VIEWPORT,
      );
      expect(result.top).toBeGreaterThanOrEqual(0);
    });
  });

  it('computes horizontal and vertical placement independently in the common case', () => {
    const result = computeOverlayPosition(
      trigger({ top: 50, bottom: 70, left: 200, right: 250 }),
      PANEL,
      VIEWPORT,
    );
    expect(result).toEqual({ top: 70, left: 200 });
  });

  describe('forcedPosition', () => {
    it('forces the panel below the trigger even when it would otherwise flip above', () => {
      const result = computeOverlayPosition(
        trigger({ top: 700, bottom: 720, left: 0, right: 50 }),
        PANEL,
        VIEWPORT,
        'bottom',
      );
      expect(result.top).toBe(720);
    });

    it('forces the panel above the trigger even when there is plenty of room below', () => {
      const result = computeOverlayPosition(
        trigger({ top: 100, bottom: 120, left: 0, right: 50 }),
        PANEL,
        VIEWPORT,
        'top',
      );
      expect(result.top).toBe(100 - PANEL.height);
    });

    it('does not clamp a forced position against the viewport - it can run off-screen', () => {
      const result = computeOverlayPosition(
        trigger({ top: 10, bottom: 30, left: 0, right: 50 }),
        PANEL,
        VIEWPORT,
        'top',
      );
      expect(result.top).toBe(10 - PANEL.height);
      expect(result.top).toBeLessThan(0);
    });

    it('leaves horizontal clamping untouched by a forced vertical position', () => {
      const result = computeOverlayPosition(
        trigger({ top: 100, bottom: 120, left: 950, right: 1000 }),
        PANEL,
        VIEWPORT,
        'bottom',
      );
      expect(result.left).toBe(VIEWPORT.width - PANEL.width);
    });
  });
});
