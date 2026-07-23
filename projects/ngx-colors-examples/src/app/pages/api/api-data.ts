export type ApiRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export const INPUTS: ApiRow[] = [
  {
    name: 'color',
    type: 'string',
    default: 'undefined',
    description:
      'Two-way bindable color value ([(color)]), for use without Forms.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Disables the trigger. Also settable via FormControl.disable().',
  },
  {
    name: 'palette',
    type: 'ColorOption[] | Observable<ColorOption[]>',
    default: 'Material palette',
    description:
      'Colors shown in the palette. Groups nest via childs, names show as tooltips, Observables show a loading skeleton. Also configurable globally.',
  },
  {
    name: 'animation',
    type: "'popup' | 'slide'",
    default: "'popup'",
    description: 'Entry animation of the palette swatches.',
  },
  {
    name: 'outputModel',
    type: "'HEXA' | 'RGBA' | 'HSLA' | 'HSVA' | 'CMYK' | 'AUTO'",
    default: "'AUTO'",
    description:
      'Format of the emitted value. AUTO keeps the format of the last input.',
  },
  {
    name: 'allowedModels',
    type: 'ColorModel[]',
    default: 'all five',
    description: 'Formats the text input can cycle through.',
  },
  {
    name: 'display',
    type: '{ text?, sliders?, palette? }',
    default: 'all true',
    description: 'Shows or hides each section of the panel.',
  },
  {
    name: 'layout',
    type: "'pages' | 'full-vertical' | 'full-horizontal'",
    default: "'pages'",
    description:
      'Paged layout (palette ⇄ sliders) or everything visible at once.',
  },
  {
    name: 'lockValues',
    type: '{ hue?, saturation?, brightness?, alpha? }',
    default: 'none locked',
    description:
      'Locks a channel to a fixed value and hides its slider. Hue is 0-360, the rest 0-1.',
  },
  {
    name: 'confirmationRequired',
    type: '{ palette?, text?, sliders? }',
    default: '{ sliders: true }',
    description:
      'Which input types need an explicit ACCEPT before the value commits.',
  },
  {
    name: 'eyedropper',
    type: 'boolean',
    default: 'false',
    description:
      'Shows an eyedropper button in browsers that support the EyeDropper API.',
  },
  {
    name: 'labels',
    type: '{ accept?, cancel? }',
    default: "'ACCEPT' / 'CANCEL'",
    description:
      'Confirmation button labels. Also settable globally via NGX_COLORS_LABELS.',
  },
  {
    name: 'overlayClass',
    type: 'string',
    default: 'undefined',
    description: 'Extra CSS class added to the overlay element.',
  },
  {
    name: 'overlayAttachTo',
    type: 'string | HTMLElement',
    default: 'document.body',
    description: 'Element (or element id) the overlay is appended to.',
  },
  {
    name: 'position',
    type: "'top' | 'bottom'",
    default: 'auto',
    description:
      'Forces the panel above or below the trigger instead of auto-flipping.',
  },
];

export const OUTPUTS: ApiRow[] = [
  {
    name: 'colorChange',
    type: 'string | null',
    description:
      'Emits whenever the value changes. Enables [(color)] two-way binding.',
  },
  {
    name: 'userChange',
    type: 'string | null',
    description:
      'Emits only for user-driven changes: palette click, text edit, confirmed slider change.',
  },
  {
    name: 'sliderChange',
    type: 'Rgba | null',
    description: 'Emits continuously while the user drags a slider.',
  },
  {
    name: 'colorHover',
    type: 'Rgba | null',
    description: 'Emits when the user hovers a palette swatch.',
  },
  {
    name: 'open',
    type: 'string | null',
    description: 'Emits when the panel opens, with the current color.',
  },
  {
    name: 'close',
    type: 'string | null',
    description: 'Emits when the panel closes, with the current color.',
  },
];

export const EXPORTS: ApiRow[] = [
  {
    name: 'NgxColorsComponent',
    type: 'component',
    description:
      'The premade <ngx-colors> swatch button. Standalone; pair it with the trigger directive.',
  },
  {
    name: 'NgxColorsTriggerDirective',
    type: 'directive',
    description:
      'ngxColorsTrigger — turns any element into a picker trigger. Implements ControlValueAccessor.',
  },
  {
    name: 'NgxColorsModule',
    type: 'NgModule',
    description:
      'Convenience module for NgModule-based apps; imports and exports the component and directive.',
  },
  {
    name: 'NGX_COLORS_CONFIG',
    type: 'InjectionToken<NgxColorsConfiguration>',
    description:
      'Global configuration: every input above (except color/disabled) can be provided once app-wide. Individual bindings win.',
  },
  {
    name: 'NGX_COLORS_LABELS',
    type: 'InjectionToken<Labels>',
    description: 'Global accept/cancel labels, e.g. for i18n.',
  },
  {
    name: 'colorValidator()',
    type: 'ValidatorFn',
    description:
      'Form validator. Returns { invalidColor: true } for unknown formats or out-of-range channels; empty values pass.',
  },
  {
    name: 'ColorHelper',
    type: 'class (static)',
    description:
      'Conversion utilities: stringToRgba, rgbaToColorModel, stringToColorModelString, getColorModelByString and friends.',
  },
  {
    name: 'Rgba / Hsla / Hsva / Cmyk',
    type: 'classes',
    description:
      'Color model classes used by ColorHelper and the Rgba-emitting outputs. All implement toString() and toRounded().',
  },
  {
    name: 'ColorOption',
    type: 'type',
    description:
      "Palette item: a color string, or { color, childs?, name? } — childs nest arbitrarily deep.",
  },
  {
    name: 'ColorModel',
    type: 'type',
    description: "'RGBA' | 'HSVA' | 'HSLA' | 'CMYK' | 'HEXA'.",
  },
  {
    name: 'DisplayOptions / LayoutOptions / LockValuesOptions / ConfirmationRequiredOptions / AnimationOptions / PositionOptions',
    type: 'types',
    description: 'The option types behind the inputs above.',
  },
];

export const DEPRECATED: ApiRow[] = [
  {
    name: 'ngx-colors-trigger',
    type: 'ngxColorsTrigger',
    description: 'v3 attribute selector; both selectors work in v4.',
  },
  {
    name: 'colorsAnimation',
    type: 'animation',
    description: "'slide-in' maps to 'slide'.",
  },
  {
    name: 'format',
    type: 'outputModel',
    description:
      "Values are uppercase now ('hex' → 'HEXA'). Also locks allowedModels to that model, like v3 did.",
  },
  {
    name: 'formats',
    type: 'allowedModels',
    description: "['hex','cmyk'] → ['HEXA','CMYK'].",
  },
  {
    name: 'hideTextInput / hideColorPicker',
    type: 'display',
    description: '{ text: false } / { sliders: false }.',
  },
  {
    name: 'attachTo / overlayClassName',
    type: 'overlayAttachTo / overlayClass',
    description: 'Renamed; overlayAttachTo also accepts an HTMLElement.',
  },
  {
    name: 'acceptLabel / cancelLabel',
    type: 'labels',
    description: '{ accept, cancel } object or the NGX_COLORS_LABELS token.',
  },
  {
    name: 'colorPickerControls',
    type: 'lockValues',
    description:
      "'no-alpha' → { alpha: 1 }. 'only-alpha' is not supported — lock the other channels instead.",
  },
  {
    name: '(change) / (input) / (slider)',
    type: '(colorChange) / (userChange) / (sliderChange)',
    description:
      'Aliases still emit; note (slider) emits a formatted string while (sliderChange) emits an Rgba.',
  },
  {
    name: 'NgxColorsColor',
    type: 'ColorOption',
    description:
      '{ preview, variants } palette items are auto-translated to { color, childs, name }.',
  },
  {
    name: 'validColorValidator',
    type: 'colorValidator',
    description: 'Alias of the same function.',
  },
];
