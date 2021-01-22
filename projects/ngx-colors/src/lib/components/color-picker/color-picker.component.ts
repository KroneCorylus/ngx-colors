import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ViewEncapsulation,
  ElementRef, ChangeDetectorRef, Input, Output, EventEmitter, OnChanges
} from '@angular/core';

import { Cmyk, Hsla, Hsva, Rgba } from '../../clases/formats';
import { ColorFormats } from '../../enums/formats';
import { SliderDimension, SliderPosition } from '../../clases/slider';

import { ConverterService } from '../../services/converter.service';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorPickerComponent implements OnInit, OnDestroy, AfterViewInit,OnChanges {
  

  //IO color
  @Input()  color: Hsva = new Hsva(0,1,1,1);
  @Output() colorChange:EventEmitter<Hsva> = new EventEmitter<Hsva>(false);
  //Event triggered when any slider change
  // @Output() colorSelectedChange:EventEmitter<Hsva> = new EventEmitter<Hsva>(false); 

  private hsva: Hsva = new Hsva(0,1,1,1);
  private outputColor: Hsva;
  public selectedColor: string = '#000000';
  private fallbackColor: string = '#000000';

  // private sHue: number;
  private sliderDimMax: SliderDimension;
  public slider: SliderPosition;


  public hueSliderColor: string;
  public alphaSliderColor: string;


  @ViewChild('hueSlider', { static: true }) hueSlider: ElementRef;
  @ViewChild('alphaSlider', { static: true }) alphaSlider: ElementRef;

  constructor(
    private service: ConverterService
  ) { }

  ngOnInit(): void {
    if(!this.color){
      this.color = new Hsva(0,1,1,1);
    }
    this.slider = new SliderPosition(0, 0, 0, 0);
    const hueWidth = this.hueSlider.nativeElement.offsetWidth || 140;
    const alphaWidth = this.alphaSlider.nativeElement.offsetWidth || 140;
    this.sliderDimMax = new SliderDimension(hueWidth, 220, 130, alphaWidth);
    // this.setColorFromString((this.color || this.fallbackColor));
    this.update();
  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: any): void {
    if(changes.color && this.color){
      this.update();
    }
  }

  ngAfterViewInit(): void {

  }

  public onSliderChange(type:string, event){
    switch(type){
      case 'saturation-lightness':
        this.hsva.onColorChange(event);
        break;
      case 'hue':
        this.hsva.onHueChange(event);
        break;
      case 'alpha':
        this.hsva.onAlphaChange(event);
        break;
      case 'value':
        this.hsva.onValueChange(event);
        break;
    }
    // this.sHue = this.hsva.h;
    this.update();
    this.setColor(this.outputColor);
  }

  setColor(color) {
    this.color = color
    this.colorChange.emit(this.color);
  }

  private update(): void {

    this.hsva = this.color;
    if (this.sliderDimMax) {
      let rgba = this.service.hsvaToRgba(this.hsva).denormalize();
      let hue = this.service.hsvaToRgba(new Hsva(this.hsva.h, 1, 1, 1)).denormalize();

      this.hueSliderColor = 'rgb(' + hue.r + ',' + hue.g + ',' + hue.b + ')';
      this.alphaSliderColor = 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';

      this.outputColor = this.hsva;
      this.selectedColor = this.service.hsvaToRgba(this.hsva).toString();
    

      this.slider = new SliderPosition(
        // (this.sHue || this.hsva.h) * this.sliderDimMax.h - 8,
        this.hsva.h * this.sliderDimMax.h - 8,
        this.hsva.s * this.sliderDimMax.s - 8,
        (1 - this.hsva.v) * this.sliderDimMax.v - 8,
        this.hsva.a * this.sliderDimMax.a - 8
      );
      
    }
  }
}
