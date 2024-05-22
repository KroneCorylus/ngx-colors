import { EventEmitter } from '@angular/core';
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
    return `hsva(${this.h}, ${this.s},${this.v},${this.a})`;
  }
}
