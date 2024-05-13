import { ColorFormat } from '../interfaces/color-format';

export class Cmyk implements ColorFormat {
  constructor(
    public c: number,
    public m: number,
    public y: number,
    public k: number,
    public a: number = 1
  ) {}

  public denormalize(): Cmyk {
    this.c = Math.round(this.c * 100);
    this.m = Math.round(this.m * 100);
    this.y = Math.round(this.y * 100);
    this.k = Math.round(this.k * 100);
    return this;
  }
  public toString(): string {
    this.denormalize();
    let output =
      'cmyk(' + this.c + ', ' + this.m + ', ' + this.y + ', ' + this.k + ')';
    return output;
  }
}
