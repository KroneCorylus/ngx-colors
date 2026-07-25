import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { SliderDirective } from '../../directives/slider.directive';
import { ThumbComponent } from '../thumb/thumb.component';
import { Hsva } from '../../models/hsva';
import { ColorHelper } from '../../utility/color-helper';
import { Rgba } from '../../models/rgba';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'ngx-colors-color-picker',
  standalone: true,
  imports: [CommonModule, SliderDirective, ThumbComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss', '../../shared/shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent
  implements OnChanges, ControlValueAccessor, AfterViewInit
{
  public hue: string = 'red';
  public preview: string = 'red';
  public alphaGradient: { background: string } = {
    background:
      'linear-gradient(90deg, rgba(36,0,0,0) 0%, ' + this.hue + ' 100%)',
  };

  //state in rgba (output format)
  @Input() value: Rgba | undefined = new Rgba(255, 0, 0, 1);
  @Output() valueChange: EventEmitter<Rgba> = new EventEmitter<Rgba>();
  constructor(
    private cdr: ChangeDetectorRef,
    public stateService: StateService,
  ) {}

  @ViewChild('slSlider', { read: SliderDirective, static: false })
  slSlider!: SliderDirective;
  @ViewChild('alphaSlider', { read: SliderDirective, static: false })
  alphaSlider!: SliderDirective;
  @ViewChild('hueSlider', { read: SliderDirective, static: false })
  hueSlider!: SliderDirective;
  @ViewChild('sSlider', { read: SliderDirective, static: false })
  sSlider!: SliderDirective;
  @ViewChild('vSlider', { read: SliderDirective, static: false })
  vSlider!: SliderDirective;

  public _hue: Hsva = new Hsva(1, 1, 1, 1);
  public bgv: string = 'rgb(255,255,255)';
  public bgs: { background: string } | undefined = undefined;
  //state in hsva
  public _value: Hsva = new Hsva(1, 1, 1, 1);

  public disabled: boolean = false;

  //@ts-expect-error eyedroper is a experimental feature.
  public eyeDropperSupport: boolean = !!window.EyeDropper;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.setValue(changes['value'].currentValue);
    }
  }
  ngAfterViewInit() {
    this.setThumbs();
  }

  private getHSVA(): Hsva {
    let hue = 1;
    let saturation = 1;
    let brightness = 1;
    let alpha = 1;
    if (this.stateService.configuration.lockValues.hue != undefined) {
      hue = this.stateService.configuration.lockValues.hue;
    }
    if (this.stateService.configuration.lockValues.saturation != undefined) {
      saturation = this.stateService.configuration.lockValues.saturation;
    }
    if (this.stateService.configuration.lockValues.brightness != undefined) {
      brightness = this.stateService.configuration.lockValues.brightness;
    }
    if (this.stateService.configuration.lockValues.alpha != undefined) {
      alpha = this.stateService.configuration.lockValues.alpha;
    }
    return new Hsva(hue, saturation, brightness, alpha);
  }

  private setValue(value: Rgba | undefined, emitEvent: boolean = true) {
    if (!value) {
      this._value = this.getHSVA();
      this._hue = new Hsva(this._value.h, 1, 1, 1);
      // TODO: should show that null is seteded
      this.preview = ColorHelper.hsva2Rgba(this._value).toString();
    }
    if (value instanceof Rgba) {
      this._value = ColorHelper.rgbaToColorModel(value, 'HSVA') as Hsva;
      this._hue.h = this._value.h;
      this.preview = value.toString();
    }
    this.hue = ColorHelper.hsva2Rgba(this._hue).toString();
    this.alphaGradient = this.getGradient(
      undefined,
      this.value ?? new Rgba(255, 0, 0, 1),
    );
    this.bgv = ColorHelper.hsva2Rgba(
      new Hsva(this._value.h, this._value.s, 1, 1),
    ).toString();
    const left = ColorHelper.hsva2Rgba(
      new Hsva(this._value.h, 0, this._value.v, 1),
    );
    const right = ColorHelper.hsva2Rgba(
      new Hsva(this._value.h, 1, this._value.v, 1),
    );
    this.bgs = this.getGradient(left, right);
    this.setThumbs();
    this.cdr.detectChanges();
    if (emitEvent) {
      this.onChange(this.value);
    }
  }

  private setThumbs() {
    this.slSlider?.setThumbPosition(this._value.s, 1 - this._value.v);
    this.hueSlider?.setThumbPosition(this._value.h / 360, 0);
    this.alphaSlider?.setThumbPosition(this._value.a, 0);
  }

  //Fired on change of slider directive.
  public onChangeCoord(
    sliderCode: 'h' | 'sv' | 'a' | 's' | 'v',
    coord: [number, number],
  ) {
    const [x, y] = coord;
    if (sliderCode === 'h') {
      this._hue.h = x * 360;
      this._value.h = x * 360;
      this.hue = ColorHelper.hsva2Rgba(this._hue).toString();
    }
    if (sliderCode === 'sv') {
      this._value.s = x;
      this._value.v = 1 - y;
    }
    if (sliderCode === 's') {
      this._value.s = x;
    }
    if (sliderCode === 'v') {
      this._value.v = x;
    }
    if (sliderCode === 'a') {
      this._value.a = x;
    }
    this.value = ColorHelper.hsva2Rgba(this._value);
    this.preview = this.value.toString();
    this.alphaGradient = this.getGradient(undefined, this.value);
    this.bgv = ColorHelper.hsva2Rgba(
      new Hsva(this._value.h, this._value.s, 1, 1),
    ).toString();
    const left = ColorHelper.hsva2Rgba(
      new Hsva(this._value.h, 0, this._value.v, 1),
    );
    const right = ColorHelper.hsva2Rgba(
      new Hsva(this._value.h, 1, this._value.v, 1),
    );
    this.bgs = this.getGradient(left, right);
    this.onChange(this.value);
    this.cdr.detectChanges();
  }

  private getGradient(left: Rgba | undefined, right: Rgba | undefined) {
    let colorLeft = 'transparent';
    let colorRight = 'transparent';
    if (left) {
      colorLeft = new Rgba(left.r, left.g, left.b, 1).toString();
    }
    if (right) {
      colorRight = new Rgba(right.r, right.g, right.b, 1).toString();
    }
    return {
      background: `linear-gradient(90deg, ${colorLeft} 0%, ${colorRight} 100%)`,
    };
  }

  public onClickEyeDropper() {
    if (!this.eyeDropperSupport) {
      console.error('EyeDropper not supported');
      return;
    }
    //@ts-expect-error eyedroper is a experimental feature.
    const eyeDropper = new EyeDropper();
    eyeDropper
      .open()
      .then((result: { sRGBHex: string }) => {
        const probeColor: Rgba = ColorHelper.stringToRgba(result.sRGBHex);
        //in unix systems the eyeDropper always return 0 on the alpha channel.
        probeColor.a = 1;
        this.value = probeColor;
        this.setValue(probeColor);
      })
      .catch((err: DOMException) => {
        console.error(err);
      });
  }
  writeValue(obj: Rgba | undefined): void {
    this.value = obj;
    this.setValue(obj, false);
  }

  onChange: (value: Rgba | undefined) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: Rgba | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
