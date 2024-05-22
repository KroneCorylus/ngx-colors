import { ColorFormat } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Cmyk implements ColorFormat {
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
    let cmyk = this.toRounded();
    return (
      'cmyk(' +
      cmyk.c * 100 +
      '%, ' +
      cmyk.m * 100 +
      '%, ' +
      cmyk.y * 100 +
      '%, ' +
      cmyk.k * 100 +
      '%)'
    );
  }
}
