import { IColorModel } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Hsla implements IColorModel {
  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a: number
  ) {}

  public toRounded(h: number = 2, s: number = 4, l: number = 4, a: number = 4) {
    return new Hsla(
      round(this.h, h),
      round(this.s, s),
      round(this.l, l),
      round(this.a, a)
    );
  }
  public toString(): string {
    const h = round(this.h, 0);
    const s = round(this.s * 100, 0);
    const l = round(this.l * 100, 0);
    const a = round(this.a, 2);
    const output =
      'hsl' +
      (a != 1 ? 'a(' : '(') +
      h +
      ', ' +
      s +
      '%, ' +
      l +
      '%' +
      (a != 1 ? ', ' + a + ')' : ')');
    return output;
  }
}
