import { ColorGroup } from '../interfaces/color-group';
import { Convert } from '../utility/convert';
import { Rgba } from './rgba';

export class Color {
  public preview: string;
  public value: Rgba | undefined;
  public childs: Array<Color> | undefined;
  constructor(color: string | ColorGroup) {
    if (typeof color == 'string') {
      this.preview = color;
      this.value = Convert.stringToRgba(color);
      return;
    }
    this.preview = color.color;
    if (color.childs?.length) {
      this.childs = color.childs.map((c) => new Color(c));
      return;
    }
    this.value = Convert.stringToRgba(color.color);
  }
}
