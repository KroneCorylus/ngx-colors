// color-picker.tokens.ts
import { InjectionToken } from '@angular/core';

export interface Labels {
  accept?: string;
  cancel?: string;
}

export const NGX_COLORS_LABELS = new InjectionToken<Labels>(
  'NGX_COLORS_LABELS',
);
