import { ColorFormat } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Hsla implements ColorFormat {
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
    let output =
      'hsl' +
      (this.a != 1 ? 'a(' : '(') +
      this.h +
      ', ' +
      this.s +
      '%, ' +
      this.l +
      '%' +
      (this.a != 1 ? ', ' + this.a + ')' : ')');
    return output;
  }
}
