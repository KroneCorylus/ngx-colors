import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ColorHelper } from '../utility/color-helper';
import { IColorModel } from '../interfaces/color-format';
import { Rgba } from '../models/rgba';
import { Hsla } from '../models/hsla';
import { Hsva } from '../models/hsva';
import { Cmyk } from '../models/cmyk';

export function colorValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if (ColorHelper.getColorModelByString(control.value) === 'INVALID') {
      return { invalidColor: true };
    }
    const color = ColorHelper.stringToColor(control.value);
    return isColorInRange(color) ? null : { invalidColor: true };
  };
}

function inRange(value: number, max: number): boolean {
  return value >= 0 && value <= max;
}

function isColorInRange(color: IColorModel | string): boolean {
  if (color instanceof Rgba) {
    return (
      [color.r, color.g, color.b].every((channel) => inRange(channel, 255)) &&
      inRange(color.a, 1)
    );
  }
  if (color instanceof Hsla) {
    return (
      inRange(color.h, 360) &&
      [color.s, color.l, color.a].every((channel) => inRange(channel, 1))
    );
  }
  if (color instanceof Hsva) {
    return (
      inRange(color.h, 360) &&
      [color.s, color.v, color.a].every((channel) => inRange(channel, 1))
    );
  }
  if (color instanceof Cmyk) {
    return [color.c, color.m, color.y, color.k, color.a].every((channel) =>
      inRange(channel, 1),
    );
  }
  return true;
}
