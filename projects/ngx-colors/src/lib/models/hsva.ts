import { EventEmitter } from '@angular/core';

export class Hsva {
  public onChange: EventEmitter<Hsva> = new EventEmitter<Hsva>(true);

  constructor(
    public h: number,
    public s: number,
    public v: number,
    public a: number
  ) {}

  public onColorChange(value: {
    s: number;
    v: number;
    rgX: number;
    rgY: number;
  }): void {
    this.s = value.s / value.rgX;
    this.v = value.v / value.rgY;
  }

  public onHueChange(value: { v: number; rgX: number }): void {
    this.h = value.v / value.rgX;
    // this.sliderH = this.hsva.h;
  }

  public onValueChange(value: { v: number; rgX: number }): void {
    this.v = value.v / value.rgX;
  }

  public onAlphaChange(value: { v: number; rgX: number }): void {
    this.a = value.v / value.rgX;
  }
}
