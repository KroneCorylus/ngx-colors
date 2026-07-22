import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, Subject, delay, of, takeUntil } from 'rxjs';
import {
  NGX_COLORS_CONFIG,
  NgxColorsComponent,
  NgxColorsConfiguration,
  NgxColorsTriggerDirective,
} from '../../../../../ngx-colors/src/public-api';
import { defaultColors } from '../../../../../ngx-colors/src/lib/utility/default-colors';
import { ColorOption } from '../../../../../ngx-colors/src/public-api';
import {
  AnimationOptions,
  ConfirmationRequiredOptions,
  DisplayOptions,
  LayoutOptions,
  LockValuesOptions,
} from '../../../../../ngx-colors/src/lib/types/configuration';
import { ColorModel } from '../../../../../ngx-colors/src/lib/types/color-model';

type PlaygroundFormValue = {
  layout: LayoutOptions;
  displayText: boolean;
  displaySliders: boolean;
  displayPalette: boolean;
  outputModel: ColorModel | 'AUTO';
  allowedModels: ColorModel[];
  eyedropper: boolean;
  animation: AnimationOptions;
  overlayClass: string;
  overlayAttachTo: 'default' | 'playground' | 'log';
  disabled: boolean;
  paletteSource: string;
  lockAlphaEnabled: boolean;
  lockAlpha: number;
  lockHueEnabled: boolean;
  lockHue: number;
  lockSaturationEnabled: boolean;
  lockSaturation: number;
  lockBrightnessEnabled: boolean;
  lockBrightness: number;
  confirmationPalette: boolean;
  confirmationText: boolean;
  confirmationSliders: boolean;
  acceptLabel: string;
  cancelLabel: string;
};

type PlaygroundPreset = {
  title: string;
  description: string;
  formValue: Partial<PlaygroundFormValue>;
  color?: string | null;
  secondaryColor?: string | null;
};

type EventLogEntry = {
  source: string;
  event: string;
  value: string;
  timestamp: Date;
};

type PaletteChoice = {
  id: string;
  label: string;
  description: string;
  palette?: ColorOption[];
  palette$?: Observable<ColorOption[]>;
};

type SnippetView = 'config' | 'html';

type PaletteBinding = {
  binding: string;
  definition?: string;
};

type ConfigPreview = {
  snapshot: Record<string, unknown>;
  paletteSummary?: string;
  paletteBinding?: PaletteBinding;
};

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  providers: [
    {
      provide: NGX_COLORS_CONFIG,
      useValue: {
        eyedropper: true,
        display: {
          text: true,
          sliders: true,
          palette: true,
        },
        layout: 'full-vertical',
        lockValues: {},
        overlayClass: '_default-overlay',
        labels: { accept: 'OK', cancel: 'Cancel' },
      },
    },
  ],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
  animations: [
    trigger('logIn', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(4px)' }),
            stagger(40, [
              animate(
                '180ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class PlaygroundPageComponent implements OnDestroy {
  constructor(
    private readonly fb: FormBuilder,
    private readonly cd: ChangeDetectorRef,
  ) {
    const initialValue = this.playgroundForm.getRawValue();
    this.defaultFormValue = {
      ...initialValue,
      allowedModels: [...initialValue.allowedModels],
    };
    const initialChoice = this.assignPalette(initialValue.paletteSource);
    this.playgroundConfig = this.buildConfig(initialValue, initialChoice);
    this.playgroundDisabled = initialValue.disabled;
    this.updatePreviews(initialValue, this.playgroundConfig, initialChoice);

    this.playgroundForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((raw) => {
        if (!raw) return;
        const value = this.normalizeFormValue(raw);
        const paletteChoice = this.assignPalette(value.paletteSource);
        this.playgroundConfig = this.buildConfig(value, paletteChoice);
        this.playgroundDisabled = value.disabled;
        this.updatePreviews(value, this.playgroundConfig, paletteChoice);
        this.cd.markForCheck();
      });
  }

  readonly colorModels: ColorModel[] = ['RGBA', 'HSVA', 'HSLA', 'HEXA', 'CMYK'];
  readonly layoutOptions: LayoutOptions[] = [
    'pages',
    'full-vertical',
    'full-horizontal',
  ];
  readonly animationOptions: AnimationOptions[] = ['popup', 'slide'];
  readonly overlayTargets = [
    { id: 'default', label: 'Auto (next to trigger)' },
    { id: 'playground', label: 'Playground container' },
    { id: 'log', label: 'Event log panel' },
  ] as const;

  readonly warmPalette: ColorOption[] = [
    { color: '#FF5E5B', name: 'Sunset Red' },
    { color: '#FF9B85', name: 'Coral' },
    { color: '#FFC4A3', name: 'Apricot' },
    { color: '#FFED8A', name: 'Golden Hour' },
    { color: '#E86868', name: 'Cranberry' },
  ];

  readonly coolPalette: ColorOption[] = [
    { color: '#004E89', name: 'Deep Sea' },
    { color: '#0F84B7', name: 'Azure' },
    { color: '#68C5DB', name: 'Lagoon' },
    { color: '#9BE7FF', name: 'Ice Blue' },
    { color: '#4CABB1', name: 'Seafoam' },
  ];

  readonly pastelPalette: ColorOption[] = [
    { color: '#FFD6E8', name: 'Pink Mist' },
    { color: '#E3F2FD', name: 'Sky Whisper' },
    { color: '#D1F2EB', name: 'Mint Foam' },
    { color: '#FFF4E6', name: 'Peach Veil' },
    { color: '#ECE8FF', name: 'Lavender Field' },
  ];

  readonly asyncPaletteSwatches: ColorOption[] = [
    { color: '#6A7FDB', name: 'Periwinkle' },
    { color: '#9D8DF1', name: 'Iris Bloom' },
    { color: '#C4F1BE', name: 'Spring Green' },
    { color: '#F6E58D', name: 'Lemonade' },
    { color: '#FF7979', name: 'Punch' },
  ];

  readonly asyncPalette$: Observable<ColorOption[]> = of(
    this.asyncPaletteSwatches,
  ).pipe(delay(400));

  readonly paletteChoices: PaletteChoice[] = [
    {
      id: 'default',
      label: 'Library default',
      description: 'Built-in palette that ships with ngx-colors.',
      palette: defaultColors,
    },
    {
      id: 'warm',
      label: 'Warm sunset',
      description: 'Reds and oranges for testing high-energy palettes.',
      palette: this.warmPalette,
    },
    {
      id: 'cool',
      label: 'Cool ocean',
      description: 'Teals and blues inspired by ocean gradients.',
      palette: this.coolPalette,
    },
    {
      id: 'pastel',
      label: 'Soft pastels',
      description: 'Gentle contrast palette great for UI testing.',
      palette: this.pastelPalette,
    },
    {
      id: 'async',
      label: 'Async (simulated API)',
      description:
        'Demonstrates passing an observable palette with delayed data.',
      palette$: this.asyncPalette$,
    },
  ];

  readonly presets: PlaygroundPreset[] = [
    {
      title: 'Palette-only quick picker',
      description:
        'Compact picker that only shows the swatch palette and auto-applies on click.',
      formValue: {
        layout: 'pages',
        displayText: false,
        displaySliders: false,
        displayPalette: true,
        confirmationPalette: false,
        confirmationSliders: false,
        confirmationText: false,
        animation: 'popup',
      },
      color: '#FF5E5B',
    },
    {
      title: 'Full vertical workspace',
      description:
        'Locked hue with alpha slider, great for monochromatic themes.',
      formValue: {
        layout: 'full-vertical',
        displayText: true,
        displaySliders: true,
        displayPalette: true,
        lockHueEnabled: true,
        lockHue: 0.58,
        lockAlphaEnabled: true,
        lockAlpha: 1,
        paletteSource: 'cool',
      },
      color: 'rgba(0, 78, 137, 1)',
    },
    {
      title: 'Confirmation workflow',
      description:
        'Requires confirm on every input type and keeps overlay attached to the log panel.',
      formValue: {
        confirmationPalette: true,
        confirmationSliders: true,
        confirmationText: true,
        overlayAttachTo: 'log',
        animation: 'slide',
        layout: 'pages',
        displayText: true,
        displaySliders: true,
        displayPalette: true,
      },
      color: '#0F84B7',
    },
    {
      title: 'Guided form entry',
      description:
        'Disables palette, limits color models, and customises action labels.',
      formValue: {
        displayPalette: false,
        allowedModels: ['RGBA', 'HEXA'],
        outputModel: 'HEXA',
        acceptLabel: 'Apply',
        cancelLabel: 'Dismiss',
        layout: 'full-horizontal',
      } as Partial<PlaygroundFormValue>,
      color: '#6A7FDB',
      secondaryColor: 'rgba(32, 178, 170, 1)',
    },
  ];

  readonly playgroundControl = new FormControl<string | null>(
    'rgba(0, 153, 255, 0.8)',
  );
  twoWayBindingColor: string | null = '#FF5E5B';

  playgroundConfig: NgxColorsConfiguration = {};
  playgroundPalette: Observable<ColorOption[]> | ColorOption[] | undefined;
  selectedPaletteDescription = this.paletteChoices[0]?.description ?? '';
  playgroundDisabled = false;

  events: EventLogEntry[] = [];
  configJson = '';
  htmlSnippet = '';
  paletteSummary = '';
  activeSnippet: SnippetView = 'config';
  private readonly defaultFormValue: PlaygroundFormValue;

  readonly reactiveDemoControl = new FormControl<string | null>('#0F84B7');
  readonly confirmationDemoControl = new FormControl<string | null>('#68C5DB');
  disabledDemoValue: string | null = '#E86868';

  readonly playgroundForm = this.fb.group({
    layout: this.fb.control<LayoutOptions>('pages', { nonNullable: true }),
    displayText: this.fb.control(true, { nonNullable: true }),
    displaySliders: this.fb.control(true, { nonNullable: true }),
    displayPalette: this.fb.control(true, { nonNullable: true }),
    outputModel: this.fb.control<ColorModel | 'AUTO'>('AUTO', {
      nonNullable: true,
    }),
    allowedModels: this.fb.control<ColorModel[]>([...this.colorModels], {
      nonNullable: true,
    }),
    eyedropper: this.fb.control(true, { nonNullable: true }),
    animation: this.fb.control<AnimationOptions>('popup', {
      nonNullable: true,
    }),
    overlayClass: this.fb.control<string>('', { nonNullable: true }),
    overlayAttachTo: this.fb.control<'default' | 'playground' | 'log'>(
      'default',
      {
        nonNullable: true,
      },
    ),
    disabled: this.fb.control(false, { nonNullable: true }),
    paletteSource: this.fb.control<string>('default', { nonNullable: true }),
    lockAlphaEnabled: this.fb.control(false, { nonNullable: true }),
    lockAlpha: this.fb.control(1, { nonNullable: true }),
    lockHueEnabled: this.fb.control(false, { nonNullable: true }),
    lockHue: this.fb.control(0.5, { nonNullable: true }),
    lockSaturationEnabled: this.fb.control(false, { nonNullable: true }),
    lockSaturation: this.fb.control(1, { nonNullable: true }),
    lockBrightnessEnabled: this.fb.control(false, { nonNullable: true }),
    lockBrightness: this.fb.control(1, { nonNullable: true }),
    confirmationPalette: this.fb.control(false, { nonNullable: true }),
    confirmationText: this.fb.control(false, { nonNullable: true }),
    confirmationSliders: this.fb.control(false, { nonNullable: true }),
    acceptLabel: this.fb.control('OK', { nonNullable: true }),
    cancelLabel: this.fb.control('Cancel', { nonNullable: true }),
  });

  private readonly destroy$ = new Subject<void>();

  get allowedModelsControl() {
    return this.playgroundForm.controls.allowedModels;
  }

  private getPaletteChoice(id: string): PaletteChoice {
    return (
      this.paletteChoices.find((option) => option.id === id) ??
      this.paletteChoices[0]
    );
  }

  private assignPalette(id: string): PaletteChoice {
    const choice = this.getPaletteChoice(id);
    this.selectedPaletteDescription = choice.description;
    this.playgroundPalette = choice.palette$ ?? choice.palette ?? defaultColors;
    return choice;
  }

  normalizeFormValue(
    value: Partial<PlaygroundFormValue>,
    base: PlaygroundFormValue | undefined = undefined,
  ): PlaygroundFormValue {
    const source = base ?? this.playgroundForm.getRawValue();
    const allowedModels =
      value.allowedModels === undefined
        ? source.allowedModels
        : (value.allowedModels ?? source.allowedModels);

    return {
      ...source,
      ...value,
      allowedModels,
    };
  }

  presetConfig(preset: PlaygroundPreset): NgxColorsConfiguration {
    const merged = this.normalizeFormValue(
      preset.formValue,
      this.defaultFormValue,
    );
    const paletteChoice = this.getPaletteChoice(merged.paletteSource);
    return this.buildConfig(merged, paletteChoice);
  }

  buildConfig(
    formValue: PlaygroundFormValue,
    paletteChoice?: PaletteChoice,
  ): NgxColorsConfiguration {
    const resolvedChoice =
      paletteChoice ?? this.getPaletteChoice(formValue.paletteSource);
    const display: DisplayOptions = {
      text: formValue.displayText,
      sliders: formValue.displaySliders,
      palette: formValue.displayPalette,
    };

    const lockValues: LockValuesOptions = {};
    if (formValue.lockHueEnabled) lockValues.hue = Number(formValue.lockHue);
    if (formValue.lockSaturationEnabled)
      lockValues.saturation = Number(formValue.lockSaturation);
    if (formValue.lockBrightnessEnabled)
      lockValues.brightness = Number(formValue.lockBrightness);
    if (formValue.lockAlphaEnabled)
      lockValues.alpha = Number(formValue.lockAlpha);

    const confirmationActive =
      formValue.confirmationPalette ||
      formValue.confirmationText ||
      formValue.confirmationSliders;

    const confirmation: ConfirmationRequiredOptions | undefined =
      confirmationActive
        ? {
            palette: formValue.confirmationPalette,
            text: formValue.confirmationText,
            sliders: formValue.confirmationSliders,
          }
        : undefined;

    const allowedModels =
      formValue.allowedModels.length === this.colorModels.length
        ? undefined
        : [...formValue.allowedModels];

    const overlayClass = formValue.overlayClass?.trim() || undefined;

    let overlayAttachTo: string | HTMLElement | undefined;
    if (formValue.overlayAttachTo === 'playground') {
      overlayAttachTo = 'playground-host';
    } else if (formValue.overlayAttachTo === 'log') {
      overlayAttachTo = 'event-log';
    }

    return {
      layout: formValue.layout,
      display,
      outputModel: formValue.outputModel,
      allowedModels,
      eyedropper: formValue.eyedropper,
      animation: formValue.animation,
      overlayClass,
      overlayAttachTo,
      palette:
        resolvedChoice.palette$ ?? resolvedChoice.palette ?? defaultColors,
      lockValues: Object.keys(lockValues).length ? lockValues : undefined,
      labels: {
        accept: formValue.acceptLabel,
        cancel: formValue.cancelLabel,
      },
      confirmationRequired: confirmation,
    };
  }

  private updatePreviews(
    formValue: PlaygroundFormValue,
    config: NgxColorsConfiguration,
    paletteChoice: PaletteChoice,
  ) {
    const preview = this.createConfigPreview(config, paletteChoice);
    this.configJson = JSON.stringify(preview.snapshot, null, 2);
    this.htmlSnippet = this.buildHtmlSnippet(formValue, preview);
    this.paletteSummary = preview.paletteSummary ?? '';
  }

  logEvent(source: string, event: string, value: unknown) {
    const stringValue =
      typeof value === 'string'
        ? value
        : value === null || value === undefined
          ? 'undefined'
          : JSON.stringify(value);
    this.events.unshift({
      source,
      event,
      value: stringValue,
      timestamp: new Date(),
    });
    if (this.events.length > 150) {
      this.events.length = 150;
    }
    this.cd.detectChanges();
  }

  clearLog() {
    this.events = [];
  }

  setActiveSnippet(view: SnippetView) {
    this.activeSnippet = view;
  }

  applyPreset(preset: PlaygroundPreset) {
    this.playgroundForm.patchValue(preset.formValue);
    if (preset.color !== undefined) {
      this.playgroundControl.setValue(preset.color);
    }
    if (preset.secondaryColor !== undefined) {
      this.twoWayBindingColor = preset.secondaryColor;
    }
  }

  setQuickColor(value: string | null) {
    this.playgroundControl.setValue(value);
    this.twoWayBindingColor = value;
  }

  toggleAllowedModel(model: ColorModel, checked: boolean) {
    const current = this.allowedModelsControl.value ?? [];
    if (checked) {
      if (!current.includes(model)) {
        this.allowedModelsControl.setValue([...current, model]);
      }
      return;
    }
    if (current.length === 1) {
      this.logEvent(
        'Playground',
        'allowedModels',
        'At least one color model is required.',
      );
      return;
    }
    this.allowedModelsControl.setValue(
      current.filter((item) => item !== model),
    );
  }

  onAllowedModelChange(model: ColorModel, event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.toggleAllowedModel(model, !!input?.checked);
  }

  formatTimestamp(entry: EventLogEntry): string {
    return entry.timestamp.toLocaleTimeString();
  }

  trackByEvent(_: number, entry: EventLogEntry) {
    return `${entry.timestamp.getTime()}-${entry.source}-${entry.event}-${entry.value}`;
  }

  trackByTitle(_: number, item: PlaygroundPreset) {
    return item.title;
  }

  private createConfigPreview(
    config: NgxColorsConfiguration,
    paletteChoice: PaletteChoice,
  ): ConfigPreview {
    const snapshot: Record<string, unknown> = {};

    if (config.layout) snapshot['layout'] = config.layout;

    const display = this.cleanObject(
      config.display as Record<string, unknown> | undefined,
    );
    if (display) snapshot['display'] = display;

    if (config.animation) snapshot['animation'] = config.animation;
    if (config.outputModel) snapshot['outputModel'] = config.outputModel;

    if (config.allowedModels)
      snapshot['allowedModels'] = [...config.allowedModels];

    if (config.eyedropper !== undefined)
      snapshot['eyedropper'] = config.eyedropper;

    if (config.overlayClass) snapshot['overlayClass'] = config.overlayClass;
    if (config.overlayAttachTo)
      snapshot['overlayAttachTo'] = config.overlayAttachTo;

    const lockValues = this.cleanObject(
      config.lockValues as Record<string, unknown> | undefined,
    );
    if (lockValues) snapshot['lockValues'] = lockValues;

    const labels = this.cleanObject(
      config.labels as Record<string, unknown> | undefined,
    );
    if (labels) snapshot['labels'] = labels;

    const confirmation = this.cleanObject(
      config.confirmationRequired as Record<string, unknown> | undefined,
    );
    if (confirmation) snapshot['confirmationRequired'] = confirmation;

    const paletteInfo = this.buildPaletteInfo(paletteChoice);
    if (paletteInfo?.jsonValue) {
      snapshot['palette'] = paletteInfo.jsonValue;
    }

    return {
      snapshot,
      paletteSummary: paletteInfo?.summary,
      paletteBinding: this.buildPaletteBinding(paletteChoice),
    };
  }

  private cleanObject(
    value: Record<string, unknown> | undefined,
  ): Record<string, unknown> | undefined {
    if (!value) return undefined;
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined || val === null) continue;
      if (Array.isArray(val)) {
        cleaned[key] = val.map((entry) => {
          if (typeof entry === 'object' && entry !== null) {
            const nested = this.cleanObject(entry as Record<string, unknown>);
            return nested ?? {};
          }
          return entry;
        });
        continue;
      }
      if (typeof val === 'object') {
        const nested = this.cleanObject(val as Record<string, unknown>);
        if (nested && Object.keys(nested).length) {
          cleaned[key] = nested;
        }
        continue;
      }
      cleaned[key] = val;
    }
    return Object.keys(cleaned).length ? cleaned : undefined;
  }

  private buildPaletteInfo(
    choice: PaletteChoice,
  ): { jsonValue: unknown; summary: string } | undefined {
    if (choice.palette$) {
      return {
        jsonValue: {
          source: choice.label,
          type: 'Observable<ColorOption[]>',
        },
        summary: `Palette source: ${choice.label} (Observable<ColorOption[]> · async)`,
      };
    }
    if (choice.palette && choice.palette.length) {
      const colors = choice.palette
        .map((option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (this.isColorOptionObject(option) && option.color) {
            return option.color;
          }
          return undefined;
        })
        .filter((color): color is string => !!color);
      const previewLimit = 8;
      const previewColors = [...colors.slice(0, previewLimit)];
      if (colors.length > previewLimit) {
        previewColors.push(`… +${colors.length - previewLimit} more`);
      }
      return {
        jsonValue: {
          source: choice.label,
          type: 'ColorOption[]',
          colors: previewColors,
        },
        summary: `Palette source: ${choice.label} (${colors.length} swatches)`,
      };
    }
    return undefined;
  }

  private buildPaletteBinding(
    choice: PaletteChoice,
  ): PaletteBinding | undefined {
    switch (choice.id) {
      case 'default':
        return { binding: 'defaultColors' };
      case 'warm':
        return {
          binding: 'warmPalette',
          definition: `const warmPalette: ColorOption[] = ${this.stringifyColorOptions(this.warmPalette)};`,
        };
      case 'cool':
        return {
          binding: 'coolPalette',
          definition: `const coolPalette: ColorOption[] = ${this.stringifyColorOptions(this.coolPalette)};`,
        };
      case 'pastel':
        return {
          binding: 'pastelPalette',
          definition: `const pastelPalette: ColorOption[] = ${this.stringifyColorOptions(this.pastelPalette)};`,
        };
      case 'async':
        return {
          binding: 'asyncPalette$',
          definition: `const asyncPalette$ = of(${this.stringifyColorOptions(this.asyncPaletteSwatches)}).pipe(delay(400));`,
        };
      default:
        return undefined;
    }
  }

  private stringifyColorOptions(options: ColorOption[]): string {
    const lines = options
      .map((option) => {
        if (option === undefined) {
          return undefined;
        }
        if (typeof option === 'string') {
          return `  ${this.literalToString(option)}`;
        }
        if (this.isColorOptionObject(option)) {
          const safeName = this.escapeSingleQuotes(option.name ?? 'Swatch');
          return `  { color: '${option.color ?? ''}', name: '${safeName}' }`;
        }
        return undefined;
      })
      .filter((line): line is string => !!line);
    return `[\n${lines.join(',\n')}\n]`;
  }

  private isColorOptionObject(
    option: ColorOption | undefined,
  ): option is {
    color: string | undefined;
    childs?: ColorOption[];
    name?: string;
  } {
    return typeof option === 'object' && option !== null && 'color' in option;
  }

  private buildHtmlSnippet(
    formValue: PlaygroundFormValue,
    preview: ConfigPreview,
  ): string {
    const lines: string[] = [];
    if (preview.paletteSummary) {
      lines.push(`<!-- ${preview.paletteSummary} -->`);
    }
    lines.push('<ngx-colors');
    lines.push('  ngxColorsTrigger');
    lines.push('  [formControl]="colorControl"');
    if (formValue.disabled) {
      lines.push('  [disabled]="true"');
    }

    const bindingOrder: Array<keyof NgxColorsConfiguration> = [
      'layout',
      'display',
      'animation',
      'outputModel',
      'allowedModels',
      'eyedropper',
      'overlayClass',
      'overlayAttachTo',
      'lockValues',
      'labels',
      'confirmationRequired',
    ];

    for (const key of bindingOrder) {
      const value = preview.snapshot[key as string];
      if (value === undefined) continue;
      const attribute = this.bindingAttributeName(key);
      const literal = this.literalToString(value);
      lines.push(`  ${attribute}="${literal}"`);
    }

    if (preview.paletteBinding) {
      lines.push(`  [palette]="${preview.paletteBinding.binding}"`);
    }

    lines.push('></ngx-colors>');

    if (preview.paletteBinding?.definition) {
      lines.push('');
      lines.push('// Define palette data:');
      lines.push(preview.paletteBinding.definition);
      if (preview.paletteBinding.binding === 'asyncPalette$') {
        lines.push("// import { of, delay } from 'rxjs';");
      }
    }

    return lines.join('\n');
  }

  private bindingAttributeName(key: keyof NgxColorsConfiguration): string {
    const map: Record<string, string> = {
      layout: '[layout]',
      display: '[display]',
      animation: '[animation]',
      outputModel: '[outputModel]',
      allowedModels: '[allowedModels]',
      eyedropper: '[eyedropper]',
      overlayClass: '[overlayClass]',
      overlayAttachTo: '[overlayAttachTo]',
      lockValues: '[lockValues]',
      labels: '[labels]',
      confirmationRequired: '[confirmationRequired]',
      palette: '[palette]',
    };
    return map[key as string] ?? `[${key as string}]`;
  }

  private literalToString(value: unknown): string {
    if (Array.isArray(value)) {
      return `[${value.map((entry) => this.literalToString(entry)).join(', ')}]`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      return `{ ${entries
        .map(([key, entry]) => `${key}: ${this.literalToString(entry)}`)
        .join(', ')} }`;
    }
    if (typeof value === 'string') {
      return `'${this.escapeSingleQuotes(value)}'`;
    }
    return String(value);
  }

  private escapeSingleQuotes(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
