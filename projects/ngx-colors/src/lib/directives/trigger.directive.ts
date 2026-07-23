import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, map, of, shareReplay, takeUntil } from 'rxjs';
import { OverlayService } from '../services/overlay.service';
import { ColorHelper } from '../utility/color-helper';
import { StateService } from '../services/state.service';
import { ColorOption } from '../types/color-option';
import { Rgba } from '../models/rgba';
import {
  NGX_COLORS_CONFIG,
  NgxColorsConfiguration,
} from '../interfaces/configuration';
import { Configuration } from '../models/configuration';
import {
  AnimationOptions,
  ConfirmationRequiredOptions,
  DisplayOptions,
  LayoutOptions,
  LockValuesOptions,
  PositionOptions,
  ThemeOptions,
} from '../types/configuration';
import { ColorModel } from '../types/color-model';
import { IColorModel } from '../interfaces/color-format';
import { Labels, NGX_COLORS_LABELS } from '../interfaces/labels';
import { isInputOrigin } from '../types/changes';
import {
  NgxColorsColor,
  legacyInputsToConfiguration,
  translateLegacyPalette,
} from '../compat/v3-compat';

@Directive({
  selector: '[ngxColorsTrigger],[ngx-colors-trigger]',
  exportAs: 'ngxColorsTrigger',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true,
    },
    OverlayService,
    StateService,
  ],
})
export class NgxColorsTriggerDirective
  implements ControlValueAccessor, OnDestroy, OnInit, OnChanges
{
  constructor(
    public triggerRef: ElementRef<HTMLElement>,
    private overlayService: OverlayService,
    private stateService: StateService,
    @Optional()
    @Inject(NGX_COLORS_CONFIG)
    private config: NgxColorsConfiguration,
    @Optional()
    @Inject(NGX_COLORS_LABELS)
    private _labels: Labels,
  ) {}
  @HostListener('click') onClick() {
    this.openPanel();
  }
  @Input() disabled: boolean = false;
  @HostBinding('style.opacity') get disabledOpacity(): number {
    return this.disabled ? 0.5 : 1;
  }
  @HostBinding('style.pointer-events') get disabledPointerEvents(): string {
    return this.disabled ? 'none' : 'auto';
  }
  @HostBinding('attr.aria-disabled') get disabledAriaAttribute(): boolean {
    return this.disabled;
  }
  destroy$: Subject<void> = new Subject<void>();
  value: string | undefined | null = undefined;

  @Input() color: string | undefined | null = undefined;
  @Output()
  public colorChange: EventEmitter<string | undefined | null> =
    new EventEmitter<string | undefined | null>();
  // Fires only when the user actually drove the change (sliders/palette/text
  // interaction, or confirming a pending value) - not for programmatic writes
  // via [color], [(ngModel)], or [formControl].
  @Output()
  public userChange: EventEmitter<string | undefined | null> =
    new EventEmitter<string | undefined | null>();

  @Output()
  public sliderChange: EventEmitter<Rgba | null> =
    this.stateService.sliderChange$;
  @Output()
  public colorHover: EventEmitter<Rgba | null> =
    this.stateService.paleteColorHover$;
  //Keep naming and payload (the current color) for parity with old version
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public open: EventEmitter<string | undefined | null> = new EventEmitter<
    string | undefined | null
  >();
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public close: EventEmitter<string | undefined | null> = new EventEmitter<
    string | undefined | null
  >();

  // CONFIGURATION
  @Input()
  public display: DisplayOptions | undefined;
  @Input()
  public layout: LayoutOptions | undefined;
  @Input()
  public lockValues: LockValuesOptions | undefined;
  @Input()
  public outputModel: ColorModel | 'AUTO' | undefined;
  @Input()
  public allowedModels: Array<ColorModel> | undefined;
  @Input()
  public eyedropper: boolean | undefined;
  @Input()
  public palette:
    | Observable<ColorOption[]>
    | ColorOption[]
    | Array<NgxColorsColor>
    | undefined;
  @Input()
  public animation: AnimationOptions | undefined;
  @Input()
  public overlayClass: string | undefined;
  @Input()
  public overlayAttachTo: string | HTMLElement | undefined;
  @Input()
  public labels: Labels | undefined;
  @Input()
  public confirmationRequired: ConfirmationRequiredOptions | undefined;
  @Input()
  public position: PositionOptions | undefined;
  @Input()
  public closeOnHidden: boolean | undefined;
  @Input()
  public theme: ThemeOptions | undefined;
  private triggerObserver: IntersectionObserver | undefined;

  // ---- v3 compatibility (deprecated) - remove this block in the next major version ----
  /** @deprecated Use `animation` ('slide' | 'popup') instead. */
  @Input() colorsAnimation: 'slide-in' | 'popup' | undefined;
  /** @deprecated Use `outputModel` ('HEXA' | 'RGBA' | 'HSLA' | 'HSVA' | 'CMYK' | 'AUTO') instead. */
  @Input() format: string | undefined;
  /** @deprecated Use `allowedModels` instead. */
  @Input() formats: string[] | undefined;
  /** @deprecated Use `display: { text: false }` instead. */
  @Input() hideTextInput: boolean | undefined;
  /** @deprecated Use `display: { sliders: false }` instead. */
  @Input() hideColorPicker: boolean | undefined;
  /** @deprecated Use `overlayAttachTo` instead. */
  @Input() attachTo: string | undefined;
  /** @deprecated Use `overlayClass` instead. */
  @Input() overlayClassName: string | undefined;
  /** @deprecated Use `labels: { accept: ... }` instead. */
  @Input() acceptLabel: string | undefined;
  /** @deprecated Use `labels: { cancel: ... }` instead. */
  @Input() cancelLabel: string | undefined;
  /** @deprecated 'no-alpha' maps to `lockValues: { alpha: 1 }`; 'only-alpha' is not supported (see MIGRATION.md). */
  @Input() colorPickerControls:
    | 'default'
    | 'only-alpha'
    | 'no-alpha'
    | undefined;
  /** @deprecated Use `colorChange` instead. */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public change: EventEmitter<string | undefined | null> = this.colorChange;
  /** @deprecated Use `userChange` instead. */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public input: EventEmitter<string | undefined | null> = this.userChange;
  /** @deprecated Use `sliderChange` instead (emits an `Rgba` object rather than a formatted string). */
  @Output()
  public slider: EventEmitter<string | null> = new EventEmitter<
    string | null
  >();

  private initLegacyOutputs(): void {
    this.stateService.sliderChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.slider.emit(value ? this.rgbaToOutputString(value) : null);
      });
  }
  // ---- end of v3 compatibility block ----

  public ngOnInit(): void {
    this.applyConfig();
    this.setPalette(this.stateService.configuration.palette);

    this.overlayService.opened
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.open.emit(this.value));
    this.overlayService.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.disconnectTriggerObserver();
        this.close.emit(this.value);
      });

    this.stateService.state.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      const newValue: string | null = state?.value
        ? this.rgbaToOutputString(state.value)
        : null;
      const changed = (newValue ?? null) !== (this.value ?? null);
      const userDriven =
        isInputOrigin(state.origin) || state.origin === 'confirm';
      this.value = newValue;
      if (changed || userDriven) {
        this.colorChange.emit(this.value);
      }
      if (userDriven) {
        this.onChange(this.value);
        this.userChange.emit(this.value);
      }
      if (state.origin === 'confirm' || state.origin === 'cancel') {
        this.overlayService.removePanel();
      }
      if (
        isInputOrigin(state.origin) &&
        !this.stateService.configuration.confirmationRequired?.[state.origin]
      ) {
        if (state.origin == 'palette') {
          this.overlayService.removePanel();
        }
      }
    });
    this.initLegacyOutputs();
  }

  private rgbaToOutputString(value: Rgba): string {
    const model: IColorModel | string =
      this.stateService.configuration.outputModel == 'AUTO'
        ? ColorHelper.rgbaToColorModel(value, this.stateService.colorModel)
        : ColorHelper.rgbaToColorModel(
            value,
            this.stateService.configuration.outputModel,
          );
    return model.toString();
  }

  private applyConfig() {
    this.stateService.configuration = new Configuration(
      { labels: this._labels },
      this.config,
      legacyInputsToConfiguration(this),
      {
        display: this.display,
        layout: this.layout,
        lockValues: this.lockValues,
        outputModel: this.outputModel,
        allowedModels: this.allowedModels,
        eyedropper: this.eyedropper,
        palette: Array.isArray(this.palette)
          ? translateLegacyPalette(this.palette)
          : this.palette,
        animation: this.animation,
        overlayClass: this.overlayClass,
        overlayAttachTo: this.overlayAttachTo,
        labels: this.labels,
        confirmationRequired: this.confirmationRequired,
        position: this.position,
        closeOnHidden: this.closeOnHidden,
        theme: this.theme,
      },
    );
  }

  public ngOnDestroy(): void {
    // If the host (or an ancestor) is destroyed while the panel is open -
    // e.g. behind an *ngIf or on route navigation - the overlay is not part
    // of this component's view tree, so Angular won't tear it down on its
    // own. Without this, the panel and its DOM node are leaked permanently.
    this.disconnectTriggerObserver();
    this.overlayService.removePanel();
    this.destroy$.next();
    this.destroy$.complete();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    this.applyConfig();
    if (changes['palette']) {
      this.setPalette(this.stateService.configuration.palette);
    }
    if (changes['color']) {
      this.applyExternalValue(changes['color'].currentValue);
    }
  }

  public get isOpen(): boolean {
    return this.overlayService.componentRef != undefined;
  }

  public openPanel() {
    if (this.disabled || this.isOpen) {
      return;
    }
    this.onTouch();
    const injector = Injector.create({
      providers: [
        { provide: StateService, useValue: this.stateService },
        { provide: OverlayService, useValue: this.overlayService },
      ],
    });
    this.overlayService.createOverlay(this, injector);
    this.observeTriggerVisibility();
  }

  public closePanel() {
    this.overlayService.removePanel();
  }

  private observeTriggerVisibility(): void {
    if (
      !this.stateService.configuration.closeOnHidden ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }
    this.triggerObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => !entry.isIntersecting)) {
        this.closePanel();
      }
    });
    this.triggerObserver.observe(this.triggerRef.nativeElement);
  }

  private disconnectTriggerObserver(): void {
    this.triggerObserver?.disconnect();
    this.triggerObserver = undefined;
  }

  private setPalette(
    palette:
      | Observable<ColorOption[]>
      | ColorOption[]
      | Array<NgxColorsColor>
      | undefined,
  ) {
    if (!palette) return;
    if (Array.isArray(palette)) {
      this.stateService.palette$ = of(translateLegacyPalette(palette));
    } else if (palette instanceof Observable) {
      this.stateService.palette$ = palette.pipe(
        map(translateLegacyPalette),
        shareReplay(1),
      );
    } else {
      throw new Error('The palette provided is not of a valid type');
    }
  }

  writeValue(value: string | undefined | null): void {
    this.applyExternalValue(value);
  }

  private applyExternalValue(value: string | undefined | null): void {
    if (value) {
      const model: ColorModel | 'INVALID' =
        ColorHelper.getColorModelByString(value);
      if (model != 'INVALID') {
        this.stateService.colorModel = model;
      }
      const rgba = ColorHelper.stringToRgba(value);
      this.stateService.set({ value: rgba, origin: 'state' });
    } else {
      this.stateService.set({ value: null, origin: 'state' });
    }
    this.value = value;
  }

  onChange: (value: string | undefined | null) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: string | undefined | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
