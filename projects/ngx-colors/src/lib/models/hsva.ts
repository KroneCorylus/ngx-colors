import { EventEmitter } from '@angular/core';
import { ColorFormat } from '../interfaces/color-format';

export class Hsva implements ColorFormat {
  public onChange: EventEmitter<Hsva> = new EventEmitter<Hsva>(true);

  constructor(
    public h: number,
    public s: number,
    public v: number,
    public a: number
  ) {}

  toString(): string {
    return `hsva(${this.h}, ${this.s},${this.v},${this.a})`;
  }
  //ONLY FOR TESTING
  public toNormalized(): Hsva {
    return new Hsva(this.h / 360, this.s, this.v, this.a);
  }
  public toDenormalized(): Hsva {
    return new Hsva(this.h * 360, this.s, this.v, this.a);
  }

  // public onColorChange(value: {
  //   s: number;
  //   v: number;
  //   rgX: number;
  //   rgY: number;
  // }): void {
  //   this.s = value.s / value.rgX;
  //   this.v = value.v / value.rgY;
  // }
  //
  // public onHueChange(value: { v: number; rgX: number }): void {
  //   this.h = value.v / value.rgX;
  //   // this.sliderH = this.hsva.h;
  // }
  //
  // public onValueChange(value: { v: number; rgX: number }): void {
  //   this.v = value.v / value.rgX;
  // }
  //
  // public onAlphaChange(value: { v: number; rgX: number }): void {
  //   this.a = value.v / value.rgX;
  // }
}
