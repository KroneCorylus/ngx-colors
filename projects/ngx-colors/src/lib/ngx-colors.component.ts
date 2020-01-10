import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, ViewEncapsulation } from '@angular/core';
import { defaultColors } from './helpers/default-colors';
import { formats } from './helpers/formats';
import { ConverterService } from './services/converter.service';
import { ColorFormats } from './enums/formats';
import { isDescendantOrSame } from './helpers/helpers';

@Component({
  selector: 'ngx-colors',
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class NgxColorsComponent implements OnInit, OnDestroy, OnChanges{

  constructor(
    public service:ConverterService,
    private changeDetectorRef: ChangeDetectorRef,
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
  public left;
  public top;


  @ViewChild('dialog', { static: false }) dialogElement: ElementRef;
  @ViewChild('caller', { static: true }) callerElement: ElementRef;

  public ngOnInit(){
  }

  public ngOnDestroy(){
    
  }

  public ngOnChanges(changes: any): void {
    if(changes.color){
      this.previewColor = this.color;
      this.change.emit(this.color);
      this.colorChange.emit(this.color);
    }
  }


  public onChange(){
    this.colorChange.emit(this.color);
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
  public open(){
    
    var viewportOffset = this.callerElement.nativeElement.getBoundingClientRect();
    this.top = viewportOffset.top + viewportOffset.height;
    this.left = viewportOffset.left + 250 > window.innerWidth ? viewportOffset.right - 250 : viewportOffset.left;
    
    this.show = true
    this.menu = 1;
  }
  public close(){
    this.show = false;
  }
  public toggleDialog(){
    if(!this.show){
      this.open();
    }
    else{
      this.close();
    }
  }

  // public onChangeColorPicker(event) {
  //   this.previewColor = this.toFormat(event,ColorFormats.HEX);
  //   this.Color = this.toFormat(event,this.format);
  // }

  /**
   * Change color from input
   * @param string color
   */
  // public changeColorManual(color: string): void {
  //     this.previewColor = color;
  //     this.colorPickerColor = color;
  // }


  isOutside(event){
    this.changeDetectorRef.detectChanges();
    if(this.dialogElement != null){
        return !(isDescendantOrSame(this.dialogElement.nativeElement,event.target) || isDescendantOrSame(this.callerElement.nativeElement,event.target))
    } 
    return false;
  }


  // get Color(): string {
  //   return this.color;
  // }
  // set Color(value: string) {
  //     this.color = value;
  //     this.colorChange.emit(this.color);
  //     this.change.emit(this.color);
  // }

}
