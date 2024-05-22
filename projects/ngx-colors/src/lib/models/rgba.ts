import { ColorFormat } from '../interfaces/color-format';
import { round } from '../utility/round';

export class Rgba implements ColorFormat {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number
  ) {}

  public getRounded(decimalCount: number = 0): Rgba {
    return new Rgba(
      round(this.r, decimalCount),
      round(this.g, decimalCount),
      round(this.b, decimalCount),
      round(this.a, 4)
    );
  }
  public toString(): string {
    let output =
      'rgb' +
      (this.a != 1 ? 'a(' : '(') +
      this.r +
      ', ' +
      this.g +
      ', ' +
      this.b +
      (this.a != 1 ? ', ' + this.a.toPrecision(2) + ')' : ')');
    return output;
  }
}
