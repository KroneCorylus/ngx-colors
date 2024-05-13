import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { defaultColors } from '../../utility/default-colors';
import { Color } from '../../models/color';
import { Palette } from '../../types/palette';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    if (this.palette.back) {
      this.palette.list = this.palette.back.list;
      this.palette.back = this.palette.back.back;
    }
  }

  private selectColor(color: Color) {
    this.selected = color.preview;
  }
}
