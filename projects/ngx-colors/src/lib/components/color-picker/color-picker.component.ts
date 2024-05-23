import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SliderDirective } from '../../directives/slider.directive';
import { ThumbComponent } from '../thumb/thumb.component';
import { Hsva } from '../../models/hsva';
import { Convert } from '../../utility/convert';
import { Rgba } from '../../models/rgba';
import { ColorFormats } from '../../enums/color-formats';

@Component({
  selector: 'ngx-colors-color-picker',
  standalone: true,
  imports: [CommonModule, SliderDirective, ThumbComponent],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss', '../../shared/shared.scss'],
})
export class ColorPickerComponent implements OnChanges {
  public hue: string = 'red';
  public preview: string = 'red';
  public alphaGradient: { background: string } = {
    background:
      'linear-gradient(90deg, rgba(36,0,0,0) 0%, ' + this.hue + ' 100%)',
  };

  @Input() value: Rgba | undefined = new Rgba(255, 0, 0, 1);
  @Output() valueChange: EventEmitter<Rgba> = new EventEmitter<Rgba>();
  constructor(private cdr: ChangeDetectorRef) {}

  private _hue: Hsva = new Hsva(1, 1, 1, 1);
  private _value: Hsva = new Hsva(1, 1, 1, 1);

  ngOnChanges(changes: SimpleChanges): void {
    let value = changes['value'].currentValue;
    console.log('colorpicker onChanges', changes);
    if (!value) {
      this.preview = 'red';
      this.hue = 'red';
      this._value = new Hsva(1, 1, 1, 1);
      this._hue = new Hsva(1, 1, 1, 1);
      return;
    }
    if (value instanceof Rgba) {
      this._value = Convert.rgbaToFormat(value, ColorFormats.HSVA) as Hsva;
      this._hue.h = this._value.h;
      this.preview = value.toString();
      this.hue = Convert.hsva2Rgba(this._hue).toString();
      this.alphaGradient = this.getAlphaGradient(this.hue);
    }
  }

  public onChangeCoord(sliderCode: string, coord: [number, number]) {
    const [x, y] = coord;
    if (sliderCode === 'hue') {
      this._hue.h = x * 360;
      this._value.h = x * 360;
      this.hue = Convert.hsva2Rgba(this._hue).toString();
    }
    if (sliderCode === 'sl') {
      this._value.s = x;
      this._value.v = 1 - y;
    }
    if (sliderCode === 'alpha') {
      this._value.a = x;
    }
    this.value = Convert.hsva2Rgba(this._value);
    this.preview = this.value.toString();
    this.alphaGradient = this.getAlphaGradient(this.preview);
    this.cdr.detectChanges();
    this.valueChange.emit(this.value);
  }

  private getAlphaGradient(color: string) {
    return {
      background:
        'linear-gradient(90deg, rgba(36,0,0,0) 0%, ' + color + ' 100%)',
    };
  }
}
