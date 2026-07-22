import { defaultColors } from './default-colors';
import { PaletteColor } from '../models/color';

describe('defaultColors', () => {
  it('contains the 19 Material palette groups', () => {
    expect(defaultColors.length).toBe(19);
  });

  it('every group has a name, a valid preview color and childs', () => {
    for (const option of defaultColors) {
      if (typeof option !== 'object' || !option) {
        fail('every default palette entry should be a group object');
        return;
      }
      expect(option.color).toMatch(/^#[0-9A-F]{6}$/);
      expect(option.name?.length).toBeGreaterThan(0);
      expect(option.childs?.length).toBeGreaterThan(0);
    }
  });

  it('every group preview is included in its own childs', () => {
    for (const option of defaultColors) {
      if (typeof option === 'object' && option?.childs) {
        expect(option.childs).toContain(option.color);
      }
    }
  });

  it('parses into PaletteColor without errors', () => {
    const parsed = defaultColors.map((option) => new PaletteColor(option));
    for (const color of parsed) {
      expect(color.preview).toBeTruthy();
      expect(color.childs?.length).toBeGreaterThan(0);
      for (const child of color.childs ?? []) {
        expect(child.value).toBeTruthy();
      }
    }
  });
});
