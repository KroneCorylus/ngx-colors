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
  @Input()  color: string;
  @Output() colorChange:EventEmitter<string> = new EventEmitter<string>(false);
  //Event triggered when any slider change
  @Output() colorSelectedChange:EventEmitter<Hsva> = new EventEmitter<Hsva>(false); 

  private hsva: Hsva;
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

    this.slider = new SliderPosition(0, 0, 0, 0);
    
    const hueWidth = this.hueSlider.nativeElement.offsetWidth || 140;
    const alphaWidth = this.alphaSlider.nativeElement.offsetWidth || 140;
    this.sliderDimMax = new SliderDimension(hueWidth, 220, 130, alphaWidth);

  

    this.setColorFromString((this.color || this.fallbackColor));

  }



  ngOnDestroy(): void {
  }

  ngOnChanges(changes: any): void {
    if(changes.color){
      this.setColorFromString((this.color || this.fallbackColor));
    }
  }

  setColor(color) {
    this.color = color
    this.colorChange.emit(this.color);
    this.colorSelectedChange.emit(this.outputColor);
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
    this.updateColor();
    this.setColor(this.outputColor);
  }

  public setColorFromString(value: string): void {
    let hsva: Hsva | null;
    hsva = this.service.stringToHsva(value,true);

    //if fails use fallback color
    if (!hsva && !this.hsva) {
      hsva = this.service.stringToHsva(this.fallbackColor, false);
    }


    if (hsva) {
      this.hsva = hsva;
      // this.sHue = this.hsva.h;
      this.updateColor();
    }
  }

  public onDragEnd(slider: string): void {
    this.setColor(this.outputColor);
  }

  public onDragStart(slider: string): void {
    this.setColor(this.outputColor);
  }


  private updateColor(): void {
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
