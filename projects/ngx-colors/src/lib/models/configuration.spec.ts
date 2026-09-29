import { Configuration } from './configuration';

describe('Configuration', () => {
  it('rejects an empty editor format list with an actionable error', () => {
    expect(() => new Configuration({ allowedModels: [] })).toThrowError(
      /allowedModels.*non-empty/,
    );
  });

  it('rejects invalid and legacy model names from untyped configuration', () => {
    for (const model of ['hex', 'HEX', 'INVALID', null]) {
      expect(
        () => new Configuration({ outputModel: model as never }),
      ).toThrowError(/outputModel/);
      expect(
        () => new Configuration({ allowedModels: [model as never] }),
      ).toThrowError(/allowedModels/);
    }
  });

  it('allows a fixed output format that is absent from the editor choices', () => {
    const config = new Configuration({
      outputModel: 'HEXA',
      allowedModels: ['RGBA', 'HSLA'],
    });
    expect(config.outputModel).toBe('HEXA');
    expect(config.allowedModels).toEqual(['RGBA', 'HSLA']);
  });
  it('uses its defaults when constructed with no overwrites', () => {
    const config = new Configuration();
    expect(config.layout).toBe('pages');
    expect(config.display).toEqual({
      text: true,
      sliders: true,
      palette: true,
    });
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
    expect(config.display).toEqual({
      text: true,
      sliders: false,
      palette: true,
    });
  });

  it('defaults position to undefined (automatic positioning)', () => {
    const config = new Configuration();
    expect(config.position).toBeUndefined();
  });

  it('applies a forced position from an overwrite', () => {
    const config = new Configuration({ position: 'top' });
    expect(config.position).toBe('top');
  });
});
