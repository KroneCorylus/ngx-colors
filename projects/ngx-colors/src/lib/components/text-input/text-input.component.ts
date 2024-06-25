import { CommonModule } from '@angular/common';
import { Component, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Rgba } from '../../models/rgba';
import { Convert } from '../../utility/convert';
import { ColorModel } from '../../types/color-model';
import { ColorValidator } from '../../validators/color-validator';

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
  >('', [ColorValidator()]);

  disabled: boolean = false;

  public selectedColorModel: ColorModel = 'RGBA';

  private availableModels: Array<ColorModel> = [
    'RGBA',
    'HEX',
    'HSVA',
    'HSLA',
    'CMYK',
  ];

  ngOnInit(): void {
    this.inputControl.valueChanges.subscribe((changes) => {
      if (typeof changes === 'string') {
        if (Convert.getColorModelByString(changes) === 'INVALID') {
          return;
        }
        this.value = Convert.stringToRgba(changes);
        this.onChange(this.value);
      }
    });
  }

  public onClickColorModel(): void {
    const index =
      (this.availableModels.findIndex((af) => af === this.selectedColorModel) +
        1) %
      this.availableModels.length;
    if (index === -1) {
      this.selectedColorModel = this.availableModels[0];
      return;
    }
    this.selectedColorModel = this.availableModels[index];
    if (this.value) {
      this.inputControl.setValue(
        Convert.rgbaToColorModel(this.value, this.selectedColorModel).toString()
      );
    }
  }

  writeValue(obj: Rgba | undefined): void {
    this.value = obj;
    if (this.value) {
      this.inputControl.setValue(
        Convert.rgbaToColorModel(this.value, this.selectedColorModel).toString()
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
