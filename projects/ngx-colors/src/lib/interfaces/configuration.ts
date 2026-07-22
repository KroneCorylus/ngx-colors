export const NGX_COLORS_CONFIG = new InjectionToken<NgxColorsConfiguration>(
  'NgxColorsConfiguration',
);
import { InjectionToken } from '@angular/core';
import { ColorOption } from '../types/color-option';
import {
  AnimationOptions,
  ConfirmationRequiredOptions,
  DisplayOptions,
  LayoutOptions,
  LockValuesOptions,
  PositionOptions,
} from '../types/configuration';
import { Observable } from 'rxjs';
import { ColorModel } from '../types/color-model';
import { Labels } from './labels';

export interface NgxColorsConfiguration {
  display?: DisplayOptions;
  layout?: LayoutOptions;
  lockValues?: LockValuesOptions;
  outputModel?: ColorModel | 'AUTO';
  allowedModels?: Array<ColorModel>;
  eyedropper?: boolean;
  palette?: Observable<ColorOption[]> | ColorOption[] | undefined;
  animation?: AnimationOptions;
  overlayClass?: string | undefined;
  overlayAttachTo?: string | HTMLElement | undefined;
  labels?: Labels | undefined;
  confirmationRequired?: ConfirmationRequiredOptions;
  position?: PositionOptions | undefined;
}
