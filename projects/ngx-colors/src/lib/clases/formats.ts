import { EventEmitter, Output } from '@angular/core';
import { ColorFormats } from '../enums/formats';
import { ConverterService } from '../services/converter.service';

export class Rgba {
  constructor(public r: number, public g: number, public b: number, public a: number) {}

  public denormalize():Rgba{
    this.r = Math.round(this.r * 255);
    this.g = Math.round(this.g * 255);
    this.b = Math.round(this.b * 255);
    return this;
  }

  public toString():string{
    this.denormalize();
    let output =  
    'rgb' + 
    (this.a != 1 ? 'a(' : '(')+
    this.r + ', ' +
    this.g + ', ' +
    this.b + 
    (this.a != 1 ? ', ' + this.a.toPrecision(2) + ')' : ')')
    return output;
  }


}

export class Hsva {

  public onChange:EventEmitter<Hsva> = new EventEmitter<Hsva>(true);

  constructor(public h: number, public s: number, public v: number, public a: number) {
    
  }

  public onColorChange(value: { s: number, v: number, rgX: number, rgY: number }): void {
    this.s = value.s / value.rgX;
    this.v = value.v / value.rgY;
  }

  public onHueChange(value: { v: number, rgX: number }): void {
    this.h = value.v / value.rgX;
    // this.sliderH = this.hsva.h;
  }

  public onValueChange(value: { v: number, rgX: number }): void {
    this.v = value.v / value.rgX;
  }

  public onAlphaChange(value: { v: number, rgX: number }): void {
    this.a = value.v / value.rgX;
  }

}

export class Hsla {
  constructor(public h: number, public s: number, public l: number, public a: number) {}
  
  public denormalize():Hsla{
    this.h = Math.round(this.h * 360);
    this.s = Math.round(this.s * 100);
    this.l = Math.round(this.l * 100);
    return this;
  }
  public toString():string{
    let output =  
    'hsl' + 
    (this.a != 1 ? 'a(': '(') +
    this.h + ', ' +
    this.s + '%, ' +
    this.l + '%' + 
    (this.a != 1 ? ', ' + this.a.toPrecision(2) + ')' : ')')
    return output;
  }

}

export class Cmyk {
  constructor(public c: number, public m: number, public y: number, public k: number, public a: number = 1) {}
}
