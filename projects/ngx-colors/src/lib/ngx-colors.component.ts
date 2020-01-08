import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, OnChanges } from '@angular/core';
import { trigger, transition, style, animate, stagger, query, keyframes } from '@angular/animations';
import { defaultColors } from './helpers/default-colors';
import { formats } from './helpers/formats';
import { ConverterService } from './services/converter.service';
import { ColorFormats } from './enums/formats';
import { Rgba, Hsla, Cmyk, Hsva } from './clases/formats';
import { isDescendantOrSame, getFormat } from './helpers/helpers';


@Component({
  selector: 'ngx-colors',
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss'],
  animations: [
    trigger('colorsAnimation', [
      transition('void => slide-in', [
        // Initially all colors are hidden
        query(':enter', style({ opacity: 0 }), { optional: true }),
        //slide-in animation
        query(':enter', stagger('10ms', [
          animate('.3s ease-in', keyframes([
            style({ opacity: 0, transform: 'translatex(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translatex(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translatex(0)', offset: 1 }),
          ]))]), { optional: true }),
      ]),
      //popup animation
      transition('void => popup', [
        query(':enter', style({ opacity: 0,transform: 'scale(0)' }), { optional: true }),
        query(':enter', stagger('10ms', [
          animate('500ms ease-out', keyframes([
            style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
            style({ opacity: 1, transform: 'scale(1.1)', offset: 0.8 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
          ]))]), { optional: true })
      ])
    ]),
    
  ]
})
export class NgxColorsComponent implements OnInit, OnDestroy, OnChanges{

  constructor(
    public service:ConverterService,
    private changeDetectorRef: ChangeDetectorRef
  )
  {
  }

  //IO color
  @Input() color: string = '#00000000';
  @Output() colorChange: EventEmitter<string> = new EventEmitter<string>(false);


  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  //Animation type for the color palette show up
  //slide-in, popup,
  @Input() colorsAnimationEffect = 'slide-in'


  //selected color used for ui before apply format, 
  public previewColor: string = '#000000';
  public colorPickerColor: string = '#000000';

  public show = false;

  public palette = defaultColors;
  public colorFormats = formats;
  public selectedFormat:number = 0;
  public format:ColorFormats = ColorFormats.HEX;
  public variants = [];
    
  public menu = 1;

  @ViewChild('dialog', { static: false }) dialogElement: ElementRef;
  @ViewChild('caller', { static: true }) callerElement: ElementRef;



  public ngOnInit(){
    document.addEventListener('mousedown', (event) => {
      if(this.isOutside(event)){
        this.close();
      }
    });
  }

  public ngOnDestroy(){
    document.removeEventListener('mousedown', (event) => {
      if(this.isOutside(event)){
        this.close();
      }
    });
  }

  public ngOnChanges(changes: any): void {
    if(changes.color){
      this.previewColor = this.color;
      this.change.emit(this.color);
    }
  }



  public hasVariant(color):boolean{
    return color.variants.some(v => v.toUpperCase() == this.previewColor.toUpperCase() );
  }

  public isSelected(color){
    return color.toUpperCase() == this.previewColor.toUpperCase();
  }


  /**
   * Change color from default colors
   * @param string color
   */
  public changeColor(color: string): void {
    this.previewColor = color;
    this.colorPickerColor = color;
    this.Color = this.stringToFormat(color,this.format);
    // this.event.emit(this.rawColor);
    this.menu = 1;
    this.show = false;
  }

  public nextFormat(){
    this.format = (this.format + 1) % this.colorFormats.length;
    this.Color = this.stringToFormat(this.previewColor,this.format);
  }


  toFormat(hsva:Hsva,format:ColorFormats){
    var output = '';
    switch(format){
      case ColorFormats.HEX:
        var rgba:Rgba = this.service.hsvaToRgba(hsva);
        rgba.denormalize();
        var output = this.service.rgbaToHex(rgba,true);
        break;
      case ColorFormats.HSLA:
        var hsla:Hsla = this.service.hsva2hsla(hsva);
        hsla.denormalize();
        var output = hsla.toString();
        break;
      case ColorFormats.RGBA:
        var rgba:Rgba = this.service.hsvaToRgba(hsva);
        var output = rgba.toString();
        break;
      case ColorFormats.CMYK:
        var rgba:Rgba = this.service.hsvaToRgba(hsva);
        var cmyk:Cmyk = this.service.rgbaToCmyk(rgba);
        break;
    }
    return output;
  }

  public stringToFormat(color:string, format:ColorFormats){
    var hsva = this.service.stringToHsva(color,true);
    return this.toFormat(hsva,format);
  }

  public showVariants(color){
    this.variants = color.variants;
    this.menu = 2;
  }
  public showColors(){
    this.menu = 1;
  }
  public addColor(){
    this.menu = 3;
  }
  public close(){
    this.menu = 1;
    this.show = false;
  }
  public toggleDialog(){
    this.show = !this.show;
  }

  public onChangeColorPicker(event) {
    this.previewColor = this.toFormat(event,ColorFormats.HEX);
    this.Color = this.toFormat(event,this.format);
  }

  /**
   * Change color from input
   * @param string color
   */
  public changeColorManual(color: string): void {
      this.previewColor = color;
      this.colorPickerColor = color;
  }


  isOutside(event){
    this.changeDetectorRef.detectChanges();
    if(this.dialogElement != null){
      return !(isDescendantOrSame(this.dialogElement.nativeElement,event.target) || isDescendantOrSame(this.callerElement.nativeElement,event.target))
    }
    return false;
  }


  get Color(): string {
    return this.color;
  }
  set Color(value: string) {
      this.color = value;
      this.colorChange.emit(this.color);
      this.change.emit(this.color);
  }

}
