import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { defaultColors } from '../../utility/default-colors';
import { Color } from '../../models/color';
import { Palette } from '../../types/palette';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { Rgba } from '../../models/rgba';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerComponent,
    TextInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', '../../shared/shared.scss'],
})
export class PanelComponent implements OnInit {
  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  public palette: Palette = {
    back: undefined,
    list: defaultColors.map((c) => new Color(c)),
  };
  public selected: string = '#9575CD';
  public showSliders: boolean = false;

  public value: Rgba | undefined = new Rgba(255, 0, 0, 1);

  public colorPickerControl: FormControl<Rgba | null | undefined> =
    new FormControl<Rgba | undefined>(this.value);
  public textInputControl: FormControl<Rgba | null | undefined> =
    new FormControl<Rgba | undefined>(this.value);

  public formatString = 'RGBA';

  private availableFormats = ['RGBA', 'HEXA', 'HSVA', 'HSLA', 'CMYK'];

  public disabled: boolean = false;
  constructor() {}

  public ngOnInit(): void {
    this.textInputControl.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

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

  public onClickFormat(): void {
    const index =
      (this.availableFormats.findIndex((af) => af === this.formatString) + 1) %
      this.availableFormats.length;
    if (index === -1) {
      this.formatString = this.availableFormats[0];
      return;
    }
    this.formatString = this.availableFormats[index];
  }

  public onClickShowSliders() {
    this.showSliders = true;
  }

  private selectColor(color: Color) {
    this.selected = color.preview;
  }

  writeValue(obj: Rgba | undefined): void {
    this.value = obj;
  }

  onChange: (value: string | undefined) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
