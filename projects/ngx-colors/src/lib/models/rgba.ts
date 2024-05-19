import { ColorFormat } from '../interfaces/color-format';

export function round(num: number, decimalPlaces = 0) {
  num = Math.round(Number(num + 'e' + decimalPlaces));
  return Number(num + 'e' + -decimalPlaces);
}

export class Rgba implements ColorFormat {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number
  ) {}

  public denormalize(): Rgba {
    this.r = Math.round(this.r * 255);
    this.g = Math.round(this.g * 255);
    this.b = Math.round(this.b * 255);
    return this;
  }

  public toNormalized(): Rgba {
    return new Rgba(
      Math.round(this.r / 255),
      Math.round(this.g / 255),
      Math.round(this.b / 255),
      this.a
    );
  }
  public toDenormalized(): Rgba {
    return new Rgba(
      Math.round(this.r * 255),
      Math.round(this.g * 255),
      Math.round(this.b * 255),
      this.a
    );
  }

  public toString(): string {
    this.denormalize();
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
