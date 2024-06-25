import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Convert } from '../utility/convert';

export function ColorValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (Convert.getColorModelByString(control.value) === 'INVALID') {
      return { invalidColor: true };
    }
    return null;
  };
}
