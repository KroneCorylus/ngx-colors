import { PaletteColor } from './color';
import { Rgba } from './rgba';
import { ColorOption } from '../types/color-option';

describe('PaletteColor', () => {
  it('parses a plain string option into preview and value', () => {
    const color = new PaletteColor('#FF0000');

    expect(color.preview).toBe('#ff0000');
    expect(color.value).toEqual(new Rgba(255, 0, 0, 1));
    expect(color.childs).toBeUndefined();
  });

  it('parses an object option with color and name', () => {
    const color = new PaletteColor({ color: '#00FF00', name: 'green' });

    expect(color.preview).toBe('#00ff00');
    expect(color.name).toBe('green');
    expect(color.value).toEqual(new Rgba(0, 255, 0, 1));
    expect(color.childs).toBeUndefined();
  });

  it('maps childs recursively and leaves the parent without a value', () => {
    const color = new PaletteColor({
      color: '#ff0000',
      name: 'reds',
      childs: ['#aa0000', { color: '#ff5555', name: 'light red' }],
    });

    expect(color.value).toBeUndefined();
    expect(color.childs?.length).toBe(2);
    expect(color.childs?.[0].value).toEqual(new Rgba(170, 0, 0, 1));
    expect(color.childs?.[1].name).toBe('light red');
  });

  it('leaves everything undefined when the option has no color', () => {
    const color = new PaletteColor({ color: undefined, name: 'empty' });

    expect(color.value).toBeUndefined();
    expect(color.preview).toBeUndefined();
  });

  it('leaves everything undefined for a falsy option', () => {
    const color = new PaletteColor(undefined as unknown as ColorOption);

    expect(color.value).toBeUndefined();
    expect(color.preview).toBeUndefined();
    expect(color.name).toBeUndefined();
    expect(color.childs).toBeUndefined();
  });
});
