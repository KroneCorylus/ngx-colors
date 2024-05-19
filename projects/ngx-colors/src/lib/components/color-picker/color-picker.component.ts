import { CommonModule } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component } from '@angular/core';
import { SliderDirective } from '../../directives/slider.directive';
import { ThumbComponent } from '../thumb/thumb.component';
import { Hsva } from '../../models/hsva';
import { Convert } from '../../utility/convert';
import { Rgba } from '../../models/rgba';

@Component({
  selector: 'ngx-colors-color-picker',
  standalone: true,
  imports: [CommonModule, SliderDirective, ThumbComponent],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss', '../../shared/shared.scss'],
})
export class ColorPickerComponent {
  public hue: string = 'red';
  public alphaGradient: { background: string } = {
    background:
      'linear-gradient(90deg, rgba(36,0,0,0) 0%, ' + this.hue + ' 100%)',
  };

  constructor(private cdr: ChangeDetectorRef) {}

  hueHsva: Hsva = new Hsva(1, 1, 1, 1);
  value: Hsva = new Hsva(0, 0, 0, 0);

  public onChangeCoord(sliderCode: string, coord: [number, number]) {
    let x: number, y: number;
    [x, y] = coord;
    if (sliderCode == 'hue') {
      this.hueHsva.h = x;
      let rgb: Rgba = Convert.hsvaToRgba(this.hueHsva);
      this.hue = rgb.toString();
      console.log(this.hueHsva, rgb);
    }

    this.cdr.detectChanges();
    console.log(sliderCode, coord);
  }
}
