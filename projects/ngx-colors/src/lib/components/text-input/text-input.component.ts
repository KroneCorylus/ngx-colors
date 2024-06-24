import { CommonModule } from '@angular/common';
import { Component, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Rgba } from '../../models/rgba';
import { Convert } from '../../utility/convert';
import { ColorFormats } from '../../enums/color-formats';

@Component({
  selector: 'ngx-colors-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss', '../../shared/shared.scss'],
})
export class TextInputComponent implements ControlValueAccessor, OnInit {
  value: Rgba | undefined = undefined;

  inputControl: FormControl<string | null | undefined> = new FormControl<
    string | undefined
  >('asd');

  disabled: boolean = false;

  public formatString = 'RGBA';

  private availableFormats = ['RGBA', 'HEXA', 'HSVA', 'HSLA', 'CMYK'];

  ngOnInit(): void {
    this.inputControl.valueChanges.subscribe((changes) => {
      if (typeof changes === 'string') {
        if (Convert.getFormatByString(changes) === 'invalid') {
          return;
        }
        this.value = Convert.stringToRgba(changes);
        this.onChange(this.value);
      }
    });
  }

  private getFormatByStringFormat(value: string) {
    switch (value.toUpperCase()) {
      case 'RGBA':
        return ColorFormats.RGBA;
      case 'HEXA':
        return ColorFormats.HEX;
      case 'HSVA':
        return ColorFormats.HSVA;
      case 'HSLA':
        return ColorFormats.HSLA;
      case 'CMYK':
        return ColorFormats.CMYK;
      default:
        return ColorFormats.RGBA;
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
    if (this.value) {
      this.inputControl.setValue(
        Convert.rgbaToFormat(
          this.value,
          this.getFormatByStringFormat(this.formatString)
        ).toString()
      );
    }
  }

  writeValue(obj: Rgba | undefined): void {
    this.value = obj;
    if (this.value) {
      this.inputControl.setValue(
        Convert.rgbaToFormat(
          this.value,
          this.getFormatByStringFormat(this.formatString)
        ).toString()
      );
    } else {
      this.inputControl.setValue('');
    }
  }

  onChange: (value: Rgba | undefined) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: Rgba | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
