import { PaletteStack } from './palette-stack';
import { PaletteColor } from './color';

describe('PaletteStack', () => {
  function colors(...hex: Array<string>): Array<PaletteColor> {
    return hex.map((h) => new PaletteColor(h));
  }

  it('starts empty', () => {
    const stack = new PaletteStack();
    expect(stack.items).toEqual([]);
    expect(stack.peek).toEqual([]);
    expect(stack.size).toBe(0);
  });

  it('push() updates peek/size to the newly pushed level', () => {
    const stack = new PaletteStack();
    const level = colors('#e57373');
    stack.push(level);
    expect(stack.peek).toBe(level);
    expect(stack.size).toBe(1);
  });

  it('pop() falls back to the previous level and refuses to pop the last one', () => {
    const stack = new PaletteStack();
    const root = colors('#e57373');
    const nested = colors('#ffffff');
    stack.push(root);
    stack.push(nested);

    stack.pop();
    expect(stack.peek).toBe(root);
    expect(stack.size).toBe(1);

    expect(stack.pop()).toBeUndefined();
    expect(stack.peek).toBe(root);
    expect(stack.size).toBe(1);
  });

  it('clear() resets peek/size along with items (C14)', () => {
    const stack = new PaletteStack();
    stack.push(colors('#e57373'));
    stack.push(colors('#ffffff'));

    stack.clear();

    expect(stack.items).toEqual([]);
    expect(stack.peek).toEqual([]);
    expect(stack.size).toBe(0);
  });
});
