import { ColorGroup } from '../interfaces/color-group';
import { Convert } from '../utility/convert';
import { Hsva } from './hsva';
export class Color {
  public preview: string;
  public value: Hsva | undefined;
  public childs: Array<Color> | undefined;
  constructor(color: string | ColorGroup) {
    if (typeof color == 'string') {
      this.preview = color;
      this.value = Convert.stringToHsva(color) ?? new Hsva(0, 0, 0, 1);
      return;
    }
    this.preview = color.color;
    if (color.childs?.length) {
      this.childs = color.childs.map((c) => new Color(c));
      return;
    }
    this.value = Convert.stringToHsva(color.color) ?? new Hsva(0, 0, 0, 1);
  }
}
