import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SliderDirective } from '../../directives/slider.directive';
import { ThumbComponent } from '../thumb/thumb.component';

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

  constructor() {}

  public onChangeCoord(sliderCode: string, coord: any) {
    console.log(sliderCode, coord);
  }
}
