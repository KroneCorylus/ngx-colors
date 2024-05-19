import { ColorFormat } from '../interfaces/color-format';

export class Hsla implements ColorFormat {
  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a: number
  ) {}

  public denormalize(): Hsla {
    this.h = Math.round(this.h * 360);
    this.s = Math.round(this.s * 100);
    this.l = Math.round(this.l * 100);
    return this;
  }

  public toDenormalized(percent: boolean = false): Hsla {
    let multiplier = percent ? 100 : 1;
    return new Hsla(
      this.h * 360,
      this.s * multiplier,
      this.l * multiplier,
      this.a
    );
  }
  public toNormalized(percent: boolean = false): Hsla {
    let multiplier = percent ? 100 : 1;
    return new Hsla(
      this.h / 360,
      this.s / multiplier,
      this.l / multiplier,
      this.a
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
      (this.a != 1 ? ', ' + this.a.toPrecision(2) + ')' : ')');
    return output;
  }
}
