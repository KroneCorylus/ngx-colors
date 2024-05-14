import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-colors-color-picker',
  standalone: true,
  imports: [CommonModule],
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
}
