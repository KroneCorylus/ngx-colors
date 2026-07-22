/*
 * v3 backward-compatibility layer. Everything in this file (and the sections
 * in trigger.directive.ts / public-api.ts that reference it) is deprecated
 * and will be removed in the next major version.
 */
import { ValidatorFn } from '@angular/forms';
import { ColorValidator } from '../validators/color-validator';
import { ColorModel } from '../types/color-model';
import { ColorOption } from '../types/color-option';
import { NgxColorsConfiguration } from '../interfaces/configuration';

/**
 * @deprecated v3 palette item shape. Use `ColorOption`
 * (`{ color, childs?, name? }`) instead. Will be removed in the next major
 * version.
 */
export class NgxColorsColor {
  color?: string;
  preview?: string;
  variants?: Array<string>;
  constructor(params?: {
    color?: string;
    preview?: string;
    variants?: Array<string>;
  }) {
    if (params) {
      this.color = params.color;
      this.preview = params.preview;
      this.variants = params.variants;
    }
  }
}

/**
 * @deprecated Use `ColorValidator` instead (same behavior, same
 * `{ invalidColor: true }` error key). Will be removed in the next major
 * version.
 */
export const validColorValidator: () => ValidatorFn = ColorValidator;

export type LegacyTriggerInputs = {
  colorsAnimation?: 'slide-in' | 'popup';
  format?: string;
  formats?: string[];
  hideTextInput?: boolean;
  hideColorPicker?: boolean;
  attachTo?: string;
  overlayClassName?: string;
  acceptLabel?: string;
  cancelLabel?: string;
  colorPickerControls?: 'default' | 'only-alpha' | 'no-alpha';
};

const LEGACY_FORMAT_TO_MODEL: Record<string, ColorModel> = {
  hex: 'HEXA',
  rgba: 'RGBA',
  hsla: 'HSLA',
  hsva: 'HSVA',
  cmyk: 'CMYK',
};

export function legacyInputsToConfiguration(
  legacy: LegacyTriggerInputs,
): NgxColorsConfiguration {
  const config: NgxColorsConfiguration = {};
  if (legacy.colorsAnimation !== undefined) {
    config.animation = legacy.colorsAnimation === 'popup' ? 'popup' : 'slide';
  }
  if (legacy.formats !== undefined) {
    const models = legacy.formats
      .map((format) => LEGACY_FORMAT_TO_MODEL[format.toLowerCase()])
      .filter((model): model is ColorModel => !!model);
    if (models.length) {
      config.allowedModels = models;
    }
  }
  if (legacy.format !== undefined) {
    const model = LEGACY_FORMAT_TO_MODEL[legacy.format.toLowerCase()];
    if (model) {
      config.outputModel = model;
      config.allowedModels = [model];
    } else {
      console.warn(
        `ngx-colors: ignoring invalid [format] "${legacy.format}". Use [outputModel] with one of: HEXA, RGBA, HSLA, HSVA, CMYK.`,
      );
    }
  }
  if (
    legacy.hideTextInput !== undefined ||
    legacy.hideColorPicker !== undefined
  ) {
    config.display = {};
    if (legacy.hideTextInput !== undefined) {
      config.display.text = !legacy.hideTextInput;
    }
    if (legacy.hideColorPicker !== undefined) {
      config.display.sliders = !legacy.hideColorPicker;
    }
  }
  if (legacy.attachTo !== undefined) {
    config.overlayAttachTo = legacy.attachTo;
  }
  if (legacy.overlayClassName !== undefined) {
    config.overlayClass = legacy.overlayClassName;
  }
  if (legacy.acceptLabel !== undefined || legacy.cancelLabel !== undefined) {
    config.labels = {};
    if (legacy.acceptLabel !== undefined) {
      config.labels.accept = legacy.acceptLabel;
    }
    if (legacy.cancelLabel !== undefined) {
      config.labels.cancel = legacy.cancelLabel;
    }
  }
  if (legacy.colorPickerControls === 'no-alpha') {
    config.lockValues = { alpha: 1 };
  } else if (legacy.colorPickerControls === 'only-alpha') {
    console.warn(
      "ngx-colors: colorPickerControls=\"only-alpha\" is not supported in v4. Lock hue/saturation/brightness via [lockValues] so only the alpha slider remains, and use [layout] to place it next to the palette.",
    );
  }
  return config;
}

export function translateLegacyPalette(
  options: Array<ColorOption | NgxColorsColor>,
): ColorOption[] {
  return options.map((option) => {
    if (
      option &&
      typeof option === 'object' &&
      ('preview' in option || 'variants' in option)
    ) {
      const legacy = option as NgxColorsColor;
      return {
        color: legacy.preview,
        childs: legacy.variants,
        name: legacy.color,
      };
    }
    return option as ColorOption;
  });
}
