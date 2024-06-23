import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements OnChanges {
  public hue: string = 'red';
  public preview: string = 'red';
  public alphaGradient: { background: string } = {
    background:
      'linear-gradient(90deg, rgba(36,0,0,0) 0%, ' + this.hue + ' 100%)',
  };

  //state in rgba (output format)
  @Input() value: Rgba | undefined = new Rgba(255, 0, 0, 1);
  @Output() valueChange: EventEmitter<Rgba> = new EventEmitter<Rgba>();
  constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('slSlider', { read: SliderDirective, static: true })
  slSlider!: SliderDirective;
  @ViewChild('alphaSlider', { read: SliderDirective, static: true })
  alphaSlider!: SliderDirective;
  @ViewChild('hueSlider', { read: SliderDirective, static: true })
  hueSlider!: SliderDirective;

  public _hue: Hsva = new Hsva(1, 1, 1, 1);
  //state in hsva
  public _value: Hsva = new Hsva(1, 1, 1, 1);

  ngOnChanges(changes: SimpleChanges): void {
    const value = changes['value'].currentValue;
    this.setValue(value);
  }

  private setValue(value: Rgba | undefined) {
    if (!value) {
      this.preview = 'red';
      this.hue = 'red';
      this._value = new Hsva(1, 1, 1, 1);
      this._hue = new Hsva(1, 1, 1, 1);
    }
    if (value instanceof Rgba) {
      this._value = Convert.rgbaToFormat(value, ColorFormats.HSVA) as Hsva;
      this._hue.h = this._value.h;
      this.preview = value.toString();
      this.hue = Convert.hsva2Rgba(this._hue).toString();
      this.alphaGradient = this.getAlphaGradient(this.value!);
    }
    this.slSlider?.setThumbPosition(this._value.s, 1 - this._value.v);
    this.hueSlider?.setThumbPosition(this._value.h / 360, 0);
    this.alphaSlider?.setThumbPosition(this._value.a, 0);
    this.cdr.detectChanges();
  }

  //Fired on change of slider directive.
  public onChangeCoord(
    sliderCode: 'hue' | 'sl' | 'alpha',
    coord: [number, number]
  ) {
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
    this.alphaGradient = this.getAlphaGradient(this.value);
    this.cdr.detectChanges();
  }

  private getAlphaGradient(rgba: Rgba) {
    const color = new Rgba(rgba.r, rgba.g, rgba.b, 1).toString();
    return {
      background:
        'linear-gradient(90deg, rgba(36,0,0,0) 0%, ' + color + ' 100%)',
    };
  }
}
