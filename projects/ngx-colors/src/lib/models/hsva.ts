import { ColorFormat } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Hsva implements ColorFormat {
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
    const hsva = this.toRounded(0, 2, 2, 2);
    if (hsva.a === 1) {
      return (
        'hsv(' + hsva.h + ', ' + hsva.s * 100 + '%, ' + hsva.v * 100 + '%)'
      );
    } else {
      return (
        'hsva(' +
        hsva.h +
        ', ' +
        hsva.s * 100 +
        '%, ' +
        hsva.v * 100 +
        '%, ' +
        hsva.a +
        ')'
      );
    }
  }
}
