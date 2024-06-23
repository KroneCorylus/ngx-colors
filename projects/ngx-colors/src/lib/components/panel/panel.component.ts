import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { defaultColors } from '../../utility/default-colors';
import { Color } from '../../models/color';
import { Palette } from '../../types/palette';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { Rgba } from '../../models/rgba';

@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPickerComponent],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', '../../shared/shared.scss'],
})
export class PanelComponent implements OnInit {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }

  public palette: Palette = {
    back: undefined,
    list: defaultColors.map((c) => new Color(c)),
  };
  public selected: string = '#9575CD';
  public showSliders: boolean = false;

  public value: Rgba = new Rgba(255, 0, 0, 1);

  constructor() {}

  ngOnInit(): void {}

  public onClickColor(color: Color): void {
    if (color.childs?.length) {
      this.palette.back = { ...this.palette };
      this.palette.list = color.childs;
    } else {
      this.selectColor(color);
    }
  }

  public onClickBack() {
    if (this.showSliders) {
      this.showSliders = false;
    }
    if (this.palette.back) {
      this.palette.list = this.palette.back.list;
      this.palette.back = this.palette.back.back;
    }
  }

  public onClickShowSliders() {
    this.showSliders = true;
  }

  private selectColor(color: Color) {
    this.selected = color.preview;
  }
}
