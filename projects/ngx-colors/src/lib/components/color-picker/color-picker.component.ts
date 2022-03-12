import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";

import { Cmyk, Hsla, Hsva, Rgba } from "../../clases/formats";
import { ColorFormats } from "../../enums/formats";
import { SliderDimension, SliderPosition } from "../../clases/slider";

import { ConverterService } from "../../services/converter.service";

@Component({
  selector: "color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: ["./color-picker.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ColorPickerComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  //IO color
  @Input() color: Hsva = new Hsva(0, 1, 1, 1);
  @Input() controls: "default" | "only-alpha" | "no-alpha" = "default";
  @Output() sliderChange: EventEmitter<Hsva> = new EventEmitter<Hsva>(false);
  @Output() onAlphaChange: EventEmitter<any> = new EventEmitter<any>(false);
  //Event triggered when any slider change
  // @Output() colorSelectedChange:EventEmitter<Hsva> = new EventEmitter<Hsva>(false);

  private hsva: Hsva = new Hsva(0, 1, 1, 1);
  private outputColor: Hsva;
  public selectedColor: string = "#000000";
  private fallbackColor: string = "#000000";

  // private sHue: number;
  private sliderDimMax: SliderDimension;
  public slider: SliderPosition;

  public hueSliderColor: string;
  public alphaSliderColor: string;

  @ViewChild("hueSlider", { static: false }) hueSlider: ElementRef;
  @ViewChild("alphaSlider", { static: false }) alphaSlider: ElementRef;

  constructor(
    private service: ConverterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.color) {
      this.color = new Hsva(0, 1, 1, 1);
    }
    this.slider = new SliderPosition(0, 0, 0, 0);
    this.update();
  }

  ngOnDestroy(): void {}

  ngOnChanges(changes: any): void {
    if (changes.color && this.color) {
      this.update();
    }
  }

  ngAfterViewInit(): void {
    const hueWidth = this.hueSlider?.nativeElement.offsetWidth || 140;
    const alphaWidth = this.alphaSlider?.nativeElement.offsetWidth || 140;
    this.sliderDimMax = new SliderDimension(hueWidth, 220, 130, alphaWidth);
    this.update();
  }

  public onSliderChange(type: string, event) {
    switch (type) {
      case "saturation-lightness":
        this.hsva.onColorChange(event);
        break;
      case "hue":
        this.hsva.onHueChange(event);
        break;
      case "alpha":
        this.hsva.onAlphaChange(event);
        this.onAlphaChange.emit(event);
        break;
      case "value":
        this.hsva.onValueChange(event);
        break;
    }
    // this.sHue = this.hsva.h;
    this.update();
    this.setColor(this.outputColor);
  }

  setColor(color) {
    this.color = color;
    this.sliderChange.emit(this.color);
  }

  public getBackgroundColor(color) {
    return {
      background:
        "linear-gradient(90deg, rgba(36,0,0,0) 0%, " + color + " 100%)",
    };
  }

  private update(): void {
    this.hsva = this.color;
    if (this.sliderDimMax) {
      let rgba = this.service.hsvaToRgba(this.hsva).denormalize();
      let hue = this.service
        .hsvaToRgba(new Hsva(this.hsva.h, 1, 1, 1))
        .denormalize();

      this.hueSliderColor = "rgb(" + hue.r + "," + hue.g + "," + hue.b + ")";
      this.alphaSliderColor =
        "rgb(" + rgba.r + "," + rgba.g + "," + rgba.b + ")";

      this.outputColor = this.hsva;
      this.selectedColor = this.service.hsvaToRgba(this.hsva).toString();

      this.slider = new SliderPosition(
        // (this.sHue || this.hsva.h) * this.sliderDimMax.h - 8,
        this.hsva.h * this.sliderDimMax.h - 5,
        this.hsva.s * this.sliderDimMax.s - 8,
        (1 - this.hsva.v) * this.sliderDimMax.v - 8,
        this.hsva.a * this.sliderDimMax.a - 5
      );
      this.cdr.detectChanges();
    }
  }
}
