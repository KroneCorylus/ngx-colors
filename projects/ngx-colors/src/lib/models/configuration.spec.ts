import { Configuration } from './configuration';

describe('Configuration', () => {
  it('uses its defaults when constructed with no overwrites', () => {
    const config = new Configuration();
    expect(config.layout).toBe('pages');
    expect(config.display).toEqual({ text: true, sliders: true, palette: true });
  });

  it('does not throw when an overwrite is null (e.g. an unprovided @Optional() token)', () => {
    expect(() => new Configuration(null as never)).not.toThrow();
  });

  it('does not throw when an overwrite is undefined', () => {
    expect(() => new Configuration(undefined as never)).not.toThrow();
  });

  it('ignores null/undefined overwrites while still applying the others, regardless of position', () => {
    const config = new Configuration(
      { layout: 'full-vertical' },
      null as never,
      { eyedropper: true },
      undefined as never,
    );
    expect(config.layout).toBe('full-vertical');
    expect(config.eyedropper).toBe(true);
  });

  it('merges display options over the defaults instead of replacing the whole object', () => {
    const config = new Configuration({ display: { sliders: false } });
    expect(config.display).toEqual({ text: true, sliders: false, palette: true });
  });
});
