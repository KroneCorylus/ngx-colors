import { IColorModel } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Hsva implements IColorModel {
  constructor(
    public h: number,
    public s: number,
    public v: number,
    public a: number
  ) {}

  toRounded(h: number = 2, s: number = 4, v: number = 4, a: number = 4): Hsva {
    return new Hsva(
      round(this.h, h),
      round(this.s, s),
      round(this.v, v),
      round(this.a, a)
    );
  }

  toString(): string {
    const h = round(this.h, 0);
    const s = round(this.s * 100, 0);
    const v = round(this.v * 100, 0);
    const a = round(this.a, 2);
    if (a === 1) {
      return 'hsv(' + h + ', ' + s + '%, ' + v + '%)';
    } else {
      return 'hsva(' + h + ', ' + s + '%, ' + v + '%, ' + a + ')';
    }
  }
}
