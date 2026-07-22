import { IColorModel } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Cmyk implements IColorModel {
  constructor(
    public c: number,
    public m: number,
    public y: number,
    public k: number,
    public a: number = 1 //CMYK do not have alpha channel, is included here to remember the value when changing formats.
  ) {}

  public toRounded(
    c: number = 4,
    m: number = 4,
    y: number = 4,
    k: number = 4,
    a: number = 4
  ): Cmyk {
    return new Cmyk(
      round(this.c, c),
      round(this.m, m),
      round(this.y, y),
      round(this.k, k),
      round(this.a, a)
    );
  }
  public toString(): string {
    const c = round(this.c * 100, 2);
    const m = round(this.m * 100, 2);
    const y = round(this.y * 100, 2);
    const k = round(this.k * 100, 2);
    return 'cmyk(' + c + '%, ' + m + '%, ' + y + '%, ' + k + '%)';
  }
}
