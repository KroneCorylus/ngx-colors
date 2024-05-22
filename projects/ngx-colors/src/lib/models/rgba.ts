import { ColorFormat } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Rgba implements ColorFormat {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number
  ) {}

  public toRounded(
    r: number = 0,
    g: number = 0,
    b: number = 0,
    a: number = 4
  ): Rgba {
    return new Rgba(
      round(this.r, r),
      round(this.g, g),
      round(this.b, b),
      round(this.a, a)
    );
  }
  public toString(): string {
    const rgba = this.toRounded(0, 0, 0, 2);
    const output =
      'rgb' +
      (rgba.a != 1 ? 'a(' : '(') +
      rgba.r +
      ', ' +
      rgba.g +
      ', ' +
      rgba.b +
      (rgba.a != 1 ? ', ' + rgba.a.toPrecision(2) + ')' : ')');
    return output;
  }
}
