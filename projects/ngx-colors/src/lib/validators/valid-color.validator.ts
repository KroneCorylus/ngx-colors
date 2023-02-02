import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validColorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }
    const rgbTest =
      /^\s*rgba?\(\s*(1?\d{1,2}|2[0-4]\d|25[0-5])\s*,\s*(1?\d{1,2}|2[0-4]\d|25[0-5])\s*,\s*(1?\d{1,2}|2[0-4]\d|25[0-5])\s*(,\s*(0\.\d{1,2}|1))?\s*\)\s*$/i;
    const hslTest =
      /^\s*hsla?\(\s*([0-2]?\d{1,2}|3[0-5]\d|360)\s*,\s*(0|[1-9]{1,2}|100)\%\s*,\s*(0|[1-9]{1,2}|100)\%\s*(,\s*(0\.\d{1,2}|1))?\s*\)\s*$/i;
    const hexTest = /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    const colorValid =
      rgbTest.test(value) || hslTest.test(value) || hexTest.test(value);
    return !colorValid ? { invalidColor: true } : null;
  };
}
