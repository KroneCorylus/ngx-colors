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
import { Observable, Subject, of, shareReplay } from 'rxjs';
import { OverlayService } from '../services/overlay.service';
import { ColorHelper } from '../utility/color-helper';
import { StateService } from '../services/state.service';
import { ColorOption } from '../types/color-option';
import { defaultColors } from '../utility/default-colors';
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
} from '../types/configuration';
import { ColorModel } from '../types/color-model';
import { IColorModel } from '../interfaces/color-format';
import { Labels, NGX_COLORS_LABELS } from '../interfaces/labels';
import { isInputOrigin } from '../types/changes';

@Directive({
  selector: '[ngxColorsTrigger]',
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
  implements
    ControlValueAccessor,
    OnDestroy,
    OnInit,
    OnChanges,
    NgxColorsConfiguration
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
  //Keep naming for parity with old version
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public open: EventEmitter<void> = this.overlayService.opened;
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public close: EventEmitter<void> = this.overlayService.closed;

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
  public palette: Observable<ColorOption[]> | ColorOption[] | undefined =
    defaultColors;
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
  public ngOnInit(): void {
    this.setPalette(this.palette);

    this.stateService.state.subscribe((state) => {
      console.log(state);
      let newValue = null;
      if (state?.value) {
        let color: IColorModel | string = state.value;
        if (this.stateService.configuration.outputModel == 'AUTO') {
          color = ColorHelper.rgbaToColorModel(
            state.value,
            this.stateService.colorModel,
          );
        } else {
          color = ColorHelper.rgbaToColorModel(
            state.value,
            this.stateService.configuration.outputModel,
          );
        }
        newValue = color.toString();
      }
      this.value = newValue;
      this.colorChange.emit(this.value);
      if (isInputOrigin(state.origin) || state.origin === 'confirm') {
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
    this.applyConfig();
  }

  private applyConfig() {
    this.stateService.configuration = new Configuration(
      { labels: this._labels },
      this.config,
      this,
    );
  }

  public ngOnDestroy(): void {
    // If the host (or an ancestor) is destroyed while the panel is open -
    // e.g. behind an *ngIf or on route navigation - the overlay is not part
    // of this component's view tree, so Angular won't tear it down on its
    // own. Without this, the panel and its DOM node are leaked permanently.
    this.overlayService.removePanel();
    this.destroy$.next();
    this.destroy$.complete();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    this.applyConfig();
    if (changes['palette']) {
      this.setPalette(changes['palette'].currentValue);
    }
    if (changes['color']) {
      this.applyExternalValue(changes['color'].currentValue);
    }
  }

  public openPanel() {
    if (this.disabled) {
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
  }

  private setPalette(
    palette: Observable<ColorOption[]> | ColorOption[] | undefined,
  ) {
    if (!palette) return;
    if (Array.isArray(this.palette)) {
      this.stateService.palette$ = of(this.palette);
    } else if (this.palette instanceof Observable) {
      this.stateService.palette$ = this.palette.pipe(shareReplay());
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
