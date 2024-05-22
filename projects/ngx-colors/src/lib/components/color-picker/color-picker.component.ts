import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SliderDirective } from '../../directives/slider.directive';
import { ThumbComponent } from '../thumb/thumb.component';
import { Hsva } from '../../models/hsva';
import { Convert } from '../../utility/convert';

@Component({
  selector: 'ngx-colors-color-picker',
  standalone: true,
  imports: [CommonModule, SliderDirective, ThumbComponent],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss', '../../shared/shared.scss'],
})
export class ColorPickerComponent {
  public hue: string = 'red';
  public preview: string = 'red';
  public alphaGradient: { background: string } = {
    background:
      'linear-gradient(90deg, rgba(36,0,0,0) 0%, ' + this.hue + ' 100%)',
  };

  constructor(private cdr: ChangeDetectorRef) {}

  hueHsva: Hsva = new Hsva(1, 1, 1, 1);
  value: Hsva = new Hsva(1, 1, 1, 1);

  public onChangeCoord(sliderCode: string, coord: [number, number]) {
    const [x, y] = coord;
    if (sliderCode == 'hue') {
      this.hueHsva.h = x * 360;
      this.value.h = x * 360;
      this.hue = Convert.hsva2Rgba(this.hueHsva).toString();
    }
    if (sliderCode == 'sl') {
      this.value.s = x;
      this.value.v = 1 - y;
    }
    if (sliderCode == 'alpha') {
      this.value.a = x;
    }
    this.preview = Convert.hsva2Rgba(this.value).toString();
    this.cdr.detectChanges();
  }
}
